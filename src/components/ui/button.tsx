'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Buttons carry weight through colour and border, never through scale
 * transforms or glow. A control that grows when you point at it reads as a
 * toy; a control that deepens by one step reads as an instrument.
 */
const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'font-medium leading-none',
    'transition-[background-color,border-color,color,box-shadow] duration-150',
    'disabled:pointer-events-none disabled:opacity-55',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        /* Primary commitment: issue, verify, sign in. One per view. */
        default:
          'bg-brand text-brand-foreground shadow-xs hover:bg-brand-strong active:bg-brand-deep',
        /* Neutral action that still needs an edge. */
        outline:
          'border border-line-strong bg-surface text-ink-secondary shadow-2xs hover:border-line-strong hover:bg-surface-muted hover:text-ink',
        secondary:
          'border border-line-strong bg-surface text-ink-secondary shadow-2xs hover:bg-surface-muted hover:text-ink',
        /* Quiet action inside dense chrome. */
        ghost: 'text-ink-secondary hover:bg-surface-muted hover:text-ink',
        subtle: 'bg-surface-muted text-ink-secondary hover:bg-surface-sunken hover:text-ink',
        /* Destructive: revocation is irreversible, so it looks it. */
        destructive: 'bg-danger text-white shadow-xs hover:bg-danger-fg',
        danger:
          'border border-danger-line bg-surface text-danger-fg shadow-2xs hover:bg-danger-soft',
        /* Inline navigation. */
        link: 'text-brand underline-offset-4 hover:text-brand-strong hover:underline',
        /* On dark surfaces (hero, welcome banner). */
        inverse:
          'border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs [&_svg]:size-3.5',
        sm: 'h-8 px-3 text-xs [&_svg]:size-3.5',
        default: 'h-9 px-3.5 text-sm [&_svg]:size-4',
        lg: 'h-11 px-5 text-md [&_svg]:size-4',
        icon: 'h-9 w-9 [&_svg]:size-4',
        'icon-sm': 'h-8 w-8 [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Swaps the leading icon for a spinner and blocks interaction. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
