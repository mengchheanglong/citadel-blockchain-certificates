'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

const TONES: Record<Tone, { icon: string; rule: string; value: string }> = {
  brand: { icon: 'bg-brand-soft text-brand', rule: 'bg-brand', value: 'text-ink' },
  success: { icon: 'bg-success-soft text-success-fg', rule: 'bg-success', value: 'text-ink' },
  warning: { icon: 'bg-warning-soft text-warning-fg', rule: 'bg-warning', value: 'text-ink' },
  danger: { icon: 'bg-danger-soft text-danger-fg', rule: 'bg-danger', value: 'text-ink' },
  neutral: { icon: 'bg-surface-muted text-ink-muted', rule: 'bg-ink-subtle', value: 'text-ink' },
};

export interface StatCardProps {
  label: string;
  value: number | string;
  /** One line explaining what the number actually counts. */
  caption: string;
  icon: LucideIcon;
  tone?: Tone;
  loading?: boolean;
  /** Percentage of the total, drawn as a hairline meter beneath the value. */
  share?: number;
  href?: string;
}

/**
 * A metric tile earns its space by being legible in a glance: the number is
 * the largest thing on it, the label sits above in small caps, and a hairline
 * meter shows the value's share of the whole so four tiles read as one chart.
 */
export function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  tone = 'neutral',
  loading = false,
  share,
  href,
}: StatCardProps) {
  const palette = TONES[tone];

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
          {label}
        </span>
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200',
            palette.icon
          )}
          aria-hidden
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {loading ? (
          <Skeleton className="h-8 w-14" />
        ) : (
          <span
            className={cn('text-3xl font-semibold tabular-nums tracking-tight', palette.value)}
          >
            {value}
          </span>
        )}
        {href && !loading ? (
          <ArrowUpRight className="h-4 w-4 text-ink-subtle transition-colors group-hover:text-brand" aria-hidden />
        ) : null}
      </div>

      {typeof share === 'number' && !loading ? (
        <div
          className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-sunken"
          role="presentation"
        >
          <div
            className={cn('h-full rounded-full transition-[width] duration-500 ease-emphasis', palette.rule)}
            style={{ width: `${Math.min(100, Math.max(0, share))}%` }}
          />
        </div>
      ) : null}

      <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">{caption}</p>
    </>
  );

  const shell =
    'group block rounded-xl border border-line bg-surface p-5 shadow-xs transition-[border-color,box-shadow] duration-200';

  if (href) {
    return (
      <Link href={href} className={cn(shell, 'hover:border-line-strong hover:shadow-sm')}>
        {body}
      </Link>
    );
  }

  return <div className={shell}>{body}</div>;
}
