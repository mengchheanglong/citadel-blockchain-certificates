'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { TableCell, TableRow } from '@/components/ui/table';

/**
 * Loading states show the shape of the answer, not a spinner in an empty
 * room. The reader's eye lands where the data will be before it arrives, so
 * nothing jumps when it does.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn('relative overflow-hidden rounded-md bg-surface-sunken', className)}
      {...props}
    >
      <span className="absolute inset-0 shimmer" />
    </div>
  );
}

/** Placeholder rows matching the registry table's column layout. */
export function TableRowSkeleton({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton
                className="h-3.5"
                style={{ width: `${colIndex === 0 ? 60 : 40 + ((rowIndex + colIndex) % 4) * 12}%` }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
