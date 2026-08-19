'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Search,
  ExternalLink,
  User,
  BookOpen,
  Calendar,
  Clock,
  Building2,
  Globe,
  Mail,
  Hash,
  Blocks,
  Network,
  Printer,
  FileQuestion,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { DataList, DataRow } from '@/components/ui/data-list';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatusSpec } from '@/components/ui/status-badge';
import { CertificateDocument } from '@/components/certificates/certificate-document';
import { PublicHeader, PublicFooter } from '@/components/layout/public-chrome';
import {
  formatDate,
  formatDateTime,
  shortenHash,
  getEtherscanUrl,
  getEtherscanAddressUrl,
  formatNetworkName,
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

/** The headline a non-technical reader needs, per lifecycle state. */
const VERDICT = {
  VALID: {
    heading: 'This certificate is genuine',
    body: 'The document matches the record written to the blockchain when it was issued, and it has not been revoked or expired.',
    banner: 'border-success-line bg-success-soft',
    text: 'text-success-fg',
    iconWrap: 'bg-success text-white',
  },
  EXPIRED: {
    heading: 'Genuine, but no longer current',
    body: 'This certificate was authentically issued and has not been revoked, but it has passed the expiry date its issuer set.',
    banner: 'border-warning-line bg-warning-soft',
    text: 'text-warning-fg',
    iconWrap: 'bg-warning text-white',
  },
  REVOKED: {
    heading: 'This certificate has been revoked',
    body: 'It was genuinely issued, but the institution has since withdrawn it. It should not be accepted as a valid credential.',
    banner: 'border-danger-line bg-danger-soft',
    text: 'text-danger-fg',
    iconWrap: 'bg-danger text-white',
  },
} as const;

export default function VerificationResultPage() {
  const params = useParams();
  const certificateId = decodeURIComponent((params?.certificateId as string) || '');

  const [data, setData] = useState<VerificationResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchVerification = useCallback(async () => {
    if (!certificateId) {
      setIsLoading(false);
      setErrorMessage('No certificate ID was supplied.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(certificateId)}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'No record was found for this certificate ID.');
      }

      if (json.success && json.certificate) {
        setData(json);
      } else {
        setErrorMessage(json.message || 'No record was found for this certificate ID.');
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'The certificate could not be checked against the ledger.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [certificateId]);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <PublicHeader
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/verify">
              <Search aria-hidden />
              Verify another
            </Link>
          </Button>
        }
      />

      <main id="main" className="flex-1 px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          {isLoading ? <VerificationSkeleton certificateId={certificateId} /> : null}

          {!isLoading && (errorMessage || !data) ? (
            <div className="mx-auto max-w-xl rounded-xl border border-line bg-surface shadow-sm">
              <EmptyState
                icon={FileQuestion}
                tone="danger"
                title="No matching certificate"
                description={
                  errorMessage ||
                  `Nothing in the registry matches “${certificateId}”.`
                }
                action={
                  <>
                    <Button asChild size="sm">
                      <Link href="/verify">
                        <Search aria-hidden />
                        Try another ID
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/">
                        <ArrowLeft aria-hidden />
                        Back to home
                      </Link>
                    </Button>
                  </>
                }
              />
              <div className="border-t border-line px-6 py-5">
                <p className="text-sm font-medium text-ink">
                  Common reasons for this
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
                  <li>• The ID was mistyped — they are case-sensitive.</li>
                  <li>• The certificate has not been issued yet.</li>
                  <li>• The issuing transaction is still confirming on-chain.</li>
                </ul>
              </div>
            </div>
          ) : null}

          {!isLoading && data?.certificate ? (
            <VerificationResult data={data} />
          ) : null}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

/* ---------------------------------------------------------------------- */

function VerificationResult({ data }: { data: VerificationResultData }) {
  const verdict = VERDICT[data.status] ?? VERDICT.VALID;
  const spec = getStatusSpec(data.status);
  const Icon = spec.icon;
  const proof = data.blockchainProof;

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------------- */}
      {/* Verdict — the answer, before any detail                          */}
      {/* ---------------------------------------------------------------- */}
      <section
        data-print-block=""
        className={cn('rounded-xl border p-6 sm:p-7', verdict.banner)}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                verdict.iconWrap
              )}
              aria-hidden
            >
              <Icon className="h-6 w-6" />
            </span>

            <div className="space-y-1.5">
              <h1
                className={cn(
                  'font-serif text-2xl font-semibold tracking-tight',
                  verdict.text
                )}
              >
                {verdict.heading}
              </h1>
              <p className={cn('max-w-xl text-sm leading-relaxed', verdict.text, 'opacity-85')}>
                {verdict.body}
              </p>
              <p className="metadata pt-1 text-ink-secondary">
                {data.certificate.certificateId}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            data-print-hide=""
            className="shrink-0 bg-surface"
          >
            <Printer aria-hidden />
            Print result
          </Button>
        </div>

        {data.status === 'REVOKED' && data.certificate.revokeReason ? (
          <div className="mt-5 rounded-lg border border-danger-line bg-surface p-4">
            <p className="text-2xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Reason recorded by the issuer
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              “{data.certificate.revokeReason}”
            </p>
            {data.certificate.revokedAt ? (
              <p className="mt-2 text-xs text-ink-muted">
                Revoked on {formatDate(data.certificate.revokedAt)}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* -------------------------------------------------------------- */}
        {/* What was verified                                              */}
        {/* -------------------------------------------------------------- */}
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Credential</CardTitle>
              <CardDescription>
                The details recorded when this certificate was issued
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataList className="rounded-none border-0">
                <DataRow
                  icon={<User />}
                  label="Awarded to"
                  value={
                    <span className="font-serif text-md font-semibold text-ink">
                      {data.certificate.recipientName}
                    </span>
                  }
                />
                <DataRow
                  icon={<BookOpen />}
                  label="Programme"
                  value={
                    <>
                      {data.certificate.courseName}
                      {data.certificate.courseDescription ? (
                        <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                          {data.certificate.courseDescription}
                        </span>
                      ) : null}
                    </>
                  }
                />
                <DataRow
                  icon={<Calendar />}
                  label="Issued on"
                  value={formatDate(data.certificate.issueDate)}
                />
                <DataRow
                  icon={<Clock />}
                  label="Valid until"
                  value={
                    data.certificate.expiryDate
                      ? formatDate(data.certificate.expiryDate)
                      : 'No expiry'
                  }
                />
              </DataList>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issuing institution</CardTitle>
              <CardDescription>
                The organisation accountable for this credential
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataList className="rounded-none border-0">
                <DataRow
                  icon={<Building2 />}
                  label="Name"
                  value={
                    <>
                      <span className="font-medium">{data.organization.name}</span>
                      {data.organization.description ? (
                        <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                          {data.organization.description}
                        </span>
                      ) : null}
                    </>
                  }
                />
                {data.organization.email ? (
                  <DataRow
                    icon={<Mail />}
                    label="Contact"
                    value={
                      <a
                        href={`mailto:${data.organization.email}`}
                        className="rounded-sm text-brand hover:underline"
                      >
                        {data.organization.email}
                      </a>
                    }
                  />
                ) : null}
                {data.organization.website ? (
                  <DataRow
                    icon={<Globe />}
                    label="Website"
                    value={
                      <a
                        href={
                          data.organization.website.startsWith('http')
                            ? data.organization.website
                            : `https://${data.organization.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-sm text-brand hover:underline"
                      >
                        {data.organization.website}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    }
                  />
                ) : null}
              </DataList>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain record</CardTitle>
              <CardDescription>
                Check these references yourself on a public block explorer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataList className="rounded-none border-0">
                <DataRow
                  icon={<Hash />}
                  label="Verification"
                  value={
                    proof.verified || data.status === 'VALID'
                      ? 'Matched against the on-chain record'
                      : 'Verified against the issuer’s registry'
                  }
                />
                <DataRow
                  icon={<ExternalLink />}
                  label="Transaction"
                  mono
                  copyValue={proof.txHash ?? undefined}
                  fallback="Not yet confirmed"
                  value={
                    proof.txHash ? (
                      <a
                        href={getEtherscanUrl(
                          proof.txHash,
                          proof.networkName || 'sepolia'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-sm text-brand hover:underline"
                      >
                        {shortenHash(proof.txHash, 10)}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ) : null
                  }
                />
                <DataRow
                  icon={<Blocks />}
                  label="Block"
                  value={proof.blockNumber ? `#${proof.blockNumber}` : null}
                  fallback="Pending"
                  mono
                />
                <DataRow
                  icon={<Network />}
                  label="Network"
                  value={formatNetworkName(proof.networkName)}
                />
                <DataRow
                  icon={<Hash />}
                  label="Registry contract"
                  mono
                  copyValue={proof.contractAddress ?? undefined}
                  fallback="Not recorded"
                  value={
                    proof.contractAddress ? (
                      <a
                        href={getEtherscanAddressUrl(
                          proof.contractAddress,
                          proof.networkName || 'sepolia'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-sm text-brand hover:underline"
                      >
                        {shortenHash(proof.contractAddress, 8)}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ) : null
                  }
                />
              </DataList>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 rounded-lg border border-line bg-surface-muted/60 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
            <p className="text-xs leading-relaxed text-ink-muted">
              Citadel confirms that this credential&apos;s fingerprint matches the
              one recorded on-chain by the named institution. It does not
              certify the academic content of the award, which remains the
              responsibility of the issuer.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* The document                                                    */}
        {/* -------------------------------------------------------------- */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-4">
            <CertificateDocument
              organizationName={data.organization.name}
              recipientName={data.certificate.recipientName}
              courseName={data.certificate.courseName}
              courseDescription={data.certificate.courseDescription}
              certificateId={data.certificate.certificateId}
              issueDate={data.certificate.issueDate}
              expiryDate={data.certificate.expiryDate}
              qrCodeData={data.certificate.qrCodeData}
              status={data.status}
            />

            <p className="text-xs leading-relaxed text-ink-muted" data-print-hide="">
              Verified {formatDateTime(new Date())} against the Citadel registry.
            </p>

            <Button asChild variant="outline" className="w-full" data-print-hide="">
              <Link href="/verify">
                <Search aria-hidden />
                Verify another certificate
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationSkeleton({ certificateId }: { certificateId: string }) {
  return (
    <div className="space-y-6" aria-busy>
      <div className="rounded-xl border border-line bg-surface p-7">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        </div>
        <p className="mt-5 text-xs text-ink-muted">
          Checking{' '}
          <span className="metadata text-ink-secondary">{certificateId}</span>{' '}
          against the ledger…
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-[420px] w-full rounded-xl" />
        </div>
      </div>
      <span className="sr-only">Verifying certificate</span>
    </div>
  );
}
