'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Lock,
  QrCode,
  FileCheck2,
  Mail,
  Calendar,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  Building2,
  GraduationCap,
  Award,
  ChevronRight,
  Activity,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CitadelLogo } from '@/components/ui/citadel-logo';

/* =========================================================================
   CITADEL - BLOCKCHAIN DIGITAL CERTIFICATE ISSUING & VERIFICATION PLATFORM
   Clean, airy Blockchain.com design aesthetic focused 100% on the core product:
   - Digital Certificate Issuance for Universities & Academies
   - Anti-Fraud & Tamper-Resistant Blockchain Hashing
   - Public Verification Engine (Certificate ID & Camera QR Code)
   - Automated PDF & Email Delivery
   - Expiration & Revocation Management (Valid, Expired, Revoked)
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

  const protocolMarquee = [
    { title: 'Universities & Colleges', tag: 'Academic Degrees' },
    { title: 'Professional Academies', tag: 'Skill Certifications' },
    { title: 'Corporate Training', tag: 'Accredited Badges' },
    { title: 'SHA-256 Cryptography', tag: 'Deterministic Sealing' },
    { title: 'Ethereum Smart Contracts', tag: 'Immutable Ledger' },
    { title: 'Instant QR Verification', tag: 'Camera Smartphone Scan' },
    { title: 'Vector PDF Engine', tag: 'High-Res Diplomas' },
    { title: 'Automated SMTP Dispatch', tag: 'Email to Graduates' },
    { title: 'Granular Revocation', tag: 'On-Chain Invalidation' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-white selection:bg-[#C8102E] selection:text-white antialiased overflow-x-hidden font-sans">
      {/* Subtle Ambient Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-64 left-[20%] w-[900px] h-[900px] rounded-full bg-[#C8102E]/8 blur-[220px] animate-glow-pulse" />
      </div>

      {/* ========================================================================= */}
      {/* NAVBAR                                                                    */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#000000]/95 backdrop-blur-xl border-b border-[#1A1A1A]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto flex h-20 max-w-[1240px] items-center justify-between px-6 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
            <CitadelLogo className="h-9 w-9" />
            <span className="text-[22px] font-[900] tracking-[-0.03em] text-white">
              Citadel
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-9 text-[14px] font-semibold text-[#888888]">
            <Link href="#features" className="transition hover:text-white">Features</Link>
            <Link href="#how-it-works" className="transition hover:text-white">How It Works</Link>
            <Link href="#verification" className="transition hover:text-white">Verification</Link>
            <Link href="#status-system" className="transition hover:text-white">Status System</Link>
            <Link href="/verify" className="flex items-center gap-1.5 text-[#C8102E] hover:text-[#FF4D6D] transition font-bold">
              <Activity className="h-3.5 w-3.5" />
              Verify Certificate
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <button className="h-10 px-5 rounded-full text-[14px] font-semibold text-[#888888] transition hover:text-white hover:bg-[#141414]">
                Issuer Login
              </button>
            </Link>
            <Link href="/register">
              <button className="h-10 px-6 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-[14px] font-bold text-white transition-all shadow-[0_0_24px_rgba(200,16,46,0.35)] hover:scale-105 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2 text-[#888888] hover:text-white transition"
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileNav && (
          <div className="md:hidden border-t border-[#1A1A1A] bg-[#000000]/98 px-6 pb-6 pt-4 space-y-4">
            <Link href="#features" className="block text-[15px] text-[#888888] hover:text-white py-2" onClick={() => setMobileNav(false)}>Features</Link>
            <Link href="#how-it-works" className="block text-[15px] text-[#888888] hover:text-white py-2" onClick={() => setMobileNav(false)}>How It Works</Link>
            <Link href="#verification" className="block text-[15px] text-[#888888] hover:text-white py-2" onClick={() => setMobileNav(false)}>Verification</Link>
            <Link href="#status-system" className="block text-[15px] text-[#888888] hover:text-white py-2" onClick={() => setMobileNav(false)}>Status System</Link>
            <Link href="/verify" className="block text-[15px] text-[#C8102E] hover:text-white py-2" onClick={() => setMobileNav(false)}>Verify Certificate</Link>
            <div className="pt-2 flex gap-3">
              <Link href="/login" className="flex-1">
                <button className="w-full h-11 rounded-full border border-[#222222] text-[14px] font-semibold text-[#888888] hover:text-white">
                  Issuer Login
                </button>
              </Link>
              <Link href="/register" className="flex-1">
                <button className="w-full h-11 rounded-full bg-[#C8102E] text-[14px] font-bold text-white shadow-lg">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO (100% Product Focused: Digital Certificate Issuing)       */}
        {/* ========================================================================= */}
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-12 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C8102E]/30 bg-[#C8102E]/10 px-4 py-1.5 text-xs font-semibold text-[#FF4D6D]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Blockchain Credential Infrastructure</span>
                </div>

                <h1 className="text-[52px] sm:text-[72px] lg:text-[84px] font-[900] leading-[0.98] tracking-[-0.04em] text-white">
                  Tamper-Proof <br />
                  <span className="text-[#C8102E]">Certificates</span>
                  <span className="text-white">.</span>
                </h1>

                <p className="max-w-[540px] text-[19px] sm:text-[22px] leading-[1.5] text-[#888888] font-normal mx-auto lg:mx-0">
                  Educational institutions and training organizations issue, manage, and verify blockchain-anchored digital certificates with instant cryptographic proof.
                </p>

                {/* 4 Core Value Propositions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[560px] mx-auto lg:mx-0 text-left text-xs font-semibold text-[#A0A0A0]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C8102E] shrink-0" />
                    <span>0% Counterfeit blockchain guarantee</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C8102E] shrink-0" />
                    <span>1-Second camera QR verification</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C8102E] shrink-0" />
                    <span>Dynamic vector PDF generation</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C8102E] shrink-0" />
                    <span>Automated recipient email dispatch</span>
                  </div>
                </div>

                {/* Search Bar Input */}
                <form
                  onSubmit={handleHeroSearch}
                  className="max-w-[560px] mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 rounded-2xl sm:rounded-full border border-[#222222] bg-[#0E0E0E] p-2 shadow-2xl transition focus-within:border-[#C8102E]"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555555]" />
                    <input
                      type="text"
                      placeholder="Enter Certificate ID (e.g. CERT-2026-OXF942K)"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full bg-transparent pl-11 pr-4 py-3.5 text-[14px] text-white placeholder:text-[#555555] focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#9E1B32] text-white text-[14px] font-bold py-3.5 px-8 rounded-xl sm:rounded-full shrink-0 shadow-lg shadow-[#C8102E]/30 transition hover:scale-105 active:scale-95"
                  >
                    Verify
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Right Column: Interactive Digital Certificate Preview */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[440px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#1E1E1E] bg-gradient-to-b from-[#141414] to-[#0A0A0A] p-7 space-y-6">
                  {/* Certificate Top Header */}
                  <div className="flex items-center justify-between border-b border-[#222222] pb-4">
                    <div className="flex items-center gap-2.5">
                      <CitadelLogo className="h-8 w-8" />
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">Oxford Institute of Tech</p>
                        <p className="text-[10px] text-[#888888]">Verified Issuing Organization</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00D26A]/10 text-[#00D26A] text-[10px] font-extrabold border border-[#00D26A]/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00D26A] animate-pulse" />
                      VALID & MINED
                    </span>
                  </div>

                  {/* Certificate Main Body */}
                  <div className="text-center space-y-2 py-2">
                    <p className="text-[11px] uppercase tracking-widest text-[#888888]">Certificate of Completion</p>
                    <h3 className="text-xl font-[900] text-white">Dr. Alex Rivera</h3>
                    <p className="text-xs text-[#C8102E] font-semibold">Master of Science in Quantum Computing & AI</p>
                  </div>

                  {/* Technical Proof Metadata */}
                  <div className="space-y-2.5 text-[11px] font-mono rounded-2xl bg-[#000000] p-4 border border-[#1E1E1E]">
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Certificate ID:</span>
                      <span className="text-[#C8102E] font-bold">CERT-2026-OXF942K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">SHA-256 Hash:</span>
                      <span className="text-slate-300 truncate max-w-[170px]">0x8f3c7a91b4e2d67a18f09cb8...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Consensus:</span>
                      <span className="text-[#00D26A] font-bold">Ethereum Sepolia EVM</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-[#666666] flex items-center gap-1.5">
                      <QrCode className="h-4 w-4 text-[#C8102E]" />
                      Point camera to verify
                    </span>
                    <Link
                      href="/verify"
                      className="text-[#C8102E] hover:text-[#FF4D6D] font-bold inline-flex items-center gap-1 transition"
                    >
                      Open Verification Portal &rarr;
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: ACCREDITATION & CAPABILITY MARQUEE (Product-focused!)          */}
        {/* ========================================================================= */}
        <section className="border-y border-[#1A1A1A] bg-[#070707] py-6 overflow-hidden">
          <div className="flex animate-marquee gap-8 items-center">
            {[...protocolMarquee, ...protocolMarquee].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-full border border-[#222222] bg-[#0E0E0E] px-5 py-2.5 shrink-0"
              >
                <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
                <span className="text-sm font-bold text-white">{item.title}</span>
                <span className="text-xs text-[#666666] font-mono">{item.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: THE PROBLEM & SOLUTION SHOWCASE                                */}
        {/* ========================================================================= */}
        <section id="features" className="py-28 md:py-36 relative">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="text-center max-w-[760px] mx-auto mb-20 space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#C8102E] font-bold">The Problem & The Solution</p>
              <h2 className="text-[40px] sm:text-[56px] font-[900] tracking-[-0.03em] text-white leading-[1.05]">
                Why Traditional Certificates Fail.
              </h2>
              <p className="text-[#888888] text-[18px] leading-relaxed">
                Traditional PDF certificates can be altered in seconds using basic image editors. Citadel anchors deterministic cryptographic proofs to the Ethereum blockchain, making forgery mathematically impossible.
              </p>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Vulnerabilities */}
              <div className="rounded-3xl border border-[#222222] bg-[#0A0A0A] p-8 sm:p-10 space-y-6">
                <div className="inline-flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <XCircle className="h-5 w-5" />
                  <span>Traditional Paper & PDF Certificates</span>
                </div>
                <ul className="space-y-4 text-sm text-[#888888]">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span><strong>Easily Modified:</strong> Student names, grades, and graduation dates can be altered with any PDF editor.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span><strong>Slow Verification:</strong> Employers wait weeks for university registrars to manually verify credentials.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span><strong>Diploma Mills:</strong> Fake institutions generate convincing counterfeit certificates with zero validation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span><strong>No Revocation Proof:</strong> No transparent way to invalidate credentials if revoked for academic dishonesty.</span>
                  </li>
                </ul>
              </div>

              {/* Citadel Blockchain Solution */}
              <div className="rounded-3xl border border-[#C8102E]/50 bg-gradient-to-b from-[#14080A] to-[#0A0A0A] p-8 sm:p-10 space-y-6 shadow-xl shadow-[#C8102E]/10">
                <div className="inline-flex items-center gap-2 text-[#00D26A] font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Citadel Blockchain Credentials</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00D26A] font-bold">✓</span>
                    <span><strong>Immutable Cryptographic Hash:</strong> SHA-256 fingerprint anchored to Ethereum smart contracts permanently.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00D26A] font-bold">✓</span>
                    <span><strong>1-Second Camera QR Scan:</strong> Anyone can point a smartphone at a diploma to verify its on-chain validity instantly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00D26A] font-bold">✓</span>
                    <span><strong>Verified Organization Registry:</strong> Only authorized institutions can issue or revoke credentials.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00D26A] font-bold">✓</span>
                    <span><strong>Transparent Lifecycle:</strong> Clear real-time status tracking for Valid, Expired, and Revoked certificates.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: 4 CORE NUMBERS & METRICS                                       */}
        {/* ========================================================================= */}
        <section className="py-24 border-y border-[#1A1A1A] bg-[#070707]">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#666666] font-bold">Tamper Resistance</p>
                <p className="text-[44px] sm:text-[56px] font-[900] text-white tracking-tight">100%</p>
                <p className="text-xs text-[#888888]">Mathematically immutable hashes</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#666666] font-bold">Verification Speed</p>
                <p className="text-[44px] sm:text-[56px] font-[900] text-[#00D26A] tracking-tight">&lt; 1.0s</p>
                <p className="text-xs text-[#888888]">Instant camera QR verification</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#666666] font-bold">Counterfeit Rate</p>
                <p className="text-[44px] sm:text-[56px] font-[900] text-[#C8102E] tracking-tight">0.0%</p>
                <p className="text-xs text-[#888888]">Zero forged certificates possible</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#666666] font-bold">Recipient Delivery</p>
                <p className="text-[44px] sm:text-[56px] font-[900] text-white tracking-tight">Auto</p>
                <p className="text-xs text-[#888888]">PDF sent directly via email</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: HOW IT WORKS (Protocol Lifecycle for Issuers & Verifiers)       */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-28 md:py-36">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="text-center max-w-[700px] mx-auto mb-20 space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#C8102E] font-bold">Protocol Lifecycle</p>
              <h2 className="text-[40px] sm:text-[56px] font-[900] tracking-[-0.03em] text-white leading-[1.05]">
                How Citadel Anchors Trust.
              </h2>
              <p className="text-[#888888] text-[18px] leading-relaxed">
                A seamless 3-step lifecycle connecting educational institutions, graduates, and verifiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="rounded-3xl border border-[#222222] bg-[#0A0A0A] p-8 space-y-5 hover:border-[#C8102E]/50 transition">
                <div className="h-12 w-12 rounded-2xl bg-[#C8102E]/20 text-[#FF4D6D] flex items-center justify-center font-[900] text-lg">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">Create & Hash</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  The verified institution enters recipient details and expiration terms. Citadel generates a canonical SHA-256 hash across the certificate metadata.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-3xl border border-[#222222] bg-[#0A0A0A] p-8 space-y-5 hover:border-[#C8102E]/50 transition">
                <div className="h-12 w-12 rounded-2xl bg-[#C8102E]/20 text-[#FF4D6D] flex items-center justify-center font-[900] text-lg">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Anchor on Ethereum</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  The smart contract records the hash and expiration on the blockchain. Vector PDF is generated and automatically emailed to the graduate.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-3xl border border-[#222222] bg-[#0A0A0A] p-8 space-y-5 hover:border-[#C8102E]/50 transition">
                <div className="h-12 w-12 rounded-2xl bg-[#00D26A]/20 text-[#00D26A] flex items-center justify-center font-[900] text-lg">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Public Verification</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Employers and recruiters scan the QR code or enter the Certificate ID to independently verify authenticity directly against the smart contract.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: CERTIFICATE STATUS SYSTEM (Valid, Expired, Revoked)             */}
        {/* ========================================================================= */}
        <section id="status-system" className="py-28 border-t border-[#1A1A1A] bg-[#070707]">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="max-w-[700px] mb-16 space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#C8102E] font-bold">Lifecycle State Management</p>
              <h2 className="text-[38px] sm:text-[54px] font-[900] tracking-[-0.03em] text-white leading-[1.05]">
                Real-Time Certificate Statuses.
              </h2>
              <p className="text-[#888888] text-[17px] leading-relaxed">
                Citadel tracks certificate validity in real-time by cross-referencing on-chain blockchain state with database metadata.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status 1: Valid */}
              <div className="p-8 rounded-3xl bg-[#000000] border border-[#1E1E1E] space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D26A]/10 text-[#00D26A] text-xs font-bold border border-[#00D26A]/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Status: VALID</span>
                </div>
                <h3 className="text-xl font-bold text-white">Active & Authentic</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  The certificate hash matches the smart contract record and the expiration date (if set) is still in the future. Full authenticity confirmed.
                </p>
              </div>

              {/* Status 2: Expired */}
              <div className="p-8 rounded-3xl bg-[#000000] border border-[#1E1E1E] space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                  <Clock className="h-4 w-4" />
                  <span>Status: EXPIRED</span>
                </div>
                <h3 className="text-xl font-bold text-white">Past Expiration Date</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  The certificate was authentic when issued, but its designated validity window (e.g. 2-year accreditation or license) has elapsed.
                </p>
              </div>

              {/* Status 3: Revoked */}
              <div className="p-8 rounded-3xl bg-[#000000] border border-[#1E1E1E] space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                  <XCircle className="h-4 w-4" />
                  <span>Status: REVOKED</span>
                </div>
                <h3 className="text-xl font-bold text-white">On-Chain Invalidation</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  The issuing institution revoked the credential on-chain (e.g. academic misconduct or clerical error) with a publicly recorded reason code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: FOR INSTITUTIONS & UNIVERSITIES                                */}
        {/* ========================================================================= */}
        <section id="verification" className="py-28 border-t border-[#1A1A1A] bg-[#000000]">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="max-w-[700px] mb-16 space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#C8102E] font-bold">Organization Portal Features</p>
              <h2 className="text-[38px] sm:text-[54px] font-[900] tracking-[-0.03em] text-white leading-[1.05]">
                Complete Issuance Suite for Organizations.
              </h2>
              <p className="text-[#888888] text-[17px] leading-relaxed">
                Designed for university registrars, professional academies, and enterprise accreditation teams.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Dynamic PDF Generator with QR Codes', desc: 'Vector-sharp PDF certificates generated with dynamic name scaling, custom branding ribbons, and embedded QR verification links.' },
                { title: 'Automated Recipient Email Notifications', desc: 'Recipients automatically receive their certificate via email with download links and verification instructions.' },
                { title: 'Granular Expiration & Revocation Authority', desc: 'Set lifetime or custom expiration dates, and revoke credentials on-chain with documented audit reason codes.' },
                { title: 'Organization Dashboard & Analytics', desc: 'Track total issued, active, expired, and revoked credentials with real-time on-chain explorer links.' },
              ].map((row, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-7 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#C8102E]/40 transition gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">{row.title}</h3>
                    <p className="text-sm text-[#888888]">{row.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#444444] shrink-0 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: FINAL HIGH-IMPACT CTA                                          */}
        {/* ========================================================================= */}
        <section className="py-28 md:py-36 border-t border-[#1A1A1A] bg-[#070707]">
          <div className="container mx-auto max-w-[900px] px-6 sm:px-8 text-center space-y-8">
            <h2 className="text-[44px] sm:text-[68px] font-[900] tracking-[-0.03em] text-white leading-[1.0]">
              Modernize Your Institution&apos;s Certificates<span className="text-[#C8102E]">.</span>
            </h2>
            <p className="text-base text-[#888888] max-w-[600px] mx-auto">
              Join universities and accredited training organizations issuing tamper-proof digital certificates anchored on the Ethereum blockchain.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link href="/register">
                <button className="w-full sm:w-auto h-12 px-9 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-sm font-bold text-white shadow-xl shadow-[#C8102E]/30 transition hover:scale-105 active:scale-95">
                  Create Issuer Account
                </button>
              </Link>
              <Link href="/verify">
                <button className="w-full sm:w-auto h-12 px-9 rounded-full border border-[#2E2E2E] bg-[#141414] text-sm font-bold text-white hover:bg-[#1E1E1E] transition">
                  Verify a Certificate
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#1A1A1A] bg-[#000000] py-16 text-[13px]">
        <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-14 border-b border-[#1A1A1A]">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <CitadelLogo className="h-8 w-8" />
                <span className="text-[20px] font-[900] text-white tracking-tight">Citadel</span>
              </div>
              <p className="text-[12px] text-[#666666] max-w-[300px] leading-relaxed">
                The modern blockchain platform for issuing and verifying tamper-proof academic and professional certificates.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#888888] mb-4">Platform</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><Link href="/dashboard" className="hover:text-white transition">Issuer Dashboard</Link></li>
                <li><Link href="/dashboard/certificates/new" className="hover:text-white transition">Issue Certificate</Link></li>
                <li><Link href="/verify" className="hover:text-white transition">Public Verification</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#888888] mb-4">Verification</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><Link href="/verify" className="hover:text-white transition">Camera QR Scanner</Link></li>
                <li><Link href="/verify" className="hover:text-white transition">Certificate ID Search</Link></li>
                <li><span className="hover:text-white transition cursor-pointer">Sepolia EVM Protocol</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#888888] mb-4">Account</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><Link href="/login" className="hover:text-white transition">Issuer Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition">Register Organization</Link></li>
                <li><Link href="/forgot-password" className="hover:text-white transition">Reset Password</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#666666]">
            <p>&copy; {currentYear} Citadel. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#00D26A] animate-pulse" />
              <span>Ethereum Sepolia Network Live</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
