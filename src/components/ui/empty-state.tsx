'use client';

import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Primary and secondary actions, rendered in a row beneath the copy. */
  action?: React.ReactNode;
  tone?: 'default' | 'danger';
  className?: string;
}

/**
 * An empty table is an opportunity, not a dead end: it names what is missing
 * and offers the single next step. Errors reuse the same layout so the page
 * never changes shape between "nothing yet" and "something went wrong".
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = 'default',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className
      )}
    >
      <div
        className={cn(
          'mb-5 flex h-12 w-12 items-center justify-center rounded-xl border shadow-xs',
          tone === 'danger'
            ? 'border-danger-line bg-danger-soft text-danger-fg'
            : 'border-line bg-surface-muted text-brand'
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>

      <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-muted">
        {description}
      </p>

      {action ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {action}
        </div>
      ) : null}
    </div>
  );
}
