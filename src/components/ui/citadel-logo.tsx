import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CitadelLogoProps {
  className?: string;
  size?: number;
}

export function CitadelLogo({
  className = 'h-9 w-9',
  size = 48,
}: CitadelLogoProps) {
  return (
    <span
      className={cn('relative flex shrink-0 items-center justify-center', className)}
    >
      <Image
        src="/citadel-logo.png"
        alt=""
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-contain"
        priority
        unoptimized
        aria-hidden
      />
    </span>
  );
}

export interface WordmarkProps {
  /** `sm` for dense chrome, `lg` for marketing headers. */
  size?: 'sm' | 'md' | 'lg';
  /** Small caps line beneath the name, e.g. "Issuer Portal". */
  subtitle?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

const MARK_SIZE = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-10 w-10' };
const NAME_SIZE = { sm: 'text-md', md: 'text-lg', lg: 'text-xl' };

/**
 * The logo lockup. One component so the mark, the name and the optional
 * qualifier keep the same relationship in every header of the product.
 */
export function Wordmark({
  size = 'md',
  subtitle,
  tone = 'dark',
  className,
}: WordmarkProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <CitadelLogo className={MARK_SIZE[size]} size={56} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-serif font-semibold tracking-tight',
            NAME_SIZE[size],
            tone === 'light' ? 'text-white' : 'text-ink'
          )}
        >
          Citadel
        </span>
        {subtitle ? (
          <span
            className={cn(
              'mt-1 text-2xs font-semibold uppercase tracking-[0.14em]',
              tone === 'light' ? 'text-white/60' : 'text-ink-muted'
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default CitadelLogo;
