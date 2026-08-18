import { NextResponse } from 'next/server';
import { getOrganizationSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getOrganizationSession();
    if (!session || !session.organization) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      organization: session.organization,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
