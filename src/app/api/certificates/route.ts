import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  generateCertificateId,
  computeCertificateHash,
  issueCertOnChain,
} from '@/lib/blockchain';
import { generateQRCodeDataURL, getVerificationUrl } from '@/lib/qrcode';
import { sendCertificateIssuedEmail } from '@/lib/email';
import { generateCertificatePDF } from '@/lib/pdf';
import { issueCertificateSchema } from '@/lib/validation';

/**
 * POST /api/certificates
 * Issue a new certificate
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = issueCertificateSchema.safeParse(body);

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

    const org = await prisma.organization.findUnique({
      where: { id: session.user.id },
    });

    if (!org) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 404 }
      );
    }

    const {
      recipientName,
      recipientEmail,
      courseName,
      courseDescription,
      expiryDate: expiryDateStr,
    } = parseResult.data;

    // Generate unique certificate ID
    let certificateId = generateCertificateId();
    let idExists = await prisma.certificate.findUnique({
      where: { certificateId },
    });
    while (idExists) {
      certificateId = generateCertificateId();
      idExists = await prisma.certificate.findUnique({
        where: { certificateId },
      });
    }

    const issueDate = new Date();
    const expiryDate =
      expiryDateStr && expiryDateStr.trim() !== ''
        ? new Date(expiryDateStr)
        : null;

    if (expiryDate && expiryDate <= issueDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: {
            expiryDate: ['Expiration date must be in the future'],
          },
        },
        { status: 400 }
      );
    }

    const expiryUnix = expiryDate ? Math.floor(expiryDate.getTime() / 1000) : 0;

    // Compute certificate cryptographic hash
    const certHash = computeCertificateHash({
      certificateId,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.toLowerCase().trim(),
      courseName: courseName.trim(),
      issuerName: org.name,
      issueDate: issueDate.toISOString(),
      expiryDate: expiryDate ? expiryDate.toISOString() : null,
    });

    // Try to issue certificate on blockchain
    let txData: { txHash: string; blockNumber: number } | null = null;
    try {
      if (process.env.CONTRACT_ADDRESS && process.env.PRIVATE_KEY) {
        txData = await issueCertOnChain(certificateId, certHash, expiryUnix);
      } else {
        console.warn('Smart contract or private key not configured. Proceeding off-chain.');
      }
    } catch (bcError) {
      console.error('Blockchain issuance failed (contract may not be deployed):', bcError);
    }

    // Generate QR code
    const qrCodeData = await generateQRCodeDataURL(certificateId);

    // Create certificate record in database
    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        organizationId: org.id,
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.toLowerCase().trim(),
        courseName: courseName.trim(),
        courseDescription: courseDescription?.trim() || null,
        issueDate,
        expiryDate,
        certificateHash: certHash,
        status: 'VALID',
        qrCodeData,
        emailSent: false,
        ...(txData
          ? {
              transactions: {
                create: {
                  txHash: txData.txHash,
                  blockNumber: BigInt(txData.blockNumber),
                  networkName:
                    process.env.NETWORK_MODE === 'hardhat' ? 'hardhat' : 'sepolia',
                  contractAddress: process.env.CONTRACT_ADDRESS || '',
                  action: 'ISSUE',
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

    // Try to send email with certificate details and attached PDF
    let emailSent = false;
    try {
      const verificationUrl = getVerificationUrl(certificateId);

      let pdfBuffer: Buffer | undefined;
      try {
        pdfBuffer = await generateCertificatePDF({
          certificateId,
          recipientName: certificate.recipientName,
          courseName: certificate.courseName,
          courseDescription: certificate.courseDescription,
          issueDate: certificate.issueDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          expiryDate: certificate.expiryDate
            ? certificate.expiryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : null,
          organizationName: org.name,
          txHash: txData?.txHash || null,
          contractAddress: process.env.CONTRACT_ADDRESS || null,
          qrCodeDataUrl: qrCodeData,
        });
      } catch (pdfErr) {
        console.warn('PDF generation for email attachment failed:', pdfErr);
      }

      const emailResult = await sendCertificateIssuedEmail(
        {
          name: certificate.recipientName,
          email: certificate.recipientEmail,
        },
        {
          certificateId: certificate.certificateId,
          courseName: certificate.courseName,
          issueDate: certificate.issueDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          expiryDate: certificate.expiryDate
            ? certificate.expiryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : null,
          organizationName: org.name,
        },
        verificationUrl,
        pdfBuffer
      );

      if (emailResult.success) {
        emailSent = true;
        await prisma.certificate.update({
          where: { id: certificate.id },
          data: { emailSent: true },
        });
      }
    } catch (emailErr) {
      console.error('Failed to send certificate issuance email:', emailErr);
    }

    const formattedCert = {
      ...certificate,
      emailSent,
      transactions: certificate.transactions.map((tx) => ({
        ...tx,
        blockNumber: tx.blockNumber.toString(),
      })),
    };

    return NextResponse.json(
      {
        success: true,
        certificate: formattedCert,
        message: 'Certificate issued successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Certificate issuance error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to issue certificate',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/certificates
 * List certificates for authenticated organization with search and pagination
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.toUpperCase() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get('limit') || '10', 10) || 10)
    );
    const skip = (page - 1) * limit;

    const where: Prisma.CertificateWhereInput = {
      organizationId: session.user.id,
    };

    if (status && ['VALID', 'EXPIRED', 'REVOKED'].includes(status)) {
      where.status = status as Prisma.EnumCertificateStatusFilter['equals'];
    }

    if (search) {
      where.OR = [
        { recipientName: { contains: search, mode: 'insensitive' } },
        { recipientEmail: { contains: search, mode: 'insensitive' } },
        { courseName: { contains: search, mode: 'insensitive' } },
        { certificateId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.certificate.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const formattedCertificates = certificates.map((cert) => ({
      ...cert,
      transactions: cert.transactions.map((tx) => ({
        ...tx,
        blockNumber: tx.blockNumber.toString(),
      })),
    }));

    return NextResponse.json({
      success: true,
      certificates: formattedCertificates,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    console.error('List certificates error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to list certificates',
      },
      { status: 500 }
    );
  }
}
