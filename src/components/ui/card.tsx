'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-xl border bg-surface text-ink transition-shadow duration-200',
  {
    variants: {
      elevation: {
        /* Flush with the canvas — for panels inside other panels. */
        flat: 'border-line shadow-none',
        /* The default document surface. */
        raised: 'border-line shadow-xs',
        /* Pulled forward: dialogs, sign-in, the verification verdict. */
        floating: 'border-line shadow-md',
      },
      tone: {
        default: '',
        brand: 'border-brand-line bg-brand-soft/50',
        success: 'border-success-line bg-success-soft',
        warning: 'border-warning-line bg-warning-soft',
        danger: 'border-danger-line bg-danger-soft',
      },
    },
    defaultVariants: { elevation: 'raised', tone: 'default' },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, tone, ...props }, ref) => (
    <div
      ref={ref}
      data-print-block=""
      className={cn(cardVariants({ elevation, tone }), className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * A card header is a title bar, not a hero. It sits on a muted band with a
 * hairline beneath so the eye can find the boundary of every panel at a
 * glance — the same way a well-set form or ledger is ruled.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { bordered?: boolean; muted?: boolean }
>(({ className, bordered = true, muted = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col gap-1 px-5 py-4',
      muted && 'rounded-t-xl bg-surface-muted/60',
      bordered && 'border-b border-line',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-md font-semibold tracking-tight text-ink', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-ink-muted', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-3 rounded-b-xl border-t border-line bg-surface-muted/50 px-5 py-4',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

/** Right-aligned actions inside a CardHeader. */
const CardToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-wrap items-center gap-2', className)}
    {...props}
  />
));
CardToolbar.displayName = 'CardToolbar';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardToolbar,
  cardVariants,
};
