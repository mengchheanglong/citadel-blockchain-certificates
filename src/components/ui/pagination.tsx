'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Total matching records, used for the "showing x–y of z" summary. */
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

/**
 * Pagination that answers the auditor's question — *which* records am I
 * looking at — before it offers the controls to move between them.
 */
export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-3 border-t border-line px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-xs text-ink-muted">
        Showing{' '}
        <span className="font-medium tabular-nums text-ink-secondary">
          {first}–{last}
        </span>{' '}
        of{' '}
        <span className="font-medium tabular-nums text-ink-secondary">{total}</span>{' '}
        {total === 1 ? 'record' : 'records'}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={disabled || page <= 1}
        >
          <ChevronLeft aria-hidden />
          Previous
        </Button>

        <span className="px-1 text-xs tabular-nums text-ink-muted">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={disabled || page >= totalPages}
        >
          Next
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
