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
      // Small timeout to ensure DOM container #qr-reader is mounted
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <CitadelLogo className="h-9 w-9" />
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

      {/* Main Content */}
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto max-w-xl px-4 sm:px-6">
          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700 shadow-xs mb-4">
              <Lock className="h-3.5 w-3.5" />
              <span>Public Verification Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Verify a Certificate
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Enter a Certificate ID or scan a QR code to verify its authenticity directly against the Ethereum blockchain.
            </p>
          </div>

          {/* Verification Box */}
          <Card className="mt-8 border-slate-200 bg-white shadow-md">
            <CardContent className="pt-6 space-y-6">
              {/* Form Input */}
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Enter Certificate ID (e.g., CERT-2026-A3B7K)"
                      value={certificateIdInput}
                      onChange={(e) => {
                        setCertificateIdInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="pl-10 h-12 text-sm font-mono placeholder:font-sans"
                      autoFocus
                    />
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Verify Certificate
                </Button>
              </form>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200" />
                <span className="relative bg-white px-3 text-xs uppercase font-semibold text-slate-400">
                  OR
                </span>
              </div>

              {/* QR Code Scanner Toggle & Container */}
              {!isScanning ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsScanning(true)}
                  className="w-full h-11 border-slate-300 text-slate-700 hover:bg-slate-50 gap-2 font-medium"
                >
                  <QrCode className="h-5 w-5 text-blue-600" />
                  <span>Scan QR Code</span>
                </Button>
              ) : (
                <div className="space-y-3 rounded-lg border border-blue-200 bg-slate-50 p-4 text-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <QrCode className="h-4 w-4 text-blue-600" />
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

                  <p className="text-xs text-slate-500">
                    Point your camera at the QR code printed on the certificate.
                  </p>

                  <div
                    id="qr-reader"
                    className="overflow-hidden rounded-md border border-slate-200 bg-white"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsScanning(false)}
                    className="w-full text-xs"
                  >
                    Cancel Scan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Benefits Cards */}
          <div className="mt-8 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">
                  Instant Blockchain Validation
                </span>
                <p className="mt-0.5 text-slate-500">
                  Cryptographically matches against the immutable smart contract registry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">
                  Zero Trust Required
                </span>
                <p className="mt-0.5 text-slate-500">
                  Completely transparent, independent verification without intermediaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Citadel. Powered by Ethereum smart contracts.
          </p>
      </footer>
    </div>
  );
}
