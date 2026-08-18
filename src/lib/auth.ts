import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';
import type { Organization } from '@prisma/client';

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
  };
  organization: Organization;
}

/**
 * Retrieves the current authenticated Supabase user on the server.
 */
export async function getAuthUser() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('Error fetching Supabase auth user:', err);
    return null;
  }
}

/**
 * Retrieves the authenticated user and matches/creates their Organization record in Prisma.
 */
export async function getOrganizationSession(): Promise<AuthSession | null> {
  const user = await getAuthUser();
  if (!user || !user.email) {
    return null;
  }

  // Find organization by email or ID
  let organization = await prisma.organization.findFirst({
    where: {
      OR: [{ id: user.id }, { email: user.email.toLowerCase() }],
    },
  });

  // If organization record doesn't exist in Prisma yet, auto-provision it from Supabase auth metadata
  if (!organization) {
    const orgName =
      user.user_metadata?.name ||
      user.user_metadata?.organizationName ||
      user.email.split('@')[0] ||
      'Organization';

    try {
      organization = await prisma.organization.create({
        data: {
          id: user.id,
          email: user.email.toLowerCase(),
          name: orgName,
          passwordHash: 'supabase-auth-managed',
        },
      });
    } catch (createErr) {
      // If race condition created it, query again
      organization = await prisma.organization.findFirst({
        where: {
          OR: [{ id: user.id }, { email: user.email.toLowerCase() }],
        },
      });
    }
  }

  if (!organization) {
    return null;
  }

  return {
    user: {
      id: organization.id,
      email: organization.email,
      name: organization.name,
    },
    organization,
  };
}

/**
 * Backward compatibility helpers
 */
export const getServerAuthSession = getOrganizationSession;
export const getAuthSession = getOrganizationSession;
export const auth = getOrganizationSession;
