'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle,
  Clock,
  XCircle,
  PlusCircle,
  FileText,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Activity,
  Download,
  Copy,
  Check,
  Sparkles,
  Building2,
  ShieldAlert,
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
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';

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

export default function DashboardOverviewPage() {
  const { toast } = useToast();
  const { organization } = useSupabaseAuth();
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const orgName = organization?.name || 'Authorized Institution';

  const fetchCertificates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/certificates?limit=100');
      if (!res.ok) {
        throw new Error(`Failed to fetch certificates (${res.status})`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
        setTotalCount(data.total || data.certificates.length);
      } else {
        throw new Error(data.message || 'Unable to load certificates');
      }
    } catch (err: any) {
      setError(err?.message || 'Error fetching certificates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: 'Copied to Clipboard',
      description: `Certificate ID ${text} copied.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (certificates.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'Issue your first certificate before exporting.',
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
    link.setAttribute('download', `citadel-certificates-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Audit Log Exported',
      description: 'Your certificate ledger has been downloaded as CSV.',
    });
  };

  // Compute stat counts
  const totalIssued = totalCount || certificates.length;
  const validCount = certificates.filter((c) => c.status === 'VALID').length;
  const expiredCount = certificates.filter((c) => c.status === 'EXPIRED').length;
  const revokedCount = certificates.filter((c) => c.status === 'REVOKED').length;
  const recentCertificates = certificates.slice(0, 6);

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
    <div className="space-y-8">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-[#1A0B10] to-[#000000] p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-[#C8102E]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8102E]/40 bg-[#C8102E]/20 px-3.5 py-1 text-xs font-bold text-[#FF4D6D]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Authority Dashboard • Ethereum Sepolia</span>
            </div>
            <h1 className="text-2xl font-[900] tracking-tight sm:text-3xl text-white">
              Welcome back, {orgName}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Manage your institution&apos;s cryptographic credential issuance, monitor on-chain verification activity, and audit tamper-proof academic records in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCertificates}
              disabled={isLoading}
              className="rounded-full border-slate-700 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Link href="/dashboard/certificates/new">
              <Button className="rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-lg shadow-[#C8102E]/30 transition hover:scale-105 active:scale-95">
                <PlusCircle className="mr-1.5 h-4 w-4" />
                Issue Certificate
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Issued */}
        <Card className="border-slate-200/90 bg-white shadow-xs transition-all hover:shadow-md hover:border-[#C8102E]/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Issued
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
              <Award className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-[900] text-slate-900">
              {isLoading ? <div className="h-8 w-16 animate-pulse rounded bg-slate-100" /> : totalIssued}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Anchored to Ethereum smart contract
            </p>
          </CardContent>
        </Card>

        {/* Active / Valid */}
        <Card className="border-slate-200/90 bg-white shadow-xs transition-all hover:shadow-md hover:border-emerald-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active / Valid
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-[900] text-emerald-600">
              {isLoading ? <div className="h-8 w-16 animate-pulse rounded bg-slate-100" /> : validCount}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              100% cryptographically verified
            </p>
          </CardContent>
        </Card>

        {/* Expired */}
        <Card className="border-slate-200/90 bg-white shadow-xs transition-all hover:shadow-md hover:border-amber-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Expired
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-[900] text-amber-600">
              {isLoading ? <div className="h-8 w-16 animate-pulse rounded bg-slate-100" /> : expiredCount}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Past validity timestamp
            </p>
          </CardContent>
        </Card>

        {/* Revoked */}
        <Card className="border-slate-200/90 bg-white shadow-xs transition-all hover:shadow-md hover:border-rose-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Revoked
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-[900] text-rose-600">
              {isLoading ? <div className="h-8 w-16 animate-pulse rounded bg-slate-100" /> : revokedCount}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Invalidated on-chain with reason code
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Issuer Quick Actions</h3>
            <p className="text-xs text-slate-500">Common administrative tasks and auditing tools</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
            Export Audit CSV
          </Button>

          <Link href="/verify" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
              Open QR Scanner
            </Button>
          </Link>

          <Link href="/dashboard/certificates/new">
            <Button
              size="sm"
              className="rounded-xl bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-xs"
            >
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Issue New
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Certificates Table Section */}
      <Card className="border-slate-200/90 bg-white shadow-xs">
        <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center pb-4 border-b border-slate-100">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Recent Issued Credentials
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Latest certificates anchored to the smart contract with live verification status
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/certificates">
              <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:text-slate-900">
                <FileText className="mr-1.5 h-3.5 w-3.5 text-[#C8102E]" />
                View Full Registry
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {error && (
            <div className="my-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
              <p className="font-bold">Unable to fetch certificate records</p>
              <p className="mt-1 text-xs">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCertificates}
                className="mt-3 rounded-xl bg-white text-xs font-semibold"
              >
                Try Again
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-[#C8102E]" />
              <p className="mt-3 text-xs font-semibold">Synchronizing with blockchain records...</p>
            </div>
          ) : recentCertificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C8102E]/10 text-[#C8102E]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800">
                No Certificates Issued Yet
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Start by issuing your first blockchain-verified credential to a student or recipient.
              </p>
              <Link href="/dashboard/certificates/new" className="mt-5">
                <Button className="rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-md">
                  <PlusCircle className="mr-1.5 h-4 w-4" />
                  Issue Your First Certificate
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200/80 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="font-bold text-xs text-slate-700">Certificate ID</TableHead>
                    <TableHead className="font-bold text-xs text-slate-700">Recipient</TableHead>
                    <TableHead className="font-bold text-xs text-slate-700">Program / Degree</TableHead>
                    <TableHead className="font-bold text-xs text-slate-700">Status</TableHead>
                    <TableHead className="font-bold text-xs text-slate-700">Issue Date</TableHead>
                    <TableHead className="text-right font-bold text-xs text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCertificates.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#C8102E]">
                          <span>{cert.certificateId}</span>
                          <button
                            onClick={() => handleCopy(cert.certificateId, cert.id)}
                            className="text-slate-400 hover:text-slate-600 transition"
                            title="Copy ID"
                          >
                            {copiedId === cert.id ? (
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/certificates/${cert.id}`}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#C8102E] transition shadow-2xs"
                          >
                            Details
                          </Link>
                          <Link
                            href={`/verify/${encodeURIComponent(cert.certificateId)}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8102E] hover:text-[#9E1B32] hover:underline"
                          >
                            <span>Verify</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
