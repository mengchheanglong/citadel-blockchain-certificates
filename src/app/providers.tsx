'use client';

import { SupabaseAuthProvider } from '@/components/auth/supabase-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SupabaseAuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200} skipDelayDuration={400}>
          {children}
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </SupabaseAuthProvider>
  );
}
