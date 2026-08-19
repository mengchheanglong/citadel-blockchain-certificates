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
  Download,
  ExternalLink,
  Filter,
  ShieldAlert,
  ShieldCheck,
  FileText,
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

      if (data.success && Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error loading registry',
          description: data.message || 'Unable to retrieve certificates',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: err?.message || 'Failed to fetch certificates',
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page, limit, toast]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setSearch('');
    setStatusFilter('ALL');
    setPage(1);
  };

  const handleCopyId = (certId: string) => {
    navigator.clipboard.writeText(certId);
    setCopiedId(certId);
    toast({
      title: 'Copied to Clipboard',
      description: `Certificate ID ${certId} copied.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (certificates.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'No certificates found for current filters.',
      });
      return;
    }

    const headers = ['Certificate ID', 'Recipient Name', 'Recipient Email', 'Course Name', 'Status', 'Issue Date', 'Expiry Date'];
    const rows = certificates.map((c) => [
      c.certificateId,
      `"${c.recipientName.replace(/"/g, '""')}"`,
      c.recipientEmail,
      `"${c.courseName.replace(/"/g, '""')}"`,
      c.status,
      c.issueDate ? c.issueDate.split('T')[0] : '',
      c.expiryDate ? c.expiryDate.split('T')[0] : 'Lifetime',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `citadel-registry-${statusFilter.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Registry Exported',
      description: 'Downloaded certificate list as CSV.',
    });
  };

  const openRevokeDialog = (cert: CertificateItem) => {
    setSelectedCertForRevoke(cert);
    setRevokeReason('');
    setIsRevokeDialogOpen(true);
  };

  const handleRevokeSubmit = async () => {
    if (!selectedCertForRevoke) return;

    if (!revokeReason.trim() || revokeReason.trim().length < 5) {
      toast({
        variant: 'destructive',
        title: 'Revocation Reason Required',
        description: 'Please provide a clear reason of at least 5 characters.',
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

      if (data.success) {
        toast({
          title: 'Certificate Revoked on Blockchain',
          description: `Certificate ${selectedCertForRevoke.certificateId} is now invalidated.`,
        });
        setIsRevokeDialogOpen(false);
        fetchCertificates();
      } else {
        toast({
          variant: 'destructive',
          title: 'Revocation Failed',
          description: data.message || 'Unable to revoke on smart contract',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Revocation Error',
        description: err?.message || 'Error communicating with network',
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'VALID':
        return 'valid';
      case 'EXPIRED':
        return 'expired';
      case 'REVOKED':
        return 'revoked';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-[900] tracking-tight text-slate-900 sm:text-3xl">
            Certificate Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, verify, and manage all blockchain-anchored credentials ({total} total records)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
            Export CSV
          </Button>

          <Link href="/dashboard/certificates/new">
            <Button className="rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-md shadow-[#C8102E]/20 transition hover:scale-105 active:scale-95">
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Issue New Certificate
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { label: 'All Credentials', value: 'ALL' },
              { label: 'Valid / Active', value: 'VALID' },
              { label: 'Expired', value: 'EXPIRED' },
              { label: 'Revoked', value: 'REVOKED' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === tab.value
                    ? 'bg-[#C8102E] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing page {page} of {totalPages}
          </span>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by recipient name, email, Certificate ID, or course title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10 rounded-xl border-slate-200 text-xs focus:border-[#C8102E]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              className="h-10 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
            >
              Search
            </Button>

            {(search || statusFilter !== 'ALL') && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetSearch}
                className="h-10 rounded-xl text-xs font-semibold border-slate-200"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Registry Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-[#C8102E]" />
            <p className="mt-3 text-xs font-semibold">Loading certificate records...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileBadge2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              No matching certificates found
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              {search || statusFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filter tabs.'
                : 'Get started by issuing your first blockchain credential.'}
            </p>
            {search || statusFilter !== 'ALL' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSearch}
                className="mt-4 rounded-xl text-xs font-semibold"
              >
                Clear Filters
              </Button>
            ) : (
              <Link href="/dashboard/certificates/new" className="mt-4">
                <Button className="rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white text-xs font-bold">
                  <PlusCircle className="mr-1.5 h-4 w-4" />
                  Issue Certificate
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div>
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow>
                  <TableHead className="font-bold text-xs text-slate-700">Certificate ID</TableHead>
                  <TableHead className="font-bold text-xs text-slate-700">Recipient</TableHead>
                  <TableHead className="font-bold text-xs text-slate-700">Program / Degree</TableHead>
                  <TableHead className="font-bold text-xs text-slate-700">Status</TableHead>
                  <TableHead className="font-bold text-xs text-slate-700">Issue Date</TableHead>
                  <TableHead className="font-bold text-xs text-slate-700">Expiry Date</TableHead>
                  <TableHead className="text-right font-bold text-xs text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#C8102E]">
                        <span>{cert.certificateId}</span>
                        <button
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
                    <TableCell>
                      <div className="font-bold text-xs text-slate-900">{cert.recipientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{cert.recipientEmail}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-800">
                      {cert.courseName}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(cert.status) as any}>
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {cert.issueDate ? formatDate(cert.issueDate) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-mono">
                      {cert.expiryDate ? formatDate(cert.expiryDate) : 'Lifetime'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/certificates/${cert.id}`}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#C8102E] transition shadow-2xs"
                        >
                          View
                        </Link>

                        <Link
                          href={`/verify/${encodeURIComponent(cert.certificateId)}`}
                          target="_blank"
                          className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:text-[#C8102E] hover:bg-slate-50 transition"
                          title="Verify Publicly"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        {cert.status === 'VALID' && (
                          <button
                            onClick={() => openRevokeDialog(cert)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
                            title="Revoke Certificate"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <div className="text-xs text-slate-500">
                  Page <span className="font-bold text-slate-900">{page}</span> of{' '}
                  <span className="font-bold text-slate-900">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="h-8 rounded-lg text-xs font-semibold border-slate-200"
                  >
                    <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="h-8 rounded-lg text-xs font-semibold border-slate-200"
                  >
                    Next
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Revocation Confirmation Dialog */}
      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-[900] text-slate-900">
              Revoke Blockchain Certificate
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500">
              This action will invoke the smart contract to permanently mark this certificate as <span className="font-bold text-rose-600">REVOKED</span> on Ethereum.
            </DialogDescription>
          </DialogHeader>

          {selectedCertForRevoke && (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Certificate ID:</span>
                  <span className="font-bold text-[#C8102E]">{selectedCertForRevoke.certificateId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-bold text-slate-800">{selectedCertForRevoke.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="text-slate-700 truncate max-w-[200px]">{selectedCertForRevoke.courseName}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="revokeReason" className="text-xs font-bold text-slate-700">
                  Revocation Reason <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="revokeReason"
                  placeholder="State the official audit reason (e.g. Academic misconduct, degree reissuance, clerical error)..."
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  rows={3}
                  className="text-xs rounded-xl border-slate-200 focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRevokeDialogOpen(false)}
              disabled={isRevoking}
              className="rounded-xl text-xs font-semibold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleRevokeSubmit}
              disabled={isRevoking}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
            >
              {isRevoking ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Mining Invalidation...
                </>
              ) : (
                'Confirm On-Chain Revocation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
