'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  Clock,
  Ban,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  Download,
  AlertTriangle,
  ShieldCheck,
  CalendarClock,
  Inbox,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableRowSkeleton, Skeleton } from '@/components/ui/skeleton';
import { CopyButton } from '@/components/ui/copy-button';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';
import {
  formatDateShort,
  formatRelative,
  downloadCsv,
  getInitials,
  cn,
} from '@/lib/utils';

interface CertificateItem {
  id: string;
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED' | string;
  issueDate: string;
  expiryDate?: string | null;
  createdAt: string;
}

const WEEKS_CHARTED = 10;
const EXPIRY_HORIZON_DAYS = 90;

export default function DashboardOverviewPage() {
  const { toast } = useToast();
  const { organization } = useSupabaseAuth();

  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const orgName = organization?.name || 'your organisation';

  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/certificates?limit=100');
      if (!res.ok) throw new Error(`The registry returned status ${res.status}.`);

      const data = await res.json();
      if (data.success && Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
        setTotalCount(data.total || data.certificates.length);
        setLastSynced(new Date());
      } else {
        throw new Error(data.message || 'The registry returned an unexpected response.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to reach the certificate registry.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  /* ------------------------------------------------------------------ */
  /* Derived figures                                                     */
  /* ------------------------------------------------------------------ */
  const stats = useMemo(() => {
    const valid = certificates.filter((c) => c.status === 'VALID').length;
    const expired = certificates.filter((c) => c.status === 'EXPIRED').length;
    const revoked = certificates.filter((c) => c.status === 'REVOKED').length;
    const total = totalCount || certificates.length;
    const share = (n: number) => (total > 0 ? (n / total) * 100 : 0);

    return { total, valid, expired, revoked, share };
  }, [certificates, totalCount]);

  /** Issuance volume per week, oldest first — a real trend, not decoration. */
  const trend = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: WEEKS_CHARTED }, (_, index) => {
      const end = new Date(now);
      end.setDate(end.getDate() - (WEEKS_CHARTED - 1 - index) * 7);
      return { weekEnding: end, count: 0 };
    });

    certificates.forEach((cert) => {
      const issued = new Date(cert.issueDate || cert.createdAt);
      if (Number.isNaN(issued.getTime())) return;
      const weeksAgo = Math.floor(
        (now.getTime() - issued.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      const index = WEEKS_CHARTED - 1 - weeksAgo;
      if (index >= 0 && index < WEEKS_CHARTED) buckets[index].count += 1;
    });

    const peak = Math.max(1, ...buckets.map((b) => b.count));
    return { buckets, peak, issuedInWindow: buckets.reduce((sum, b) => sum + b.count, 0) };
  }, [certificates]);

  /** Valid credentials lapsing within the horizon — the registrar's to-do list. */
  const expiringSoon = useMemo(() => {
    const horizon = new Date();
    horizon.setDate(horizon.getDate() + EXPIRY_HORIZON_DAYS);

    return certificates
      .filter((cert) => {
        if (cert.status !== 'VALID' || !cert.expiryDate) return false;
        const expiry = new Date(cert.expiryDate);
        return expiry > new Date() && expiry <= horizon;
      })
      .sort(
        (a, b) =>
          new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()
      )
      .slice(0, 5);
  }, [certificates]);

  const recentCertificates = certificates.slice(0, 6);

  const handleExportCsv = () => {
    if (certificates.length === 0) {
      toast({
        title: 'Nothing to export',
        description: 'Issue a certificate before downloading the audit log.',
      });
      return;
    }

    downloadCsv(
      `citadel-audit-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        'Certificate ID',
        'Recipient name',
        'Recipient email',
        'Course',
        'Status',
        'Issue date',
        'Expiry date',
      ],
      certificates.map((c) => [
        c.certificateId,
        c.recipientName,
        c.recipientEmail,
        c.courseName,
        c.status,
        c.issueDate?.slice(0, 10) ?? '',
        c.expiryDate?.slice(0, 10) ?? 'No expiry',
      ])
    );

    toast({
      variant: 'success',
      title: 'Audit log exported',
      description: `${certificates.length} records written to CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={
          <>
            Issuance activity and credential health for{' '}
            <span className="font-medium text-ink-secondary">{orgName}</span>.
            {lastSynced ? (
              <span className="text-ink-subtle"> Synced {formatRelative(lastSynced)}.</span>
            ) : null}
          </>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCertificates}
              disabled={isLoading}
            >
              <RefreshCw className={cn(isLoading && 'animate-spin')} aria-hidden />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download aria-hidden />
              Export audit log
            </Button>
          </>
        }
      />

      {error ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-danger-line bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger-fg" aria-hidden />
            <div>
              <p className="text-sm font-medium text-danger-fg">
                Could not load the certificate registry
              </p>
              <p className="mt-0.5 text-xs text-danger-fg/80">{error}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchCertificates}>
            Try again
          </Button>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Credential health                                                */}
      {/* ---------------------------------------------------------------- */}
      <section aria-label="Credential summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total issued"
          value={stats.total}
          caption="Credentials anchored to the registry contract"
          icon={Award}
          tone="brand"
          loading={isLoading}
          href="/dashboard/certificates"
        />
        <StatCard
          label="Valid"
          value={stats.valid}
          caption="Active and verifiable by third parties"
          icon={CheckCircle2}
          tone="success"
          loading={isLoading}
          share={stats.share(stats.valid)}
          href="/dashboard/certificates?status=VALID"
        />
        <StatCard
          label="Expired"
          value={stats.expired}
          caption="Past their validity date, authentic when issued"
          icon={Clock}
          tone="warning"
          loading={isLoading}
          share={stats.share(stats.expired)}
          href="/dashboard/certificates?status=EXPIRED"
        />
        <StatCard
          label="Revoked"
          value={stats.revoked}
          caption="Withdrawn on-chain with a recorded reason"
          icon={Ban}
          tone="danger"
          loading={isLoading}
          share={stats.share(stats.revoked)}
          href="/dashboard/certificates?status=REVOKED"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* -------------------------------------------------------------- */}
        {/* Recent issuance                                                */}
        {/* -------------------------------------------------------------- */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Recently issued</CardTitle>
              <CardDescription>
                The last six credentials written to the ledger
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/certificates">
                View registry
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issued</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRowSkeleton columns={4} rows={5} />
                </TableBody>
              </Table>
            ) : recentCertificates.length === 0 ? (
              <EmptyState
                icon={ShieldCheck}
                title="No credentials issued yet"
                description="Issue your first certificate and it will be hashed, anchored on-chain, and emailed to the recipient automatically."
                action={
                  <Button asChild size="sm">
                    <Link href="/dashboard/certificates/new">
                      <PlusCircle aria-hidden />
                      Issue your first certificate
                    </Link>
                  </Button>
                }
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead className="text-right">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/dashboard/certificates/${cert.id}`}
                            className="metadata rounded-sm font-medium text-ink transition-colors hover:text-brand"
                          >
                            {cert.certificateId}
                          </Link>
                          <CopyButton
                            value={cert.certificateId}
                            label="certificate ID"
                          />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-ink-muted">
                          {cert.courseName}
                        </p>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-sunken text-2xs font-semibold text-ink-secondary"
                            aria-hidden
                          >
                            {getInitials(cert.recipientName)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">
                              {cert.recipientName}
                            </p>
                            <p className="truncate text-xs text-ink-muted">
                              {cert.recipientEmail}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={cert.status} />
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-xs text-ink-muted">
                        {formatDateShort(cert.issueDate)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/certificates/${cert.id}`}>Open</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* -------------------------------------------------------------- */}
        {/* Trend + upcoming expiries                                      */}
        {/* -------------------------------------------------------------- */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issuance volume</CardTitle>
              <CardDescription>
                Certificates issued per week over the last {WEEKS_CHARTED} weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[104px] w-full" />
              ) : (
                <>
                  <p className="mb-4 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tabular-nums text-ink">
                      {trend.issuedInWindow}
                    </span>
                    <span className="text-xs text-ink-muted">
                      issued in this window
                    </span>
                  </p>

                  <div
                    className="flex h-20 items-end gap-1.5"
                    role="img"
                    aria-label={`Weekly issuance: ${trend.buckets
                      .map((b) => `${formatDateShort(b.weekEnding)}, ${b.count}`)
                      .join('; ')}`}
                  >
                    {trend.buckets.map((bucket, index) => {
                      const height = (bucket.count / trend.peak) * 100;
                      const isLatest = index === trend.buckets.length - 1;
                      return (
                        <div
                          key={bucket.weekEnding.toISOString()}
                          className="group relative flex h-full flex-1 flex-col justify-end"
                          title={`Week ending ${formatDateShort(bucket.weekEnding)}: ${bucket.count}`}
                        >
                          <div
                            className={cn(
                              'w-full rounded-sm transition-colors',
                              bucket.count === 0
                                ? 'bg-surface-sunken'
                                : isLatest
                                  ? 'bg-brand'
                                  : 'bg-brand/35 group-hover:bg-brand/60'
                            )}
                            style={{ height: `${Math.max(height, 4)}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 flex justify-between text-2xs text-ink-subtle">
                    <span>{formatDateShort(trend.buckets[0].weekEnding)}</span>
                    <span>This week</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expiring soon</CardTitle>
              <CardDescription>
                Valid credentials lapsing within {EXPIRY_HORIZON_DAYS} days
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-3 p-5">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                  ))}
                </div>
              ) : expiringSoon.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="Nothing lapsing"
                  description={`No valid credentials expire in the next ${EXPIRY_HORIZON_DAYS} days.`}
                  className="py-10"
                />
              ) : (
                <ul className="divide-y divide-line">
                  {expiringSoon.map((cert) => (
                    <li key={cert.id}>
                      <Link
                        href={`/dashboard/certificates/${cert.id}`}
                        className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-muted"
                      >
                        <CalendarClock
                          className="h-4 w-4 shrink-0 text-warning"
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">
                            {cert.recipientName}
                          </p>
                          <p className="truncate text-xs text-ink-muted">
                            {cert.courseName}
                          </p>
                        </div>
                        <span className="shrink-0 text-right">
                          <span className="block text-xs font-medium text-warning-fg">
                            {formatDateShort(cert.expiryDate!)}
                          </span>
                          <span className="block text-2xs text-ink-subtle">
                            {formatRelative(cert.expiryDate!)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
