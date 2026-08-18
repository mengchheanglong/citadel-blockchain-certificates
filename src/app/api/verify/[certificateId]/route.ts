import { NextResponse } from 'next/server';
import type { BlockchainTransaction } from '@prisma/client';
import { prisma } from '@/lib/db';
import { verifyCertOnChain, CERT_STATUS_LABELS } from '@/lib/blockchain';

interface RouteContext {
  params: {
    certificateId: string;
  };
}

/**
 * GET /api/verify/[certificateId]
 * Public verification endpoint for a certificate by its unique certificate ID (e.g. CERT-2024-XXXX).
 * No authentication required.
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const rawCertId = decodeURIComponent(params.certificateId || '').trim();

    if (!rawCertId) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'Certificate ID is required',
        },
        { status: 400 }
      );
    }

    // Look up certificate in database by normalized certificateId
    let certificate = await prisma.certificate.findUnique({
      where: { certificateId: rawCertId.toUpperCase() },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            description: true,
            logoUrl: true,
            website: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!certificate) {
      // Fallback search with exact raw case or case-insensitive query
      certificate = await prisma.certificate.findFirst({
        where: {
          certificateId: rawCertId,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              email: true,
              description: true,
              logoUrl: true,
              website: true,
            },
          },
          transactions: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: `Certificate with ID "${rawCertId}" was not found`,
        },
        { status: 404 }
      );
    }

    // Check if certificate has expired and update status if necessary
    let currentStatus = certificate.status;
    if (
      certificate.status === 'VALID' &&
      certificate.expiryDate &&
      new Date(certificate.expiryDate) < new Date()
    ) {
      currentStatus = 'EXPIRED';
      await prisma.certificate.update({
        where: { id: certificate.id },
        data: { status: 'EXPIRED' },
      });
    }

    // Attempt on-chain verification
    let onChainResult: { isValid: boolean; status: number } | null = null;
    let blockchainError: string | null = null;

    try {
      if (process.env.CONTRACT_ADDRESS) {
        onChainResult = await verifyCertOnChain(
          certificate.certificateId,
          certificate.certificateHash
        );
      } else {
        blockchainError = 'Smart contract address not configured';
      }
    } catch (bcError: any) {
      console.error('Blockchain verification error (proceeding with DB record):', bcError);
      blockchainError =
        bcError?.message || 'Smart contract verification currently unavailable';
    }

    const latestTx =
      certificate.transactions.find((t: BlockchainTransaction) => t.action === 'ISSUE') ||
      certificate.transactions[0];

    const onChainStatusLabel =
      onChainResult !== null
        ? CERT_STATUS_LABELS[onChainResult.status] || 'Unknown'
        : null;

    // Overall verification state:
    // If on-chain result is available, check isValid && DB status === 'VALID'.
    // If on-chain unavailable, DB valid is used as fallback.
    const isVerified =
      onChainResult !== null
        ? onChainResult.isValid && currentStatus === 'VALID'
        : currentStatus === 'VALID';

    const verificationResult = {
      success: true,
      verified: isVerified,
      status: currentStatus,
      certificate: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
        courseName: certificate.courseName,
        courseDescription: certificate.courseDescription,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        status: currentStatus,
        revokeReason: certificate.revokeReason,
        revokedAt: certificate.revokedAt,
        qrCodeData: certificate.qrCodeData,
        createdAt: certificate.createdAt,
      },
      organization: {
        name: certificate.organization.name,
        website: certificate.organization.website,
        email: certificate.organization.email,
        description: certificate.organization.description,
        logoUrl: certificate.organization.logoUrl,
      },
      blockchainProof: {
        txHash: latestTx?.txHash || null,
        blockNumber: latestTx?.blockNumber ? latestTx.blockNumber.toString() : null,
        networkName:
          latestTx?.networkName ||
          (process.env.NETWORK_MODE === 'hardhat' ? 'hardhat' : 'sepolia'),
        contractAddress:
          latestTx?.contractAddress || process.env.CONTRACT_ADDRESS || null,
        onChainStatus: onChainResult !== null ? onChainResult.status : null,
        onChainStatusLabel,
        verified: onChainResult !== null ? onChainResult.isValid : false,
        error: blockchainError,
      },
    };

    return NextResponse.json(verificationResult, { status: 200 });
  } catch (error: any) {
    console.error('Public certificate verification error:', error);
    return NextResponse.json(
      {
        success: false,
        verified: false,
        message: error?.message || 'Verification service error',
      },
      { status: 500 }
    );
  }
}
