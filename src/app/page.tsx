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
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  Sparkles,
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
    <div className="flex min-h-screen flex-col bg-[#070A13] text-slate-100 selection:bg-[#0C6CF2] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-[#0C6CF2]/15 blur-[140px] animate-pulse-glow" />
        <div className="absolute top-[30%] -right-40 w-[600px] h-[600px] rounded-full bg-[#00D2FF]/10 blur-[160px] animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-20 w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      {/* Top Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1C2540]/80 bg-[#070A13]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-95">
            <CitadelLogo className="h-11 w-11" />
            <span className="text-2xl font-[800] tracking-tight text-white">
              Citadel
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#features" className="transition hover:text-white">
              Features
            </Link>
            <Link href="#how-it-works" className="transition hover:text-white">
              How It Works
            </Link>
            <Link href="#architecture" className="transition hover:text-white">
              Smart Contracts
            </Link>
            <Link href="/verify" className="flex items-center gap-1.5 transition text-[#00D2FF] hover:text-cyan-300">
              <Activity className="h-3.5 w-3.5" />
              Explorer
            </Link>
          </nav>

          {/* Right Nav CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/verify">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1C2540]/60 rounded-full px-4"
              >
                <Search className="mr-2 h-4 w-4 text-[#00D2FF]" />
                Verify
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-[#1C2540] bg-[#111628]/60 text-slate-200 hover:bg-[#1C2540] hover:text-white text-sm font-medium rounded-full px-5"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#0C6CF2] hover:bg-[#0A58C7] text-white font-semibold text-sm rounded-full px-6 shadow-[0_0_20px_rgba(12,108,242,0.35)] transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                             */}
        {/* ========================================================================= */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-12 items-center">
              
              {/* Left Column: Headline & Search */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                {/* Live Protocol Beacon Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#0C6CF2]/30 bg-[#0C6CF2]/10 px-4 py-1.5 text-xs font-semibold text-[#00D2FF] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D2FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D2FF]"></span>
                  </span>
                  <span>Decentralized Credential Authority • Ethereum Network</span>
                </div>

                {/* Massive Hero Heading */}
                <h1 className="text-4xl font-[900] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl leading-[1.08]">
                  Be your own <br />
                  <span className="bg-gradient-to-r from-[#0C6CF2] via-[#00D2FF] to-[#A855F7] bg-clip-text text-transparent">
                    Certificate Authority.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl text-lg text-slate-400 sm:text-xl font-normal leading-relaxed mx-auto lg:mx-0">
                  Issue, anchor, and instantly verify tamper-proof university degrees, diplomas, and corporate credentials on the Ethereum blockchain.
                </p>

                {/* Blockchain.com-Style Hero Search Input Bar */}
                <form
                  onSubmit={handleHeroSearch}
                  className="max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 rounded-2xl sm:rounded-full border border-[#1C2540] bg-[#111628]/90 p-2 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl transition focus-within:border-[#0C6CF2] focus-within:shadow-[0_0_25px_rgba(12,108,242,0.3)]"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter Certificate ID (e.g. CERT-2026-X89B)"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-[#0C6CF2] hover:bg-[#0A58C7] text-white font-semibold py-3.5 px-7 rounded-xl sm:rounded-full shrink-0 shadow-lg shadow-[#0C6CF2]/25 transition-all hover:scale-[1.02]"
                  >
                    Verify Credential
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 pt-2 font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#00D2FF]" />
                    Zero Counterfeit Risk
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#00D2FF]" />
                    OpenZeppelin Security
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#00D2FF]" />
                    Instant QR Camera Scan
                  </span>
                </div>
              </div>

              {/* Right Column: Live Interactive On-Chain Block Receipt */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl border border-[#1C2540] bg-gradient-to-b from-[#111628]/95 to-[#070A13]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-float">
                  
                  {/* Window Controls & Live Status */}
                  <div className="flex items-center justify-between border-b border-[#1C2540] pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-xs font-mono text-slate-400">
                        CertificateRegistry.verify()
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      MINED ON-CHAIN
                    </span>
                  </div>

                  {/* Blockchain Data Parameters */}
                  <div className="space-y-3.5 text-xs font-mono">
                    <div className="rounded-xl bg-[#070A13] p-3.5 border border-[#1C2540]">
                      <span className="text-slate-500 text-[11px] uppercase tracking-wider">Certificate ID</span>
                      <p className="font-bold text-[#00D2FF] mt-0.5 text-sm">CERT-2026-OXF942K</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#070A13] p-3 border border-[#1C2540]">
                        <span className="text-slate-500 text-[11px]">Recipient</span>
                        <p className="text-slate-200 font-semibold truncate mt-0.5">Dr. Alex Rivera</p>
                      </div>
                      <div className="rounded-xl bg-[#070A13] p-3 border border-[#1C2540]">
                        <span className="text-slate-500 text-[11px]">Degree / Program</span>
                        <p className="text-slate-200 font-semibold truncate mt-0.5">Quantum AI</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#070A13] p-3.5 border border-[#1C2540]">
                      <span className="text-slate-500 text-[11px] uppercase tracking-wider">SHA-256 Cryptographic Hash</span>
                      <p className="text-slate-300 break-all text-[11px] mt-0.5 text-[#00D2FF]/90">
                        0x8f3c7a91b4e2d67a18f09cb87321a4159cf058a912b...
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="rounded-xl bg-[#070A13] p-3 border border-[#1C2540]">
                        <span className="text-slate-500">Active Network</span>
                        <p className="text-indigo-400 font-semibold mt-0.5">Sepolia EVM</p>
                      </div>
                      <div className="rounded-xl bg-[#070A13] p-3 border border-[#1C2540]">
                        <span className="text-slate-500">Smart Contract State</span>
                        <p className="text-emerald-400 font-semibold mt-0.5">VALID / ACTIVE</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Scan Action Footer */}
                  <div className="mt-5 pt-4 border-t border-[#1C2540] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <QrCode className="h-4 w-4 text-[#00D2FF]" />
                      <span>Scan QR code with smartphone</span>
                    </div>
                    <Link
                      href="/verify"
                      className="text-[#0C6CF2] hover:text-[#00D2FF] font-semibold inline-flex items-center gap-1 transition"
                    >
                      Open Live Portal &rarr;
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LIVE METRICS TICKER STRIP                                                 */}
        {/* ========================================================================= */}
        <section className="border-y border-[#1C2540] bg-[#0A0E1A]/80 py-10 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
              <div className="space-y-1.5 border-r border-[#1C2540]/60 last:border-r-0">
                <p className="text-3xl sm:text-4xl font-[900] text-white">0.0%</p>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Fraud & Forgery Rate</p>
              </div>
              <div className="space-y-1.5 border-r border-[#1C2540]/60 last:border-r-0">
                <p className="text-3xl sm:text-4xl font-[900] text-[#00D2FF]">100%</p>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">On-Chain Consensus</p>
              </div>
              <div className="space-y-1.5 border-r border-[#1C2540]/60 last:border-r-0">
                <p className="text-3xl sm:text-4xl font-[900] text-white">&lt; 1.0s</p>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Verification Latency</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-3xl sm:text-4xl font-[900] text-[#A855F7]">256-Bit</p>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Cryptographic Security</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BENTO GRID FEATURE SHOWCASE                                               */}
        {/* ========================================================================= */}
        <section id="features" className="py-28 relative">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0C6CF2]/30 bg-[#0C6CF2]/10 px-3.5 py-1 text-xs font-semibold text-[#00D2FF]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Enterprise Credential Infrastructure</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-[900] tracking-tight text-white">
                Cryptographic certainty for every issued degree.
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                Engineered for higher education institutions, academies, and enterprise accreditation bodies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1: Large Span Card */}
              <div className="md:col-span-2 rounded-3xl border border-[#1C2540] bg-gradient-to-br from-[#111628] to-[#0A0E1A] p-8 sm:p-10 flex flex-col justify-between hover:border-[#0C6CF2]/60 hover:shadow-[0_0_35px_rgba(12,108,242,0.15)] transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0C6CF2]/15 text-[#00D2FF] border border-[#0C6CF2]/30">
                    <Lock className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-[800] text-white">
                    Immutable Solidity Smart Contract
                  </h3>
                  <p className="text-slate-400 text-base leading-relaxed max-w-xl">
                    Every certificate hash is anchored directly to the Ethereum blockchain via `CertificateRegistry.sol`. OpenZeppelin cryptographic permissioning ensures that only verified authorities can register or revoke credentials.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[#1C2540] flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="text-[#00D2FF]">Solidity 0.8.20</span>
                  <span>•</span>
                  <span>EVM Bytecode Verified</span>
                  <span>•</span>
                  <span>Zero Single-Point-of-Failure</span>
                </div>
              </div>

              {/* Feature 2: High Bento Card */}
              <div className="rounded-3xl border border-[#1C2540] bg-gradient-to-br from-[#111628] to-[#0A0E1A] p-8 sm:p-10 flex flex-col justify-between hover:border-[#0C6CF2]/60 hover:shadow-[0_0_35px_rgba(12,108,242,0.15)] transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/15 text-indigo-400 border border-indigo-500/30">
                    <QrCode className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-[800] text-white">
                    Camera QR Scanner
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Embedded QR codes allow employers, recruiters, and government agencies to point any smartphone camera at a paper or digital diploma to verify its authenticity in real-time.
                  </p>
                </div>
                <div className="mt-6">
                  <Link href="/verify" className="text-sm font-semibold text-[#00D2FF] hover:text-cyan-300 inline-flex items-center gap-1.5">
                    Launch Scanner Portal &rarr;
                  </Link>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl border border-[#1C2540] bg-gradient-to-br from-[#111628] to-[#0A0E1A] p-8 flex flex-col justify-between hover:border-[#0C6CF2]/60 hover:shadow-[0_0_35px_rgba(12,108,242,0.15)] transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600/15 text-sky-400 border border-sky-500/30">
                    <FileCheck2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Dynamic PDF Engine
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    High-resolution vector PDF certificates generated on-the-fly with dynamic font fitting, crisp metadata ribbons, and instant email dispatch.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="rounded-3xl border border-[#1C2540] bg-gradient-to-br from-[#111628] to-[#0A0E1A] p-8 flex flex-col justify-between hover:border-[#0C6CF2]/60 hover:shadow-[0_0_35px_rgba(12,108,242,0.15)] transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/15 text-emerald-400 border border-emerald-500/30">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Supabase PostgreSQL Cache
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Encrypted metadata cached in Supabase with transaction poolers, delivering zero-latency queries, real-time sync, and enterprise reliability.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="rounded-3xl border border-[#1C2540] bg-gradient-to-br from-[#111628] to-[#0A0E1A] p-8 flex flex-col justify-between hover:border-[#0C6CF2]/60 hover:shadow-[0_0_35px_rgba(12,108,242,0.15)] transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/15 text-purple-400 border border-purple-500/30">
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    On-Chain Revocation
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Granular revocation authority allowing institutions to invalidate credentials with reason codes recorded permanently on the ledger.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS / LIFECYCLE WORKFLOW                                         */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-24 border-t border-[#1C2540] bg-[#0A0E1A]/60">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#00D2FF]">
                Protocol Workflow
              </h2>
              <p className="text-3xl sm:text-4xl font-[900] tracking-tight text-white">
                How Citadel Anchors Trust
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="rounded-3xl border border-[#1C2540] bg-[#111628]/60 p-8 space-y-5 hover:border-[#0C6CF2]/50 transition">
                <div className="h-12 w-12 rounded-2xl bg-[#0C6CF2] text-white font-bold flex items-center justify-center text-base shadow-lg shadow-[#0C6CF2]/30">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">1. Issue & SHA-256 Hash</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The authenticated institution submits recipient, course, and date details. Citadel calculates a deterministic SHA-256 cryptographic hash across the certificate data.
                </p>
              </div>

              <div className="rounded-3xl border border-[#1C2540] bg-[#111628]/60 p-8 space-y-5 hover:border-[#0C6CF2]/50 transition">
                <div className="h-12 w-12 rounded-2xl bg-[#00D2FF] text-[#070A13] font-bold flex items-center justify-center text-base shadow-lg shadow-[#00D2FF]/30">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">2. Ethereum Consensus</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The transaction is broadcast to the Ethereum blockchain. The `CertificateRegistry` smart contract anchors the hash into an immutable block receipt.
                </p>
              </div>

              <div className="rounded-3xl border border-[#1C2540] bg-[#111628]/60 p-8 space-y-5 hover:border-[#0C6CF2]/50 transition">
                <div className="h-12 w-12 rounded-2xl bg-[#A855F7] text-white font-bold flex items-center justify-center text-base shadow-lg shadow-[#A855F7]/30">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">3. Public Verification</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Recipients receive their PDF certificate and QR code. Employers and verifiers can query the public blockchain directly without needing login credentials.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HIGH-IMPACT CTA BANNER                                                    */}
        {/* ========================================================================= */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl border border-[#0C6CF2]/40 bg-gradient-to-r from-[#0C6CF2]/20 via-[#111628] to-[#0C6CF2]/10 p-10 md:p-16 text-center shadow-[0_20px_60px_rgba(12,108,242,0.2)] backdrop-blur-2xl">
              <div className="mx-auto max-w-2xl space-y-6">
                <h2 className="text-3xl font-[900] tracking-tight text-white sm:text-5xl">
                  Ready to anchor credentials to Ethereum?
                </h2>
                <p className="text-slate-300 text-base sm:text-lg">
                  Join certified institutions and universities issuing blockchain-backed credentials with mathematical certainty.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-[#0C6CF2] hover:bg-[#0A58C7] text-white font-bold px-8 rounded-full shadow-lg shadow-[#0C6CF2]/30 transition-all hover:scale-105">
                      Create Issuer Account
                    </Button>
                  </Link>
                  <Link href="/verify">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-[#1C2540] bg-[#111628]/80 text-white hover:bg-[#1C2540] font-semibold px-8 rounded-full"
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

      {/* ========================================================================= */}
      {/* ENTERPRISE FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#1C2540] bg-[#05070D] py-14 text-slate-400 text-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#1C2540]/60">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <CitadelLogo className="h-10 w-10" />
                <span className="text-2xl font-[800] text-white tracking-tight">Citadel</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                The institutional standard for blockchain-anchored digital credentials. Powered by Ethereum smart contracts, Supabase, and Ethers.js.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/dashboard" className="hover:text-white transition">Issuer Dashboard</Link></li>
                <li><Link href="/dashboard/certificates/new" className="hover:text-white transition">Issue Certificate</Link></li>
                <li><Link href="/verify" className="hover:text-white transition">Public Explorer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Smart Contracts</h4>
              <ul className="space-y-2.5 text-xs">
                <li><span className="text-slate-400">OpenZeppelin Standards</span></li>
                <li><span className="text-slate-400">SHA-256 Hashing</span></li>
                <li><span className="text-slate-400">Sepolia EVM Protocol</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Account</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition">Create Account</Link></li>
                <li><Link href="/forgot-password" className="hover:text-white transition">Reset Password</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>&copy; {currentYear} Citadel. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ethereum Sepolia Network Live</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
