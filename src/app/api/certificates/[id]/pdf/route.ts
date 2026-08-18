import { NextResponse } from 'next/server';
import type { BlockchainTransaction } from '@prisma/client';
import { getOrganizationSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateCertificatePDF } from '@/lib/pdf';
import { generateQRCodeDataURL } from '@/lib/qrcode';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/certificates/[id]/pdf
 * Download certificate as a PDF file
 */
export async function GET(request: Request, { params }: RouteContext) {
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

    // Generate or use existing QR code data URL
    const qrCodeDataUrl =
      certificate.qrCodeData ||
      (await generateQRCodeDataURL(certificate.certificateId));

    const latestTx =
      certificate.transactions.find((t: BlockchainTransaction) => t.action === 'ISSUE') ||
      certificate.transactions[0];

    const pdfBuffer = await generateCertificatePDF({
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

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificate.certificateId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('PDF download error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to generate certificate PDF',
      },
      { status: 500 }
    );
  }
}
