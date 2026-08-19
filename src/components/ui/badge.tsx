'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badges are tinted, never saturated. Solid fills are reserved for buttons,
 * so a page full of statuses never competes with the one action the reader
 * is meant to take.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.06em] whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-brand-line bg-brand-soft text-brand-strong',
        secondary: 'border-line bg-surface-muted text-ink-secondary',
        outline: 'border-line-strong bg-surface text-ink-secondary',
        valid: 'border-success-line bg-success-soft text-success-fg',
        expired: 'border-warning-line bg-warning-soft text-warning-fg',
        revoked: 'border-danger-line bg-danger-soft text-danger-fg',
        destructive: 'border-danger-line bg-danger-soft text-danger-fg',
        info: 'border-info-line bg-info-soft text-info-fg',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
