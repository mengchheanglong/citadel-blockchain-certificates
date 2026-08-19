'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Shield,
  Search,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  Lock,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CitadelLogo } from '@/components/ui/citadel-logo';

export default function VerifyEntryPage() {
  const router = useRouter();

  const [certificateIdInput, setCertificateIdInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Extract certificate ID from input or scanned QR URL
  const parseCertificateId = (raw: string): string => {
    let clean = raw.trim();
    if (clean.includes('/verify/')) {
      const parts = clean.split('/verify/');
      clean = parts[parts.length - 1].split('?')[0].split('#')[0];
    } else if (clean.startsWith('http://') || clean.startsWith('https://')) {
      try {
        const url = new URL(clean);
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          clean = segments[segments.length - 1];
        }
      } catch {
        // fallback to clean
      }
    }
    return clean.trim();
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseCertificateId(certificateIdInput);
    if (!id) {
      setErrorMessage('Please enter a valid Certificate ID');
      return;
    }
    setErrorMessage('');
    router.push(`/verify/${encodeURIComponent(id)}`);
  };

  // QR Code Scanner Effect
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      const timer = setTimeout(() => {
        try {
          scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              const id = parseCertificateId(decodedText);
              if (id) {
                scanner?.clear().catch(console.error);
                setIsScanning(false);
                router.push(`/verify/${encodeURIComponent(id)}`);
              }
            },
            (error) => {
              // Frame scanning errors are ignored
            }
          );
        } catch (err) {
          console.error('Failed to initialize QR scanner:', err);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          scanner.clear().catch(console.error);
        }
      };
    }
  }, [isScanning, router]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#C8102E]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
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

      {/* Main Content */}
      <main className="flex-1 py-14 sm:py-20">
        <div className="container mx-auto max-w-xl px-4 sm:px-6">
          {/* Heading */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8102E]/30 bg-[#C8102E]/10 px-3.5 py-1 text-xs font-bold text-[#C8102E] shadow-2xs">
              <Lock className="h-3.5 w-3.5" />
              <span>Public Verification Engine</span>
            </div>
            <h1 className="text-3xl font-[900] tracking-tight text-slate-900 sm:text-4xl">
              Verify a Certificate
            </h1>
            <p className="text-xs text-slate-600 sm:text-sm max-w-md mx-auto leading-relaxed">
              Enter a Certificate ID or scan a diploma QR code to verify its cryptographic authenticity directly against Ethereum.
            </p>
          </div>

          {/* Verification Box */}
          <Card className="mt-8 border-slate-200/90 bg-white shadow-md rounded-3xl overflow-hidden">
            <CardContent className="pt-7 p-7 space-y-6">
              {/* Form Input */}
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Enter Certificate ID (e.g., CERT-2026-A3B7K)"
                      value={certificateIdInput}
                      onChange={(e) => {
                        setCertificateIdInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="pl-11 h-12 text-xs sm:text-sm font-mono rounded-2xl border-slate-200 focus:border-[#C8102E]"
                      autoFocus
                    />
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 pl-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-md shadow-[#C8102E]/25 transition hover:scale-[1.01] active:scale-95"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Verify Certificate
                </Button>
              </form>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200" />
                <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  OR
                </span>
              </div>

              {/* QR Code Scanner Toggle & Container */}
              {!isScanning ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsScanning(true)}
                  className="w-full h-12 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 font-bold text-xs"
                >
                  <QrCode className="h-4 w-4 text-[#C8102E]" />
                  <span>Scan Diploma QR Code</span>
                </Button>
              ) : (
                <div className="space-y-3 rounded-2xl border border-[#C8102E]/30 bg-slate-50 p-5 text-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <QrCode className="h-4 w-4 text-[#C8102E]" />
                      <span>Camera Scanner Active</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsScanning(false)}
                      className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                      title="Close Scanner"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Point your camera at the QR code printed on the certificate.
                  </p>

                  <div
                    id="qr-reader"
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsScanning(false)}
                    className="w-full rounded-full text-xs font-semibold"
                  >
                    Cancel Scan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Benefits Cards */}
          <div className="mt-8 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Instant Blockchain Validation
                </span>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
                  Cryptographically matches against the immutable smart contract registry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Zero Trust Required
                </span>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
                  Completely transparent, independent verification without intermediaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Citadel. Immutable blockchain credentialing.
      </footer>
    </div>
  );
}
