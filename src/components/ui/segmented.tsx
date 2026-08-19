'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
  /** Optional running count shown as a trailing pill. */
  count?: number;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  'aria-label': string;
  className?: string;
}

/**
 * A segmented control instead of a row of loose pills: the group is one
 * object with one selected member, which is both what the user sees and what
 * assistive technology is told.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  ...props
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={props['aria-label']}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg border border-line bg-surface-muted p-0.5',
        className
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium',
              'transition-[background-color,color,box-shadow] duration-150',
              selected
                ? 'bg-surface text-ink shadow-xs'
                : 'text-ink-muted hover:text-ink-secondary'
            )}
          >
            {option.label}
            {typeof option.count === 'number' ? (
              <span
                className={cn(
                  'rounded px-1.5 py-px text-2xs font-semibold tabular-nums',
                  selected ? 'bg-brand-soft text-brand-strong' : 'bg-surface-sunken text-ink-muted'
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
