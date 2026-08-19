'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders a leading adornment (icon) with correct padding reserved. */
  leading?: React.ReactNode;
  /** Renders a trailing adornment (unit, action) with correct padding. */
  trailing?: React.ReactNode;
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leading, trailing, invalid, ...props }, ref) => {
    const field = (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink',
          'transition-[border-color,box-shadow,background-color] duration-150',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'hover:border-line-strong',
          'focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand/15',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-subtle',
          invalid
            ? 'border-danger-line focus:border-danger focus:ring-danger/15'
            : 'border-line-strong',
          leading && 'pl-9',
          trailing && 'pr-9',
          className
        )}
        {...props}
      />
    );

    if (!leading && !trailing) return field;

    return (
      <div className="relative">
        {leading ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-ink-subtle [&_svg]:h-4 [&_svg]:w-4"
            aria-hidden
          >
            {leading}
          </span>
        ) : null}
        {field}
        {trailing ? (
          <span className="absolute right-3 top-1/2 flex -translate-y-1/2 text-ink-subtle [&_svg]:h-4 [&_svg]:w-4">
            {trailing}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
