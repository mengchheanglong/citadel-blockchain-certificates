'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  ChevronRight,
  Lock,
  Zap,
  FileCheck2,
  QrCode,
  Fingerprint,
  CheckCircle2,
  Activity,
  Sparkles,
  Globe2,
  ShieldCheck,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CitadelLogo } from '@/components/ui/citadel-logo';

/* ================================================================
   DESIGN TOKENS — Blockchain.com 2026 Brand System
   ================================================================
   Background:    #0A0D14  (deep space obsidian)
   Surface-1:     #12151E  (card / elevated surface)
   Surface-2:     #1A1D28  (secondary panels)
   Border:        #23262F  (subtle hairline)
   Border-hover:  #363940  (interactive hover)
   Text-primary:  #FFFFFF
   Text-secondary:#8A8F98
   Text-muted:    #5A5F6B
   Accent:        #6916F5  (blockchain.com purple primary)
   Accent-hover:  #7C3AED
   Accent-glow:   rgba(105, 22, 245, 0.35)
   Success:       #00D26A
   Cyan:          #00C2FF
   Font:          Inter, variable weight 400-900
   Border-radius: 8px buttons, 16px cards, 24px hero panels
   ================================================================ */

export default function LandingPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentYear = new Date().getFullYear();

  // Track scroll position for header background opacity
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
    <div className="flex min-h-screen flex-col bg-[#0A0D14] text-white selection:bg-[#6916F5]/40 selection:text-white antialiased overflow-x-hidden">
      {/* =============== AMBIENT BACKGROUND EFFECTS =============== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[300px] left-[15%] w-[800px] h-[800px] rounded-full bg-[#6916F5]/12 blur-[180px] animate-glow-pulse" />
        <div className="absolute top-[40%] -right-[200px] w-[600px] h-[600px] rounded-full bg-[#00C2FF]/8 blur-[160px] animate-glow-pulse [animation-delay:3s]" />
        <div className="absolute -bottom-[300px] left-[5%] w-[700px] h-[700px] rounded-full bg-[#6916F5]/6 blur-[200px]" />
      </div>

      {/* =============== STICKY NAVBAR =============== */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0D14]/90 backdrop-blur-2xl border-b border-[#23262F]/80 shadow-[0_1px_0_rgba(255,255,255,0.03)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <CitadelLogo className="h-10 w-10" />
            <span className="text-[22px] font-extrabold tracking-[-0.02em] text-white">
              Citadel
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#8A8F98]">
            <Link href="#features" className="transition-colors hover:text-white">Features</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-white">How It Works</Link>
            <Link href="#architecture" className="transition-colors hover:text-white">Architecture</Link>
            <Link href="/verify" className="flex items-center gap-1.5 text-[#00C2FF] transition-colors hover:text-white">
              <Activity className="h-3.5 w-3.5" />
              Explorer
            </Link>
          </nav>

          {/* Right CTA Group */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <button className="h-10 px-5 rounded-lg text-[14px] font-medium text-[#8A8F98] transition-all hover:text-white hover:bg-[#1A1D28]">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="h-10 px-6 rounded-lg bg-[#6916F5] text-[14px] font-semibold text-white transition-all hover:bg-[#7C3AED] shadow-[0_0_24px_rgba(105,22,245,0.3)] hover:shadow-[0_0_32px_rgba(105,22,245,0.5)] hover:scale-[1.02] active:scale-[0.98]">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#1A1D28] text-[#8A8F98] transition"
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNav && (
          <div className="lg:hidden border-t border-[#23262F] bg-[#0A0D14]/98 backdrop-blur-2xl px-5 pb-6 pt-4 space-y-4 animate-fade-in-up">
            <Link href="#features" className="block text-[15px] font-medium text-[#8A8F98] hover:text-white transition py-2" onClick={() => setMobileNav(false)}>Features</Link>
            <Link href="#how-it-works" className="block text-[15px] font-medium text-[#8A8F98] hover:text-white transition py-2" onClick={() => setMobileNav(false)}>How It Works</Link>
            <Link href="/verify" className="block text-[15px] font-medium text-[#00C2FF] hover:text-white transition py-2" onClick={() => setMobileNav(false)}>Explorer</Link>
            <div className="pt-2 flex gap-3">
              <Link href="/login" className="flex-1">
                <button className="w-full h-11 rounded-lg border border-[#23262F] text-[14px] font-medium text-[#8A8F98] hover:text-white hover:bg-[#1A1D28] transition">
                  Log In
                </button>
              </Link>
              <Link href="/register" className="flex-1">
                <button className="w-full h-11 rounded-lg bg-[#6916F5] text-[14px] font-semibold text-white hover:bg-[#7C3AED] transition shadow-[0_0_24px_rgba(105,22,245,0.3)]">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        {/* =============== HERO SECTION =============== */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-28 lg:pb-32">
          <div className="container mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 items-center">

              {/* Left — Copy & Search */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                {/* Status Beacon */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#6916F5]/25 bg-[#6916F5]/8 px-4 py-[7px] text-[12px] font-semibold text-[#B89DFF] tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89DFF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B89DFF]" />
                  </span>
                  Decentralized Credential Authority
                </div>

                {/* Headline */}
                <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-[900] leading-[1.06] tracking-[-0.035em] text-white">
                  Be your own{' '}
                  <span className="bg-gradient-to-r from-[#6916F5] via-[#00C2FF] to-[#6916F5] bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                    Certificate Authority
                  </span>
                  <span className="text-[#6916F5]">.</span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-[540px] text-[17px] sm:text-[19px] leading-[1.65] text-[#8A8F98] font-normal mx-auto lg:mx-0">
                  Issue, anchor, and verify tamper-proof academic and professional credentials on the Ethereum blockchain — instantly.
                </p>

                {/* Search Bar */}
                <form
                  onSubmit={handleHeroSearch}
                  className="max-w-[560px] mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 rounded-2xl border border-[#23262F] bg-[#12151E] p-2 transition-all focus-within:border-[#6916F5]/60 focus-within:shadow-[0_0_30px_rgba(105,22,245,0.15)]"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#5A5F6B]" />
                    <input
                      type="text"
                      placeholder="Enter Certificate ID or Transaction Hash"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full bg-transparent pl-12 pr-4 py-3 text-[14px] text-white placeholder:text-[#5A5F6B] focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#6916F5] hover:bg-[#7C3AED] text-white text-[14px] font-semibold py-3 px-6 rounded-xl shrink-0 shadow-[0_0_20px_rgba(105,22,245,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Verify
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Trust chips */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 text-[12px] text-[#5A5F6B] font-medium pt-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00D26A]" />
                    Zero counterfeit risk
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00D26A]" />
                    OpenZeppelin audited
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00D26A]" />
                    Instant QR scan verify
                  </span>
                </div>
              </div>

              {/* Right — On-Chain Receipt Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl border border-[#23262F] bg-[#12151E] p-6 shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-float">
                  {/* Terminal header */}
                  <div className="flex items-center justify-between border-b border-[#23262F] pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="h-[10px] w-[10px] rounded-full bg-[#FF5F57]" />
                      <div className="h-[10px] w-[10px] rounded-full bg-[#FFBD2E]" />
                      <div className="h-[10px] w-[10px] rounded-full bg-[#28CA41]" />
                      <span className="ml-3 text-[11px] font-mono text-[#5A5F6B]">
                        CertificateRegistry.verify()
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00D26A]/10 px-3 py-[3px] text-[10px] font-bold text-[#00D26A] border border-[#00D26A]/20 uppercase tracking-wider">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#00D26A] animate-pulse" />
                      Verified
                    </span>
                  </div>

                  {/* Data fields */}
                  <div className="space-y-3 text-[12px] font-mono">
                    <div className="rounded-xl bg-[#0A0D14] p-3.5 border border-[#23262F]">
                      <span className="text-[10px] text-[#5A5F6B] uppercase tracking-widest">Certificate ID</span>
                      <p className="font-bold text-[#00C2FF] mt-1 text-[14px]">CERT-2026-OXF942K</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl bg-[#0A0D14] p-3 border border-[#23262F]">
                        <span className="text-[10px] text-[#5A5F6B]">Recipient</span>
                        <p className="text-white font-semibold truncate mt-0.5 text-[12px]">Dr. Alex Rivera</p>
                      </div>
                      <div className="rounded-xl bg-[#0A0D14] p-3 border border-[#23262F]">
                        <span className="text-[10px] text-[#5A5F6B]">Program</span>
                        <p className="text-white font-semibold truncate mt-0.5 text-[12px]">Quantum AI</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#0A0D14] p-3.5 border border-[#23262F]">
                      <span className="text-[10px] text-[#5A5F6B] uppercase tracking-widest">SHA-256 Hash</span>
                      <p className="text-[#8A8F98] break-all text-[11px] mt-1">
                        0x8f3c7a91b4e2d67a18f09cb87321a415...
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl bg-[#0A0D14] p-3 border border-[#23262F]">
                        <span className="text-[10px] text-[#5A5F6B]">Network</span>
                        <p className="text-[#B89DFF] font-semibold mt-0.5 text-[12px]">Sepolia EVM</p>
                      </div>
                      <div className="rounded-xl bg-[#0A0D14] p-3 border border-[#23262F]">
                        <span className="text-[10px] text-[#5A5F6B]">Status</span>
                        <p className="text-[#00D26A] font-semibold mt-0.5 text-[12px]">ACTIVE</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer action */}
                  <div className="mt-5 pt-4 border-t border-[#23262F] flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2 text-[#5A5F6B]">
                      <QrCode className="h-4 w-4 text-[#6916F5]" />
                      <span>Scan to verify</span>
                    </div>
                    <Link href="/verify" className="text-[#6916F5] hover:text-[#B89DFF] font-semibold inline-flex items-center gap-1 transition">
                      Open Explorer
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =============== LIVE STATS TICKER =============== */}
        <section className="border-y border-[#23262F] bg-[#0A0D14]/80 py-10 backdrop-blur-sm">
          <div className="container mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '0.0%', label: 'Fraud Rate', color: 'text-white' },
                { value: '100%', label: 'On-Chain Consensus', color: 'text-[#00C2FF]' },
                { value: '<1.0s', label: 'Verification Speed', color: 'text-white' },
                { value: '256-Bit', label: 'SHA Proof', color: 'text-[#B89DFF]' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className={`text-[32px] sm:text-[40px] font-[900] tracking-[-0.03em] ${stat.color} animate-count-up`} style={{ animationDelay: `${i * 0.12}s` }}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#5A5F6B] font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =============== FEATURES — BENTO GRID =============== */}
        <section id="features" className="py-24 lg:py-32 relative">
          <div className="container mx-auto max-w-[1280px] px-5 sm:px-8">
            {/* Section header */}
            <div className="text-center max-w-[640px] mx-auto mb-16 lg:mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#6916F5]/20 bg-[#6916F5]/8 px-3.5 py-1 text-[11px] font-semibold text-[#B89DFF] uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                Platform Capabilities
              </div>
              <h2 className="text-[32px] sm:text-[44px] font-[900] tracking-[-0.03em] text-white leading-[1.1]">
                Everything to issue credentials with certainty.
              </h2>
              <p className="text-[#8A8F98] text-[16px] leading-relaxed">
                Built for universities, academies, and enterprise accreditation bodies.
              </p>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Large card */}
              <div className="md:col-span-2 group rounded-2xl border border-[#23262F] bg-[#12151E] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-[#6916F5]/40 hover:shadow-[0_0_40px_rgba(105,22,245,0.08)]">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6916F5]/12 text-[#B89DFF] border border-[#6916F5]/20 transition group-hover:bg-[#6916F5]/20">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-[24px] sm:text-[28px] font-[800] text-white tracking-[-0.02em]">
                    Immutable Smart Contract Registry
                  </h3>
                  <p className="text-[#8A8F98] text-[15px] leading-[1.7] max-w-xl">
                    Every certificate hash is anchored to the Ethereum blockchain via custom Solidity smart contracts. OpenZeppelin permissioning ensures only verified authorities can mint or revoke.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-[#23262F] flex flex-wrap items-center gap-4 text-[12px] font-mono text-[#5A5F6B]">
                  <span className="text-[#B89DFF]">Solidity 0.8.20</span>
                  <span className="text-[#23262F]">|</span>
                  <span>EVM Bytecode Verified</span>
                  <span className="text-[#23262F]">|</span>
                  <span>Zero Single Point of Failure</span>
                </div>
              </div>

              {/* Tall card */}
              <div className="group rounded-2xl border border-[#23262F] bg-[#12151E] p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#6916F5]/40 hover:shadow-[0_0_40px_rgba(105,22,245,0.08)]">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20 transition group-hover:bg-[#00C2FF]/20">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <h3 className="text-[22px] font-[800] text-white tracking-[-0.02em]">
                    Camera QR Scanner
                  </h3>
                  <p className="text-[#8A8F98] text-[14px] leading-[1.7]">
                    Embedded QR codes let employers point any smartphone camera at a diploma and verify its on-chain authenticity in real-time.
                  </p>
                </div>
                <Link href="/verify" className="mt-6 text-[13px] font-semibold text-[#6916F5] hover:text-[#B89DFF] inline-flex items-center gap-1.5 transition">
                  Launch Scanner
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Row of 3 smaller cards */}
              {[
                { icon: FileCheck2, title: 'Dynamic PDF Engine', desc: 'Vector PDFs generated on-the-fly with dynamic font scaling, metadata ribbons, and instant email delivery.', color: 'sky' },
                { icon: Zap, title: 'Supabase PostgreSQL', desc: 'Encrypted metadata cached with transaction poolers for sub-second queries and zero cold starts.', color: 'emerald' },
                { icon: Fingerprint, title: 'On-Chain Revocation', desc: 'Granular revocation authority with reason codes recorded permanently and transparently on the ledger.', color: 'purple' },
              ].map((f, i) => (
                <div key={i} className="group rounded-2xl border border-[#23262F] bg-[#12151E] p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#6916F5]/40 hover:shadow-[0_0_40px_rgba(105,22,245,0.08)]">
                  <div className="space-y-3.5">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-${f.color}-500/10 text-${f.color}-400 border border-${f.color}-500/20 transition group-hover:bg-${f.color}-500/20`}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[18px] font-bold text-white">{f.title}</h3>
                    <p className="text-[#8A8F98] text-[13px] leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =============== HOW IT WORKS =============== */}
        <section id="how-it-works" className="py-24 border-t border-[#23262F] bg-[#0A0D14]">
          <div className="container mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="text-center max-w-[560px] mx-auto mb-16 space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#B89DFF]">
                Protocol Lifecycle
              </h2>
              <p className="text-[32px] sm:text-[40px] font-[900] tracking-[-0.03em] text-white leading-[1.1]">
                How Citadel anchors trust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Issue & Hash', desc: 'Institution submits recipient details. A deterministic SHA-256 hash is computed across the certificate metadata.', color: '#6916F5' },
                { step: '02', title: 'Ethereum Consensus', desc: 'The transaction is broadcast to the blockchain. The CertificateRegistry smart contract anchors the hash in an immutable block.', color: '#00C2FF' },
                { step: '03', title: 'Public Verification', desc: 'Recipients receive their PDF and QR code. Anyone can independently verify authenticity — no login required.', color: '#00D26A' },
              ].map((s, i) => (
                <div key={i} className="group rounded-2xl border border-[#23262F] bg-[#12151E] p-8 space-y-5 transition-all duration-300 hover:border-[#6916F5]/40">
                  <div
                    className="h-11 w-11 rounded-xl font-[800] text-[14px] flex items-center justify-center text-white"
                    style={{ backgroundColor: s.color, boxShadow: `0 0 20px ${s.color}40` }}
                  >
                    {s.step}
                  </div>
                  <h3 className="text-[20px] font-bold text-white">{s.title}</h3>
                  <p className="text-[14px] text-[#8A8F98] leading-[1.7]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =============== CTA BANNER =============== */}
        <section className="py-24 relative">
          <div className="container mx-auto max-w-[960px] px-5 sm:px-8">
            <div className="relative rounded-3xl border border-[#6916F5]/30 bg-gradient-to-br from-[#6916F5]/15 via-[#12151E] to-[#00C2FF]/5 p-10 md:p-16 text-center overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#6916F5]/5 to-transparent pointer-events-none" />
              <div className="relative z-10 mx-auto max-w-[580px] space-y-6">
                <h2 className="text-[28px] sm:text-[40px] font-[900] tracking-[-0.03em] text-white leading-[1.12]">
                  Ready to anchor credentials on Ethereum?
                </h2>
                <p className="text-[#8A8F98] text-[16px] leading-relaxed">
                  Join universities and accreditation bodies issuing blockchain-backed credentials with mathematical certainty.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <Link href="/register">
                    <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#6916F5] text-[15px] font-bold text-white hover:bg-[#7C3AED] shadow-[0_0_28px_rgba(105,22,245,0.35)] transition-all hover:scale-[1.03] active:scale-[0.98]">
                      Create Issuer Account
                    </button>
                  </Link>
                  <Link href="/verify">
                    <button className="w-full sm:w-auto h-12 px-8 rounded-lg border border-[#23262F] bg-[#12151E] text-[15px] font-semibold text-white hover:bg-[#1A1D28] transition-all">
                      Open Verification Portal
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =============== FOOTER =============== */}
      <footer className="border-t border-[#23262F] bg-[#070A0F] py-14 text-[13px]">
        <div className="container mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#23262F]/60">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <CitadelLogo className="h-9 w-9" />
                <span className="text-[20px] font-extrabold text-white tracking-[-0.02em]">Citadel</span>
              </div>
              <p className="text-[12px] text-[#5A5F6B] max-w-[320px] leading-relaxed">
                The institutional standard for blockchain-anchored digital credentials. Powered by Ethereum, Supabase, and Ethers.js.
              </p>
            </div>

            {[
              {
                title: 'Platform',
                links: [
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Issue Certificate', href: '/dashboard/certificates/new' },
                  { label: 'Public Explorer', href: '/verify' },
                ],
              },
              {
                title: 'Smart Contracts',
                links: [
                  { label: 'OpenZeppelin', href: '#' },
                  { label: 'SHA-256 Hashing', href: '#' },
                  { label: 'Sepolia EVM', href: '#' },
                ],
              },
              {
                title: 'Account',
                links: [
                  { label: 'Sign In', href: '/login' },
                  { label: 'Create Account', href: '/register' },
                  { label: 'Reset Password', href: '/forgot-password' },
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A8F98] mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((l, j) => (
                    <li key={j}>
                      <Link href={l.href} className="text-[#5A5F6B] hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#5A5F6B]">
            <p>&copy; {currentYear} Citadel. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="h-[6px] w-[6px] rounded-full bg-[#00D26A] animate-pulse" />
              <span>Ethereum Sepolia Live</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
