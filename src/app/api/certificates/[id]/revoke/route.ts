import { NextResponse } from 'next/server';
import type { BlockchainTransaction } from '@prisma/client';
import { getOrganizationSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revokeCertOnChain } from '@/lib/blockchain';
import { sendCertificateRevokedEmail } from '@/lib/email';
import { revokeCertificateSchema } from '@/lib/validation';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * POST /api/certificates/[id]/revoke
 * Revoke an existing certificate
 */
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const session = await getOrganizationSession();
    if (!session?.organization?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Certificate ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parseResult = revokeCertificateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { reason } = parseResult.data;

    // Get certificate from DB
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (certificate.organizationId !== session.organization.id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if already revoked
    if (certificate.status === 'REVOKED') {
      return NextResponse.json(
        { success: false, message: 'Certificate is already revoked' },
        { status: 400 }
      );
    }

    // Try to revoke on blockchain
    let txData: { txHash: string; blockNumber: number } | null = null;
    try {
      if (process.env.CONTRACT_ADDRESS && process.env.PRIVATE_KEY) {
        txData = await revokeCertOnChain(certificate.certificateId);
      } else {
        console.warn('Smart contract or private key not configured. Proceeding off-chain.');
      }
    } catch (bcError) {
      console.error('Blockchain revocation failed (contract may not be deployed):', bcError);
    }

    // Update certificate in DB
    const updatedCertificate = await prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        status: 'REVOKED',
        revokeReason: reason.trim(),
        revokedAt: new Date(),
        ...(txData
          ? {
              transactions: {
                create: {
                  txHash: txData.txHash,
                  blockNumber: BigInt(txData.blockNumber),
                  networkName:
                    process.env.NETWORK_MODE === 'hardhat' ? 'hardhat' : 'sepolia',
                  contractAddress: process.env.CONTRACT_ADDRESS || '',
                  action: 'REVOKE',
                  timestamp: new Date(),
                  confirmed: true,
                },
              },
            }
          : {}),
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            logoUrl: true,
            website: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Try to send revocation email (don't fail the request if email fails)
    try {
      await sendCertificateRevokedEmail(
        {
          name: certificate.recipientName,
          email: certificate.recipientEmail,
        },
        {
          certificateId: certificate.certificateId,
          courseName: certificate.courseName,
          organizationName: certificate.organization.name,
        },
        reason.trim()
      );
    } catch (emailErr) {
      console.error('Failed to send revocation email:', emailErr);
    }

    const formattedCert = {
      ...updatedCertificate,
      transactions: updatedCertificate.transactions.map((tx: BlockchainTransaction) => ({
        ...tx,
        blockNumber: tx.blockNumber.toString(),
      })),
    };

    return NextResponse.json({
      success: true,
      certificate: formattedCert,
      message: 'Certificate revoked successfully',
    });
  } catch (error: any) {
    console.error('Certificate revocation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to revoke certificate',
      },
      { status: 500 }
    );
  }
}
