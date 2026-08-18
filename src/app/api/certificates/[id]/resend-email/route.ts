import { NextResponse } from 'next/server';
import type { BlockchainTransaction } from '@prisma/client';
import { getOrganizationSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getVerificationUrl, generateQRCodeDataURL } from '@/lib/qrcode';
import { sendCertificateIssuedEmail } from '@/lib/email';
import { generateCertificatePDF } from '@/lib/pdf';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * POST /api/certificates/[id]/resend-email
 * Resend the certificate issued email to the recipient
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

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        organization: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: 'Certificate not found' },
        { status: 404 }
      );
    }

    if (certificate.organizationId !== session.organization.id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Generate verification URL
    const verificationUrl = getVerificationUrl(certificate.certificateId);

    // Try to generate PDF buffer for attachment
    let pdfBuffer: Buffer | undefined;
    try {
      const qrCodeDataUrl =
        certificate.qrCodeData ||
        (await generateQRCodeDataURL(certificate.certificateId));
      const latestTx =
        certificate.transactions.find((t: BlockchainTransaction) => t.action === 'ISSUE') ||
        certificate.transactions[0];

      pdfBuffer = await generateCertificatePDF({
        certificateId: certificate.certificateId,
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
        organizationName: certificate.organization.name,
        txHash: latestTx?.txHash || null,
        contractAddress:
          latestTx?.contractAddress || process.env.CONTRACT_ADDRESS || null,
        qrCodeDataUrl,
      });
    } catch (pdfErr) {
      console.warn('PDF generation for resend email failed:', pdfErr);
    }

    // Send certificate issued email
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
        organizationName: certificate.organization.name,
      },
      verificationUrl,
      pdfBuffer
    );

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResult.error || 'Failed to send email',
        },
        { status: 500 }
      );
    }

    // Update emailSent to true
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: { emailSent: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Certificate email sent successfully',
    });
  } catch (error: any) {
    console.error('Resend certificate email error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to resend certificate email',
      },
      { status: 500 }
    );
  }
}
