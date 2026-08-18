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

  // Data & State
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Revoke Dialog State
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [isRevoking, setIsRevoking] = useState(false);

  // Fetch certificate details
  const fetchCertificate = useCallback(async () => {
    if (!certificateDbId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/certificates/${certificateDbId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to retrieve certificate');
      }

      setCertificate(data.certificate);
    } catch (error: any) {
      console.error('Error fetching certificate details:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error?.message || 'Unable to load certificate information.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [certificateDbId, toast]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Resend email
  const handleResendEmail = async () => {
    if (!certificate) return;
    setIsSendingEmail(true);
    try {
      const res = await fetch(
        `/api/certificates/${certificate.id}/resend-email`,
        {
          method: 'POST',
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to resend email');
      }

      toast({
        title: 'Email Sent Successfully',
        description: `Notification email dispatched to ${certificate.recipientEmail}.`,
      });
    } catch (error: any) {
      console.error('Resend email error:', error);
      toast({
        variant: 'destructive',
        title: 'Email Delivery Failed',
        description: error?.message || 'Could not deliver the certificate email.',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Confirm Revocation
  const handleConfirmRevoke = async () => {
    if (!certificate) return;

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
      const res = await fetch(`/api/certificates/${certificate.id}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: revokeReason.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to revoke certificate');
      }

      toast({
        title: 'Certificate Revoked',
        description: 'The certificate has been permanently revoked.',
      });

      setIsRevokeDialogOpen(false);
      setRevokeReason('');
      fetchCertificate();
    } catch (error: any) {
      console.error('Revoke error:', error);
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

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading certificate details...
        </p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="mx-auto max-w-lg text-center py-16 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <XCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Certificate Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The requested certificate does not exist or you do not have permission to view it.
        </p>
        <Link href="/dashboard/certificates">
          <Button variant="outline" className="mt-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Certificates List
          </Button>
        </Link>
      </div>
    );
  }

  const issueTx =
    certificate.transactions.find((t) => t.action === 'ISSUE') ||
    certificate.transactions[0];
  const revokeTx = certificate.transactions.find((t) => t.action === 'REVOKE');

  const statusVariant =
    certificate.status === 'VALID'
      ? 'valid'
      : certificate.status === 'EXPIRED'
      ? 'expired'
      : 'revoked';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/certificates">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Certificates</span>
            </Button>
          </Link>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Public Verification Link */}
          <Link
            href={`/verify/${certificate.certificateId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
            >
              <span>Public Verification Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>

          {/* Download PDF */}
          <a
            href={`/api/certificates/${certificate.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700">
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </Button>
          </a>

          {/* Resend Email */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendEmail}
            disabled={isSendingEmail}
            className="gap-1.5 text-xs"
          >
            {isSendingEmail ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Resend Email</span>
          </Button>

          {/* Revoke Button if Valid */}
          {certificate.status === 'VALID' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsRevokeDialogOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Revoke</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Certificate Info + Blockchain Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Certificate Info Card (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileBadge2 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl">Certificate Details</CardTitle>
                </div>
                <CardDescription>
                  Credential record and recipient metadata
                </CardDescription>
              </div>

              <Badge variant={statusVariant} className="px-3 py-1 text-xs uppercase font-bold tracking-wider">
                {certificate.status}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Certificate ID Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-800">
                    Unique Certificate ID
                  </span>
                  <p className="mt-0.5 font-mono text-base font-bold text-blue-900">
                    {certificate.certificateId}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopy(certificate.certificateId, 'certId')
                  }
                  className="gap-1.5 text-xs bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  {copiedKey === 'certId' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Recipient Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recipient Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Recipient Name</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {certificate.recipientName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Recipient Email</p>
                      <p className="text-sm font-medium text-slate-800">
                        {certificate.recipientEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Course & Credential Details
                </h3>
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">Course / Program</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {certificate.courseName}
                    </p>
                  </div>
                  {certificate.courseDescription && (
                    <div>
                      <p className="text-xs text-slate-500">Description / Achievements</p>
                      <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                        {certificate.courseDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Validity Dates
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Issue Date</p>
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(certificate.issueDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Expiration Date</p>
                      <p className="text-sm font-medium text-slate-900">
                        {certificate.expiryDate
                          ? formatDate(certificate.expiryDate)
                          : 'Does not expire'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revocation Section (if revoked) */}
              {certificate.status === 'REVOKED' && (
                <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Revocation Audit Trail</span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p>
                      <span className="font-medium text-slate-800">Reason:</span>{' '}
                      {certificate.revokeReason || 'No reason provided'}
                    </p>
                    {certificate.revokedAt && (
                      <p>
                        <span className="font-medium text-slate-800">Date Revoked:</span>{' '}
                        {formatDate(certificate.revokedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Proof Card (1 col) */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Shield className="h-5 w-5" />
                <CardTitle className="text-lg">Blockchain Proof</CardTitle>
              </div>
              <CardDescription>
                On-chain cryptographic verification
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              {/* Network */}
              <div>
                <span className="text-slate-500 font-medium">Network</span>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="secondary" className="font-mono text-[11px] uppercase">
                    {issueTx?.networkName || 'Sepolia Testnet'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Block Number */}
              <div>
                <span className="text-slate-500 font-medium">Block Number</span>
                <p className="mt-1 font-mono font-semibold text-slate-800">
                  {issueTx?.blockNumber ? `#${issueTx.blockNumber}` : 'Pending / Off-Chain'}
                </p>
              </div>

              <Separator />

              {/* Transaction Hash */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Transaction Hash</span>
                  {issueTx?.txHash && (
                    <button
                      type="button"
                      onClick={() => handleCopy(issueTx.txHash, 'txHash')}
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
                {issueTx?.txHash ? (
                  <div className="mt-1">
                    <a
                      href={getEtherscanUrl(
                        issueTx.txHash,
                        issueTx.networkName
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-blue-600 hover:underline break-all"
                    >
                      <span>{shortenHash(issueTx.txHash, 10)}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                ) : (
                  <p className="mt-1 text-slate-400 italic">Off-chain record</p>
                )}
              </div>

              <Separator />

              {/* Contract Address */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Contract Address</span>
                  {issueTx?.contractAddress && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(issueTx.contractAddress, 'contractAddress')
                      }
                      className="text-slate-400 hover:text-slate-600"
                      title="Copy Address"
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
                  {issueTx?.contractAddress || 'Not configured'}
                </p>
              </div>

              <Separator />

              {/* Certificate Hash */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Certificate SHA-256 Hash</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(certificate.certificateHash, 'certHash')
                    }
                    className="text-slate-400 hover:text-slate-600"
                    title="Copy SHA-256 Hash"
                  >
                    {copiedKey === 'certHash' ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <p className="mt-1 font-mono text-[11px] text-slate-800 break-all">
                  {certificate.certificateHash}
                </p>
              </div>

              {/* Revoke Tx if exists */}
              {revokeTx && (
                <>
                  <Separator />
                  <div className="rounded border border-rose-100 bg-rose-50 p-2 text-rose-800">
                    <span className="font-semibold">Revocation Transaction:</span>
                    <a
                      href={getEtherscanUrl(
                        revokeTx.txHash,
                        revokeTx.networkName
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 flex items-center gap-1 font-mono text-[11px] underline break-all"
                    >
                      <span>{shortenHash(revokeTx.txHash, 8)}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* QR Code Card if available */}
          {certificate.qrCodeData && (
            <Card className="border-slate-200 bg-white shadow-sm text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Verification QR Code
                </CardTitle>
                <CardDescription className="text-xs">
                  Scan to verify authentic on-chain credential
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={certificate.qrCodeData}
                  alt={`QR Code for ${certificate.certificateId}`}
                  className="h-36 w-36 rounded-md border border-slate-200 p-1 shadow-xs"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Revocation Confirmation Dialog */}
      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
              <DialogTitle className="text-lg">Revoke Certificate</DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 pt-1">
              Revoking will permanently change this certificate&apos;s status on the Ethereum blockchain.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-md border border-rose-100 bg-rose-50/50 p-3 text-xs">
              <p>
                <span className="font-medium text-slate-700">Certificate ID:</span>{' '}
                <span className="font-mono font-semibold text-rose-700">
                  {certificate.certificateId}
                </span>
              </p>
              <p className="mt-1">
                <span className="font-medium text-slate-700">Recipient:</span>{' '}
                <span className="text-slate-900 font-medium">
                  {certificate.recipientName}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revokeReason" className="text-xs font-semibold">
                Reason for Revocation *
              </Label>
              <Textarea
                id="revokeReason"
                placeholder="State the reason for certificate revocation..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                disabled={isRevoking}
                rows={3}
                className="text-xs"
              />
              <p className="text-[11px] text-slate-500">
                Minimum 5 characters. This explanation will be displayed publicly.
              </p>
            </div>
          </div>

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
