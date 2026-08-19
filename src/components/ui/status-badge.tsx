'use client';

import * as React from 'react';
import { CheckCircle2, Clock, Ban, HelpCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CertificateStatus = 'VALID' | 'EXPIRED' | 'REVOKED' | string;

type StatusSpec = {
  label: string;
  /** Plain-language meaning, used for tooltips and screen readers. */
  meaning: string;
  icon: LucideIcon;
  chip: string;
  dot: string;
  solid: string;
  accent: string;
};

/**
 * One source of truth for the credential lifecycle. Every table row, banner
 * and verification verdict in the product reads its colour, icon and wording
 * from here, so a revoked certificate looks identical wherever it appears.
 */
export const STATUS: Record<'VALID' | 'EXPIRED' | 'REVOKED' | 'UNKNOWN', StatusSpec> = {
  VALID: {
    label: 'Valid',
    meaning: 'Active and cryptographically verified on-chain',
    icon: CheckCircle2,
    chip: 'border-success-line bg-success-soft text-success-fg',
    dot: 'bg-success',
    solid: 'bg-success text-white',
    accent: 'text-success-fg',
  },
  EXPIRED: {
    label: 'Expired',
    meaning: 'Authentic when issued, but past its validity date',
    icon: Clock,
    chip: 'border-warning-line bg-warning-soft text-warning-fg',
    dot: 'bg-warning',
    solid: 'bg-warning text-white',
    accent: 'text-warning-fg',
  },
  REVOKED: {
    label: 'Revoked',
    meaning: 'Withdrawn by the issuing institution and no longer recognised',
    icon: Ban,
    chip: 'border-danger-line bg-danger-soft text-danger-fg',
    dot: 'bg-danger',
    solid: 'bg-danger text-white',
    accent: 'text-danger-fg',
  },
  UNKNOWN: {
    label: 'Unknown',
    meaning: 'No lifecycle state recorded for this credential',
    icon: HelpCircle,
    chip: 'border-line bg-surface-muted text-ink-muted',
    dot: 'bg-ink-subtle',
    solid: 'bg-ink-muted text-white',
    accent: 'text-ink-muted',
  },
};

export function getStatusSpec(status: CertificateStatus): StatusSpec {
  return STATUS[(status as keyof typeof STATUS) ?? 'UNKNOWN'] ?? STATUS.UNKNOWN;
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: CertificateStatus;
  size?: 'sm' | 'md';
  /** Render a leading icon instead of the status dot. */
  withIcon?: boolean;
}

export function StatusBadge({
  status,
  size = 'sm',
  withIcon = false,
  className,
  ...props
}: StatusBadgeProps) {
  const spec = getStatusSpec(status);
  const Icon = spec.icon;

  return (
    <span
      title={spec.meaning}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-semibold uppercase tracking-[0.06em]',
        size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs',
        spec.chip,
        className
      )}
      {...props}
    >
      {withIcon ? (
        <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden />
      ) : (
        <span className={cn('h-1.5 w-1.5 rounded-full', spec.dot)} aria-hidden />
      )}
      {spec.label}
      <span className="sr-only"> — {spec.meaning}</span>
    </span>
  );
}
