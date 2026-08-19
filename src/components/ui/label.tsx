'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    /** Appends the conventional required marker with an accessible name. */
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'flex items-center gap-1 text-sm font-medium leading-none text-ink-secondary',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
      className
    )}
    {...props}
  >
    {children}
    {required ? (
      <span className="text-danger" aria-hidden>
        *
      </span>
    ) : null}
    {required ? <span className="sr-only">(required)</span> : null}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
