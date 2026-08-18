'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface OrganizationProfile {
  id: string;
  name: string;
  email: string;
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
}

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  organization: OrganizationProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshOrganization: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  session: null,
  organization: null,
  isLoading: true,
  signOut: async () => {},
  refreshOrganization: async () => {},
});

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [organization, setOrganization] = useState<OrganizationProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchOrgProfile = async (currentUser: User) => {
    try {
      const res = await fetch('/api/auth/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.organization) {
          setOrganization(data.organization);
          return;
        }
      }
      // Fallback from user metadata
      setOrganization({
        id: currentUser.id,
        name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Organization',
        email: currentUser.email || '',
      });
    } catch {
      setOrganization({
        id: currentUser.id,
        name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Organization',
        email: currentUser.email || '',
      });
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await fetchOrgProfile(initialSession.user);
        }
      } catch (err) {
        console.error('Error initializing Supabase auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchOrgProfile(newSession.user);
      } else {
        setOrganization(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setOrganization(null);
    router.push('/login');
    router.refresh();
  };

  const refreshOrganization = async () => {
    if (user) {
      await fetchOrgProfile(user);
    }
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        organization,
        isLoading,
        signOut,
        refreshOrganization,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export const useSupabaseAuth = () => useContext(SupabaseAuthContext);
