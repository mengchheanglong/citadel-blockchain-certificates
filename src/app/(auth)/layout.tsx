'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, ScanLine, FileCheck2 } from 'lucide-react';
import { Wordmark } from '@/components/ui/citadel-logo';

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: 'Tamper-evident by construction',
    body: 'Each certificate is hashed and anchored on-chain, so any alteration is detectable by anyone.',
  },
  {
    icon: ScanLine,
    title: 'Verified in seconds, not weeks',
    body: 'Employers and registrars check a credential from its ID or QR code — no phone calls, no forms.',
  },
  {
    icon: FileCheck2,
    title: 'A complete audit trail',
    body: 'Issuance, delivery and revocation are all recorded, exportable and independently checkable.',
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* ---------------------------------------------------------------- */}
      {/* Editorial panel — the institutional promise, stated once.        */}
      {/* ---------------------------------------------------------------- */}
      <aside className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 9px)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-brand/25 blur-[140px]"
          aria-hidden
        />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="w-fit rounded-md">
            <Wordmark size="lg" tone="light" />
          </Link>

          <div className="max-w-md space-y-10">
            <div className="space-y-4">
              <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Issuer portal
              </p>
              <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-white">
                The credential registry for institutions that are asked to prove
                things.
              </h2>
            </div>

            <ul className="space-y-6">
              {ASSURANCES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3.5">
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-sm leading-relaxed text-white/60">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Citadel · Credentials anchored to
            Ethereum
          </p>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Form column                                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col bg-canvas">
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>

          <Link href="/" className="rounded-md lg:hidden">
            <Wordmark size="sm" />
          </Link>

          <Link
            href="/verify"
            className="hidden rounded-md text-sm font-medium text-ink-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Verify a certificate
          </Link>
        </header>

        <main
          id="main"
          className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10"
        >
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="px-6 py-6 text-center text-xs text-ink-subtle sm:px-10">
          Need help? Contact your Citadel administrator.
        </footer>
      </div>
    </div>
  );
}
