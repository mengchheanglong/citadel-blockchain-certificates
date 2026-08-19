'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Trail of ancestors; the current page is supplied by `title`. */
  breadcrumbs?: Breadcrumb[];
  /** Right-aligned page-level actions. */
  actions?: React.ReactNode;
  /** Rendered directly after the title, e.g. a status badge. */
  badge?: React.ReactNode;
  className?: string;
}

/**
 * Every application page opens the same way: where you are, what this is,
 * and what you can do about it. Consistency here is what makes a product
 * feel like one system rather than a set of screens.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('space-y-4', className)}>
      {breadcrumbs?.length ? (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-muted">
            {breadcrumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="rounded-sm font-medium transition-colors hover:text-ink"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                <ChevronRight className="h-3 w-3 text-ink-subtle" aria-hidden />
              </li>
            ))}
            <li className="font-medium text-ink-secondary" aria-current="page">
              {typeof title === 'string' ? title : 'Current'}
            </li>
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
              {title}
            </h1>
            {badge}
          </div>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2.5" data-print-hide="">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
