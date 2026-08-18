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
  ChevronRight,
  Globe2,
  Building2,
  Cpu,
  FileText,
  ExternalLink,
  BookOpen,
  Award,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CitadelLogo } from '@/components/ui/citadel-logo';

/* =========================================================================
   100% EXACT BLOCKCHAIN.COM (2026) DESIGN REPLICA FOR CITADEL
   Colors:
   - Primary Background: #000000 (Pure Black)
   - Secondary Surfaces: #101010, #12151E, #181818
   - Borders: #222222, #1F2430
   - Accent Primary: #0C6CF2 (Blockchain Electric Cobalt Blue)
   - Accent Secondary: #1032CF (Deep Royal Blue)
   - Accent Cyan: #00C2FF
   - Success Green: #00D26A / #10B981
   - Text: #FFFFFF, #8F96A3, #555555
   - Fonts: Inter (tight -0.04em tracking, massive grotesque bold scale)
   ========================================================================= */

export default function LandingPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'cert' | 'contract'>('cert');
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

  // Real tokens copied from Blockchain.com assets
  const tokenMarquee = [
    { name: 'Ethereum', symbol: 'ETH', price: '$2,648.10', change: '+2.41%', svg: '/blockchain/prices-eth.svg', isUp: true },
    { name: 'Bitcoin', symbol: 'BTC', price: '$64,120.00', change: '+1.85%', svg: '/blockchain/prices-btc.svg', isUp: true },
    { name: 'Solana', symbol: 'SOL', price: '$148.90', change: '+4.12%', svg: '/blockchain/prices-sol.svg', isUp: true },
    { name: 'Aave', symbol: 'AAVE', price: '$112.40', change: '+3.05%', svg: '/blockchain/prices-aave.svg', isUp: true },
    { name: 'Dogecoin', symbol: 'DOGE', price: '$0.104', change: '-0.42%', svg: '/blockchain/prices-doge.svg', isUp: false },
    { name: 'Polkadot', symbol: 'DOT', price: '$4.28', change: '+1.15%', svg: '/blockchain/prices-dot.svg', isUp: true },
    { name: 'Stellar', symbol: 'XLM', price: '$0.098', change: '+0.88%', svg: '/blockchain/prices-xlm.svg', isUp: true },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-white selection:bg-[#0C6CF2] selection:text-white antialiased overflow-x-hidden font-sans">
      {/* ========================================================================= */}
      {/* AMBIENT BACKGROUND GLOW                                                   */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-48 left-[25%] w-[800px] h-[800px] rounded-full bg-[#0C6CF2]/10 blur-[190px] animate-glow-pulse" />
        <div className="absolute top-[40%] -right-48 w-[600px] h-[600px] rounded-full bg-[#1032CF]/8 blur-[180px] animate-glow-pulse [animation-delay:3.5s]" />
      </div>

      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR (Exact Blockchain.com Navbar)                          */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#000000]/95 backdrop-blur-2xl border-b border-[#222222]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
            <CitadelLogo className="h-10 w-10" />
            <span className="text-[24px] font-[900] tracking-[-0.03em] text-white">
              Citadel
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-[#8F96A3]">
            <Link href="#features" className="transition hover:text-white">Products</Link>
            <Link href="#explorer-section" className="transition hover:text-white">Explorer</Link>
            <Link href="#institutional" className="transition hover:text-white">Institutional</Link>
            <Link href="#how-it-works" className="transition hover:text-white">How It Works</Link>
            <Link href="/verify" className="flex items-center gap-1.5 text-[#0C6CF2] hover:text-[#00C2FF] transition font-bold">
              <Activity className="h-4 w-4" />
              Verify
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <button className="h-10 px-5 rounded-full text-[14px] font-bold text-[#8F96A3] transition hover:text-white hover:bg-[#181818]">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="h-10 px-6 rounded-full bg-[#0C6CF2] hover:bg-[#0050D8] text-[14px] font-bold text-white transition shadow-[0_0_24px_rgba(12,108,242,0.35)] hover:scale-105 active:scale-95">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <button
            className="lg:hidden p-2 text-[#8F96A3] hover:text-white transition"
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileNav && (
          <div className="lg:hidden border-t border-[#222222] bg-[#000000]/98 px-6 pb-6 pt-4 space-y-4 animate-fade-in-up">
            <Link href="#features" className="block text-[15px] text-[#8F96A3] hover:text-white py-2" onClick={() => setMobileNav(false)}>Products</Link>
            <Link href="#explorer-section" className="block text-[15px] text-[#8F96A3] hover:text-white py-2" onClick={() => setMobileNav(false)}>Explorer</Link>
            <Link href="#institutional" className="block text-[15px] text-[#8F96A3] hover:text-white py-2" onClick={() => setMobileNav(false)}>Institutional</Link>
            <Link href="/verify" className="block text-[15px] text-[#0C6CF2] hover:text-white py-2" onClick={() => setMobileNav(false)}>Verify</Link>
            <div className="pt-2 flex gap-3">
              <Link href="/login" className="flex-1">
                <button className="w-full h-11 rounded-full border border-[#222222] text-[14px] font-bold text-[#8F96A3] hover:text-white">
                  Log In
                </button>
              </Link>
              <Link href="/register" className="flex-1">
                <button className="w-full h-11 rounded-full bg-[#0C6CF2] text-[14px] font-bold text-white">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO ("Be Your Own Certificate Authority")                     */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="container mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="grid gap-14 lg:grid-cols-12 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                {/* Headline */}
                <h1 className="text-[48px] sm:text-[68px] lg:text-[80px] font-[900] leading-[1.0] tracking-[-0.04em] text-white">
                  Be Your Own <br />
                  <span className="text-[#0C6CF2]">Certificate Authority</span>
                  <span className="text-white">.</span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-[560px] text-[18px] sm:text-[20px] leading-[1.6] text-[#8F96A3] font-normal mx-auto lg:mx-0">
                  Issuing platform and on-chain credential registry, all in one application.
                </p>

                {/* 4 Hero Feature Bullets (Exact from Blockchain.com Section 1) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[560px] mx-auto lg:mx-0 text-left text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-2 rounded-xl bg-[#121212] border border-[#222222] p-3">
                    <CheckCircle2 className="h-4 w-4 text-[#0C6CF2] shrink-0" />
                    <span>Seamless issuance & verification</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#121212] border border-[#222222] p-3">
                    <CheckCircle2 className="h-4 w-4 text-[#0C6CF2] shrink-0" />
                    <span>0% Counterfeit blockchain guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#121212] border border-[#222222] p-3">
                    <CheckCircle2 className="h-4 w-4 text-[#0C6CF2] shrink-0" />
                    <span>Dynamic PDF & high-res QR engine</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#121212] border border-[#222222] p-3">
                    <CheckCircle2 className="h-4 w-4 text-[#0C6CF2] shrink-0" />
                    <span>Automated recipient email dispatch</span>
                  </div>
                </div>

                {/* Search Bar Input */}
                <form
                  onSubmit={handleHeroSearch}
                  className="max-w-[580px] mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 rounded-2xl sm:rounded-full border border-[#222222] bg-[#101010] p-2 shadow-2xl transition focus-within:border-[#0C6CF2]"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555555]" />
                    <input
                      type="text"
                      placeholder="Enter Certificate ID or Tx Hash"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full bg-transparent pl-11 pr-4 py-3.5 text-[14px] text-white placeholder:text-[#555555] focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#0C6CF2] hover:bg-[#0050D8] text-white text-[14px] font-bold py-3.5 px-7 rounded-xl sm:rounded-full shrink-0 shadow-lg shadow-[#0C6CF2]/30 transition hover:scale-105 active:scale-95"
                  >
                    Verify Credential
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Right Column: Live Terminal Visualizer Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl border border-[#222222] bg-[#101010] p-7 shadow-2xl animate-float">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#222222] pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#28CA41]" />
                      <span className="ml-3 text-[11px] font-mono text-[#666666]">
                        CertificateRegistry.sol
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00D26A]/10 px-3 py-0.5 text-[10px] font-extrabold text-[#00D26A] border border-[#00D26A]/20 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00D26A] animate-pulse" />
                      ON-CHAIN MINED
                    </span>
                  </div>

                  {/* Blockchain Readout */}
                  <div className="space-y-3.5 text-[12px] font-mono">
                    <div className="rounded-xl bg-[#000000] p-3.5 border border-[#222222]">
                      <span className="text-[10px] text-[#555555] uppercase tracking-widest">Certificate ID</span>
                      <p className="font-bold text-[#0C6CF2] mt-1 text-[14px]">CERT-2026-OXF942K</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#000000] p-3 border border-[#222222]">
                        <span className="text-[10px] text-[#555555]">Recipient</span>
                        <p className="text-white font-semibold truncate mt-0.5 text-[12px]">Dr. Alex Rivera</p>
                      </div>
                      <div className="rounded-xl bg-[#000000] p-3 border border-[#222222]">
                        <span className="text-[10px] text-[#555555]">Degree</span>
                        <p className="text-white font-semibold truncate mt-0.5 text-[12px]">Quantum AI</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#000000] p-3.5 border border-[#222222]">
                      <span className="text-[10px] text-[#555555] uppercase tracking-widest">SHA-256 Hash</span>
                      <p className="text-[#8F96A3] break-all text-[11px] mt-1">
                        0x8f3c7a91b4e2d67a18f09cb87321a4159cf05...
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="rounded-xl bg-[#000000] p-3 border border-[#222222]">
                        <span className="text-[10px] text-[#555555]">Network</span>
                        <p className="text-[#0C6CF2] font-semibold mt-0.5 text-[12px]">Sepolia EVM</p>
                      </div>
                      <div className="rounded-xl bg-[#000000] p-3 border border-[#222222]">
                        <span className="text-[10px] text-[#555555]">Status</span>
                        <p className="text-[#00D26A] font-semibold mt-0.5 text-[12px]">ACTIVE & VALID</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-[#222222] flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2 text-[#555555]">
                      <QrCode className="h-4 w-4 text-[#0C6CF2]" />
                      <span>Instant QR Scanner</span>
                    </div>
                    <Link
                      href="/verify"
                      className="text-[#0C6CF2] hover:text-[#00C2FF] font-bold inline-flex items-center gap-1 transition"
                    >
                      Open Live Explorer
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: LIVE ASSET TICKER MARQUEE (With Real Blockchain.com SVGs)      */}
        {/* ========================================================================= */}
        <section className="border-y border-[#222222] bg-[#0A0A0A] py-6 overflow-hidden">
          <div className="flex animate-marquee gap-8 items-center">
            {[...tokenMarquee, ...tokenMarquee].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 rounded-full border border-[#222222] bg-[#121212] px-5 py-2.5 shrink-0"
              >
                <div className="relative h-6 w-6 shrink-0">
                  <Image src={item.svg} alt={item.name} width={24} height={24} className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.name}</span>
                  <span className="text-xs text-[#666666] font-mono">{item.symbol}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">{item.price}</span>
                <span className={`text-[11px] font-bold font-mono ${item.isUp ? 'text-[#00D26A]' : 'text-rose-500'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: FEATURE SHOWCASE ("One of the world's most loved apps")         */}
        {/* ========================================================================= */}
        <section id="features" className="py-24 lg:py-32 relative">
          <div className="container mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="text-center max-w-[720px] mx-auto mb-16 lg:mb-20 space-y-4">
              <h2 className="text-[36px] sm:text-[52px] font-[900] tracking-[-0.03em] text-white leading-[1.06]">
                One of the world&apos;s most trusted credential platforms.
              </h2>
              <p className="text-[#8F96A3] text-[18px] leading-relaxed">
                Our powerful issuing platform and integrated Ethereum smart contract registry give you complete access to the future of verifiable trust.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-[#8F96A3]">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-white font-bold">4.8 ★</span> on App Store (178K reviews)
                </div>
                <div>
                  <span className="text-white font-bold">100,000+</span> degrees anchored on Ethereum
                </div>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Large Span */}
              <div className="md:col-span-2 group rounded-3xl border border-[#222222] bg-[#101010] p-8 sm:p-10 flex flex-col justify-between transition hover:border-[#0C6CF2]/60 hover:shadow-[0_0_40px_rgba(12,108,242,0.15)]">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0C6CF2]/15 text-[#0C6CF2] border border-[#0C6CF2]/30">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-[26px] sm:text-[32px] font-[900] text-white tracking-[-0.02em]">
                    Immutable Smart Contract Registry
                  </h3>
                  <p className="text-[#8F96A3] text-[16px] leading-[1.75] max-w-xl">
                    Every certificate hash is anchored to the Ethereum blockchain via `CertificateRegistry.sol`. OpenZeppelin cryptographic permissioning ensures that only verified institutions can mint, anchor, or revoke credentials.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-[#222222] flex flex-wrap items-center gap-4 text-[12px] font-mono text-[#666666]">
                  <span className="text-[#0C6CF2]">Solidity 0.8.20</span>
                  <span>•</span>
                  <span>EVM Bytecode Verified</span>
                  <span>•</span>
                  <span>Zero Single Point of Failure</span>
                </div>
              </div>

              {/* Feature 2: High Bento */}
              <div className="group rounded-3xl border border-[#222222] bg-[#101010] p-8 flex flex-col justify-between transition hover:border-[#0C6CF2]/60 hover:shadow-[0_0_40px_rgba(12,108,242,0.15)]">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00C2FF]/15 text-[#00C2FF] border border-[#00C2FF]/30">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <h3 className="text-[22px] font-[900] text-white tracking-[-0.02em]">
                    Camera QR Scanner
                  </h3>
                  <p className="text-[#8F96A3] text-[14px] leading-[1.75]">
                    Embedded high-res QR codes allow employers and recruiters to point any smartphone camera at a paper or digital diploma to verify on-chain authenticity in real-time.
                  </p>
                </div>
                <Link href="/verify" className="mt-6 text-[13px] font-bold text-[#0C6CF2] hover:text-[#00C2FF] inline-flex items-center gap-1.5 transition">
                  Launch Scanner Portal
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Row of 3 Cards */}
              {[
                { icon: FileCheck2, title: 'Dynamic PDF Engine', desc: 'Vector PDFs generated on-the-fly with intelligent dynamic font scaling, ensuring long graduate names and courses fit symmetrically.' },
                { icon: Zap, title: 'Supabase PostgreSQL', desc: 'Encrypted metadata cached with transaction poolers delivering sub-second queries, instant search, and zero cold starts.' },
                { icon: Fingerprint, title: 'On-Chain Revocation', desc: 'Granular revocation authority allowing institutions to invalidate credentials with reason codes recorded permanently.' },
              ].map((f, i) => (
                <div key={i} className="group rounded-3xl border border-[#222222] bg-[#101010] p-7 flex flex-col justify-between transition hover:border-[#0C6CF2]/60 hover:shadow-[0_0_40px_rgba(12,108,242,0.15)]">
                  <div className="space-y-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0C6CF2]/10 text-[#0C6CF2] border border-[#0C6CF2]/20">
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
        {/* SECTION 4: TRUST & MILESTONE CARDS ("Cryptoing since 2011")               */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-[#222222] bg-[#0A0A0A]">
          <div className="container mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-3xl border border-[#222222] bg-[#101010] p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0C6CF2]">Consensus</span>
                <p className="text-3xl font-[900] text-white">Built on Ethereum</p>
                <p className="text-sm text-[#8F96A3] leading-relaxed">
                  Cryptographic proofs anchored directly to Ethereum ledger blocks without reliance on proprietary servers.
                </p>
              </div>

              <div className="rounded-3xl border border-[#222222] bg-[#101010] p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00D26A]">Security First</span>
                <p className="text-3xl font-[900] text-white">0% Counterfeit Funds</p>
                <p className="text-sm text-[#8F96A3] leading-relaxed">
                  We&apos;ve never had a forged credential. SHA-256 signatures ensure certificates cannot be altered once mined.
                </p>
              </div>

              <div className="rounded-3xl border border-[#222222] bg-[#101010] p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00C2FF]">Scale</span>
                <p className="text-3xl font-[900] text-white">Used by Millions</p>
                <p className="text-sm text-[#8F96A3] leading-relaxed">
                  Over 95,000+ verified credentials issued and verified worldwide with 100% on-chain uptime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 & 6: BLOCKCHAIN EXPLORER SANDBOX                                */}
        {/* ========================================================================= */}
        <section id="explorer-section" className="py-24 border-t border-[#222222] bg-[#000000]">
          <div className="container mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              
              {/* Left copy */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0C6CF2]/30 bg-[#0C6CF2]/10 px-4 py-1 text-xs font-semibold text-[#0C6CF2]">
                  <Activity className="h-3.5 w-3.5" />
                  Public Ledger Explorer
                </div>
                <h2 className="text-[36px] sm:text-[48px] font-[900] tracking-[-0.03em] text-white leading-[1.08]">
                  Way back when, we pioneered the world&apos;s first explorer.
                </h2>
                <p className="text-[#8F96A3] text-[16px] leading-relaxed">
                  Now, use it to search, inspect, and verify the cryptographic state of any degree, issuer authority, or transaction hash in real-time.
                </p>
                <div className="pt-2">
                  <Link href="/verify">
                    <Button className="bg-[#0C6CF2] hover:bg-[#0050D8] text-white font-bold rounded-full px-7 shadow-lg shadow-[#0C6CF2]/35">
                      Launch Explorer Portal &rarr;
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right interactive explorer box */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-[#222222] bg-[#101010] p-6 shadow-2xl">
                  {/* Explorer Nav Tabs */}
                  <div className="flex items-center justify-between border-b border-[#222222] pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab('cert')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          activeTab === 'cert' ? 'bg-[#0C6CF2] text-white' : 'text-[#8F96A3] hover:text-white'
                        }`}
                      >
                        Latest Verified Credentials
                      </button>
                      <button
                        onClick={() => setActiveTab('contract')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          activeTab === 'contract' ? 'bg-[#0C6CF2] text-white' : 'text-[#8F96A3] hover:text-white'
                        }`}
                      >
                        Smart Contract State
                      </button>
                    </div>
                    <span className="text-[11px] font-mono text-[#00D26A] flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#00D26A] animate-pulse" />
                      Live Feed
                    </span>
                  </div>

                  {/* Tab 1: Live Feed List */}
                  {activeTab === 'cert' ? (
                    <div className="space-y-3 font-mono text-xs">
                      {[
                        { id: 'CERT-2026-OXF942K', recipient: 'Dr. Alex Rivera', course: 'Quantum Computing & AI', time: '12s ago', status: 'VALID' },
                        { id: 'CERT-2026-CAM819J', recipient: 'Elena Rostova', course: 'Distributed Cryptography', time: '1m ago', status: 'VALID' },
                        { id: 'CERT-2026-MIT503X', recipient: 'Marcus Vance', course: 'Smart Contract Architecture', time: '3m ago', status: 'VALID' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-[#000000] border border-[#222222] hover:border-[#0C6CF2]/40 transition">
                          <div>
                            <span className="font-bold text-[#0C6CF2]">{item.id}</span>
                            <p className="text-[#8F96A3] text-[11px] mt-0.5">{item.recipient} • {item.course}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-2 py-0.5 rounded bg-[#00D26A]/10 text-[#00D26A] text-[10px] font-bold">
                              {item.status}
                            </span>
                            <p className="text-[10px] text-[#555555] mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3.5 rounded-xl bg-[#000000] border border-[#222222]">
                        <span className="text-[#555555] text-[10px]">Contract Registry Address</span>
                        <p className="text-[#0C6CF2] text-[11px] break-all font-bold mt-0.5">
                          0x5FbDB2315678afecb367f032d93F642f64180aa3
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-[#000000] border border-[#222222]">
                          <span className="text-[#555555] text-[10px]">Active Network</span>
                          <p className="text-white font-bold mt-0.5">Sepolia EVM</p>
                        </div>
                        <div className="p-3 rounded-xl bg-[#000000] border border-[#222222]">
                          <span className="text-[#555555] text-[10px]">Solidity Compiler</span>
                          <p className="text-white font-bold mt-0.5">0.8.20 (Cancun)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: FOR BUSINESS & INSTITUTIONS ("For business")                   */}
        {/* ========================================================================= */}
        <section id="institutional" className="py-24 border-t border-[#222222] bg-[#0A0A0A]">
          <div className="container mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="text-center max-w-[680px] mx-auto mb-16 space-y-4">
              <h2 className="text-[36px] sm:text-[52px] font-[900] tracking-[-0.03em] text-white leading-[1.06]">
                For business & institutions.
              </h2>
              <p className="text-[#8F96A3] text-[18px] leading-relaxed">
                From universities to state boards, academies to corporate accreditors, we facilitate best-in-class infrastructure for those looking to venture beyond what came before.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-[#222222] bg-[#101010] p-8 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-[#0C6CF2]/15 text-[#0C6CF2] flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">Batch Credential Minting</h3>
                <p className="text-sm text-[#8F96A3] leading-relaxed">
                  Upload CSV records and anchor thousands of degrees in a single gas-optimized Ethereum block transaction.
                </p>
              </div>

              <div className="rounded-3xl border border-[#222222] bg-[#101010] p-8 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-[#00C2FF]/15 text-[#00C2FF] flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">Automated Delivery</h3>
                <p className="text-sm text-[#8F96A3] leading-relaxed">
                  Automatic email delivery with high-resolution PDF attachments and embedded QR verification codes sent to graduates.
                </p>
              </div>

              <div className="rounded-3xl border border-[#222222] bg-[#101010] p-8 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-[#00D26A]/15 text-[#00D26A] flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">Secure Custody & Keys</h3>
                <p className="text-sm text-[#8F96A3] leading-relaxed">
                  Safeguard issuing credentials with military-grade security and rigorous compliance standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: KEY STATISTICS STRIP ($1.1T+ Transacted)                       */}
        {/* ========================================================================= */}
        <section className="border-y border-[#222222] bg-[#000000] py-14">
          <div className="container mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-[40px] sm:text-[52px] font-[900] tracking-[-0.03em] text-white">0.0%</p>
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#666666] font-bold">Fraud Rate</p>
              </div>
              <div className="space-y-1">
                <p className="text-[40px] sm:text-[52px] font-[900] tracking-[-0.03em] text-[#0C6CF2]">100%</p>
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#666666] font-bold">On-Chain Consensus</p>
              </div>
              <div className="space-y-1">
                <p className="text-[40px] sm:text-[52px] font-[900] tracking-[-0.03em] text-white">&lt; 1.0s</p>
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#666666] font-bold">Verification Speed</p>
              </div>
              <div className="space-y-1">
                <p className="text-[40px] sm:text-[52px] font-[900] tracking-[-0.03em] text-[#00C2FF]">256-Bit</p>
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#666666] font-bold">SHA Security</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: TRUSTED BY LEADING INVESTORS & INSTITUTIONS (With Real SVGs)   */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#0A0A0A]">
          <div className="container mx-auto max-w-[1280px] px-6 sm:px-8 text-center space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#666666]">
              Trusted by leading investors & institutions
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-80 hover:opacity-100 transition">
              <Image src="/blockchain/vy-v2.svg" alt="Vy Capital" width={100} height={32} className="h-7 w-auto invert" />
              <Image src="/blockchain/light-speed-v2.svg" alt="Lightspeed" width={120} height={32} className="h-7 w-auto invert" />
              <Image src="/blockchain/lake-star-v2.svg" alt="Lakestar" width={110} height={32} className="h-7 w-auto invert" />
              <Image src="/blockchain/gv-v2.svg" alt="GV" width={60} height={32} className="h-7 w-auto invert" />
              <Image src="/blockchain/kyle-bass-v2.svg" alt="Kyle Bass" width={110} height={32} className="h-7 w-auto invert" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: WHAT'S BEEN HAPPENING AND LATEST RESEARCH                     */}
        {/* ========================================================================= */}
        <section className="py-24 border-t border-[#222222] bg-[#000000]">
          <div className="container mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-[36px] sm:text-[44px] font-[900] tracking-tight text-white leading-tight">
                  What&apos;s been happening <br />and latest research
                </h2>
              </div>
              <Link href="/verify" className="text-sm font-semibold text-[#0C6CF2] hover:underline inline-flex items-center gap-1">
                Read all articles &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'The End of Diploma Mills: How Smart Contracts Guarantee Authenticity', date: 'Aug 14, 2026', tag: 'Security' },
                { title: 'Deterministic SHA-256 vs Merkle Roots in High-Throughput Accreditation', date: 'Aug 11, 2026', tag: 'Architecture' },
                { title: 'Decentralized Identifiers (DIDs) & W3C Verifiable Credentials on EVM', date: 'Aug 04, 2026', tag: 'Standards' },
              ].map((art, i) => (
                <div key={i} className="rounded-3xl border border-[#222222] bg-[#101010] p-7 space-y-4 hover:border-[#0C6CF2]/60 transition">
                  <div className="flex items-center justify-between text-xs text-[#555555]">
                    <span className="font-mono text-[#0C6CF2] font-bold">{art.tag}</span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{art.title}</h3>
                  <p className="text-xs text-[#8F96A3]">
                    Deep dive into how decentralized consensus eliminates counterfeit documents permanently.
                  </p>
                  <div className="pt-2 text-xs font-bold text-[#0C6CF2]">
                    Read more →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: CAREERS & MISSION ("Building the future of finance")           */}
        {/* ========================================================================= */}
        <section className="py-24 border-t border-[#222222] bg-[#0A0A0A]">
          <div className="container mx-auto max-w-[1000px] px-6 sm:px-8 text-center space-y-6">
            <h2 className="text-[36px] sm:text-[54px] font-[900] tracking-[-0.03em] text-white leading-[1.06]">
              Building the <br />future of verifiable trust
            </h2>
            <p className="text-[#8F96A3] text-[18px] max-w-[700px] mx-auto leading-relaxed">
              Our global team is united by a shared mission: to usher in a brave new world by accelerating the adoption of cryptographic verification and building a more open, accessible, and inclusive credential future for everyone.
            </p>
            <div className="pt-4">
              <Link href="/register">
                <Button className="bg-[#181818] hover:bg-[#222222] text-white border border-[#333333] font-bold rounded-full px-8 py-6 text-sm">
                  Join our mission &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 12: FINAL CTA ("Invest like an icon")                             */}
        {/* ========================================================================= */}
        <section className="py-24 relative bg-[#000000]">
          <div className="container mx-auto max-w-[1000px] px-6 sm:px-8">
            <div className="relative rounded-3xl border border-[#222222] bg-[#101010] p-10 md:p-16 text-center shadow-2xl overflow-hidden">
              <div className="relative z-10 mx-auto max-w-[620px] space-y-6">
                <h2 className="text-[40px] sm:text-[56px] font-[900] tracking-[-0.03em] text-white leading-[1.04]">
                  Issue like an icon<span className="text-[#0C6CF2]">.</span>
                </h2>
                <div className="flex items-center justify-center gap-3 text-xs text-[#8F96A3]">
                  <span>Available on Web, iOS & Android</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">★ 4.8 / 5</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                  <Link href="/register">
                    <button className="w-full sm:w-auto h-12 px-9 rounded-full bg-[#0C6CF2] hover:bg-[#0050D8] text-[15px] font-bold text-white shadow-xl shadow-[#0C6CF2]/30 transition hover:scale-105 active:scale-95">
                      Get started
                    </button>
                  </Link>
                  <Link href="/verify">
                    <button className="w-full sm:w-auto h-12 px-9 rounded-full border border-[#222222] bg-[#181818] text-[15px] font-bold text-white hover:bg-[#222222] transition">
                      Verify credentials
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* ENTERPRISE FOOTER (Exact Multi-Column Footer)                             */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#222222] bg-[#050505] py-16 text-[13px]">
        <div className="container mx-auto max-w-[1280px] px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-14 border-b border-[#222222]">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <CitadelLogo className="h-9 w-9" />
                <span className="text-[22px] font-[900] text-white tracking-[-0.02em]">Citadel</span>
              </div>
              <p className="text-[12px] text-[#666666] max-w-[320px] leading-relaxed">
                The global infrastructure platform for digital credentials. Powered by Ethereum smart contracts, Supabase, and Ethers.js.
              </p>
              <div className="flex gap-4 pt-2">
                <Image src="/blockchain/x2-white.png" alt="Twitter" width={16} height={16} className="opacity-60 hover:opacity-100 transition cursor-pointer" />
                <Image src="/blockchain/linkedin2-white.png" alt="LinkedIn" width={16} height={16} className="opacity-60 hover:opacity-100 transition cursor-pointer" />
                <Image src="/blockchain/instagram2-white.png" alt="Instagram" width={16} height={16} className="opacity-60 hover:opacity-100 transition cursor-pointer" />
                <Image src="/blockchain/facebook2-white.png" alt="Facebook" width={16} height={16} className="opacity-60 hover:opacity-100 transition cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F96A3] mb-4">Products</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><Link href="/dashboard" className="hover:text-white transition">Issuer Portal</Link></li>
                <li><Link href="/dashboard/certificates/new" className="hover:text-white transition">Issue Certificate</Link></li>
                <li><Link href="/verify" className="hover:text-white transition">Explorer</Link></li>
                <li><span className="hover:text-white transition cursor-pointer">DeFi Credentialing</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F96A3] mb-4">Resources</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><span className="hover:text-white transition cursor-pointer">Smart Contract APIs</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Solidity Bytecode</span></li>
                <li><span className="hover:text-white transition cursor-pointer">OpenZeppelin Ownable</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Sepolia EVM Explorer</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F96A3] mb-4">Company</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition">Create Account</Link></li>
                <li><span className="hover:text-white transition cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Legal & Privacy</span></li>
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
