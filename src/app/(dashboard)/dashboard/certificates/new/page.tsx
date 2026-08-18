'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  Loader2,
  Mail,
  RotateCcw,
  User,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  FileText,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { shortenHash, getEtherscanUrl } from '@/lib/utils';

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
  transactions?: Array<{
    txHash: string;
    blockNumber: string;
    networkName: string;
    contractAddress: string;
  }>;
}

export default function IssueCertificatePage() {
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    courseName: '',
    courseDescription: '',
    expiryDate: '',
  });

  // Loading and Success States
  const [isLoading, setIsLoading] = useState(false);
  const [issuedCertificate, setIssuedCertificate] =
    useState<IssuedCertificate | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetForm = () => {
    setFormData({
      recipientName: '',
      recipientEmail: '',
      courseName: '',
      courseDescription: '',
      expiryDate: '',
    });
    setIssuedCertificate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend checks
    if (!formData.recipientName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Recipient Name is required.',
      });
      return;
    }
    if (!formData.recipientEmail.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Recipient Email is required.',
      });
      return;
    }
    if (!formData.courseName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Course or Program Name is required.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare payload with ISO expiry date if provided
      let isoExpiry: string | null = null;
      if (formData.expiryDate) {
        const parsed = new Date(formData.expiryDate);
        if (!isNaN(parsed.getTime())) {
          isoExpiry = parsed.toISOString();
        }
      }

      const payload = {
        recipientName: formData.recipientName.trim(),
        recipientEmail: formData.recipientEmail.trim().toLowerCase(),
        courseName: formData.courseName.trim(),
        courseDescription: formData.courseDescription.trim() || undefined,
        expiryDate: isoExpiry,
      };

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        let errorMsg = data.message || 'Failed to issue certificate';
        if (data.errors) {
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError) errorMsg = String(firstError);
        }
        throw new Error(errorMsg);
      }

      const cert: IssuedCertificate = data.certificate;
      setIssuedCertificate(cert);

      toast({
        title: 'Certificate Issued Successfully!',
        description: `Certificate ${cert.certificateId} has been created and registered.`,
      });
    } catch (error: any) {
      console.error('Certificate issuance error:', error);
      toast({
        variant: 'destructive',
        title: 'Issuance Failed',
        description:
          error?.message ||
          'An unexpected error occurred while issuing the certificate.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const latestTx = issuedCertificate?.transactions?.[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/certificates">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Certificates</span>
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Issue New Certificate
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create, anchor to the Ethereum blockchain, and deliver a cryptographic digital credential.
        </p>
      </div>

      {/* Success View */}
      {issuedCertificate ? (
        <Card className="border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white shadow-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold text-emerald-950">
              Certificate Issued Successfully!
            </CardTitle>
            <CardDescription className="text-emerald-700">
              The digital certificate has been created, hashed, and recorded.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Certificate Details Summary */}
            <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Certificate ID
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-600">
                    {issuedCertificate.certificateId}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-slate-600"
                    onClick={() =>
                      handleCopy(issuedCertificate.certificateId, 'certId')
                    }
                    title="Copy Certificate ID"
                  >
                    {copiedField === 'certId' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Recipient Name
                </span>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {issuedCertificate.recipientName}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Recipient Email
                </span>
                <p className="mt-1 text-sm text-slate-700">
                  {issuedCertificate.recipientEmail}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Course / Program
                </span>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {issuedCertificate.courseName}
                </p>
              </div>
            </div>

            {/* Blockchain Transaction Information */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Blockchain Proof Record
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                {latestTx?.txHash ? (
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-slate-500">Transaction Hash:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <a
                        href={getEtherscanUrl(
                          latestTx.txHash,
                          latestTx.networkName
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{shortenHash(latestTx.txHash, 8)}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-slate-400 hover:text-slate-600"
                        onClick={() =>
                          handleCopy(latestTx.txHash, 'txHash')
                        }
                        title="Copy Tx Hash"
                      >
                        {copiedField === 'txHash' ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">
                    Registered in database. Smart contract transaction recorded or queued.
                  </p>
                )}

                {issuedCertificate.emailSent && (
                  <div className="flex items-center gap-1.5 text-emerald-700 pt-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>Notification email with PDF attachment dispatched to recipient.</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between border-t border-emerald-100 pt-6">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <a
                href={`/api/certificates/${issuedCertificate.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto gap-2 bg-blue-600 text-white hover:bg-blue-700">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </a>

              <Link
                href={`/dashboard/certificates/${issuedCertificate.id}`}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2 border-slate-300"
                >
                  <Eye className="h-4 w-4" />
                  View Certificate
                </Button>
              </Link>
            </div>

            <Button
              variant="secondary"
              onClick={handleResetForm}
              className="w-full sm:w-auto gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Issue Another
            </Button>
          </CardFooter>
        </Card>
      ) : (
        /* Form View */
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-blue-600">
              <Award className="h-5 w-5" />
              <CardTitle className="text-xl">Certificate Details</CardTitle>
            </div>
            <CardDescription>
              Provide the recipient details and credential metadata. All fields marked with * are required.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {/* Recipient Name */}
              <div className="space-y-2">
                <Label htmlFor="recipientName" className="flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>Recipient Full Name *</span>
                </Label>
                <Input
                  id="recipientName"
                  name="recipientName"
                  placeholder="e.g., Alice Johnson"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  autoComplete="name"
                />
                <p className="text-[12px] text-slate-500">
                  This name will be permanently displayed on the certificate and hashed into the blockchain record.
                </p>
              </div>

              {/* Recipient Email */}
              <div className="space-y-2">
                <Label htmlFor="recipientEmail" className="flex items-center gap-1.5 font-medium">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span>Recipient Email Address *</span>
                </Label>
                <Input
                  id="recipientEmail"
                  name="recipientEmail"
                  type="email"
                  placeholder="e.g., alice.johnson@example.com"
                  value={formData.recipientEmail}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
                <p className="text-[12px] text-slate-500">
                  The recipient will receive an email containing the certificate link, verification QR code, and PDF.
                </p>
              </div>

              {/* Course / Program Name */}
              <div className="space-y-2">
                <Label htmlFor="courseName" className="flex items-center gap-1.5 font-medium">
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                  <span>Course / Program Name *</span>
                </Label>
                <Input
                  id="courseName"
                  name="courseName"
                  placeholder="e.g., Certified Blockchain Solutions Architect"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Course Description */}
              <div className="space-y-2">
                <Label htmlFor="courseDescription" className="flex items-center gap-1.5 font-medium">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  <span>Course Description (Optional)</span>
                </Label>
                <Textarea
                  id="courseDescription"
                  name="courseDescription"
                  placeholder="Provide a short description of achievements, competencies, or curriculum covered..."
                  value={formData.courseDescription}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={3}
                />
                <p className="text-[12px] text-slate-500">
                  Optional summary of achievements or honors shown on the certificate verification page.
                </p>
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="flex items-center gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Expiration Date (Optional)</span>
                </Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full sm:w-64"
                />
                <p className="text-[12px] text-slate-500">
                  Leave blank if the credential is perpetual and does not expire.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-500 order-2 sm:order-1">
                Issuance registers an irreversible SHA-256 hash.
              </p>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 order-1 sm:order-2 min-w-[160px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Issuing On-Chain...
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Issue Certificate
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
