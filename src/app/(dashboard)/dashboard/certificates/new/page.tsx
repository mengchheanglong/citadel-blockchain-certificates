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
  Sparkles,
  QrCode,
  Lock,
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
import { shortenHash, getEtherscanUrl, formatDate } from '@/lib/utils';
import { CitadelLogo } from '@/components/ui/citadel-logo';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';

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
  const { organization } = useSupabaseAuth();
  const orgName = organization?.name || 'Oxford Institute of Technology';

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
    toast({
      title: 'Copied to Clipboard',
      description: `${field} copied.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetPresetExpiry = (months: number | null) => {
    if (months === null) {
      setFormData((prev) => ({ ...prev, expiryDate: '' }));
      return;
    }
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    setFormData((prev) => ({ ...prev, expiryDate: d.toISOString().split('T')[0] }));
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

    if (!formData.recipientName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Recipient Name is required.',
      });
      return;
    }

    if (!formData.recipientEmail.trim() || !formData.recipientEmail.includes('@')) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'A valid Recipient Email is required for delivery.',
      });
      return;
    }

    if (!formData.courseName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Course or Program title is required.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        recipientName: formData.recipientName.trim(),
        recipientEmail: formData.recipientEmail.trim().toLowerCase(),
        courseName: formData.courseName.trim(),
        courseDescription: formData.courseDescription.trim() || null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      };

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.certificate) {
        setIssuedCertificate(data.certificate);
        toast({
          title: 'Certificate Anchored to Blockchain!',
          description: `Minted with Certificate ID: ${data.certificate.certificateId}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Issuance Failed',
          description: data.message || 'Unable to record on smart contract.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: err?.message || 'Failed to issue certificate.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/dashboard/certificates"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Registry</span>
          </Link>
          <h1 className="text-2xl font-[900] tracking-tight text-slate-900 sm:text-3xl">
            Issue Digital Certificate
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Anchor a tamper-proof credential to Ethereum with instant PDF generation and automated recipient dispatch.
          </p>
        </div>

        {issuedCertificate && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetForm}
            className="rounded-full border-slate-200 text-xs font-semibold"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Issue Another Certificate
          </Button>
        )}
      </div>

      {/* Success State Screen */}
      {issuedCertificate ? (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-mono text-xs">
                    ON-CHAIN MINED & VERIFIED
                  </Badge>
                  <h2 className="text-xl font-[900] text-slate-900 mt-1">
                    Certificate Successfully Issued!
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Cryptographic hash recorded on Ethereum Sepolia ledger. Vector PDF diploma generated.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`/api/certificates/${issuedCertificate.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-md">
                    <Download className="mr-1.5 h-4 w-4" />
                    Download Official PDF
                  </Button>
                </a>

                <Link
                  href={`/verify/${encodeURIComponent(issuedCertificate.certificateId)}`}
                  target="_blank"
                >
                  <Button variant="outline" className="rounded-full border-slate-300 text-xs font-semibold bg-white">
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    Public Verification Page
                  </Button>
                </Link>
              </div>
            </div>

            {/* Proof Metadata Strip */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-emerald-200/80 font-mono text-xs">
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-slate-400 text-[11px] block">Certificate ID</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C8102E] text-sm">{issuedCertificate.certificateId}</span>
                  <button onClick={() => handleCopy(issuedCertificate.certificateId, 'Certificate ID')} className="text-slate-400 hover:text-slate-600">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-slate-400 text-[11px] block">Recipient</span>
                <span className="font-bold text-slate-800 block truncate">{issuedCertificate.recipientName}</span>
                <span className="text-slate-500 text-[10px] truncate block">{issuedCertificate.recipientEmail}</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-slate-400 text-[11px] block">Transaction Hash</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 text-xs truncate max-w-[150px]">
                    {issuedCertificate.transactions?.[0]?.txHash || 'Pending on node'}
                  </span>
                  {issuedCertificate.transactions?.[0]?.txHash && (
                    <button onClick={() => handleCopy(issuedCertificate.transactions![0].txHash, 'Tx Hash')} className="text-slate-400 hover:text-slate-600">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Split Screen Studio: Form + Live Interactive Preview */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: 7 Columns */}
          <div className="lg:col-span-7">
            <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8102E]">
                  <Sparkles className="h-4 w-4" />
                  <span>Credential Details</span>
                </div>
                <CardTitle className="text-lg font-[900] text-slate-900">
                  Recipient & Program Specification
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Enter student information to compute the SHA-256 cryptographic seal.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Recipient Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="recipientName" className="text-xs font-bold text-slate-700">
                      Recipient Full Name <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="recipientName"
                        name="recipientName"
                        placeholder="e.g. Dr. Alex Rivera or Eleanor Vance"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-11 rounded-xl border-slate-200 text-xs focus:border-[#C8102E]"
                      />
                    </div>
                  </div>

                  {/* Recipient Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="recipientEmail" className="text-xs font-bold text-slate-700">
                      Recipient Email Address <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="recipientEmail"
                        name="recipientEmail"
                        type="email"
                        placeholder="e.g. student@oxford.edu"
                        value={formData.recipientEmail}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-11 rounded-xl border-slate-200 text-xs focus:border-[#C8102E]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      The official PDF certificate will be delivered to this email automatically upon mining.
                    </p>
                  </div>

                  {/* Course Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="courseName" className="text-xs font-bold text-slate-700">
                      Program / Degree / Certification Title <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="courseName"
                        name="courseName"
                        placeholder="e.g. Master of Science in Quantum Computing & AI"
                        value={formData.courseName}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-11 rounded-xl border-slate-200 text-xs focus:border-[#C8102E]"
                      />
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="courseDescription" className="text-xs font-bold text-slate-700">
                      Program Description & Honors <span className="text-slate-400 font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      id="courseDescription"
                      name="courseDescription"
                      placeholder="e.g. Awarded with Distinction for exceptional research in decentralized cryptography..."
                      value={formData.courseDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="rounded-xl border-slate-200 text-xs focus:border-[#C8102E]"
                    />
                  </div>

                  {/* Expiration Date & Presets */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="expiryDate" className="text-xs font-bold text-slate-700">
                        Validity / Expiration Date <span className="text-slate-400 font-normal">(Leave blank for Lifetime)</span>
                      </Label>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pb-1">
                      <button
                        type="button"
                        onClick={() => handleSetPresetExpiry(null)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                          formData.expiryDate === ''
                            ? 'bg-[#C8102E] text-white border-[#C8102E]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Lifetime (No Expiry)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPresetExpiry(12)}
                        className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition"
                      >
                        +1 Year
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetPresetExpiry(24)}
                        className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition"
                      >
                        +2 Years
                      </button>
                    </div>

                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="pl-10 h-11 rounded-xl border-slate-200 text-xs focus:border-[#C8102E]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-sm shadow-md shadow-[#C8102E]/25 transition hover:scale-[1.01] active:scale-95"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Broadcasting Transaction to Sepolia Blockchain...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Anchor & Issue Certificate
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Live Preview: 5 Columns */}
          <div className="lg:col-span-5 space-y-4 sticky top-28">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-[#C8102E]" />
                Live Diploma Preview
              </span>
              <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                A4 Vector Sharp
              </span>
            </div>

            {/* Real-time Simulated Diploma Card */}
            <div className="rounded-3xl border-2 border-[#9E1B32] bg-white p-7 shadow-xl space-y-6 relative overflow-hidden">
              {/* Inner gold decorative border */}
              <div className="absolute inset-2 border border-[#CA8A04]/40 rounded-2xl pointer-events-none" />

              {/* Institution Header */}
              <div className="text-center space-y-1.5 pt-2">
                <div className="flex justify-center">
                  <CitadelLogo className="h-10 w-10" size={48} />
                </div>
                <h4 className="text-xs font-[900] tracking-wider uppercase text-slate-800">
                  {orgName}
                </h4>
                <p className="text-[9px] uppercase tracking-widest text-[#9E1B32] font-bold">
                  Official Blockchain-Verified Credential
                </p>
              </div>

              {/* Student Name */}
              <div className="text-center py-2 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">This is to certify that</p>
                <h3 className="text-lg font-[900] text-slate-900 tracking-tight font-serif min-h-[28px]">
                  {formData.recipientName.trim() || 'Graduate Student Name'}
                </h3>
                <p className="text-[10px] text-slate-500">has successfully fulfilled all requirements for</p>
                <p className="text-xs font-bold text-[#C8102E] leading-snug min-h-[18px]">
                  {formData.courseName.trim() || 'Degree / Certification Title'}
                </p>
              </div>

              {/* Description Snippet */}
              {formData.courseDescription && (
                <p className="text-[10px] text-slate-500 text-center italic line-clamp-2 px-4">
                  &ldquo;{formData.courseDescription}&rdquo;
                </p>
              )}

              {/* Footer proof bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <div className="space-y-0.5">
                  <span className="block text-[9px] text-slate-400">Issue Date:</span>
                  <span className="font-bold text-slate-700">{new Date().toISOString().split('T')[0]}</span>
                </div>

                <div className="flex items-center gap-2">
                  <QrCode className="h-6 w-6 text-slate-700" />
                  <div className="text-right">
                    <span className="block text-[9px] text-slate-400">Validity:</span>
                    <span className="font-bold text-emerald-600">
                      {formData.expiryDate ? formData.expiryDate : 'Lifetime'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
