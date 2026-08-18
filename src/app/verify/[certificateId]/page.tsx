'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Search,
  ArrowLeft,
  Building2,
  User,
  BookOpen,
  Calendar,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  FileCheck2,
  Cpu,
  Globe,
  Mail,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CitadelLogo } from '@/components/ui/citadel-logo';
import {
  formatDate,
  shortenHash,
  getEtherscanUrl,
  cn,
} from '@/lib/utils';

interface VerificationResultData {
  success: boolean;
  verified: boolean;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
  certificate: {
    id: string;
    certificateId: string;
    recipientName: string;
    courseName: string;
    courseDescription?: string | null;
    issueDate: string;
    expiryDate?: string | null;
    status: 'VALID' | 'EXPIRED' | 'REVOKED';
    revokeReason?: string | null;
    revokedAt?: string | null;
    qrCodeData?: string | null;
    createdAt?: string;
  };
  organization: {
    name: string;
    website?: string | null;
    email?: string | null;
    description?: string | null;
    logoUrl?: string | null;
  };
  blockchainProof: {
    txHash?: string | null;
    blockNumber?: string | null;
    networkName?: string | null;
    contractAddress?: string | null;
    onChainStatus?: number | null;
    onChainStatusLabel?: string | null;
    verified: boolean;
    error?: string | null;
  };
}

export default function VerificationResultPage() {
  const params = useParams();
  const rawCertId = (params?.certificateId as string) || '';
  const certificateId = decodeURIComponent(rawCertId);

  // States
  const [data, setData] = useState<VerificationResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch verification data
  const fetchVerification = useCallback(async () => {
    if (!certificateId) {
      setIsLoading(false);
      setErrorMessage('No certificate ID was provided.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(certificateId)}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(
          result.message ||
            `Certificate with ID "${certificateId}" could not be found or verified.`
        );
        setData(null);
      } else {
        setData(result);
      }
    } catch (error: any) {
      console.error('Verification query failed:', error);
      setErrorMessage(
        error?.message ||
          'A network error occurred while connecting to the verification service.'
      );
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [certificateId]);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/verify"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Verify Another</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <CitadelLogo className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-slate-900">
              Citadel
            </span>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="sm" className="text-xs">
              Issuer Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-10 sm:py-14">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-800">
                  Verifying Credential on Blockchain...
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Querying smart contract for {certificateId}
                </p>
              </div>
            </div>
          )}

          {/* Error State: Not Found */}
          {!isLoading && (errorMessage || !data) && (
            <div className="mx-auto max-w-lg text-center space-y-6 py-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-xs">
                <XCircle className="h-10 w-10" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Certificate Not Verified
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {errorMessage ||
                    `No active record matching Certificate ID "${certificateId}" was found in our decentralized registry.`}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 text-left text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">Possible explanations:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-500">
                  <li>The Certificate ID was mistyped or incomplete.</li>
                  <li>The credential has not been officially registered or issued.</li>
                  <li>The smart contract transaction is still confirming on the blockchain.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/verify" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2 bg-blue-600 text-white">
                    <Search className="h-4 w-4" />
                    Verify Another Certificate
                  </Button>
                </Link>
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Success State */}
          {!isLoading && data && data.certificate && (
            <div className="space-y-6">
              {/* Top Large Status Indicator Banner */}
              {data.status === 'VALID' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 shadow-sm text-emerald-950">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold text-emerald-950">
                          Certificate is Valid
                        </h1>
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                          AUTHENTIC RECORD
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-emerald-800">
                        This credential is cryptographically anchored on the Ethereum blockchain and verified authentic.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {data.status === 'EXPIRED' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm text-amber-950">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <Clock className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold text-amber-950">
                          Certificate has Expired
                        </h1>
                        <Badge className="bg-amber-600 text-white hover:bg-amber-700">
                          EXPIRED
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-amber-800">
                        This credential was authentic when issued, but reached its expiration date on{' '}
                        <span className="font-semibold">
                          {data.certificate.expiryDate
                            ? formatDate(data.certificate.expiryDate)
                            : 'the configured expiration date'}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {data.status === 'REVOKED' && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-6 shadow-sm text-rose-950">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      <XCircle className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold text-rose-950">
                          Certificate has been Revoked
                        </h1>
                        <Badge className="bg-rose-600 text-white hover:bg-rose-700">
                          REVOKED
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-rose-800">
                        This credential has been officially marked as revoked by the issuing institution and is no longer active.
                      </p>
                    </div>
                  </div>

                  {/* Revocation Reason Notice */}
                  {data.certificate.revokeReason && (
                    <div className="mt-4 rounded-lg border border-rose-200 bg-white p-3.5 text-xs text-rose-900">
                      <span className="font-bold">Revocation Reason:</span>{' '}
                      <span>{data.certificate.revokeReason}</span>
                      {data.certificate.revokedAt && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          Revoked on: {formatDate(data.certificate.revokedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Certificate Details (2 cols) */}
                <div className="space-y-6 lg:col-span-2">
                  <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            Credential Details
                          </CardTitle>
                          <CardDescription>
                            Verified recipient and course information
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                          <span>{data.certificate.certificateId}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                data.certificate.certificateId,
                                'certId'
                              )
                            }
                            className="text-slate-400 hover:text-slate-600"
                            title="Copy ID"
                          >
                            {copiedKey === 'certId' ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5 pt-6 text-sm">
                      {/* Recipient */}
                      <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <User className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Recipient Name
                          </span>
                          <p className="text-base font-bold text-slate-900">
                            {data.certificate.recipientName}
                          </p>
                        </div>
                      </div>

                      {/* Course */}
                      <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <BookOpen className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Course / Credential
                          </span>
                          <p className="text-base font-bold text-slate-900">
                            {data.certificate.courseName}
                          </p>
                          {data.certificate.courseDescription && (
                            <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                              {data.certificate.courseDescription}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Issuing Organization */}
                      <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <Building2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 flex-1">
                          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Issuing Organization
                          </span>
                          <p className="text-base font-bold text-slate-900">
                            {data.organization.name}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                            {data.organization.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {data.organization.email}
                              </span>
                            )}
                            {data.organization.website && (
                              <a
                                href={
                                  data.organization.website.startsWith('http')
                                    ? data.organization.website
                                    : `https://${data.organization.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <Globe className="h-3.5 w-3.5" />
                                <span>Official Website</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid gap-4 sm:grid-cols-2 rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-xs">
                        <div className="flex items-start gap-2.5">
                          <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <span className="text-slate-500">Issue Date</span>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatDate(data.certificate.issueDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <span className="text-slate-500">Expiration Date</span>
                            <p className="text-sm font-semibold text-slate-900">
                              {data.certificate.expiryDate
                                ? formatDate(data.certificate.expiryDate)
                                : 'No Expiration (Lifetime)'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Blockchain Proof (1 col) */}
                <div className="space-y-6">
                  <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-600">
                          <ShieldCheck className="h-5 w-5" />
                          <CardTitle className="text-base font-semibold">
                            Blockchain Proof
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-xs">
                        {data.blockchainProof.verified
                          ? 'Verified on Blockchain'
                          : 'Blockchain verification recorded'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3.5 pt-4 text-xs">
                      {/* Status pill */}
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5 text-center">
                        <span className="text-slate-500 block text-[11px] font-medium uppercase">
                          Verification Status
                        </span>
                        <span className="font-bold text-sm text-slate-900">
                          {data.blockchainProof.verified || data.status === 'VALID'
                            ? 'Verified on Blockchain'
                            : 'Blockchain verification unavailable'}
                        </span>
                      </div>

                      {/* Transaction Hash */}
                      <div>
                        <div className="flex items-center justify-between text-slate-500 font-medium">
                          <span>Transaction Hash</span>
                          {data.blockchainProof.txHash && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  data.blockchainProof.txHash!,
                                  'txHash'
                                )
                              }
                              className="text-slate-400 hover:text-slate-600"
                              title="Copy Hash"
                            >
                              {copiedKey === 'txHash' ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>
                        {data.blockchainProof.txHash ? (
                          <div className="mt-1">
                            <a
                              href={getEtherscanUrl(
                                data.blockchainProof.txHash,
                                data.blockchainProof.networkName || 'sepolia'
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-blue-600 hover:underline break-all"
                            >
                              <span>
                                {shortenHash(data.blockchainProof.txHash, 8)}
                              </span>
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          </div>
                        ) : (
                          <p className="mt-1 font-mono text-slate-400 italic">
                            Off-chain verification record
                          </p>
                        )}
                      </div>

                      <Separator />

                      {/* Block Number */}
                      <div>
                        <span className="text-slate-500 font-medium">Block Number</span>
                        <p className="mt-0.5 font-mono font-semibold text-slate-800">
                          {data.blockchainProof.blockNumber
                            ? `#${data.blockchainProof.blockNumber}`
                            : 'Pending'}
                        </p>
                      </div>

                      <Separator />

                      {/* Network */}
                      <div>
                        <span className="text-slate-500 font-medium">Network</span>
                        <p className="mt-0.5 font-mono uppercase text-slate-800">
                          {data.blockchainProof.networkName || 'Sepolia Testnet'}
                        </p>
                      </div>

                      <Separator />

                      {/* Contract Address */}
                      <div>
                        <div className="flex items-center justify-between text-slate-500 font-medium">
                          <span>Contract Address</span>
                          {data.blockchainProof.contractAddress && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  data.blockchainProof.contractAddress!,
                                  'contractAddress'
                                )
                              }
                              className="text-slate-400 hover:text-slate-600"
                              title="Copy Contract"
                            >
                              {copiedKey === 'contractAddress' ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="mt-1 font-mono text-[11px] text-slate-800 break-all">
                          {data.blockchainProof.contractAddress ||
                            'Standard Registry'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Need to verify another certificate?
                  </h3>
                  <p className="text-xs text-slate-500">
                    You can search by ID or scan another QR code.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <Link href="/verify" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto gap-2 bg-blue-600 text-white">
                      <Search className="h-4 w-4" />
                      Verify Another Certificate
                    </Button>
                  </Link>

                  <Link href="/" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} Citadel. Immutable blockchain credential verification.
        </p>
      </footer>
    </div>
  );
}
