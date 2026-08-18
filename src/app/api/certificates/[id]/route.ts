import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { BlockchainTransaction } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/certificates/[id]
 * Get certificate details by database UUID for authenticated organization
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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
      return NextResponse.json(
        { success: false, message: 'Certificate not found' },
        { status: 404 }
      );
    }

    if (certificate.organizationId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const formattedCert = {
      ...certificate,
      transactions: certificate.transactions.map((tx: BlockchainTransaction) => ({
        ...tx,
        blockNumber: tx.blockNumber.toString(),
      })),
    };

    return NextResponse.json({
      success: true,
      certificate: formattedCert,
    });
  } catch (error: any) {
    console.error('Get certificate error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to retrieve certificate',
      },
      { status: 500 }
    );
  }
}
