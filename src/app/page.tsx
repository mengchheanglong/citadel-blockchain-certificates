'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Cpu,
  Zap,
  Globe,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Fingerprint,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CitadelLogo } from '@/components/ui/citadel-logo';

export default function LandingPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');
  const currentYear = new Date().getFullYear();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    router.push(`/verify/${encodeURIComponent(certInput.trim())}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#070A13] text-slate-100 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Glow Orbs Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute top-[35%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070A13]/85 backdrop-blur-md">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
            <CitadelLogo className="h-11 w-11" />
            <span className="text-2xl font-bold tracking-tight text-white">
              Citadel
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="transition hover:text-white">
              Features
            </Link>
            <Link href="#how-it-works" className="transition hover:text-white">
              How It Works
            </Link>
            <Link href="#architecture" className="transition hover:text-white">
              Architecture
            </Link>
            <Link href="/verify" className="transition hover:text-blue-400">
              Explorer
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/verify">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
              >
                <Search className="mr-2 h-4 w-4 text-blue-400" />
                Verify
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800 hover:text-white text-sm"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 text-white hover:bg-blue-500 font-medium text-sm shadow-lg shadow-blue-600/25">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
              
              {/* Left Column: Hero Copy & Search */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                {/* Live Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>Decentralized Credential Authority on Ethereum</span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.1]">
                  Be your own <br />
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                    Certificate Authority.
                  </span>
                </h1>

                <p className="max-w-2xl text-lg text-slate-400 sm:text-xl font-normal leading-relaxed mx-auto lg:mx-0">
                  Issue, anchor, and instantly verify tamper-proof academic degrees, diplomas, and corporate credentials on the blockchain.
                </p>

                {/* Hero Quick Search / Verify Bar */}
                <form
                  onSubmit={handleHeroSearch}
                  className="max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-md"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Enter Certificate ID (e.g. CERT-2026-X89B)"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl shrink-0 shadow-md transition"
                  >
                    Verify Credential
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                {/* Sub-text trust line */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 pt-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Zero counterfeit guarantee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    OpenZeppelin audited logic
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Supabase & Ethers.js v6
                  </span>
                </div>
              </div>

              {/* Right Column: Live Interactive On-Chain Mockup */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-2xl backdrop-blur-xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-xs font-mono text-slate-400">
                        contract.verify()
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                      ON-CHAIN VALID
                    </span>
                  </div>

                  {/* Simulated Blockchain Receipt */}
                  <div className="space-y-4 text-xs font-mono">
                    <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                      <span className="text-slate-500">Certificate ID:</span>
                      <p className="font-bold text-blue-400 mt-0.5">CERT-2026-OXF942K</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                        <span className="text-slate-500">Recipient:</span>
                        <p className="text-slate-200 truncate mt-0.5">Dr. Alex Rivera</p>
                      </div>
                      <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                        <span className="text-slate-500">Course:</span>
                        <p className="text-slate-200 truncate mt-0.5">Quantum AI</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800">
                      <span className="text-slate-500">SHA-256 Cryptographic Hash:</span>
                      <p className="text-slate-300 break-all text-[11px] mt-0.5">
                        0x8f3c7a91b4e2d67a18f09cb87321a4159cf0...
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                      <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                        <span className="text-slate-500">Network:</span>
                        <p className="text-indigo-400 font-semibold mt-0.5">Sepolia Testnet</p>
                      </div>
                      <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                        <span className="text-slate-500">Block Height:</span>
                        <p className="text-slate-200 mt-0.5">#6,482,910</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Scan Action Mock */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <QrCode className="h-4 w-4 text-blue-400" />
                      <span>Instant Smartphone Scan</span>
                    </div>
                    <Link
                      href="/verify"
                      className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                    >
                      Test in Explorer &rarr;
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Live Metrics Ticker Bar */}
        <section className="border-y border-slate-800/80 bg-slate-950/60 py-8 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-white">0%</p>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Counterfeit Risk</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-blue-400">100%</p>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">On-Chain Consensus</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-white">&lt; 1.2s</p>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Verification Speed</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-indigo-400">256-bit</p>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">SHA Cryptographic Proof</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Feature Showcase */}
        <section id="features" className="py-24 relative">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Built for Institutions & Verifiers
              </h2>
              <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Cryptographic security meets effortless issuance.
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                Everything required to mint, distribute, and verify immutable certificates with mathematical certainty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1: Large Bento */}
              <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-8 flex flex-col justify-between hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/20">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Immutable Smart Contract Registry
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                    Every certificate hash is anchored directly into the Ethereum blockchain via custom Solidity smart contracts (`CertificateRegistry.sol`). Once mined, no diploma mill, hacker, or central server can alter the historical proof.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-4 text-xs font-mono text-slate-500">
                  <span>Standard: ERC Compatible</span>
                  <span>•</span>
                  <span>Solidity 0.8.20</span>
                  <span>•</span>
                  <span>OpenZeppelin Ownable</span>
                </div>
              </div>

              {/* Feature 2: High Bento */}
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-8 flex flex-col justify-between hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Live Camera QR Verification
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Embedded QR codes allow employers and recruiters to point any smartphone camera at a paper or digital PDF diploma and verify its legitimacy instantly.
                  </p>
                </div>
                <div className="mt-6">
                  <Link href="/verify" className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                    Try Scanner Portal &rarr;
                  </Link>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-8 flex flex-col justify-between hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600/20 text-sky-400 border border-sky-500/20">
                    <FileCheck2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Dynamic PDF Engine
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    High-resolution vector PDFs generated on-the-fly with intelligent dynamic font scaling, ensuring long names and degrees fit symmetrically.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-8 flex flex-col justify-between hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/20">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Supabase PostgreSQL & Pooler
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Encrypted metadata and audit records cached in Supabase with transaction poolers, giving you sub-second queries with zero cold starts.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-8 flex flex-col justify-between hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/20">
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Granular Revocation Authority
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Authorized institutions can revoke degrees on-chain in cases of academic fraud, recording transparent reason logs permanently on ledger.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How it Works / Workflow Section */}
        <section id="how-it-works" className="py-20 border-t border-slate-800/80 bg-slate-950/40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Workflow
              </h2>
              <p className="text-3xl font-bold tracking-tight text-white">
                How Citadel Anchors Trust
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  1
                </div>
                <h3 className="text-lg font-semibold text-white">Issue & Cryptographic Hash</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The institution enters the graduate’s details. Citadel calculates a deterministic SHA-256 hash across canonical metadata.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  2
                </div>
                <h3 className="text-lg font-semibold text-white">On-Chain Consensus</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The transaction is broadcast to Ethereum. The smart contract validates the issuer’s cryptographic authorization and records the root block.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  3
                </div>
                <h3 className="text-lg font-semibold text-white">Universal Verification</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Recipients receive their PDF and QR code. Anyone in the world can independently verify authenticity without logging in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* High-Impact CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/60 via-indigo-950/80 to-slate-900/90 p-10 md:p-16 text-center shadow-2xl backdrop-blur-xl">
              <div className="mx-auto max-w-2xl space-y-6">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Ready to anchor credentials to Ethereum?
                </h2>
                <p className="text-slate-300 text-base sm:text-lg">
                  Join educational institutions and certified training organizations issuing blockchain-backed credentials today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 shadow-xl">
                      Create Issuer Account
                    </Button>
                  </Link>
                  <Link href="/verify">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-slate-600 text-white hover:bg-slate-800/60 font-semibold px-8"
                    >
                      Open Verification Portal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05070D] py-12 text-slate-400 text-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800/60">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <CitadelLogo className="h-10 w-10" />
                <span className="text-xl font-bold text-white tracking-tight">Citadel</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                The decentralized credential registry for universities, academies, and professional accreditors. Powered by Ethereum smart contracts and Supabase.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/dashboard" className="hover:text-white transition">Issuer Dashboard</Link></li>
                <li><Link href="/dashboard/certificates/new" className="hover:text-white transition">Issue Certificate</Link></li>
                <li><Link href="/verify" className="hover:text-white transition">Public Explorer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Security</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="text-slate-400">OpenZeppelin Ownable</span></li>
                <li><span className="text-slate-400">SHA-256 Hashing</span></li>
                <li><span className="text-slate-400">Sepolia Consensus</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Account</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition">Create Account</Link></li>
                <li><Link href="/forgot-password" className="hover:text-white transition">Reset Password</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>&copy; {currentYear} Citadel. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ethereum Sepolia Network Live</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
