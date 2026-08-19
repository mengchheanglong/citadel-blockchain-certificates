'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wordmark } from '@/components/ui/citadel-logo';

/**
 * Shared chrome for the pages a member of the public sees. Keeping it in one
 * place is what makes the verification result look like it belongs to the
 * same institution as the landing page.
 */
export function PublicHeader({
  action,
}: {
  action?: React.ReactNode;
}) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md"
      data-print-hide=""
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="rounded-md">
          <Wordmark size="sm" />
        </Link>

        <nav className="flex items-center gap-2">
          {action ?? (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Issuer sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface" data-print-hide="">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-ink-muted sm:flex-row sm:px-8">
        <p>
          &copy; {new Date().getFullYear()} Citadel — credentials anchored to
          Ethereum.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/verify" className="rounded-sm transition-colors hover:text-ink">
            Verify a certificate
          </Link>
          <Link href="/login" className="rounded-sm transition-colors hover:text-ink">
            Issuer portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
