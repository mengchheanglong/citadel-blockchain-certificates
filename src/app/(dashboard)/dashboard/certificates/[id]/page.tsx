'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Ban,
  Download,
  ExternalLink,
  Mail,
  Send,
  User,
  BookOpen,
  Calendar,
  Clock,
  Hash,
  Blocks,
  Network,
  FileWarning,
  ShieldCheck,
  QrCode,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';
import { DataList, DataRow } from '@/components/ui/data-list';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CertificateDocument } from '@/components/certificates/certificate-document';
import { useToast } from '@/components/ui/use-toast';
import {
  formatDate,
  formatDateTime,
  shortenHash,
  getEtherscanUrl,
  getEtherscanAddressUrl,
  formatNetworkName,
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

const MIN_REASON_LENGTH = 5;

export default function CertificateDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const certificateDbId = (params?.id as string) || '';

  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isResending, setIsResending] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

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
        setErrorMessage(data.message || 'This certificate record could not be found.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'The record could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, [certificateDbId]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  const handleResendEmail = async () => {
    if (!certificate) return;
    setIsResending(true);

    try {
      const res = await fetch(
        `/api/certificates/${certificate.id}/resend-email`,
        { method: 'POST' }
      );
      const data = await res.json();

      if (data.success) {
        toast({
          variant: 'success',
          title: 'Certificate sent',
          description: `Delivered to ${certificate.recipientEmail}.`,
        });
        setCertificate((prev) => (prev ? { ...prev, emailSent: true } : prev));
      } else {
        toast({
          variant: 'destructive',
          title: 'Delivery failed',
          description: data.message || 'The email could not be sent.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Delivery failed',
        description: err?.message || 'The mail server could not be reached.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleRevoke = async () => {
    if (!certificate) return;

    if (revokeReason.trim().length < MIN_REASON_LENGTH) {
      setRevokeError(
        `Give an auditable reason of at least ${MIN_REASON_LENGTH} characters. It is stored permanently with the record.`
      );
      return;
    }

    setIsRevoking(true);
    setRevokeError(null);

    try {
      const res = await fetch(`/api/certificates/${certificate.id}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: revokeReason.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          variant: 'success',
          title: 'Certificate revoked',
          description: 'The revocation is recorded on-chain.',
        });
        setIsRevokeOpen(false);
        setRevokeReason('');
        fetchCertificate();
      } else {
        setRevokeError(data.message || 'The registry contract rejected the revocation.');
      }
    } catch (err: any) {
      setRevokeError(err?.message || 'The network request failed. Try again.');
    } finally {
      setIsRevoking(false);
    }
  };

  /* ------------------------------------------------------------------ */
  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (errorMessage || !certificate) {
    return (
      <div className="rounded-xl border border-line bg-surface shadow-xs">
        <EmptyState
          icon={FileWarning}
          tone="danger"
          title="Record not found"
          description={
            errorMessage || 'No certificate matches this reference in your registry.'
          }
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/certificates">
                <ArrowLeft aria-hidden />
                Back to registry
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const issueTx = certificate.transactions?.find((t) => t.action === 'ISSUE')
    ?? certificate.transactions?.[0];
  const revokeTx = certificate.transactions?.find((t) => t.action === 'REVOKE');

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Registry', href: '/dashboard/certificates' }]}
        title={<span className="metadata text-xl">{certificate.certificateId}</span>}
        badge={<StatusBadge status={certificate.status} size="md" withIcon />}
        description={`${certificate.courseName} — awarded to ${certificate.recipientName}`}
        actions={
          <>
            <Button asChild size="sm">
              <a
                href={`/api/certificates/${certificate.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download aria-hidden />
                Download PDF
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/verify/${encodeURIComponent(certificate.certificateId)}`}
                target="_blank"
              >
                <ExternalLink aria-hidden />
                Public page
              </Link>
            </Button>
            {certificate.status === 'VALID' ? (
              <Button variant="danger" size="sm" onClick={() => setIsRevokeOpen(true)}>
                <Ban aria-hidden />
                Revoke
              </Button>
            ) : null}
          </>
        }
      />

      {/* Revocation notice takes precedence over everything else on the page. */}
      {certificate.status === 'REVOKED' ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-danger-line bg-danger-soft p-4"
        >
          <Ban className="mt-0.5 h-5 w-5 shrink-0 text-danger-fg" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-danger-fg">
              This certificate was revoked
              {certificate.revokedAt
                ? ` on ${formatDate(certificate.revokedAt)}`
                : ''}
            </p>
            {certificate.revokeReason ? (
              <p className="text-xs leading-relaxed text-danger-fg/85">
                Recorded reason: “{certificate.revokeReason}”
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {certificate.status === 'EXPIRED' ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-warning-line bg-warning-soft p-4"
        >
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warning-fg" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-warning-fg">
              This certificate expired
              {certificate.expiryDate
                ? ` on ${formatDate(certificate.expiryDate)}`
                : ''}
            </p>
            <p className="text-xs leading-relaxed text-warning-fg/85">
              It remains authentic and on the ledger, but is no longer current.
              Issue a replacement if the holder needs an active credential.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* -------------------------------------------------------------- */}
        {/* Record                                                          */}
        {/* -------------------------------------------------------------- */}
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Credential details</CardTitle>
              <CardDescription>
                The exact values hashed into the on-chain record
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataList className="rounded-none border-0">
                <DataRow
                  icon={<User />}
                  label="Recipient"
                  value={
                    <>
                      {certificate.recipientName}
                      <span className="block text-xs text-ink-muted">
                        {certificate.recipientEmail}
                      </span>
                    </>
                  }
                />
                <DataRow
                  icon={<BookOpen />}
                  label="Programme"
                  value={
                    <>
                      {certificate.courseName}
                      {certificate.courseDescription ? (
                        <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                          {certificate.courseDescription}
                        </span>
                      ) : null}
                    </>
                  }
                />
                <DataRow
                  icon={<Calendar />}
                  label="Issued"
                  value={formatDate(certificate.issueDate)}
                />
                <DataRow
                  icon={<Clock />}
                  label="Valid until"
                  value={
                    certificate.expiryDate
                      ? formatDate(certificate.expiryDate)
                      : 'No expiry'
                  }
                />
              </DataList>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Delivery</CardTitle>
                <CardDescription>
                  The recipient receives a PDF and a verification link
                </CardDescription>
              </div>
              <Badge variant={certificate.emailSent ? 'valid' : 'expired'}>
                {certificate.emailSent ? 'Sent' : 'Not sent'}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink-muted"
                  aria-hidden
                >
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">
                    {certificate.recipientEmail}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {certificate.emailSent
                      ? 'The certificate has been emailed to this address.'
                      : 'Delivery has not been confirmed for this address.'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResendEmail}
                loading={isResending}
              >
                {isResending ? (
                  'Sending…'
                ) : (
                  <>
                    <Send aria-hidden />
                    {certificate.emailSent ? 'Resend' : 'Send now'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ledger proof</CardTitle>
              <CardDescription>
                Independently checkable on a public block explorer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataList className="rounded-none border-0">
                <DataRow
                  icon={<Hash />}
                  label="Certificate hash (SHA-256)"
                  value={certificate.certificateHash}
                  mono
                  copyValue={certificate.certificateHash}
                  fallback="Not recorded"
                />
                <DataRow
                  icon={<ExternalLink />}
                  label="Issuance transaction"
                  mono
                  copyValue={issueTx?.txHash}
                  fallback="Awaiting confirmation"
                  value={
                    issueTx?.txHash ? (
                      <a
                        href={getEtherscanUrl(
                          issueTx.txHash,
                          issueTx.networkName || 'sepolia'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-sm text-brand hover:underline"
                      >
                        {shortenHash(issueTx.txHash, 10)}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ) : null
                  }
                />
                {revokeTx ? (
                  <DataRow
                    icon={<Ban />}
                    label="Revocation transaction"
                    mono
                    copyValue={revokeTx.txHash}
                    value={
                      <a
                        href={getEtherscanUrl(
                          revokeTx.txHash,
                          revokeTx.networkName || 'sepolia'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-sm text-brand hover:underline"
                      >
                        {shortenHash(revokeTx.txHash, 10)}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    }
                  />
                ) : null}
                <DataRow
                  icon={<Blocks />}
                  label="Block"
                  value={issueTx?.blockNumber ? `#${issueTx.blockNumber}` : null}
                  fallback="Pending"
                  mono
                />
                <DataRow
                  icon={<Network />}
                  label="Network"
                  value={formatNetworkName(issueTx?.networkName)}
                />
                <DataRow
                  icon={<ShieldCheck />}
                  label="Registry contract"
                  mono
                  copyValue={issueTx?.contractAddress}
                  fallback="Not recorded"
                  value={
                    issueTx?.contractAddress ? (
                      <a
                        href={getEtherscanAddressUrl(
                          issueTx.contractAddress,
                          issueTx.networkName || 'sepolia'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-sm text-brand hover:underline"
                      >
                        {shortenHash(issueTx.contractAddress, 8)}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ) : null
                  }
                />
                {issueTx?.timestamp ? (
                  <DataRow
                    icon={<Clock />}
                    label="Recorded at"
                    value={formatDateTime(issueTx.timestamp)}
                  />
                ) : null}
              </DataList>
            </CardContent>
          </Card>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Document & QR                                                   */}
        {/* -------------------------------------------------------------- */}
        <div className="space-y-6 lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-6">
            <CertificateDocument
              organizationName={certificate.organization?.name || 'Issuing organisation'}
              recipientName={certificate.recipientName}
              courseName={certificate.courseName}
              courseDescription={certificate.courseDescription}
              certificateId={certificate.certificateId}
              issueDate={certificate.issueDate}
              expiryDate={certificate.expiryDate}
              qrCodeData={certificate.qrCodeData}
              status={certificate.status}
            />

            {certificate.qrCodeData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-brand" aria-hidden />
                    Verification code
                  </CardTitle>
                  <CardDescription>
                    Anyone can scan this to confirm the credential
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={certificate.qrCodeData}
                    alt={`QR code linking to the verification page for ${certificate.certificateId}`}
                    className="h-24 w-24 rounded-md border border-line bg-white p-1.5"
                  />
                  <div className="min-w-0 space-y-2">
                    <p className="text-xs leading-relaxed text-ink-muted">
                      Printed on the PDF certificate. It resolves to the public
                      verification page for this record.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/verify/${encodeURIComponent(certificate.certificateId)}`}
                        target="_blank"
                      >
                        Open verification page
                        <ExternalLink aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Revocation                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Dialog
        open={isRevokeOpen}
        onOpenChange={(open) => {
          if (!isRevoking) setIsRevokeOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this certificate?</DialogTitle>
            <DialogDescription>
              Revocation is written to the blockchain and cannot be undone. Anyone
              verifying {certificate.certificateId} from now on will see it as
              revoked, together with the reason you record below.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <Field
              htmlFor="detail-revoke-reason"
              label="Reason for revocation"
              required
              error={revokeError}
              hint="Recorded permanently and shown on the public verification page."
            >
              <Textarea
                id="detail-revoke-reason"
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRevokeOpen(false)}
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

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="space-y-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-[420px] w-full rounded-xl" />
        </div>
      </div>
      <span className="sr-only">Loading certificate record</span>
    </div>
  );
}
