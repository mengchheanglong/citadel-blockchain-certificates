import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

/**
 * Three typefaces, three jobs.
 *
 *  Inter          — the interface: labels, tables, controls.
 *  Source Serif 4 — the institution: page titles, recipient names, diplomas.
 *  IBM Plex Mono  — the ledger: certificate IDs, hashes, contract addresses.
 */
const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Citadel — Blockchain Certificate Registry',
    template: '%s · Citadel',
  },
  description:
    'Citadel is the credential registry for universities, academies and training providers. Issue tamper-evident certificates, deliver them automatically, and let anyone verify them against the Ethereum blockchain in seconds.',
  applicationName: 'Citadel',
  keywords: [
    'digital certificates',
    'blockchain credentials',
    'certificate verification',
    'university diploma',
    'academic records',
  ],
  openGraph: {
    title: 'Citadel — Blockchain Certificate Registry',
    description:
      'Issue, manage and verify tamper-evident academic and professional credentials anchored to the Ethereum blockchain.',
    siteName: 'Citadel',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/citadel-logo.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#C8102E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-foreground"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
