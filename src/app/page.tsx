import Link from 'next/link';
import { Shield, Search, QrCode, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CitadelLogo } from '@/components/ui/citadel-logo';

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <CitadelLogo className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Citadel
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/verify">
              <Button variant="ghost" className="text-sm font-medium text-slate-700 hover:text-blue-600">
                <Search className="mr-2 h-4 w-4" />
                Verify Certificate
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="text-sm font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 py-20 sm:py-28 lg:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />

          <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700 shadow-sm sm:text-sm">
              <Lock className="h-3.5 w-3.5" />
              <span>Immutable & Cryptographically Secured on Ethereum</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Blockchain-Verified <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Digital Certificates
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg md:text-xl">
              Issue, manage, and instantly verify tamper-proof educational credentials and professional certificates anchored securely on the blockchain.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/verify" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Verify a Certificate
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:text-blue-600 sm:w-auto">
                  Organization Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 sm:text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero Forgery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Instant Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Decentralized Trust</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Core Capabilities
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Engineered for Complete Trust & Transparency
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                Our platform blends smart contract immutability with enterprise-grade usability to revolutionize credential issuance.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <Card className="relative overflow-hidden border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-xl font-bold text-slate-900">
                    Tamper-Proof
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Certificates secured by blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Each credential is cryptographically hashed and anchored directly to the Ethereum blockchain smart contract. Once issued, certificate records cannot be altered, forged, or deleted.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="relative overflow-hidden border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Search className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-xl font-bold text-slate-900">
                    Instant Verification
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Verify in seconds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Employers and verifiers can confirm authenticity in real-time by entering a Certificate ID or searching transaction hashes, validating recipient names, courses, and issuing authorities instantly.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="relative overflow-hidden border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-xl font-bold text-slate-900">
                    QR Code Support
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Scan to verify
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Every generated PDF certificate embeds a high-resolution QR code. Anyone with a smartphone camera can scan and immediately inspect the on-chain authenticity and full audit trail.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Workflow / Steps Section */}
        <section className="border-t border-slate-200 bg-white py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                How It Works
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Simple, Reliable Credential Lifecycle
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600 border border-blue-200">
                  1
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">Issue & Hash</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Organizations enter recipient details. A cryptographic SHA-256 hash is generated and anchored to Ethereum.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600 border border-blue-200">
                  2
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">Automated Delivery</h3>
                <p className="mt-2 text-sm text-slate-600">
                  A high-resolution PDF certificate with embedded QR verification code is emailed directly to the recipient.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600 border border-blue-200">
                  3
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">Universal Verification</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Anyone can verify the certificate anywhere in the world, completely independent of central authority servers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
          <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to Issue Blockchain-Backed Credentials?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100">
              Join leading educational institutions and organizations issuing tamper-evident digital certificates today.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full bg-white font-semibold text-blue-700 hover:bg-blue-50 sm:w-auto shadow-sm">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/verify">
                <Button size="lg" variant="outline" className="w-full border-blue-300 text-white hover:bg-blue-800/50 sm:w-auto">
                  Verify Existing Certificate
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-slate-500">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white">
              <CitadelLogo className="h-4 w-4" />
            </div>
            <span className="font-semibold text-slate-900">Citadel</span>
          </div>
          <p className="text-center text-sm">
            &copy; {currentYear} Citadel. All rights reserved. Powered by Ethereum smart contracts.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/verify" className="hover:text-blue-600 transition">
              Verify
            </Link>
            <Link href="/login" className="hover:text-blue-600 transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-blue-600 transition">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
