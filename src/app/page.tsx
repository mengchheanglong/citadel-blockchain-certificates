'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  FileCheck2,
  QrCode,
  Fingerprint,
  Activity,
  ArrowUpRight,
  Menu,
  X,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CitadelLogo } from '@/components/ui/citadel-logo';

/* =========================================================================
   EXACT BLOCKCHAIN.COM (2026) UI / UX SPECIFICATION
   - Title: "Issue like an icon | Citadel"
   - Mission: "The global infrastructure platform for digital credentials"
   - Headline: "Issue like an icon."
   - Subtitle: "We power credential authenticity for everyone: from students, to universities, to global institutions. Here for the future of digital trust."
   - Dark Aesthetic: Deep Charcoal Obsidian (#07090E, #0D1117, #131822)
   - Accent: Electric Indigo-Purple (#6916F5, #7C3AED) + Neon Cyan (#00C2FF)
   - Font: Inter (tight negative tracking -0.04em, bold grotesque style)
   ========================================================================= */

export default function LandingPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    router.push(`/verify/${encodeURIComponent(certInput.trim())}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#07090E] text-white selection:bg-[#6916F5] selection:text-white antialiased overflow-x-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-48 left-[20%] w-[750px] h-[750px] rounded-full bg-[#6916F5]/10 blur-[180px] animate-glow-pulse" />
        <div className="absolute top-[35%] -right-48 w-[600px] h-[600px] rounded-full bg-[#00C2FF]/8 blur-[160px] animate-glow-pulse [animation-delay:3.5s]" />
      </div>

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#07090E]/90 backdrop-blur-2xl border-b border-[#1E2330] shadow-lg shadow-black/40'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto flex h-20 max-w-[1240px] items-center justify-between px-6 sm:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <CitadelLogo className="h-10 w-10" />
            <span className="text-[22px] font-[900] tracking-[-0.03em] text-white">
              Citadel
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#8F96A3]">
            <Link href="#features" className="transition-colors hover:text-white">Features</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-white">How It Works</Link>
            <Link href="#infrastructure" className="transition-colors hover:text-white">Infrastructure</Link>
            <Link href="/verify" className="flex items-center gap-1.5 text-[#00C2FF] transition-colors hover:text-white">
              <Activity className="h-3.5 w-3.5" />
              Explorer
            </Link>
          </nav>

          {/* Right CTA Group */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <button className="h-10 px-5 rounded-full text-[14px] font-semibold text-[#8F96A3] transition-all hover:text-white hover:bg-[#131822]">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="h-10 px-6 rounded-full bg-[#6916F5] hover:bg-[#7C3AED] text-[14px] font-bold text-white transition-all shadow-[0_0_24px_rgba(105,22,245,0.35)] hover:scale-105 active:scale-95">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-[#8F96A3] hover:text-white transition"
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileNav && (
          <div className="lg:hidden border-t border-[#1E2330] bg-[#07090E]/98 px-6 pb-6 pt-4 space-y-4 animate-fade-in-up">
            <Link href="#features" className="block text-[15px] text-[#8F96A3] hover:text-white py-2" onClick={() => setMobileNav(false)}>Features</Link>
            <Link href="#how-it-works" className="block text-[15px] text-[#8F96A3] hover:text-white py-2" onClick={() => setMobileNav(false)}>How It Works</Link>
            <Link href="/verify" className="block text-[15px] text-[#00C2FF] hover:text-white py-2" onClick={() => setMobileNav(false)}>Explorer</Link>
            <div className="pt-2 flex gap-3">
              <Link href="/login" className="flex-1">
                <button className="w-full h-11 rounded-full border border-[#1E2330] text-[14px] font-semibold text-[#8F96A3] hover:text-white">
                  Log In
                </button>
              </Link>
              <Link href="/register" className="flex-1">
                <button className="w-full h-11 rounded-full bg-[#6916F5] text-[14px] font-bold text-white shadow-lg">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                             */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="grid gap-14 lg:grid-cols-12 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#6916F5]/30 bg-[#6916F5]/10 px-4 py-1.5 text-xs font-semibold text-[#B89DFF] tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2FF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C2FF]" />
                  </span>
                  <span>global infrastructure platform for credentials</span>
                </div>

                {/* Massive Headline (Blockchain.com "Invest like an icon" style) */}
                <h1 className="text-[44px] sm:text-[64px] lg:text-[72px] font-[900] leading-[1.04] tracking-[-0.04em] text-white">
                  Issue like <br />
                  <span className="bg-gradient-to-r from-[#6916F5] via-[#00C2FF] to-[#A855F7] bg-clip-text text-transparent">
                    an icon
                  </span>
                  <span className="text-[#6916F5]">.</span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-[560px] text-[17px] sm:text-[19px] leading-[1.65] text-[#8F96A3] font-normal mx-auto lg:mx-0">
                  We power credential authenticity for everyone: from students, to universities, to global institutions. Here for the future of digital trust.
                </p>

                {/* Search Bar */}
                <form
                  onSubmit={handleHeroSearch}
                  className="max-w-[580px] mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 rounded-2xl sm:rounded-full border border-[#1E2330] bg-[#0E121B] p-2 shadow-2xl transition-all focus-within:border-[#6916F5]/60 focus-within:shadow-[0_0_30px_rgba(105,22,245,0.25)]"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6072]" />
                    <input
                      type="text"
                      placeholder="Enter Certificate ID or Transaction Hash"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full bg-transparent pl-11 pr-4 py-3.5 text-[14px] text-white placeholder:text-[#5A6072] focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#6916F5] hover:bg-[#7C3AED] text-white text-[14px] font-bold py-3.5 px-7 rounded-xl sm:rounded-full shrink-0 shadow-[0_0_20px_rgba(105,22,245,0.3)] transition-all hover:scale-105 active:scale-95"
                  >
                    Verify
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Trust Metrics */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[12px] text-[#5A6072] font-semibold pt-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00D26A]" />
                    Zero Counterfeit Guarantee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00D26A]" />
                    Ethereum Sepolia Protocol
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00D26A]" />
                    OpenZeppelin Security
                  </span>
                </div>
              </div>

              {/* Right Column: Live On-Chain Visualizer Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl border border-[#1E2330] bg-gradient-to-b from-[#0E121B] to-[#07090E] p-7 shadow-2xl animate-float">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-[#1E2330] pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#28CA41]" />
                      <span className="ml-3 text-[11px] font-mono text-[#5A6072]">
                        CertificateRegistry.verify()
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00D26A]/10 px-3 py-0.5 text-[10px] font-extrabold text-[#00D26A] border border-[#00D26A]/20 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00D26A] animate-pulse" />
                      ON-CHAIN MINED
                    </span>
                  </div>

                  {/* Blockchain Technical Readout */}
                  <div className="space-y-3.5 text-[12px] font-mono">
                    <div className="rounded-xl bg-[#07090E] p-3.5 border border-[#1E2330]">
                      <span className="text-[10px] text-[#5A6072] uppercase tracking-widest">Certificate ID</span>
                      <p className="font-bold text-[#00C2FF] mt-1 text-[14px]">CERT-2026-OXF942K</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#07090E] p-3 border border-[#1E2330]">
                        <span className="text-[10px] text-[#5A6072]">Recipient</span>
                        <p className="text-white font-semibold truncate mt-0.5 text-[12px]">Dr. Alex Rivera</p>
                      </div>
                      <div className="rounded-xl bg-[#07090E] p-3 border border-[#1E2330]">
                        <span className="text-[10px] text-[#5A6072]">Degree / Course</span>
                        <p className="text-white font-semibold truncate mt-0.5 text-[12px]">Quantum AI</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#07090E] p-3.5 border border-[#1E2330]">
                      <span className="text-[10px] text-[#5A6072] uppercase tracking-widest">SHA-256 Hash</span>
                      <p className="text-[#8F96A3] break-all text-[11px] mt-1">
                        0x8f3c7a91b4e2d67a18f09cb87321a4159cf05...
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="rounded-xl bg-[#07090E] p-3 border border-[#1E2330]">
                        <span className="text-[10px] text-[#5A6072]">Network</span>
                        <p className="text-[#B89DFF] font-semibold mt-0.5 text-[12px]">Sepolia EVM</p>
                      </div>
                      <div className="rounded-xl bg-[#07090E] p-3 border border-[#1E2330]">
                        <span className="text-[10px] text-[#5A6072]">Status</span>
                        <p className="text-[#00D26A] font-semibold mt-0.5 text-[12px]">ACTIVE & VALID</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Scan Explorer Action */}
                  <div className="mt-5 pt-4 border-t border-[#1E2330] flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2 text-[#5A6072]">
                      <QrCode className="h-4 w-4 text-[#6916F5]" />
                      <span>Instant Camera Scanner</span>
                    </div>
                    <Link
                      href="/verify"
                      className="text-[#6916F5] hover:text-[#B89DFF] font-bold inline-flex items-center gap-1 transition"
                    >
                      Open Explorer
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STATS TICKER STRIP                                                        */}
        {/* ========================================================================= */}
        <section className="border-y border-[#1E2330] bg-[#0A0D14]/80 py-10 backdrop-blur-sm">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '0.0%', label: 'Fraud Rate', color: 'text-white' },
                { value: '100%', label: 'On-Chain Consensus', color: 'text-[#00C2FF]' },
                { value: '< 1.0s', label: 'Verification Latency', color: 'text-white' },
                { value: '256-Bit', label: 'SHA Proof', color: 'text-[#B89DFF]' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className={`text-[36px] sm:text-[44px] font-[900] tracking-[-0.03em] ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#5A6072] font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BENTO GRID FEATURE SUITE                                                  */}
        {/* ========================================================================= */}
        <section id="features" className="py-24 lg:py-32 relative">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            {/* Section Header */}
            <div className="text-center max-w-[640px] mx-auto mb-16 lg:mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#6916F5]/25 bg-[#6916F5]/10 px-4 py-1 text-[11px] font-semibold text-[#B89DFF] uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                Enterprise Infrastructure
              </div>
              <h2 className="text-[34px] sm:text-[48px] font-[900] tracking-[-0.03em] text-white leading-[1.08]">
                Everything to issue credentials with certainty.
              </h2>
              <p className="text-[#8F96A3] text-[17px] leading-relaxed">
                Engineered for universities, professional accreditors, and global training institutions.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Large Span */}
              <div className="md:col-span-2 group rounded-3xl border border-[#1E2330] bg-[#0E121B] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-[#6916F5]/50 hover:shadow-[0_0_40px_rgba(105,22,245,0.12)]">
                <div className="space-y-4">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#6916F5]/15 text-[#B89DFF] border border-[#6916F5]/30 p-3 w-fit">
                    <Lock className="h-7 w-7" />
                  </div>
                  <h3 className="text-[26px] sm:text-[30px] font-[900] text-white tracking-[-0.02em]">
                    Immutable Smart Contract Registry
                  </h3>
                  <p className="text-[#8F96A3] text-[15px] leading-[1.75] max-w-xl">
                    Every certificate hash is anchored to the Ethereum blockchain via `CertificateRegistry.sol`. OpenZeppelin cryptographic permissioning ensures that only verified institutions can mint, anchor, or revoke credentials.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-[#1E2330] flex flex-wrap items-center gap-4 text-[12px] font-mono text-[#5A6072]">
                  <span className="text-[#B89DFF]">Solidity 0.8.20</span>
                  <span>•</span>
                  <span>EVM Bytecode Verified</span>
                  <span>•</span>
                  <span>Zero Single Point of Failure</span>
                </div>
              </div>

              {/* Feature 2: High Bento */}
              <div className="group rounded-3xl border border-[#1E2330] bg-[#0E121B] p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#6916F5]/50 hover:shadow-[0_0_40px_rgba(105,22,245,0.12)]">
                <div className="space-y-4">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#00C2FF]/15 text-[#00C2FF] border border-[#00C2FF]/30 p-3 w-fit">
                    <QrCode className="h-7 w-7" />
                  </div>
                  <h3 className="text-[22px] font-[900] text-white tracking-[-0.02em]">
                    Camera QR Scanner
                  </h3>
                  <p className="text-[#8F96A3] text-[14px] leading-[1.75]">
                    Embedded high-res QR codes allow employers and recruiters to point any smartphone camera at a paper or digital diploma to verify on-chain authenticity in real-time.
                  </p>
                </div>
                <Link href="/verify" className="mt-6 text-[13px] font-bold text-[#6916F5] hover:text-[#B89DFF] inline-flex items-center gap-1.5 transition">
                  Launch Scanner Portal
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Row of 3 Cards */}
              {[
                { icon: FileCheck2, title: 'Dynamic PDF Engine', desc: 'Vector PDFs generated on-the-fly with intelligent dynamic font scaling, ensuring names fit symmetrically.' },
                { icon: Zap, title: 'Supabase PostgreSQL', desc: 'Encrypted metadata cached with transaction poolers delivering sub-second queries and zero cold starts.' },
                { icon: Fingerprint, title: 'On-Chain Revocation', desc: 'Granular revocation authority allowing institutions to invalidate credentials with reason codes on-chain.' },
              ].map((f, i) => (
                <div key={i} className="group rounded-3xl border border-[#1E2330] bg-[#0E121B] p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#6916F5]/50 hover:shadow-[0_0_40px_rgba(105,22,245,0.12)]">
                  <div className="space-y-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6916F5]/10 text-[#B89DFF] border border-[#6916F5]/20">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[18px] font-bold text-white">{f.title}</h3>
                    <p className="text-[#8F96A3] text-[13px] leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PROTOCOL WORKFLOW                                                         */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-24 border-t border-[#1E2330] bg-[#07090E]">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="text-center max-w-[560px] mx-auto mb-16 space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#B89DFF]">
                Protocol Lifecycle
              </h2>
              <p className="text-[34px] sm:text-[44px] font-[900] tracking-[-0.03em] text-white leading-[1.08]">
                How Citadel anchors trust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Issue & Hash', desc: 'The verified institution submits recipient data. Citadel calculates a deterministic SHA-256 cryptographic hash across the certificate.', color: '#6916F5' },
                { step: '02', title: 'Ethereum Consensus', desc: 'The transaction is broadcast to the network. The CertificateRegistry smart contract anchors the hash into an immutable block.', color: '#00C2FF' },
                { step: '03', title: 'Public Verification', desc: 'Recipients receive their PDF and QR code. Anyone in the world can independently verify authenticity — no login required.', color: '#00D26A' },
              ].map((s, i) => (
                <div key={i} className="rounded-3xl border border-[#1E2330] bg-[#0E121B] p-8 space-y-5 transition hover:border-[#6916F5]/40">
                  <div
                    className="h-11 w-11 rounded-xl font-[900] text-[14px] flex items-center justify-center text-white"
                    style={{ backgroundColor: s.color, boxShadow: `0 0 20px ${s.color}40` }}
                  >
                    {s.step}
                  </div>
                  <h3 className="text-[20px] font-bold text-white">{s.title}</h3>
                  <p className="text-[14px] text-[#8F96A3] leading-[1.75]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HIGH-IMPACT CTA BANNER                                                    */}
        {/* ========================================================================= */}
        <section className="py-24 relative">
          <div className="container mx-auto max-w-[960px] px-6 sm:px-8">
            <div className="relative rounded-3xl border border-[#6916F5]/40 bg-gradient-to-br from-[#6916F5]/20 via-[#0E121B] to-[#00C2FF]/10 p-10 md:p-16 text-center shadow-[0_20px_60px_rgba(105,22,245,0.25)] backdrop-blur-2xl">
              <div className="relative z-10 mx-auto max-w-[580px] space-y-6">
                <h2 className="text-[32px] sm:text-[44px] font-[900] tracking-[-0.03em] text-white leading-[1.1]">
                  Ready to anchor credentials on Ethereum?
                </h2>
                <p className="text-[#8F96A3] text-[16px] leading-relaxed">
                  Join universities and accreditation bodies issuing blockchain-backed credentials with mathematical certainty.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                  <Link href="/register">
                    <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#6916F5] hover:bg-[#7C3AED] text-[15px] font-bold text-white shadow-[0_0_28px_rgba(105,22,245,0.4)] transition-all hover:scale-105 active:scale-95">
                      Create Issuer Account
                    </button>
                  </Link>
                  <Link href="/verify">
                    <button className="w-full sm:w-auto h-12 px-8 rounded-full border border-[#1E2330] bg-[#0E121B] text-[15px] font-semibold text-white hover:bg-[#131822] transition-all">
                      Open Verification Portal
                    </button>
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
      <footer className="border-t border-[#1E2330] bg-[#05070A] py-14 text-[13px]">
        <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#1E2330]/60">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <CitadelLogo className="h-9 w-9" />
                <span className="text-[20px] font-[900] text-white tracking-[-0.02em]">Citadel</span>
              </div>
              <p className="text-[12px] text-[#5A6072] max-w-[320px] leading-relaxed">
                The institutional standard for blockchain-anchored digital credentials. Powered by Ethereum, Supabase, and Ethers.js.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F96A3] mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs text-[#5A6072]">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard/certificates/new" className="hover:text-white transition-colors">Issue Certificate</Link></li>
                <li><Link href="/verify" className="hover:text-white transition-colors">Public Explorer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F96A3] mb-4">Smart Contracts</h4>
              <ul className="space-y-2.5 text-xs text-[#5A6072]">
                <li><span>OpenZeppelin Standards</span></li>
                <li><span>SHA-256 Hashing</span></li>
                <li><span>Sepolia EVM Protocol</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F96A3] mb-4">Account</h4>
              <ul className="space-y-2.5 text-xs text-[#5A6072]">
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/forgot-password" className="hover:text-white transition-colors">Reset Password</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#5A6072]">
            <p>&copy; {currentYear} Citadel. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00D26A] animate-pulse" />
              <span>Ethereum Sepolia Live</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
