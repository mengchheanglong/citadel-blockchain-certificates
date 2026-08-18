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
  Shield,
  Loader2,
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
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Compute stat counts
  const totalIssued = totalCount || certificates.length;
  const validCount = certificates.filter((c) => c.status === 'VALID').length;
  const expiredCount = certificates.filter((c) => c.status === 'EXPIRED').length;
  const revokedCount = certificates.filter((c) => c.status === 'REVOKED').length;

  const recentCertificates = certificates.slice(0, 5);

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
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500">
            Monitor and manage your organization&apos;s blockchain-issued credentials
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCertificates}
            disabled={isLoading}
            className="text-slate-600 hover:text-slate-900"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>

          <Link href="/dashboard/certificates/new">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Issue New Certificate
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid (4 Cards) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Issued */}
        <Card className="border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Issued
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Award className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
              ) : (
                totalIssued
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Total anchored to blockchain
            </p>
          </CardContent>
        </Card>

        {/* Active / Valid */}
        <Card className="border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Active / Valid
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
              ) : (
                validCount
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Live & verifiable credentials
            </p>
          </CardContent>
        </Card>

        {/* Expired */}
        <Card className="border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Expired
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-600">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
              ) : (
                expiredCount
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Past expiration validity
            </p>
          </CardContent>
        </Card>

        {/* Revoked */}
        <Card className="border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Revoked
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-red-600">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
              ) : (
                revokedCount
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Marked invalid on smart contract
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Certificates Section */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Recent Certificates
            </CardTitle>
            <CardDescription className="text-slate-500">
              Latest issued credentials and their live verification statuses
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/certificates">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                View All
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
              <p className="font-semibold">Unable to fetch certificates</p>
              <p className="mt-1 text-xs">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCertificates}
                className="mt-3 bg-white"
              >
                Try Again
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-3 text-sm">Loading certificate records...</p>
            </div>
          ) : recentCertificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-800">
                No Certificates Issued Yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Start by issuing your first blockchain-verified credential to a student or recipient.
              </p>
              <Link href="/dashboard/certificates/new" className="mt-5">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Issue Your First Certificate
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">
                      Certificate ID
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Recipient
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
                  {recentCertificates.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-slate-50/70">
                      <TableCell className="font-mono text-xs font-semibold text-blue-600">
                        {cert.certificateId}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">
                          {cert.recipientName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {cert.recipientEmail}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-800">
                        {cert.courseName}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(cert.status) as any}>
                          {cert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {cert.issueDate ? formatDate(cert.issueDate) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/verify?id=${encodeURIComponent(cert.certificateId)}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
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
