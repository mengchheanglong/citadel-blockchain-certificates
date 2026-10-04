'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QrScanner, parseCertificateId } from '@/components/verification/qr-scanner';
import {
  Search,
  QrCode,
  X,
  ShieldCheck,
  Blocks,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { PublicHeader, PublicFooter } from '@/components/layout/public-chrome';

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: 'Checked against the ledger',
    body: 'The certificate’s fingerprint is compared with the record written on-chain when it was issued.',
  },
  {
    icon: Eye,
    title: 'No account needed',
    body: 'Verification is public and anonymous. Nothing you enter here is shared with the issuing institution.',
  },
  {
    icon: Blocks,
    title: 'Independently checkable',
    body: 'Every result links to the underlying transaction on a public block explorer.',
  },
];

export default function VerifyEntryPage() {
  const router = useRouter();

  const [certificateId, setCertificateId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = parseCertificateId(certificateId);

    if (!id) {
      setError('Enter the certificate ID printed on the document.');
      inputRef.current?.focus();
      return;
    }

    setError(null);
    router.push(`/verify/${encodeURIComponent(id)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <PublicHeader />

      <main id="main" className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-xl">
          <div className="space-y-3 text-center">
            <p className="eyebrow">Public verification</p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
              Verify a certificate
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-muted">
              Enter the certificate ID or scan the QR code on the document to
              confirm it is genuine, current, and issued by the institution it
              names.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-7">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field
                htmlFor="certificateId"
                label="Certificate ID"
                error={error}
                hint="Printed beneath the QR code, in the form CERT-2026-XXXXXXX."
              >
                <Input
                  id="certificateId"
                  ref={inputRef}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="CERT-2026-A3B7K"
                  leading={<Search />}
                  className="metadata h-11 text-md"
                  value={certificateId}
                  invalid={Boolean(error)}
                  onChange={(event) => {
                    setCertificateId(event.target.value);
                    if (error) setError(null);
                  }}
                />
              </Field>

              <Button type="submit" size="lg" className="w-full">
                Verify certificate
                <ArrowRight aria-hidden />
              </Button>
            </form>

            <div className="relative my-6 flex items-center" aria-hidden>
              <span className="h-px flex-1 bg-line" />
              <span className="px-3 text-2xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                or
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            {isScanning ? (
              <QrScanner
                onScanSuccess={(id) => {
                  setIsScanning(false);
                  router.push(`/verify/${encodeURIComponent(id)}`);
                }}
                onClose={() => setIsScanning(false)}
              />
            ) : (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setIsScanning(true)}
              >
                <QrCode aria-hidden />
                Scan QR code
              </Button>
            )}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {ASSURANCES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-lg border border-line bg-surface p-4"
              >
                <Icon className="h-4 w-4 text-brand" aria-hidden />
                <p className="mt-2.5 text-sm font-medium text-ink">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-xs text-ink-muted">
            Issue certificates for your institution?{' '}
            <Link
              href="/register"
              className="rounded-sm font-medium text-brand transition-colors hover:underline"
            >
              Register as an issuer
            </Link>
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
