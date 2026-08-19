'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'min-h-[88px] w-full rounded-md border bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink',
        'transition-[border-color,box-shadow] duration-150',
        'hover:border-line-strong',
        'focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand/15',
        'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-subtle',
        invalid
          ? 'border-danger-line focus:border-danger focus:ring-danger/15'
          : 'border-line-strong',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
