'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Download,
  Mail,
  RotateCcw,
  User,
  BookOpen,
  ShieldCheck,
  ExternalLink,
  Send,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { DataList, DataRow } from '@/components/ui/data-list';
import { PageHeader } from '@/components/ui/page-header';
import { CertificateDocument } from '@/components/certificates/certificate-document';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';
import { cn, formatDate, shortenHash, getEtherscanUrl } from '@/lib/utils';

interface IssuedCertificate {
  id: string;
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  courseDescription?: string | null;
  issueDate: string;
  expiryDate?: string | null;
  certificateHash?: string;
  emailSent?: boolean;
  qrCodeData?: string | null;
  transactions?: Array<{
    txHash: string;
    blockNumber: string;
    networkName: string;
    contractAddress: string;
  }>;
}

type FormState = {
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  courseDescription: string;
  expiryDate: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  recipientName: '',
  recipientEmail: '',
  courseName: '',
  courseDescription: '',
  expiryDate: '',
};

const EXPIRY_PRESETS = [
  { label: 'No expiry', months: null },
  { label: '1 year', months: 12 },
  { label: '2 years', months: 24 },
  { label: '5 years', months: 60 },
] as const;

export default function IssueCertificatePage() {
  const { toast } = useToast();
  const { organization } = useSupabaseAuth();
  const orgName = organization?.name || 'Your organisation';

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issued, setIssued] = useState<IssuedCertificate | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const setValue = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const applyExpiryPreset = (months: number | null) => {
    if (months === null) {
      setValue('expiryDate', '');
      return;
    }
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    setValue('expiryDate', date.toISOString().slice(0, 10));
  };

  /** Validation lives next to the field that failed, never in a toast. */
  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.recipientName.trim()) {
      next.recipientName = 'Enter the recipient’s full name as it should appear on the certificate.';
    }
    if (!form.recipientEmail.trim()) {
      next.recipientEmail = 'An email address is required — the certificate is delivered to it.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recipientEmail.trim())) {
      next.recipientEmail = 'That does not look like a valid email address.';
    }
    if (!form.courseName.trim()) {
      next.courseName = 'Name the programme, degree or qualification being awarded.';
    }
    if (form.expiryDate && form.expiryDate <= today) {
      next.expiryDate = 'The expiry date must be in the future.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: form.recipientName.trim(),
          recipientEmail: form.recipientEmail.trim().toLowerCase(),
          courseName: form.courseName.trim(),
          courseDescription: form.courseDescription.trim() || null,
          expiryDate: form.expiryDate
            ? new Date(form.expiryDate).toISOString()
            : null,
        }),
      });

      const data = await res.json();

      if (data.success && data.certificate) {
        setIssued(data.certificate);
        toast({
          variant: 'success',
          title: 'Certificate issued',
          description: `${data.certificate.certificateId} has been anchored on-chain.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Issuance failed',
          description:
            data.message || 'The certificate could not be recorded on the ledger.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Network error',
        description: err?.message || 'The request did not reach the server.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIssueAnother = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setIssued(null);
  };

  /* ------------------------------------------------------------------ */
  /* Confirmation                                                        */
  /* ------------------------------------------------------------------ */
  if (issued) {
    const transaction = issued.transactions?.[0];

    return (
      <div className="space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Registry', href: '/dashboard/certificates' },
          ]}
          title="Certificate issued"
          description="The credential has been hashed, written to the ledger and sent to the recipient."
          actions={
            <>
              <Button variant="outline" size="sm" onClick={handleIssueAnother}>
                <RotateCcw aria-hidden />
                Issue another
              </Button>
              <Button asChild size="sm">
                <Link href={`/dashboard/certificates/${issued.id}`}>
                  Open record
                </Link>
              </Button>
            </>
          }
        />

        <div className="flex items-start gap-3 rounded-xl border border-success-line bg-success-soft p-4">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-success-fg"
            aria-hidden
          />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-success-fg">
              {issued.certificateId} is live and publicly verifiable
            </p>
            <p className="text-xs leading-relaxed text-success-fg/85">
              {issued.emailSent === false
                ? 'The certificate is on-chain, but the delivery email has not gone out yet. You can resend it from the record.'
                : `A PDF and verification link were emailed to ${issued.recipientEmail}.`}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Proof of issuance</CardTitle>
                <CardDescription>
                  Keep these references for your audit trail
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataList className="rounded-none border-0">
                  <DataRow
                    label="Certificate ID"
                    value={issued.certificateId}
                    mono
                    copyValue={issued.certificateId}
                  />
                  <DataRow
                    label="Recipient"
                    value={
                      <>
                        {issued.recipientName}
                        <span className="block text-xs text-ink-muted">
                          {issued.recipientEmail}
                        </span>
                      </>
                    }
                  />
                  <DataRow
                    label="Certificate hash (SHA-256)"
                    value={issued.certificateHash}
                    fallback="Not recorded"
                    mono
                    copyValue={issued.certificateHash}
                  />
                  <DataRow
                    label="Transaction"
                    mono
                    copyValue={transaction?.txHash}
                    value={
                      transaction?.txHash ? (
                        <a
                          href={getEtherscanUrl(
                            transaction.txHash,
                            transaction.networkName || 'sepolia'
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-sm text-brand hover:underline"
                        >
                          {shortenHash(transaction.txHash, 10)}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      ) : null
                    }
                    fallback="Awaiting confirmation"
                  />
                  <DataRow
                    label="Block"
                    value={transaction?.blockNumber ? `#${transaction.blockNumber}` : null}
                    fallback="Pending"
                    mono
                  />
                  <DataRow
                    label="Valid until"
                    value={issued.expiryDate ? formatDate(issued.expiryDate) : 'No expiry'}
                  />
                </DataList>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2.5">
              <Button asChild>
                <a
                  href={`/api/certificates/${issued.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download aria-hidden />
                  Download PDF
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href={`/verify/${encodeURIComponent(issued.certificateId)}`}
                  target="_blank"
                >
                  <ExternalLink aria-hidden />
                  View public verification
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/dashboard/certificates/${issued.id}`}>
                  <Send aria-hidden />
                  Manage delivery
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <CertificateDocument
              organizationName={orgName}
              recipientName={issued.recipientName}
              courseName={issued.courseName}
              courseDescription={issued.courseDescription}
              certificateId={issued.certificateId}
              issueDate={issued.issueDate}
              expiryDate={issued.expiryDate}
              qrCodeData={issued.qrCodeData}
              status="VALID"
            />
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Issuance form                                                       */
  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Registry', href: '/dashboard/certificates' }]}
        title="Issue a certificate"
        description="The details below are hashed together and written to the blockchain. They cannot be edited afterwards — only revoked and reissued."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* ------------------------------------------------------------ */}
        {/* Form                                                          */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipient</CardTitle>
                <CardDescription>
                  Who the credential is awarded to, and where it is delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Field
                  htmlFor="recipientName"
                  label="Full name"
                  required
                  error={errors.recipientName}
                  hint="Printed on the certificate exactly as entered."
                >
                  <Input
                    id="recipientName"
                    name="recipientName"
                    autoComplete="off"
                    placeholder="Eleanor Vance"
                    leading={<User />}
                    value={form.recipientName}
                    invalid={Boolean(errors.recipientName)}
                    onChange={(e) => setValue('recipientName', e.target.value)}
                  />
                </Field>

                <Field
                  htmlFor="recipientEmail"
                  label="Email address"
                  required
                  error={errors.recipientEmail}
                  hint="The PDF and verification link are sent here as soon as the transaction confirms."
                >
                  <Input
                    id="recipientEmail"
                    name="recipientEmail"
                    type="email"
                    autoComplete="off"
                    placeholder="e.vance@university.edu"
                    leading={<Mail />}
                    value={form.recipientEmail}
                    invalid={Boolean(errors.recipientEmail)}
                    onChange={(e) => setValue('recipientEmail', e.target.value)}
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Award</CardTitle>
                <CardDescription>
                  What the credential certifies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Field
                  htmlFor="courseName"
                  label="Programme or qualification"
                  required
                  error={errors.courseName}
                >
                  <Input
                    id="courseName"
                    name="courseName"
                    placeholder="MSc Computer Science"
                    leading={<BookOpen />}
                    value={form.courseName}
                    invalid={Boolean(errors.courseName)}
                    onChange={(e) => setValue('courseName', e.target.value)}
                  />
                </Field>

                <Field
                  htmlFor="courseDescription"
                  label="Description or honours"
                  hint="Optional. Appears beneath the award title on the certificate."
                >
                  <Textarea
                    id="courseDescription"
                    name="courseDescription"
                    rows={3}
                    maxLength={280}
                    placeholder="Awarded with Distinction for research in applied cryptography."
                    value={form.courseDescription}
                    onChange={(e) => setValue('courseDescription', e.target.value)}
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Validity</CardTitle>
                <CardDescription>
                  How long the credential remains active
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {EXPIRY_PRESETS.map((preset) => {
                    const selected =
                      preset.months === null
                        ? form.expiryDate === ''
                        : form.expiryDate === presetDate(preset.months);
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyExpiryPreset(preset.months)}
                        aria-pressed={selected}
                        className={cn(
                          'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                          selected
                            ? 'border-brand bg-brand-soft text-brand-strong'
                            : 'border-line-strong bg-surface text-ink-secondary hover:bg-surface-muted'
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                <Field
                  htmlFor="expiryDate"
                  label="Expiry date"
                  error={errors.expiryDate}
                  hint="Leave empty for a credential that never expires, such as a degree."
                >
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    min={today}
                    value={form.expiryDate}
                    invalid={Boolean(errors.expiryDate)}
                    onChange={(e) => setValue('expiryDate', e.target.value)}
                  />
                </Field>
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
                <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                Issuing writes a transaction to Ethereum Sepolia. This can take a
                few seconds to confirm.
              </p>
              <Button type="submit" size="lg" loading={isSubmitting} className="sm:w-auto">
                {isSubmitting ? (
                  'Issuing certificate…'
                ) : (
                  <>
                    <ShieldCheck aria-hidden />
                    Issue certificate
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Live preview                                                  */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="eyebrow">Live preview</h2>
              <span className="text-2xs text-ink-subtle">
                Updates as you type
              </span>
            </div>

            <CertificateDocument
              organizationName={orgName}
              recipientName={form.recipientName}
              courseName={form.courseName}
              courseDescription={form.courseDescription || null}
              expiryDate={form.expiryDate || null}
              placeholder
              status="VALID"
            />

            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              The delivered PDF follows this layout at A4, with the verification
              QR code generated once the certificate is anchored on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Same arithmetic as `applyExpiryPreset`, used to mark the active preset. */
function presetDate(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}
