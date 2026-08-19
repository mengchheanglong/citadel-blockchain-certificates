'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/copy-button';

/**
 * A definition list for record detail: label above, value below, ruled
 * between rows. Used for credential metadata and on-chain proof so the
 * dashboard and the public verification page describe a certificate in
 * exactly the same voice.
 */
export function DataList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDListElement>) {
  return (
    <dl
      className={cn('divide-y divide-line rounded-lg border border-line', className)}
      {...props}
    />
  );
}

export interface DataRowProps {
  label: string;
  /** Rendered when the value is absent, e.g. "Not recorded". */
  fallback?: string;
  value?: React.ReactNode;
  /** Renders the value in the ledger typeface with wrapping enabled. */
  mono?: boolean;
  /** Adds a copy control aligned to the right of the value. */
  copyValue?: string;
  copyLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function DataRow({
  label,
  value,
  fallback = '—',
  mono = false,
  copyValue,
  copyLabel,
  icon,
  className,
}: DataRowProps) {
  const isEmpty =
    value === null || value === undefined || value === '' || value === false;

  return (
    <div className={cn('flex items-start gap-3 px-4 py-3', className)}>
      {icon ? (
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink-muted [&_svg]:h-3.5 [&_svg]:w-3.5">
          {icon}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <dt className="text-2xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          {label}
        </dt>
        <dd
          className={cn(
            'mt-1 text-sm text-ink',
            mono && 'metadata break-all text-ink-secondary',
            isEmpty && 'text-ink-subtle'
          )}
        >
          {isEmpty ? fallback : value}
        </dd>
      </div>

      {copyValue ? (
        <CopyButton value={copyValue} label={copyLabel ?? label.toLowerCase()} className="mt-3" />
      ) : null}
    </div>
  );
}
