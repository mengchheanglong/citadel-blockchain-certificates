'use client';

import * as React from 'react';
import { CitadelLogo } from '@/components/ui/citadel-logo';
import { getStatusSpec, type CertificateStatus } from '@/components/ui/status-badge';
import { cn, formatDate } from '@/lib/utils';

export interface CertificateDocumentProps {
  organizationName: string;
  recipientName?: string;
  courseName?: string;
  courseDescription?: string | null;
  certificateId?: string;
  issueDate?: string | Date;
  expiryDate?: string | Date | null;
  status?: CertificateStatus;
  /** Data URL of the verification QR code, when one has been generated. */
  qrCodeData?: string | null;
  /** Renders muted sample text for empty fields — used by the live preview. */
  placeholder?: boolean;
  className?: string;
}

/**
 * The credential itself, rendered as a document rather than a card.
 *
 * The visual language is deliberately borrowed from engraved certificates:
 * a double rule, a guilloché ground, centred serif setting, and a seal in
 * the corner. Everything a registrar expects to see — and nothing that
 * belongs to a web dashboard.
 */
export function CertificateDocument({
  organizationName,
  recipientName,
  courseName,
  courseDescription,
  certificateId,
  issueDate,
  expiryDate,
  status = 'VALID',
  qrCodeData,
  placeholder = false,
  className,
}: CertificateDocumentProps) {
  const spec = getStatusSpec(status);
  const isVoid = status === 'REVOKED' || status === 'EXPIRED';

  const name = recipientName?.trim();
  const course = courseName?.trim();

  return (
    <article
      data-print-block=""
      aria-label="Certificate preview"
      className={cn(
        'relative isolate overflow-hidden rounded-xl border border-line bg-surface shadow-md',
        className
      )}
    >
      {/* Engraved ground and inner rule */}
      <div className="pointer-events-none absolute inset-0 guilloche opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute inset-3 rounded-lg border border-brand/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[13px] rounded-[7px] border border-brand/10"
        aria-hidden
      />

      {/* Void watermark for credentials that no longer stand */}
      {isVoid ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          aria-hidden
        >
          <span
            className={cn(
              'select-none -rotate-[14deg] rounded-md border-2 px-6 py-2 font-serif text-3xl font-bold uppercase tracking-[0.2em] opacity-[0.13]',
              status === 'REVOKED'
                ? 'border-danger text-danger'
                : 'border-warning text-warning'
            )}
          >
            {spec.label}
          </span>
        </div>
      ) : null}

      <div className="relative z-20 flex h-full flex-col px-7 py-7 text-center">
        {/* Issuing authority */}
        <header className="flex flex-col items-center gap-2 pb-5">
          <CitadelLogo className="h-9 w-9" size={56} />
          <p className="font-serif text-sm font-semibold leading-tight text-ink">
            {organizationName}
          </p>
          <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-brand">
            Blockchain-verified credential
          </p>
        </header>

        <Rule />

        {/* Award statement */}
        <div className="flex-1 space-y-3 py-6">
          <p className="text-2xs uppercase tracking-[0.16em] text-ink-muted">
            This is to certify that
          </p>

          <p
            className={cn(
              'font-serif text-xl font-semibold leading-snug tracking-tight',
              name ? 'text-ink' : 'text-ink-subtle'
            )}
          >
            {name || (placeholder ? 'Recipient name' : '—')}
          </p>

          <p className="text-2xs uppercase tracking-[0.16em] text-ink-muted">
            has satisfied the requirements for
          </p>

          <p
            className={cn(
              'font-serif text-md font-semibold italic leading-snug',
              course ? 'text-brand-strong' : 'text-ink-subtle'
            )}
          >
            {course || (placeholder ? 'Programme or award title' : '—')}
          </p>

          {courseDescription ? (
            <p className="mx-auto line-clamp-2 max-w-[36ch] text-xs leading-relaxed text-ink-muted">
              {courseDescription}
            </p>
          ) : null}
        </div>

        <Rule />

        {/* Provenance footer */}
        <footer className="flex items-end justify-between gap-4 pt-5 text-left">
          <dl className="space-y-2">
            <Stamp
              label="Issued"
              value={issueDate ? formatDate(issueDate) : formatDate(new Date())}
            />
            <Stamp
              label="Valid until"
              value={expiryDate ? formatDate(expiryDate) : 'No expiry'}
            />
            {certificateId ? (
              <Stamp label="Reference" value={certificateId} mono />
            ) : null}
          </dl>

          <div className="flex flex-col items-center gap-1.5">
            {qrCodeData ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={qrCodeData}
                alt="QR code linking to this certificate's verification page"
                className="h-16 w-16 rounded border border-line bg-white p-1"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded border border-dashed border-line-strong bg-surface-muted"
                aria-hidden
              >
                <span className="text-2xs font-medium text-ink-subtle">QR</span>
              </div>
            )}
            <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
              Scan to verify
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
}

/** A hairline pair — the engraver's double rule. */
function Rule() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <span className="h-px flex-1 bg-brand/25" />
      <span className="h-1 w-1 rotate-45 bg-brand/40" />
      <span className="h-px flex-1 bg-brand/25" />
    </div>
  );
}

function Stamp({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </dt>
      <dd
        className={cn(
          'text-xs font-medium text-ink-secondary',
          mono && 'metadata text-[11px]'
        )}
      >
        {value}
      </dd>
    </div>
  );
}
