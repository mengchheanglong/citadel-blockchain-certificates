'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  PlusCircle,
  Eye,
  Ban,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileBadge2,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';

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

export default function CertificatesListPage() {
  const { toast } = useToast();

  // Filter & Pagination State
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Data & Loading State
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Revoke Dialog State
  const [selectedCertForRevoke, setSelectedCertForRevoke] =
    useState<CertificateItem | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [isRevoking, setIsRevoking] = useState(false);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);

  // Fetch certificates from API
  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter && statusFilter !== 'ALL')
        params.set('status', statusFilter);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const res = await fetch(`/api/certificates?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load certificates');
      }

      setCertificates(data.certificates || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      console.error('Error loading certificates:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Failed to fetch certificates.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page, limit, toast]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  // Handle Search Input Change with instant reset if cleared
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    if (val === '' && search !== '') {
      setSearch('');
      setPage(1);
    }
  };

  // Handle Status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  // Copy Cert ID
  const handleCopyId = (certId: string) => {
    navigator.clipboard.writeText(certId);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open revoke modal
  const openRevokeModal = (cert: CertificateItem) => {
    setSelectedCertForRevoke(cert);
    setRevokeReason('');
    setIsRevokeDialogOpen(true);
  };

  // Submit revocation
  const handleConfirmRevoke = async () => {
    if (!selectedCertForRevoke) return;

    if (!revokeReason.trim() || revokeReason.trim().length < 5) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Revocation reason must be at least 5 characters.',
      });
      return;
    }

    setIsRevoking(true);
    try {
      const res = await fetch(
        `/api/certificates/${selectedCertForRevoke.id}/revoke`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: revokeReason.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to revoke certificate');
      }

      toast({
        title: 'Certificate Revoked',
        description: `Certificate ${selectedCertForRevoke.certificateId} has been revoked on the blockchain.`,
      });

      setIsRevokeDialogOpen(false);
      setSelectedCertForRevoke(null);
      setRevokeReason('');
      fetchCertificates();
    } catch (error: any) {
      console.error('Revocation error:', error);
      toast({
        variant: 'destructive',
        title: 'Revocation Failed',
        description:
          error?.message || 'An error occurred while revoking the certificate.',
      });
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            All Certificates
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View, search, manage, and verify all credentials issued by your organization.
          </p>
        </div>

        <Link href="/dashboard/certificates/new">
          <Button className="w-full sm:w-auto gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            Issue New Certificate
          </Button>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by recipient name, email, or Certificate ID..."
              value={searchInput}
              onChange={handleSearchInputChange}
              className="pl-9 text-sm"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="px-4">
            Search
          </Button>
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Status:
          </span>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="VALID">Valid</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="REVOKED">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-3 text-sm font-medium">Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FileBadge2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-800">
              No certificates found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {search || statusFilter !== 'ALL'
                ? 'No certificates match your search query or selected filter.'
                : 'Your organization has not issued any certificates yet.'}
            </p>
            <div className="mt-6 flex gap-3">
              {search || statusFilter !== 'ALL' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setSearchInput('');
                    setStatusFilter('ALL');
                    setPage(1);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear Filters
                </Button>
              ) : (
                <Link href="/dashboard/certificates/new">
                  <Button size="sm" className="gap-1.5 bg-blue-600 text-white">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Issue Your First Certificate
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
                  <TableHead className="font-semibold text-slate-700">
                    Certificate ID
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Recipient Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Course / Program
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Issue Date
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => {
                  const statusVariant =
                    cert.status === 'VALID'
                      ? 'valid'
                      : cert.status === 'EXPIRED'
                      ? 'expired'
                      : 'revoked';

                  return (
                    <TableRow key={cert.id} className="hover:bg-slate-50/60">
                      {/* Certificate ID */}
                      <TableCell className="font-mono text-xs font-semibold text-blue-600">
                        <div className="flex items-center gap-1.5">
                          <span>{cert.certificateId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyId(cert.certificateId)}
                            className="text-slate-400 hover:text-slate-600 transition"
                            title="Copy ID"
                          >
                            {copiedId === cert.certificateId ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Recipient */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {cert.recipientName}
                          </span>
                          <span className="text-xs text-slate-500">
                            {cert.recipientEmail}
                          </span>
                        </div>
                      </TableCell>

                      {/* Course */}
                      <TableCell className="max-w-[220px] truncate text-slate-800">
                        {cert.courseName}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={statusVariant} className="uppercase text-[10px]">
                          {cert.status}
                        </Badge>
                      </TableCell>

                      {/* Issue Date */}
                      <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                        {formatDate(cert.issueDate)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/dashboard/certificates/${cert.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-xs text-slate-700 hover:text-blue-600"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View</span>
                            </Button>
                          </Link>

                          {cert.status === 'VALID' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRevokeModal(cert)}
                              className="h-8 gap-1 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <Ban className="h-3.5 w-3.5" />
                              <span>Revoke</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-600">
            <div>
              Showing{' '}
              <span className="font-medium text-slate-900">
                {(page - 1) * limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-slate-900">
                {Math.min(page * limit, total)}
              </span>{' '}
              of <span className="font-medium text-slate-900">{total}</span>{' '}
              certificates
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 gap-1 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </Button>

              <span className="px-2 font-medium text-slate-700">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="h-8 gap-1 text-xs"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Revocation Confirmation Dialog */}
      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-lg">Revoke Certificate</DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 pt-1">
              This action will permanently mark this certificate as revoked both in the database and on the Ethereum blockchain.
            </DialogDescription>
          </DialogHeader>

          {selectedCertForRevoke && (
            <div className="space-y-4 py-2">
              <div className="rounded-md border border-rose-100 bg-rose-50/50 p-3 text-xs">
                <p>
                  <span className="font-medium text-slate-700">Certificate ID:</span>{' '}
                  <span className="font-mono font-semibold text-rose-700">
                    {selectedCertForRevoke.certificateId}
                  </span>
                </p>
                <p className="mt-1">
                  <span className="font-medium text-slate-700">Recipient:</span>{' '}
                  <span className="text-slate-900 font-medium">
                    {selectedCertForRevoke.recipientName}
                  </span>
                </p>
                <p className="mt-1">
                  <span className="font-medium text-slate-700">Course:</span>{' '}
                  <span className="text-slate-900">
                    {selectedCertForRevoke.courseName}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revokeReason" className="text-xs font-semibold">
                  Reason for Revocation *
                </Label>
                <Textarea
                  id="revokeReason"
                  placeholder="e.g., Course requirements incomplete, administrative error, or credential superseded..."
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  disabled={isRevoking}
                  rows={3}
                  className="text-xs"
                />
                <p className="text-[11px] text-slate-500">
                  Minimum 5 characters. This explanation will be publicly visible on the verification lookup page.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRevokeDialogOpen(false)}
              disabled={isRevoking}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmRevoke}
              disabled={isRevoking || revokeReason.trim().length < 5}
              className="gap-2"
            >
              {isRevoking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Revoking On-Chain...</span>
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  <span>Confirm Revocation</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
