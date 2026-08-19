'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface FieldProps {
  /** Must match the `id` of the control rendered as a child. */
  htmlFor: string;
  label: string;
  required?: boolean;
  /** Guidance shown before the user makes a mistake, not after. */
  hint?: React.ReactNode;
  error?: string | null;
  /** Right-aligned affordance in the label row, e.g. "Forgot password?". */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Every labelled control in the product goes through this wrapper, so the
 * label/hint/error rhythm is identical on the sign-in screen, the issuance
 * form and the settings page.
 */
export function Field({
  htmlFor,
  label,
  required,
  hint,
  error,
  action,
  className,
  children,
}: FieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
        {action}
      </div>

      <div aria-describedby={cn(hintId, errorId) || undefined}>{children}</div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-medium text-danger-fg"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
