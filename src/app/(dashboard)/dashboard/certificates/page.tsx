'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  PlusCircle,
  Download,
  ExternalLink,
  FileSearch,
  Ban,
  MoreHorizontal,
  Eye,
  Copy,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { TableRowSkeleton } from '@/components/ui/skeleton';
import { Segmented } from '@/components/ui/segmented';
import { Pagination } from '@/components/ui/pagination';
import { CopyButton } from '@/components/ui/copy-button';
import { useToast } from '@/components/ui/use-toast';
import { formatDateShort, downloadCsv, getInitials } from '@/lib/utils';

interface CertificateItem {
  id: string;
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  courseDescription?: string | null;
  issueDate: string;
  expiryDate?: string | null;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

type StatusFilter = 'ALL' | 'VALID' | 'EXPIRED' | 'REVOKED';

const PAGE_SIZE = 10;
const MIN_REASON_LENGTH = 5;

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Valid', value: 'VALID' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Revoked', value: 'REVOKED' },
];

function CertificatesRegistry() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get('status') as StatusFilter) || 'ALL'
  );
  const [page, setPage] = useState(1);

  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [revokeTarget, setRevokeTarget] = useState<CertificateItem | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));

      const res = await fetch(`/api/certificates?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toast({
          variant: 'destructive',
          title: 'Could not load the registry',
          description: data.message || 'The server returned an unexpected response.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Network error',
        description: err?.message || 'The registry could not be reached.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page, toast]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const isFiltered = Boolean(search) || statusFilter !== 'ALL';

  const resultSummary = useMemo(() => {
    if (isLoading) return 'Loading records…';
    if (total === 0) return 'No records';
    return `${total} ${total === 1 ? 'record' : 'records'}`;
  }, [isLoading, total]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatusFilter('ALL');
    setPage(1);
    searchRef.current?.focus();
  };

  const handleExportCsv = () => {
    if (certificates.length === 0) {
      toast({
        title: 'Nothing to export',
        description: 'No records match the current filters.',
      });
      return;
    }

    downloadCsv(
      `citadel-registry-${statusFilter.toLowerCase()}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
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
      title: 'Registry exported',
      description: `${certificates.length} records written to CSV.`,
    });
  };

  const openRevokeDialog = (cert: CertificateItem) => {
    setRevokeTarget(cert);
    setRevokeReason('');
    setRevokeError(null);
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;

    if (revokeReason.trim().length < MIN_REASON_LENGTH) {
      setRevokeError(
        `Give an auditable reason of at least ${MIN_REASON_LENGTH} characters. It is stored permanently with the record.`
      );
      return;
    }

    setIsRevoking(true);
    setRevokeError(null);

    try {
      const res = await fetch(`/api/certificates/${revokeTarget.id}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: revokeReason.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          variant: 'success',
          title: 'Certificate revoked',
          description: `${revokeTarget.certificateId} is now marked revoked on-chain.`,
        });
        setRevokeTarget(null);
        fetchCertificates();
      } else {
        setRevokeError(data.message || 'The registry contract rejected the revocation.');
      }
    } catch (err: any) {
      setRevokeError(err?.message || 'The network request failed. Try again.');
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificate registry"
        description="Every credential your organisation has issued, with its current on-chain state."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download aria-hidden />
              Export CSV
            </Button>
          </>
        }
      />

      {/* ---------------------------------------------------------------- */}
      {/* Filter toolbar                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-xl border border-line bg-surface shadow-xs">
        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2" role="search">
            <label htmlFor="registry-search" className="sr-only">
              Search the registry
            </label>
            <Input
              id="registry-search"
              ref={searchRef}
              type="search"
              placeholder="Search by recipient, email, course or certificate ID"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              leading={<Search />}
              className="max-w-md"
            />
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              aria-label="Filter by credential status"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            />
            {isFiltered ? (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X aria-hidden />
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2">
          <p className="text-xs text-ink-muted">
            {resultSummary}
            {isFiltered ? ' matching your filters' : ''}
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Records                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
        {isLoading ? (
          <Table>
            <TableHeader>
              <RegistryHeaderRow />
            </TableHeader>
            <TableBody>
              <TableRowSkeleton columns={6} rows={PAGE_SIZE} />
            </TableBody>
          </Table>
        ) : certificates.length === 0 ? (
          <EmptyState
            icon={FileSearch}
            title={isFiltered ? 'No matching records' : 'The registry is empty'}
            description={
              isFiltered
                ? 'No credential matches this search and status combination. Try a broader query.'
                : 'Once you issue a certificate it will appear here with its full audit trail.'
            }
            action={
              isFiltered ? (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button asChild size="sm">
                  <Link href="/dashboard/certificates/new">
                    <PlusCircle aria-hidden />
                    Issue certificate
                  </Link>
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <RegistryHeaderRow />
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/certificates/${cert.id}`}
                          className="metadata rounded-sm font-medium text-ink transition-colors hover:text-brand"
                        >
                          {cert.certificateId}
                        </Link>
                        <CopyButton value={cert.certificateId} label="certificate ID" />
                      </div>
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

                    <TableCell className="max-w-[240px]">
                      <p className="truncate text-sm text-ink-secondary" title={cert.courseName}>
                        {cert.courseName}
                      </p>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={cert.status} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs text-ink-muted">
                      {formatDateShort(cert.issueDate)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs text-ink-muted">
                      {cert.expiryDate ? (
                        formatDateShort(cert.expiryDate)
                      ) : (
                        <span className="text-ink-subtle">No expiry</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${cert.certificateId}`}
                          >
                            <MoreHorizontal aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/certificates/${cert.id}`}>
                              <Eye aria-hidden />
                              Open record
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/verify/${encodeURIComponent(cert.certificateId)}`}
                              target="_blank"
                            >
                              <ExternalLink aria-hidden />
                              Public verification
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              navigator.clipboard.writeText(cert.certificateId)
                            }
                          >
                            <Copy aria-hidden />
                            Copy certificate ID
                          </DropdownMenuItem>

                          {cert.status === 'VALID' ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                tone="danger"
                                onSelect={() => openRevokeDialog(cert)}
                              >
                                <Ban aria-hidden />
                                Revoke certificate
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 ? (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                disabled={isLoading}
              />
            ) : null}
          </>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Revocation                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Dialog
        open={Boolean(revokeTarget)}
        onOpenChange={(open) => {
          if (!open && !isRevoking) setRevokeTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this certificate?</DialogTitle>
            <DialogDescription>
              Revocation is written to the blockchain and cannot be undone. Anyone
              verifying this credential from now on will see it as revoked, together
              with the reason you record below.
            </DialogDescription>
          </DialogHeader>

          {revokeTarget ? (
            <DialogBody>
              <dl className="rounded-lg border border-line bg-surface-muted/60 p-3 text-sm">
                <div className="flex items-baseline justify-between gap-4 py-1">
                  <dt className="text-xs text-ink-muted">Certificate</dt>
                  <dd className="metadata font-medium text-ink">
                    {revokeTarget.certificateId}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-1">
                  <dt className="text-xs text-ink-muted">Recipient</dt>
                  <dd className="truncate font-medium text-ink">
                    {revokeTarget.recipientName}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-1">
                  <dt className="text-xs text-ink-muted">Course</dt>
                  <dd className="truncate text-ink-secondary">
                    {revokeTarget.courseName}
                  </dd>
                </div>
              </dl>

              <Field
                htmlFor="revoke-reason"
                label="Reason for revocation"
                required
                error={revokeError}
                hint="Recorded permanently and shown on the public verification page."
              >
                <Textarea
                  id="revoke-reason"
                  autoFocus
                  rows={3}
                  placeholder="e.g. Issued in error — superseded by CERT-2026-XXXXX"
                  value={revokeReason}
                  invalid={Boolean(revokeError)}
                  onChange={(event) => {
                    setRevokeReason(event.target.value);
                    if (revokeError) setRevokeError(null);
                  }}
                />
              </Field>
            </DialogBody>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeTarget(null)}
              disabled={isRevoking}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke} loading={isRevoking}>
              {isRevoking ? 'Revoking…' : 'Revoke certificate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RegistryHeaderRow() {
  return (
    <TableRow>
      <TableHead>Certificate ID</TableHead>
      <TableHead>Recipient</TableHead>
      <TableHead>Course</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Issued</TableHead>
      <TableHead>Expires</TableHead>
      <TableHead className="text-right">
        <span className="sr-only">Actions</span>
      </TableHead>
    </TableRow>
  );
}

export default function CertificatesListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden />
          <span className="sr-only">Loading registry</span>
        </div>
      }
    >
      <CertificatesRegistry />
    </Suspense>
  );
}
