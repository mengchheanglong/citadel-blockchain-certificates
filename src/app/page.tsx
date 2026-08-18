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
  Activity,
  ArrowUpRight,
  Menu,
  X,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { CitadelLogo } from '@/components/ui/citadel-logo';

/* =========================================================================
   BLOCKCHAIN.COM (2026 REFRESH) - LIGHT, AIRY, EDITORIAL VIBE
   - Generous spacing & whitespace
   - Pure black background (#000000)
   - Refined typography (Inter, massive headings, clean sub-labels)
   - Signature Burgundy Red accent (#C8102E, hover #9E1B32)
   - Real assets & imagery from the downloaded Blockchain.com source
   - Minimalist horizontal rows and light editorial layout
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
    <div className="flex min-h-screen flex-col bg-[#000000] text-white selection:bg-[#C8102E] selection:text-white antialiased overflow-x-hidden font-sans">
      {/* Subtle Ambient Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-64 left-[20%] w-[900px] h-[900px] rounded-full bg-[#C8102E]/8 blur-[220px] animate-glow-pulse" />
      </div>

      {/* ========================================================================= */}
      {/* NAVBAR (Exact Blockchain.com Minimalist Header)                           */}
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
            <Link href="#features" className="transition hover:text-white">Products</Link>
            <Link href="#explorer" className="transition hover:text-white">Explorer</Link>
            <Link href="#institutional" className="transition hover:text-white">Institutional</Link>
            <Link href="#research" className="transition hover:text-white">Research</Link>
            <Link href="/verify" className="flex items-center gap-1.5 text-[#C8102E] hover:text-[#FF4D6D] transition font-bold">
              <Activity className="h-3.5 w-3.5" />
              Verify
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <button className="h-10 px-5 rounded-full text-[14px] font-semibold text-[#888888] transition hover:text-white hover:bg-[#141414]">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="h-10 px-6 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-[14px] font-bold text-white transition-all shadow-[0_0_24px_rgba(200,16,46,0.35)] hover:scale-105 active:scale-95">
                Sign Up
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
            <Link href="#features" className="block text-[15px] text-[#888888] hover:text-white py-2" onClick={() => setMobileNav(false)}>Products</Link>
            <Link href="#explorer" className="block text-[15px] text-[#888888] hover:text-white py-2" onClick={() => setMobileNav(false)}>Explorer</Link>
            <Link href="#institutional" className="block text-[15px] text-[#888888] hover:text-white py-2" onClick={() => setMobileNav(false)}>Institutional</Link>
            <Link href="/verify" className="block text-[15px] text-[#C8102E] hover:text-white py-2" onClick={() => setMobileNav(false)}>Verify</Link>
            <div className="pt-2 flex gap-3">
              <Link href="/login" className="flex-1">
                <button className="w-full h-11 rounded-full border border-[#222222] text-[14px] font-semibold text-[#888888] hover:text-white">
                  Log In
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
        {/* SECTION 1: HERO (Exact Blockchain.com "Be Your Own Bank" Layout)          */}
        {/* ========================================================================= */}
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-12 items-center">
              
              {/* Left Column: Big Clean Typography */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <h1 className="text-[52px] sm:text-[72px] lg:text-[88px] font-[900] leading-[0.98] tracking-[-0.04em] text-white">
                  Be Your Own <br />
                  <span className="text-[#C8102E]">Certificate Authority</span>
                  <span className="text-white">.</span>
                </h1>

                <p className="max-w-[540px] text-[19px] sm:text-[22px] leading-[1.5] text-[#888888] font-normal mx-auto lg:mx-0">
                  Issuing platform and on-chain Certificate Registry, all in one application.
                </p>

                {/* 4 Minimalist Bullets (Matching original) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[560px] mx-auto lg:mx-0 text-left text-xs font-semibold text-[#A0A0A0]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C8102E] shrink-0" />
                    <span>Seamless issuance & verification</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C8102E] shrink-0" />
                    <span>0% Counterfeit blockchain proof</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C8102E] shrink-0" />
                    <span>Instant PDF & dynamic QR generation</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#C8102E] shrink-0" />
                    <span>Automated recipient email delivery</span>
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
                      placeholder="Enter Certificate ID or Tx Hash"
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

              {/* Right Column: Original Card Visuals from Blockchain.com */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#1E1E1E]">
                  <Image
                    src="/blockchain/card-content-1-v2.png"
                    alt="Blockchain Card Preview"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#0A0A0A]/90 backdrop-blur-md border border-[#222222]">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#888888] font-mono">CERT-2026-OXF942K</span>
                      <span className="text-[#00D26A] font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00D26A] animate-pulse" />
                        MINED
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">Quantum Computing & AI</p>
                    <p className="text-xs text-[#888888] mt-0.5">Dr. Alex Rivera • Sepolia EVM</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: LIVE ASSET TICKER MARQUEE (16 Real Blockchain SVGs)            */}
        {/* ========================================================================= */}
        <section className="border-y border-[#1A1A1A] bg-[#070707] py-6 overflow-hidden">
          <div className="flex animate-marquee gap-8 items-center">
            {[...tokenMarquee, ...tokenMarquee].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-full border border-[#222222] bg-[#0E0E0E] px-5 py-2.5 shrink-0"
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
        {/* SECTION 3: APP SHOWCASE (Exact Section 3 Layout & download-app Image)     */}
        {/* ========================================================================= */}
        <section id="features" className="py-28 md:py-36 relative">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="grid gap-14 lg:grid-cols-12 items-center">
              
              {/* Left text */}
              <div className="lg:col-span-6 space-y-6">
                <h2 className="text-[40px] sm:text-[56px] font-[900] tracking-[-0.03em] text-white leading-[1.05]">
                  One of the world&apos;s most loved credential apps.
                </h2>
                <p className="text-[#888888] text-[18px] leading-relaxed">
                  Our powerful issuing platform and integrated Ethereum smart contract registry give you complete access to the future of verifiable trust.
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-[#888888]">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-white font-bold">4.8 ★</span> on App Store
                  </div>
                  <div>
                    <span className="text-white font-bold">100K+</span> degrees anchored
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/register">
                    <button className="h-12 px-8 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-sm font-bold text-white shadow-lg transition hover:scale-105 active:scale-95">
                      Get Started Free &rarr;
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right image */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/blockchain/download-app-v1.png"
                    alt="Citadel App"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: TRUST & MILESTONES (Exact 4-Column Minimal Numbers Layout)     */}
        {/* ========================================================================= */}
        <section className="py-24 border-y border-[#1A1A1A] bg-[#070707]">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#666666] font-bold">Anchoring since</p>
                <p className="text-[44px] sm:text-[56px] font-[900] text-white tracking-tight">Genesis</p>
                <p className="text-xs text-[#888888]">Native Ethereum EVM consensus</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#666666] font-bold">Security first</p>
                <p className="text-[44px] sm:text-[56px] font-[900] text-[#00D26A] tracking-tight">0.0%</p>
                <p className="text-xs text-[#888888]">We&apos;ve never had a counterfeit</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#666666] font-bold">Used by millions</p>
                <p className="text-[44px] sm:text-[56px] font-[900] text-[#C8102E] tracking-tight">100K+</p>
                <p className="text-xs text-[#888888]">Verified degrees issued worldwide</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#666666] font-bold">Digital trust hub</p>
                <p className="text-[44px] sm:text-[56px] font-[900] text-white tracking-tight">100%</p>
                <p className="text-xs text-[#888888]">Immutable smart contract uptime</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 & 6: EXPLORER INTRO & LIVE STATUS                               */}
        {/* ========================================================================= */}
        <section id="explorer" className="py-28 md:py-36">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="text-center max-w-[760px] mx-auto mb-20 space-y-6">
              <h2 className="text-[40px] sm:text-[60px] font-[900] tracking-[-0.03em] text-white leading-[1.04]">
                Way back when, we pioneered the world&apos;s first explorer.
              </h2>
              <p className="text-[19px] text-[#888888] leading-relaxed">
                Now, use it to begin your own verifiable credential journey.
              </p>
              <div className="pt-2">
                <Link href="/verify">
                  <button className="h-12 px-8 rounded-full bg-[#181818] hover:bg-[#222222] border border-[#2E2E2E] text-sm font-bold text-white transition">
                    Explore All Blocks &rarr;
                  </button>
                </Link>
              </div>
            </div>

            {/* Clean Minimalist Verified Feed */}
            <div className="max-w-[900px] mx-auto rounded-3xl border border-[#1E1E1E] bg-[#0A0A0A] p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">Live Mined Credentials</span>
                <span className="text-xs text-[#00D26A] font-mono flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#00D26A] animate-pulse" />
                  Sepolia Network Active
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { id: 'CERT-2026-OXF942K', name: 'Dr. Alex Rivera', degree: 'Quantum Computing & AI', time: '14s ago' },
                  { id: 'CERT-2026-CAM819J', name: 'Elena Rostova', degree: 'Distributed Cryptography', time: '1m ago' },
                  { id: 'CERT-2026-MIT503X', name: 'Marcus Vance', degree: 'Smart Contract Architecture', time: '3m ago' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#000000] border border-[#1A1A1A] hover:border-[#C8102E]/50 transition">
                    <div>
                      <span className="font-bold text-[#C8102E]">{row.id}</span>
                      <p className="text-[#888888] text-[11px] mt-0.5">{row.name} • {row.degree}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#00D26A]/10 text-[#00D26A] text-[10px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: FOR BUSINESS (Clean Minimalist Horizontal Rows)                */}
        {/* ========================================================================= */}
        <section id="institutional" className="py-28 border-t border-[#1A1A1A] bg-[#070707]">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="max-w-[700px] mb-16 space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#C8102E] font-bold">Institutional Infrastructure</p>
              <h2 className="text-[38px] sm:text-[54px] font-[900] tracking-[-0.03em] text-white leading-[1.05]">
                For business & universities.
              </h2>
              <p className="text-[#888888] text-[17px] leading-relaxed">
                From token foundations to family offices, universities to state boards, we facilitate best-in-class opportunities for those looking to venture beyond what came before.
              </p>
            </div>

            {/* 4 Clean Minimal Rows */}
            <div className="space-y-4">
              {[
                { title: 'Digital credential treasury solutions', desc: 'Integrate blockchain credentials into your institutional record architecture seamlessly.' },
                { title: 'Batch spot and instant issuance', desc: 'Execute large credential mints with minimal gas impact and verified cryptographic speed.' },
                { title: 'Automated graduate distribution', desc: 'Automatic email delivery with high-resolution PDF attachments and embedded QR verification codes.' },
                { title: 'Secure key custody', desc: 'Safeguard institution issuing authority with military-grade security and rigorous compliance.' },
              ].map((row, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-7 rounded-2xl bg-[#000000] border border-[#1A1A1A] hover:border-[#C8102E]/40 transition gap-4">
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
        {/* SECTION 8 & 9: INVESTOR & INSTITUTION TRUST (Real SVGs)                   */}
        {/* ========================================================================= */}
        <section className="py-24 border-t border-[#1A1A1A]">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8 text-center space-y-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#555555]">
              Trusted by leading investors & institutions
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-70 hover:opacity-100 transition">
              <Image src="/blockchain/vy-v2.svg" alt="Vy Capital" width={100} height={32} className="h-7 w-auto invert" />
              <Image src="/blockchain/light-speed-v2.svg" alt="Lightspeed" width={120} height={32} className="h-7 w-auto invert" />
              <Image src="/blockchain/lake-star-v2.svg" alt="Lakestar" width={110} height={32} className="h-7 w-auto invert" />
              <Image src="/blockchain/gv-v2.svg" alt="GV" width={60} height={32} className="h-7 w-auto invert" />
              <Image src="/blockchain/kyle-bass-v2.svg" alt="Kyle Bass" width={110} height={32} className="h-7 w-auto invert" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: RESEARCH & BLOG                                               */}
        {/* ========================================================================= */}
        <section id="research" className="py-28 border-t border-[#1A1A1A] bg-[#070707]">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-[36px] sm:text-[48px] font-[900] tracking-tight text-white leading-tight">
                  What&apos;s been happening <br />and latest research
                </h2>
              </div>
              <Link href="/verify" className="text-sm font-bold text-[#C8102E] hover:underline inline-flex items-center gap-1">
                Read all insights &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'The End of Diploma Mills: How Smart Contracts Guarantee Authenticity', date: 'Aug 14, 2026', tag: 'Security' },
                { title: 'Deterministic SHA-256 vs Merkle Roots in High-Throughput Accreditation', date: 'Aug 11, 2026', tag: 'Architecture' },
                { title: 'Decentralized Identifiers (DIDs) & W3C Verifiable Credentials on EVM', date: 'Aug 04, 2026', tag: 'Standards' },
              ].map((art, i) => (
                <div key={i} className="rounded-3xl border border-[#1E1E1E] bg-[#000000] p-8 space-y-4 hover:border-[#C8102E]/60 transition">
                  <div className="flex items-center justify-between text-xs text-[#555555]">
                    <span className="font-mono text-[#C8102E] font-bold">{art.tag}</span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{art.title}</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    Deep dive into how decentralized consensus eliminates counterfeit documents permanently.
                  </p>
                  <div className="pt-2 text-xs font-bold text-[#C8102E]">
                    Read more →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: CAREERS (Split Layout with Real Blockchain Photos)             */}
        {/* ========================================================================= */}
        <section className="py-28 border-t border-[#1A1A1A] overflow-hidden">
          <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Photo */}
              <div className="lg:col-span-3 hidden lg:block relative h-[420px] rounded-3xl overflow-hidden border border-[#1E1E1E]">
                <Image
                  src="/blockchain/careers-left-xl-v2.png"
                  alt="Citadel Team"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Center Text */}
              <div className="lg:col-span-6 text-center space-y-6 px-4">
                <h2 className="text-[38px] sm:text-[54px] font-[900] tracking-[-0.03em] text-white leading-[1.05]">
                  Building the <br />future of verifiable trust
                </h2>
                <p className="text-[#888888] text-[17px] leading-relaxed max-w-[480px] mx-auto">
                  Our global team is united by a shared mission: to usher in a brave new world by accelerating the adoption of cryptographic verification.
                </p>
                <div>
                  <Link href="/register">
                    <button className="h-12 px-8 rounded-full bg-[#181818] hover:bg-[#222222] border border-[#2E2E2E] text-sm font-bold text-white transition">
                      Explore jobs &rarr;
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Photo */}
              <div className="lg:col-span-3 hidden lg:block relative h-[420px] rounded-3xl overflow-hidden border border-[#1E1E1E]">
                <Image
                  src="/blockchain/careers-right-xl-v2.png"
                  alt="Citadel Culture"
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 12: FINAL CTA ("Issue like an icon")                              */}
        {/* ========================================================================= */}
        <section className="py-28 md:py-36 border-t border-[#1A1A1A] bg-[#000000]">
          <div className="container mx-auto max-w-[900px] px-6 sm:px-8 text-center space-y-8">
            <h2 className="text-[44px] sm:text-[68px] font-[900] tracking-[-0.03em] text-white leading-[1.0]">
              Issue like an icon<span className="text-[#C8102E]">.</span>
            </h2>
            <p className="text-xs text-[#888888] font-semibold">
              Available on Web, iOS & Android • <span className="text-amber-400 font-bold">★ 4.8 / 5</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link href="/register">
                <button className="w-full sm:w-auto h-12 px-9 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-sm font-bold text-white shadow-xl shadow-[#C8102E]/30 transition hover:scale-105 active:scale-95">
                  Get started
                </button>
              </Link>
              <Link href="/verify">
                <button className="w-full sm:w-auto h-12 px-9 rounded-full border border-[#2E2E2E] bg-[#141414] text-sm font-bold text-white hover:bg-[#1E1E1E] transition">
                  Verify credentials
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* ENTERPRISE FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#1A1A1A] bg-[#040404] py-16 text-[13px]">
        <div className="container mx-auto max-w-[1240px] px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-14 border-b border-[#1A1A1A]">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <CitadelLogo className="h-8 w-8" />
                <span className="text-[20px] font-[900] text-white tracking-tight">Citadel</span>
              </div>
              <p className="text-[12px] text-[#666666] max-w-[300px] leading-relaxed">
                The global infrastructure platform for digital credentials. Powered by Ethereum smart contracts, Supabase, and Ethers.js.
              </p>
              <div className="flex gap-4 pt-2">
                <Image src="/blockchain/x2-white.png" alt="Twitter" width={16} height={16} className="opacity-50 hover:opacity-100 transition cursor-pointer" />
                <Image src="/blockchain/linkedin2-white.png" alt="LinkedIn" width={16} height={16} className="opacity-50 hover:opacity-100 transition cursor-pointer" />
                <Image src="/blockchain/instagram2-white.png" alt="Instagram" width={16} height={16} className="opacity-50 hover:opacity-100 transition cursor-pointer" />
                <Image src="/blockchain/facebook2-white.png" alt="Facebook" width={16} height={16} className="opacity-50 hover:opacity-100 transition cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#888888] mb-4">Products</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><Link href="/dashboard" className="hover:text-white transition">Issuer Portal</Link></li>
                <li><Link href="/dashboard/certificates/new" className="hover:text-white transition">Issue Certificate</Link></li>
                <li><Link href="/verify" className="hover:text-white transition">Explorer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#888888] mb-4">Resources</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><span className="hover:text-white transition cursor-pointer">Smart Contract APIs</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Solidity Bytecode</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Sepolia EVM Protocol</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#888888] mb-4">Company</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition">Create Account</Link></li>
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
