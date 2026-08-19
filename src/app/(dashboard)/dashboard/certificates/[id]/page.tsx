'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileBadge2,
  Hash,
  Loader2,
  Mail,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
  Clock,
  Ban,
  Building2,
  FileText,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  formatDate,
  shortenHash,
  getEtherscanUrl,
  cn,
} from '@/lib/utils';
import { CitadelLogo } from '@/components/ui/citadel-logo';

interface BlockchainTransactionItem {
  id: string;
  txHash: string;
  blockNumber: string;
  networkName: string;
  contractAddress: string;
  action: 'ISSUE' | 'REVOKE';
  timestamp: string;
}

interface CertificateDetail {
  id: string;
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  courseDescription?: string | null;
  issueDate: string;
  expiryDate?: string | null;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
  certificateHash: string;
  revokeReason?: string | null;
  revokedAt?: string | null;
  emailSent?: boolean;
  qrCodeData?: string | null;
  organization: {
    id: string;
    name: string;
    email: string;
    description?: string | null;
    logoUrl?: string | null;
    website?: string | null;
  };
  transactions: BlockchainTransactionItem[];
}

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const certificateDbId = (params?.id as string) || '';

  // State
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Email resend state
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // Revoke Dialog state
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [isRevoking, setIsRevoking] = useState(false);

  // Fetch certificate details
  const fetchCertificate = useCallback(async () => {
    if (!certificateDbId) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/certificates/${certificateDbId}`);
      const data = await res.json();

      if (data.success && data.certificate) {
        setCertificate(data.certificate);
      } else {
        setErrorMessage(data.message || 'Certificate record not found.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error fetching certificate details.');
    } finally {
      setIsLoading(false);
    }
  }, [certificateDbId]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast({
      title: 'Copied to Clipboard',
      description: `${key} copied.`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleResendEmail = async () => {
    if (!certificate) return;
    setIsResendingEmail(true);

    try {
      const res = await fetch(
        `/api/certificates/${certificate.id}/resend-email`,
        { method: 'POST' }
      );
      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Email Sent Successfully',
          description: `PDF diploma dispatched to ${certificate.recipientEmail}.`,
        });
        setCertificate((prev) => (prev ? { ...prev, emailSent: true } : null));
      } else {
        toast({
          variant: 'destructive',
          title: 'Email Failed',
          description: data.message || 'Unable to send email.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err?.message || 'Error dispatching email.',
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleRevokeSubmit = async () => {
    if (!certificate) return;

    if (!revokeReason.trim() || revokeReason.trim().length < 5) {
      toast({
        variant: 'destructive',
        title: 'Reason Required',
        description: 'Please provide an official audit reason (at least 5 characters).',
      });
      return;
    }

    setIsRevoking(true);

    try {
      const res = await fetch(`/api/certificates/${certificate.id}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: revokeReason.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Certificate Revoked on Blockchain',
          description: `Status updated on Ethereum Sepolia ledger.`,
        });
        setIsRevokeDialogOpen(false);
        fetchCertificate();
      } else {
        toast({
          variant: 'destructive',
          title: 'Revocation Failed',
          description: data.message || 'Unable to revoke on-chain.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: err?.message || 'Failed to revoke certificate.',
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-[#C8102E]" />
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          Loading certificate verification data...
        </p>
      </div>
    );
  }

  if (errorMessage || !certificate) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-[900] text-red-900">Certificate Not Found</h3>
        <p className="mt-1 text-xs text-red-600">{errorMessage || 'Unable to find certificate record.'}</p>
        <Link href="/dashboard/certificates">
          <Button variant="outline" className="mt-5 rounded-full bg-white text-xs font-semibold">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registry
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/dashboard/certificates"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Registry</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-[900] tracking-tight text-slate-900 sm:text-3xl font-mono">
              {certificate.certificateId}
            </h1>
            <Badge variant={getBadgeVariant(certificate.status) as any}>
              {certificate.status}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/api/certificates/${certificate.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-md">
              <Download className="mr-1.5 h-4 w-4" />
              Download PDF Diploma
            </Button>
          </a>

          <Link
            href={`/verify/${encodeURIComponent(certificate.certificateId)}`}
            target="_blank"
          >
            <Button variant="outline" className="rounded-full border-slate-200 text-xs font-semibold">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Public Verification
            </Button>
          </Link>

          {certificate.status === 'VALID' && (
            <Button
              variant="outline"
              onClick={() => setIsRevokeDialogOpen(true)}
              className="rounded-full border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              <Ban className="mr-1.5 h-4 w-4" />
              Revoke
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          {/* Certificate Metadata Card */}
          <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-[900] text-slate-900">
                Academic Credential Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Recipient Name:</span>
                  <span className="font-bold text-sm text-slate-900">{certificate.recipientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Recipient Email:</span>
                  <span className="font-bold text-slate-800 font-mono">{certificate.recipientEmail}</span>
                </div>
              </div>

              <div className="space-y-1 pb-3 border-b border-slate-100">
                <span className="text-slate-400 block font-medium">Program / Degree Title:</span>
                <span className="font-bold text-sm text-[#C8102E]">{certificate.courseName}</span>
              </div>

              {certificate.courseDescription && (
                <div className="space-y-1 pb-3 border-b border-slate-100">
                  <span className="text-slate-400 block font-medium">Description & Honors:</span>
                  <p className="text-slate-600 italic">{certificate.courseDescription}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">Issue Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(certificate.issueDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Expiration:</span>
                  <span className="font-bold text-emerald-600">
                    {certificate.expiryDate ? formatDate(certificate.expiryDate) : 'Lifetime Validity'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Delivery & Notifications */}
          <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-[900] text-slate-900">
                Recipient Delivery & Notifications
              </CardTitle>
              <Badge variant="outline" className={certificate.emailSent ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                {certificate.emailSent ? 'Email Dispatched' : 'Email Pending'}
              </Badge>
            </CardHeader>
            <CardContent className="pt-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">Automated PDF Diploma Delivery</p>
                <p className="text-xs text-slate-500">Recipient is sent the vector PDF with verification links</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendEmail}
                disabled={isResendingEmail}
                className="rounded-xl text-xs font-semibold border-slate-200"
              >
                {isResendingEmail ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Resend Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: 5 Columns (Blockchain Proofs & QR) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Blockchain Proof Card */}
          <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-[900] text-slate-900">
                  Ethereum Ledger Proof
                </CardTitle>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Mined on EVM
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-3 font-mono text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] block uppercase">Cryptographic SHA-256 Hash</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-800 font-bold truncate text-[11px]">{certificate.certificateHash}</span>
                  <button onClick={() => handleCopy(certificate.certificateHash, 'SHA-256 Hash')} className="text-slate-400 hover:text-slate-600">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {certificate.transactions?.[0] && (
                <>
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] block uppercase">Ethereum Transaction Hash</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-800 font-bold truncate text-[11px]">{certificate.transactions[0].txHash}</span>
                      <button onClick={() => handleCopy(certificate.transactions[0].txHash, 'Tx Hash')} className="text-slate-400 hover:text-slate-600">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Block Number</span>
                      <span className="font-bold text-slate-800">{certificate.transactions[0].blockNumber}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Network</span>
                      <span className="font-bold text-emerald-600">{certificate.transactions[0].networkName}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* QR Code Verification Display */}
          {certificate.qrCodeData && (
            <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden p-6 text-center space-y-3">
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={certificate.qrCodeData}
                  alt="Certificate Verification QR Code"
                  className="h-36 w-36 rounded-2xl border border-slate-200 p-2 shadow-2xs"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Instant Camera QR Verification</p>
                <p className="text-[11px] text-slate-500">Scan with any mobile camera to verify on Ethereum</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Revocation Dialog */}
      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-[900] text-slate-900">
              Confirm Blockchain Revocation
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500">
              This will permanently invalidate Certificate <span className="font-mono font-bold text-[#C8102E]">{certificate.certificateId}</span> on the smart contract.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Label htmlFor="detailRevokeReason" className="text-xs font-bold text-slate-700">
              Official Revocation Reason <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="detailRevokeReason"
              placeholder="State the official audit reason..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              rows={3}
              className="text-xs rounded-xl border-slate-200 focus:border-rose-500"
            />
          </div>

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
                'Confirm Revocation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
