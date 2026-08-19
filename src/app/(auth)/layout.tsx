'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CitadelLogo } from '@/components/ui/citadel-logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Bar with Home Link */}
      <header className="w-full border-b border-slate-200 bg-white/95 px-6 py-4 sm:px-8">
        <div className="container mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#C8102E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link href="/" className="flex items-center gap-3.5 transition hover:opacity-90">
            <CitadelLogo className="h-12 w-12" size={64} />
            <span className="text-2xl font-[900] tracking-tight text-slate-900">
              Citadel
            </span>
          </Link>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white">
        &copy; {new Date().getFullYear()} Citadel. Immutable blockchain credentialing.
      </footer>
    </div>
  );
}
