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
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || `Verification failed with status ${res.status}`);
      }

      if (json.success && json.certificate) {
        setData(json);
      } else {
        setErrorMessage(json.message || 'Certificate record not found.');
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'An error occurred while verifying the certificate with the blockchain.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [certificateId]);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-8">
          <Link
            href="/verify"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#C8102E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Verify Another</span>
          </Link>

          <Link href="/" className="flex items-center gap-3.5 transition hover:opacity-90">
            <CitadelLogo className="h-12 w-12" size={64} />
            <span className="text-2xl font-[900] tracking-tight text-slate-900">
              Citadel
            </span>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold border-slate-200 text-slate-700 hover:text-slate-900">
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
              <Loader2 className="h-12 w-12 animate-spin text-[#C8102E]" />
              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-800">
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs">
                <XCircle className="h-10 w-10" />
              </div>

              <div>
                <h1 className="text-2xl font-[900] tracking-tight text-slate-900">
                  Certificate Not Verified
                </h1>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {errorMessage ||
                    `No active record matching Certificate ID "${certificateId}" was found in our decentralized registry.`}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left text-xs text-slate-600 space-y-2 shadow-2xs">
                <p className="font-bold text-slate-800">Possible explanations:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[11px]">
                  <li>The Certificate ID was mistyped or incomplete.</li>
                  <li>The credential has not been officially registered or issued.</li>
                  <li>The smart contract transaction is still confirming on the blockchain.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/verify" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-md">
                    <Search className="h-4 w-4" />
                    Verify Another Certificate
                  </Button>
                </Link>
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto rounded-full border-slate-200 text-xs font-semibold">
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
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-7 shadow-xs text-emerald-950">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-[900] text-emerald-950 tracking-tight">
                          Certificate is Valid
                        </h1>
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 font-mono text-[10px] uppercase">
                          AUTHENTIC ON-CHAIN RECORD
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                        This credential is cryptographically anchored on the Ethereum blockchain and verified authentic.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {data.status === 'EXPIRED' && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-7 shadow-xs text-amber-950">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-sm">
                      <Clock className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-[900] text-amber-950 tracking-tight">
                          Certificate has Expired
                        </h1>
                        <Badge className="bg-amber-600 text-white hover:bg-amber-700 font-mono text-[10px] uppercase">
                          EXPIRED
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                        This credential was authentic when issued, but reached its expiration date on{' '}
                        <span className="font-bold">
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
                <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-7 shadow-xs text-rose-950">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm">
                      <XCircle className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-[900] text-rose-950 tracking-tight">
                          Certificate has been Revoked
                        </h1>
                        <Badge className="bg-rose-600 text-white hover:bg-rose-700 font-mono text-[10px] uppercase">
                          REVOKED
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-rose-800 leading-relaxed">
                        This credential has been officially invalidated by the issuing institution and is no longer active.
                      </p>
                    </div>
                  </div>

                  {/* Revocation Reason Notice */}
                  {data.certificate.revokeReason && (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-white p-4 text-xs text-rose-900">
                      <span className="font-bold">Official Audit Reason:</span>{' '}
                      <span>{data.certificate.revokeReason}</span>
                      {data.certificate.revokedAt && (
                        <p className="mt-1 text-[11px] text-rose-600 font-mono">
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
                  <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/70">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base font-[900] text-slate-900">
                            Academic Credential Details
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500">
                            Verified recipient and institution records
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#C8102E] bg-[#C8102E]/10 px-3 py-1 rounded-full border border-[#C8102E]/20">
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

                    <CardContent className="space-y-4 pt-5 text-xs">
                      {/* Recipient */}
                      <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <User className="h-5 w-5 text-[#C8102E] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Recipient Name
                          </span>
                          <p className="text-sm font-[900] text-slate-900 mt-0.5">
                            {data.certificate.recipientName}
                          </p>
                        </div>
                      </div>

                      {/* Course */}
                      <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <BookOpen className="h-5 w-5 text-[#C8102E] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Program / Credential Title
                          </span>
                          <p className="text-sm font-[900] text-[#C8102E]">
                            {data.certificate.courseName}
                          </p>
                          {data.certificate.courseDescription && (
                            <p className="text-xs text-slate-600 pt-1 leading-relaxed italic">
                              &ldquo;{data.certificate.courseDescription}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Issuing Organization */}
                      <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <Building2 className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Issuing Institution
                          </span>
                          <p className="text-sm font-[900] text-slate-900">
                            {data.organization.name}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                            {data.organization.email && (
                              <span className="flex items-center gap-1 font-mono">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
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
                                className="flex items-center gap-1 text-[#C8102E] hover:underline font-semibold"
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
                      <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-xs">
                        <div className="flex items-start gap-2.5">
                          <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <span className="text-slate-400 block font-medium">Issue Date</span>
                            <p className="text-xs font-bold text-slate-900 mt-0.5">
                              {formatDate(data.certificate.issueDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
                          <div>
                            <span className="text-slate-400 block font-medium">Expiration Status</span>
                            <p className="text-xs font-bold text-emerald-600 mt-0.5">
                              {data.certificate.expiryDate
                                ? formatDate(data.certificate.expiryDate)
                                : 'Lifetime Validity'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Blockchain Proof (1 col) */}
                <div className="space-y-6">
                  <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/70">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#C8102E]">
                          <ShieldCheck className="h-5 w-5" />
                          <CardTitle className="text-sm font-[900]">
                            Blockchain Proof
                          </CardTitle>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3.5 pt-5 text-xs font-mono">
                      {/* Status pill */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider font-sans">
                          Verification Status
                        </span>
                        <span className="font-[900] text-xs text-slate-900 mt-0.5 block">
                          {data.blockchainProof.verified || data.status === 'VALID'
                            ? 'Anchored to Ethereum'
                            : 'Off-chain record verified'}
                        </span>
                      </div>

                      {/* Transaction Hash */}
                      <div>
                        <div className="flex items-center justify-between text-slate-400 font-sans text-[11px]">
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
                              className="inline-flex items-center gap-1 font-mono text-[#C8102E] hover:underline break-all text-xs font-bold"
                            >
                              <span>
                                {shortenHash(data.blockchainProof.txHash, 8)}
                              </span>
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          </div>
                        ) : (
                          <p className="mt-1 font-mono text-slate-400 italic text-[11px]">
                            Off-chain verification record
                          </p>
                        )}
                      </div>

                      <Separator className="bg-slate-100" />

                      {/* Block Number */}
                      <div>
                        <span className="text-slate-400 font-sans text-[11px] block">Block Number</span>
                        <p className="mt-0.5 font-bold text-slate-800 text-xs">
                          {data.blockchainProof.blockNumber
                            ? `#${data.blockchainProof.blockNumber}`
                            : 'Pending'}
                        </p>
                      </div>

                      <Separator className="bg-slate-100" />

                      {/* Network */}
                      <div>
                        <span className="text-slate-400 font-sans text-[11px] block">Network</span>
                        <p className="mt-0.5 font-bold uppercase text-emerald-600 text-xs">
                          {data.blockchainProof.networkName || 'Ethereum Sepolia EVM'}
                        </p>
                      </div>

                      <Separator className="bg-slate-100" />

                      {/* Contract Address */}
                      <div>
                        <div className="flex items-center justify-between text-slate-400 font-sans text-[11px]">
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
                        <p className="mt-1 font-mono text-[11px] text-slate-700 break-all">
                          {data.blockchainProof.contractAddress ||
                            'Standard Registry'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div>
                  <h3 className="font-[900] text-slate-900 text-sm">
                    Need to verify another certificate?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Search by Certificate ID or scan another QR code.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <Link href="/verify" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto gap-2 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-md">
                      <Search className="h-4 w-4" />
                      Verify Another Certificate
                    </Button>
                  </Link>

                  <Link href="/" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto rounded-full border-slate-200 text-xs font-semibold">
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
        &copy; {new Date().getFullYear()} Citadel. Immutable blockchain credential verification.
      </footer>
    </div>
  );
}
