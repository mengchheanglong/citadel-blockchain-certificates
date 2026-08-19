'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onCopy'> {
  value: string;
  /** Names the thing being copied, e.g. "certificate ID". */
  label?: string;
  size?: 'sm' | 'md';
}

/**
 * Copying a hash is the single most repeated gesture in this product, so it
 * gets one component with its own confirmation. The tick replaces the icon in
 * place — no toast required, no layout shift.
 */
export function CopyButton({
  value,
  label = 'value',
  size = 'sm',
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard unavailable (insecure origin) — leave the icon untouched. */
    }
  }, [value]);

  const box = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  const glyph = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
      title={copied ? 'Copied' : `Copy ${label}`}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md text-ink-subtle',
        'transition-colors duration-150 hover:bg-surface-muted hover:text-ink-secondary',
        box,
        className
      )}
      {...props}
    >
      {copied ? (
        <Check className={cn(glyph, 'text-success-fg')} aria-hidden />
      ) : (
        <Copy className={glyph} aria-hidden />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ''}
      </span>
    </button>
  );
}
