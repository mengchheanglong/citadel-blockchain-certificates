'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  QrCode,
  Menu,
  X,
  Clock,
  Ban,
  FileText,
  Mail,
  ShieldCheck,
  ScanLine,
  Fingerprint,
  Link2,
  Send,
  Stamp,
  type LucideIcon,
} from 'lucide-react';
import { Wordmark, CitadelLogo } from '@/components/ui/citadel-logo';

/* ==========================================================================
   CITADEL — PUBLIC LANDING PAGE
   Set on near-black so the burgundy reads as a wax seal rather than a button.
   Headings run in the same serif that appears on the certificates themselves,
   and every section states one idea at display size before elaborating.
   ========================================================================== */

const NAV_LINKS = [
  { label: 'What it does', href: '#capabilities' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Lifecycle', href: '#lifecycle' },
  { label: 'For institutions', href: '#institutions' },
];

/** Rotates through the audiences a credential registry actually serves. */
const AUDIENCES = [
  'For universities awarding degrees',
  'For academies certifying skills',
  'For employers checking a claim',
  'For the graduate who earned it',
];

/** Product facts, not marketing figures — each one is checkable. */
const HERO_STATS = [
  { value: 'SHA-256', label: 'Fingerprint sealed into\nevery certificate' },
  { value: 'Ethereum', label: 'Public ledger the record\nis anchored to' },
  { value: 'PDF + QR', label: 'Delivered to the recipient\nautomatically' },
  { value: '3 states', label: 'Valid, expired, revoked —\nalways current' },
];

const CAPABILITIES_ROW_ONE = [
  'Universities & colleges',
  'Professional academies',
  'Corporate training',
  'Degrees & diplomas',
  'Skill certifications',
  'Accreditation bodies',
];

const CAPABILITIES_ROW_TWO = [
  'SHA-256 fingerprinting',
  'Ethereum smart contracts',
  'QR verification',
  'Vector PDF certificates',
  'Automated email delivery',
  'On-chain revocation',
  'Expiry management',
  'Exportable audit trail',
];

const PILLARS: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
}[] = [
  {
    icon: FileText,
    eyebrow: 'Issue',
    title: 'A credential, sealed in under a minute',
    body: 'Enter the recipient and the award. Citadel derives a SHA-256 fingerprint across the finalised record and writes it to the registry contract.',
  },
  {
    icon: Send,
    eyebrow: 'Deliver',
    title: 'It arrives before anyone asks for it',
    body: 'A vector PDF carrying a verification QR code is emailed to the recipient the moment the issuing transaction confirms.',
  },
  {
    icon: ScanLine,
    eyebrow: 'Verify',
    title: 'Anyone can check it, no account needed',
    body: 'The QR code opens a public page that re-checks the document against the on-chain record and links to the underlying transaction.',
  },
  {
    icon: Stamp,
    eyebrow: 'Withdraw',
    title: 'Revocation goes on the record too',
    body: 'Withdrawing a credential is written to the chain with a reason attached — visible to every verifier from that moment on.',
  },
];

const LIFECYCLE = [
  {
    status: 'Valid',
    icon: CheckCircle2,
    body: 'The fingerprint matches the on-chain record and any expiry date is still in the future.',
    tone: 'light' as const,
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    status: 'Expired',
    icon: Clock,
    body: 'Authentically issued, but past the validity window the institution set for it.',
    tone: 'dark' as const,
    accent: 'border border-night-line bg-night text-amber-400',
  },
  {
    status: 'Revoked',
    icon: Ban,
    body: 'Withdrawn by the issuer on-chain, with the recorded reason shown to anyone who checks.',
    tone: 'dark' as const,
    accent: 'border border-night-line bg-night text-rose-400',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Record the award',
    body: 'A registrar enters the recipient, the programme and any expiry terms. Citadel derives a fingerprint across the finalised record.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Anchor and deliver',
    body: 'The fingerprint is written to Ethereum. A PDF carrying a verification QR code is generated and emailed to the recipient.',
    icon: Link2,
  },
  {
    number: '03',
    title: 'Anyone can check it',
    body: 'An employer scans the code or enters the ID. The document is re-fingerprinted and compared with the ledger in front of them.',
    icon: ScanLine,
  },
];

const INSTITUTION_FEATURES = [
  {
    title: 'Certificate generation with embedded verification',
    body: 'Vector PDFs carrying your institution’s name, the recipient’s award, and a QR code that resolves to a public verification page.',
    icon: FileText,
  },
  {
    title: 'Automatic delivery to recipients',
    body: 'The certificate and its verification link are emailed the moment the issuing transaction confirms — with resend on demand.',
    icon: Mail,
  },
  {
    title: 'Expiry and revocation authority',
    body: 'Set lifetime or fixed-term validity, and revoke a credential on-chain with an auditable reason that verifiers can see.',
    icon: Ban,
  },
  {
    title: 'A registry you can audit and export',
    body: 'Search every credential you have issued, review its transaction trail, and export the ledger as CSV for your records.',
    icon: ShieldCheck,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleHeroSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const id = certInput.trim();
    if (!id) return;
    router.push(`/verify/${encodeURIComponent(id)}`);
  };

  return (
    <div
      data-surface="marketing"
      className="flex min-h-screen flex-col overflow-x-hidden bg-night font-sans text-white antialiased"
    >
      {/* ================================================================ */}
      {/* Navigation                                                        */}
      {/* ================================================================ */}
      <header
        className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
          scrolled
            ? 'border-b border-night-line bg-night/90 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="rounded-md">
            <Wordmark size="md" tone="light" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm text-sm text-night-muted transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/verify"
              className="rounded-full px-4 py-2 text-sm font-medium text-night-muted transition-colors hover:text-white"
            >
              Verify
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-night-line px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              Get started
            </Link>
          </div>

          <button
            className="rounded-md p-2 text-night-muted transition-colors hover:text-white md:hidden"
            onClick={() => setMobileNav((open) => !open)}
            aria-expanded={mobileNav}
            aria-label={mobileNav ? 'Close menu' : 'Open menu'}
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileNav ? (
          <div className="border-t border-night-line bg-night px-5 py-4 md:hidden">
            <nav className="space-y-1" aria-label="Main">
              {[...NAV_LINKS, { label: 'Verify a certificate', href: '/verify' }].map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNav(false)}
                    className="block rounded-md px-2 py-2.5 text-sm text-night-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
            <div className="mt-3 flex gap-2 border-t border-night-line pt-4">
              <Link
                href="/login"
                className="flex-1 rounded-full border border-night-line py-2.5 text-center text-sm font-medium text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-full bg-brand py-2.5 text-center text-sm font-medium text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main id="main" className="flex-1">
        {/* ============================================================== */}
        {/* Hero                                                            */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-16 sm:px-8 lg:pb-24 lg:pt-24">
            <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <h1 className="text-balance font-serif text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
                  Certificates that prove themselves
                </h1>

                {/* The detail the headline used to carry, at a size meant for
                    reading rather than for scanning. */}
                <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-night-muted sm:text-xl">
                  Every credential your institution issues is anchored to a public
                  blockchain record — so anyone can confirm it is genuine, and see
                  at once whether it has expired or been revoked.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
                  >
                    Issue certificates
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href="/verify"
                    className="inline-flex items-center gap-2 rounded-full border border-night-line bg-night-raised px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/30"
                  >
                    <QrCode className="h-4 w-4" aria-hidden />
                    Verify a certificate
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 lg:pb-3">
                <RotatingCaption items={AUDIENCES} />
              </div>
            </div>

            {/* Stage: the answer a verifier actually receives. */}
            <div className="relative mt-16 lg:mt-20">
              <div
                className="aurora pointer-events-none absolute -inset-x-16 inset-y-0"
                aria-hidden
              />
              <div className="relative mx-auto max-w-[860px]">
                <VerificationStage />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Fact bar                                                      */}
          {/* ------------------------------------------------------------ */}
          <div className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-8 lg:pb-28">
            <dl className="grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {HERO_STATS.map((stat, index) => (
                <div
                  key={stat.value}
                  className={[
                    'sm:px-8 lg:px-10',
                    /* Stacked on phones: a rule between each pair. */
                    index > 0 ? 'border-t border-night-line pt-8 sm:border-t-0 sm:pt-0' : '',
                    /* Two-up: rule down the middle. */
                    index % 2 === 1 ? 'sm:border-l sm:border-night-line' : 'sm:pl-0',
                    /* Four-up: a rule before every column but the first. */
                    index > 0
                      ? 'lg:border-l lg:border-night-line lg:pl-10'
                      : 'lg:border-l-0 lg:pl-0',
                  ].join(' ')}
                >
                  <dt className="font-serif text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 whitespace-pre-line text-sm leading-relaxed text-night-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ============================================================== */}
        {/* Capability rails                                                */}
        {/* ============================================================== */}
        <section
          id="capabilities"
          className="border-y border-night-line bg-night-raised py-16 lg:py-20"
          aria-label="What Citadel covers"
        >
          <div className="mx-auto mb-10 max-w-[1200px] px-5 sm:px-8">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything a credential needs, in one registry
            </h2>
            <p className="mt-3 max-w-xl text-md leading-relaxed text-night-muted">
              From the institutions that issue them to the cryptography that keeps
              them honest.
            </p>
          </div>

          {/* The rails are wider than the viewport by design; clip them here so
              they never widen the document. */}
          <div className="mask-edges space-y-3 overflow-hidden">
            <div className="marquee-track gap-3" style={{ animationDuration: '46s' }}>
              {[...CAPABILITIES_ROW_ONE, ...CAPABILITIES_ROW_ONE].map((item, index) => (
                <Pill key={`${item}-${index}`}>{item}</Pill>
              ))}
            </div>
            <div
              className="marquee-track marquee-track--reverse gap-3"
              style={{ animationDuration: '58s' }}
            >
              {[...CAPABILITIES_ROW_TWO, ...CAPABILITIES_ROW_TWO].map((item, index) => (
                <Pill key={`${item}-${index}`} muted>
                  {item}
                </Pill>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* Four pillars                                                    */}
        {/* ============================================================== */}
        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              The whole lifecycle
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
              Issue it, send it, prove it, withdraw it
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-night-muted">
              Four things a registrar has to be able to do. Citadel does all four
              from one screen, and records each of them.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, eyebrow, title, body }) => (
              <article
                key={eyebrow}
                className="group rounded-2xl border border-night-line bg-night-raised p-8 transition-colors hover:border-brand/40 sm:p-10"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-night-muted">
                    {eyebrow}
                  </span>
                </div>
                <h3 className="mt-8 font-serif text-2xl font-semibold leading-snug text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-night-muted">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* Pull quote                                                      */}
        {/* ============================================================== */}
        <section className="border-y border-night-line bg-night-raised py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <p className="font-serif text-3xl font-semibold leading-[1.25] tracking-tight text-white sm:text-4xl lg:text-5xl">
              A certificate should never need a phone call to the registrar&apos;s
              office.
              <br className="hidden sm:block" />{' '}
              <span className="text-brand">It should carry its own proof.</span>
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* Lifecycle                                                       */}
        {/* ============================================================== */}
        <section id="lifecycle" className="py-24 lg:py-32">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                Lifecycle
              </p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
                Every check returns
              </h2>
              <p
                className="mt-2 font-serif text-[6rem] font-semibold leading-none tracking-tight text-brand sm:text-[8rem]"
                aria-hidden
              >
                3
              </p>
              <p className="mt-2 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                unambiguous states
              </p>
              <p className="mt-6 max-w-sm text-md leading-relaxed text-night-muted">
                A verifier never has to interpret what they are looking at, and a
                credential never quietly changes meaning.
              </p>
            </div>

            <div className="space-y-4 lg:col-span-8">
              {LIFECYCLE.map(({ status, icon: Icon, body, tone, accent }) => (
                <article
                  key={status}
                  className={`flex flex-col gap-6 rounded-2xl border p-8 sm:flex-row sm:items-center sm:p-10 ${
                    tone === 'light'
                      ? 'border-transparent bg-white text-ink'
                      : 'border-night-line bg-night-raised text-white'
                  }`}
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${accent}`}
                    aria-hidden
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="space-y-2">
                    <h3
                      className={`font-serif text-2xl font-semibold ${
                        tone === 'light' ? 'text-ink' : 'text-white'
                      }`}
                    >
                      {status}
                    </h3>
                    <p
                      className={`max-w-xl text-sm leading-relaxed ${
                        tone === 'light' ? 'text-ink-muted' : 'text-night-muted'
                      }`}
                    >
                      {body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* How it works                                                    */}
        {/* ============================================================== */}
        <section
          id="how-it-works"
          className="border-y border-night-line bg-night-raised py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                How it works
              </p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
                Three steps, one source of truth
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-night-muted">
                From the registrar&apos;s desk to the employer&apos;s screen, without
                a phone call in between.
              </p>
            </div>

            <ol className="mt-14 grid gap-5 md:grid-cols-3">
              {STEPS.map(({ number, title, body, icon: Icon }) => (
                <li
                  key={number}
                  className="rounded-2xl border border-night-line bg-night p-8 transition-colors hover:border-brand/40 sm:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand"
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-sm text-night-line" aria-hidden>
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-8 font-serif text-2xl font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-night-muted">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============================================================== */}
        {/* Verify strip                                                    */}
        {/* ============================================================== */}
        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:py-28">
          <div className="rounded-3xl border border-night-line bg-gradient-to-b from-brand/[0.10] to-night-raised p-8 sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                  Holding a certificate right now?
                </h2>
                <p className="mt-4 text-md leading-relaxed text-night-muted">
                  Type the reference printed beneath its QR code. No account, no
                  contact with the issuer, no waiting.
                </p>
              </div>

              <div className="lg:col-span-7">
                <form
                  onSubmit={handleHeroSearch}
                  className="flex flex-col gap-2 rounded-2xl border border-night-line bg-night p-2 transition-colors focus-within:border-brand sm:flex-row"
                  role="search"
                >
                  <label htmlFor="hero-verify" className="sr-only">
                    Certificate ID
                  </label>
                  <div className="relative flex-1">
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-night-muted"
                      aria-hidden
                    />
                    <input
                      id="hero-verify"
                      type="text"
                      placeholder="CERT-2026-A3B7K"
                      value={certInput}
                      onChange={(event) => setCertInput(event.target.value)}
                      className="w-full bg-transparent py-3.5 pl-11 pr-3 font-mono text-sm text-white placeholder:text-night-muted/70 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
                  >
                    Verify
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </form>
                <p className="mt-3 pl-1 text-xs text-night-muted">
                  Or{' '}
                  <Link href="/verify" className="rounded-sm text-brand hover:underline">
                    scan the QR code with your camera
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* For institutions                                                */}
        {/* ============================================================== */}
        <section
          id="institutions"
          className="border-t border-night-line py-24 lg:py-32"
        >
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                For institutions
              </p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
                Built around the registrar&apos;s workflow
              </h2>
            </div>

            <div className="mt-14 divide-y divide-night-line border-y border-night-line">
              {INSTITUTION_FEATURES.map(({ title, body, icon: Icon }) => (
                <div
                  key={title}
                  className="group flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:gap-10"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-night-line bg-night-raised text-brand"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-white sm:w-[38%] sm:shrink-0">
                    {title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-night-muted">
                    {body}
                  </p>
                  <ArrowUpRight
                    className="hidden h-4 w-4 shrink-0 text-night-line transition-colors group-hover:text-brand sm:block"
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* Closing                                                         */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden border-t border-night-line py-28 lg:py-36">
          <div
            className="aurora pointer-events-none absolute inset-x-0 -bottom-1/2 top-0 opacity-40"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="font-serif text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Give your credentials
              <br />a way to speak for themselves
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-night-muted">
              Register your institution and issue your first blockchain-anchored
              certificate in a few minutes.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
              >
                Create an issuer account
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-night-line bg-night-raised px-8 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/30"
              >
                <QrCode className="h-4 w-4" aria-hidden />
                Verify a certificate
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================ */}
      {/* Footer                                                            */}
      {/* ================================================================ */}
      <footer className="border-t border-night-line bg-night">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
          <div className="grid gap-10 border-b border-night-line pb-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Wordmark size="md" tone="light" />
              <p className="max-w-xs text-sm leading-relaxed text-night-muted">
                The certificate registry for institutions that are asked to prove
                things.
              </p>
            </div>

            <FooterColumn
              title="Platform"
              links={[
                { label: 'Issuer dashboard', href: '/dashboard' },
                { label: 'Issue a certificate', href: '/dashboard/certificates/new' },
                { label: 'Certificate registry', href: '/dashboard/certificates' },
              ]}
            />
            <FooterColumn
              title="Verification"
              links={[
                { label: 'Verification portal', href: '/verify' },
                { label: 'Scan a QR code', href: '/verify' },
                { label: 'How it works', href: '#how-it-works' },
              ]}
            />
            <FooterColumn
              title="Account"
              links={[
                { label: 'Sign in', href: '/login' },
                { label: 'Register your institution', href: '/register' },
                { label: 'Reset password', href: '/forgot-password' },
              ]}
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs text-night-muted sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Citadel. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              Anchored to Ethereum Sepolia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

/**
 * One line of type that swaps itself out on a timer. The outgoing line
 * leaves upward and the incoming one rises into place, so the eye reads a
 * single sentence being rewritten rather than four separate labels.
 */
function RotatingCaption({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <p className="rotator text-lg text-night-muted sm:text-xl lg:text-right">
      {/* The live text for assistive tech; the animated layers are decorative. */}
      <span className="sr-only">{items[index]}</span>
      {items.map((item, itemIndex) => {
        const state =
          itemIndex === index
            ? 'current'
            : (itemIndex - index + items.length) % items.length === items.length - 1
              ? 'above'
              : 'below';
        return (
          <span
            key={item}
            className="rotator__line lg:justify-end"
            data-state={state}
            aria-hidden
          >
            {item}
          </span>
        );
      })}
    </p>
  );
}

function Pill({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={`flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm ${
        muted
          ? 'border-night-line bg-night text-night-muted'
          : 'border-night-line bg-night-panel text-white'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${muted ? 'bg-night-muted/60' : 'bg-brand'}`}
        aria-hidden
      />
      {children}
    </span>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-2xs font-semibold uppercase tracking-[0.12em] text-white/70">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="rounded-sm text-sm text-night-muted transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The hero stage: a faithful miniature of the verification result an employer
 * receives, rather than an abstract illustration of one.
 */
function VerificationStage() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-px rounded-[26px] bg-gradient-to-b from-white/10 to-transparent"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-[25px] border border-night-line bg-night-raised shadow-2xl">
        {/* Verdict */}
        <div className="flex items-center justify-between gap-4 border-b border-night-line bg-emerald-400/[0.07] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white"
              aria-hidden
            >
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif text-lg font-semibold text-white">
                This certificate is genuine
              </p>
              <p className="mt-0.5 font-mono text-xs text-night-muted">
                CERT-2026-OXF942K
              </p>
            </div>
          </div>
          <span className="hidden shrink-0 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.08em] text-emerald-300 sm:block">
            Valid
          </span>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:grid-cols-2 sm:px-8">
          {/* Credential */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <CitadelLogo className="h-8 w-8" size={48} />
              <div>
                <p className="text-sm font-medium text-white">
                  Oxford Institute of Technology
                </p>
                <p className="text-xs text-night-muted">Issuing institution</p>
              </div>
            </div>

            <div className="rounded-xl border border-night-line bg-night px-5 py-4">
              <p className="text-2xs uppercase tracking-[0.12em] text-night-muted">
                Awarded to
              </p>
              <p className="mt-1.5 font-serif text-xl font-semibold text-white">
                Dr Alex Rivera
              </p>
              <p className="mt-1.5 font-serif text-sm italic text-brand">
                MSc Quantum Computing &amp; Artificial Intelligence
              </p>
            </div>
          </div>

          {/* Proof */}
          <dl className="space-y-3.5 font-mono text-xs">
            {[
              { term: 'Fingerprint', value: '0x8f3c7a91b4e2…cb8f09', icon: Fingerprint },
              { term: 'Block', value: '#6,412,908', icon: Link2 },
              { term: 'Network', value: 'Ethereum Sepolia', icon: ShieldCheck },
              { term: 'Issued', value: '14 June 2026', icon: FileText },
            ].map(({ term, value, icon: Icon }) => (
              <div key={term} className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-night-muted">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {term}
                </dt>
                <dd className="truncate text-white/85">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-night-line px-6 py-4 sm:px-8">
          <span className="flex items-center gap-2 text-xs text-night-muted">
            <QrCode className="h-4 w-4 text-brand" aria-hidden />
            Scan the code on the diploma to reach this page
          </span>
          <Link
            href="/verify"
            className="inline-flex shrink-0 items-center gap-1 rounded-sm text-xs font-medium text-brand transition-colors hover:text-white"
          >
            Open the portal
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
