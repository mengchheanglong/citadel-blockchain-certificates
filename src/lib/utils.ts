import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "19 August 2026" — unambiguous across regions, which matters on a record. */
export function formatDate(date: Date | string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '—';
  return value.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Compact form for dense tables: "19 Aug 2026". */
export function formatDateShort(date: Date | string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '—';
  return value.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Date with time, for audit trails where ordering within a day matters. */
export function formatDateTime(date: Date | string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '—';
  return value.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** "3 days ago" — used alongside, never instead of, the absolute date. */
export function formatRelative(date: Date | string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '';

  const seconds = Math.round((Date.now() - value.getTime()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  const formatter = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' });
  for (const [unit, secondsPerUnit] of units) {
    if (Math.abs(seconds) >= secondsPerUnit) {
      return formatter.format(-Math.round(seconds / secondsPerUnit), unit);
    }
  }
  return 'just now';
}

export function shortenHash(hash: string, chars: number = 6): string {
  if (!hash) return '';
  if (hash.length <= chars * 2 + 4) return hash;
  return `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}`;
}

export function getEtherscanUrl(
  txHash: string,
  network: string = 'sepolia'
): string {
  const baseUrl =
    network?.toLowerCase().includes('sepolia')
      ? 'https://sepolia.etherscan.io'
      : 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
}

export function getEtherscanAddressUrl(
  address: string,
  network: string = 'sepolia'
): string {
  const baseUrl =
    network?.toLowerCase().includes('sepolia')
      ? 'https://sepolia.etherscan.io'
      : 'https://etherscan.io';
  return `${baseUrl}/address/${address}`;
}

/** Turns a raw chain identifier ("sepolia") into a presentable name. */
export function formatNetworkName(network?: string | null): string {
  if (!network) return 'Ethereum Sepolia';

  const key = network.toLowerCase().trim();
  const known: Record<string, string> = {
    sepolia: 'Ethereum Sepolia',
    mainnet: 'Ethereum Mainnet',
    homestead: 'Ethereum Mainnet',
    hardhat: 'Local Hardhat node',
    localhost: 'Local Hardhat node',
    unknown: 'Local Hardhat node',
  };

  if (known[key]) return known[key];
  return network.charAt(0).toUpperCase() + network.slice(1);
}

/**
 * Tailwind classes for a credential status.
 * Prefer the `StatusBadge` component; this exists for non-component contexts.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'VALID':
      return 'text-success-fg bg-success-soft';
    case 'EXPIRED':
      return 'text-warning-fg bg-warning-soft';
    case 'REVOKED':
      return 'text-danger-fg bg-danger-soft';
    default:
      return 'text-ink-muted bg-surface-muted';
  }
}

/** Initials for an avatar, capped at two characters. */
export function getInitials(name: string): string {
  if (!name?.trim()) return '—';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Builds a CSV file and hands it to the browser.
 * Values are quoted and internal quotes doubled, per RFC 4180, so a course
 * title containing a comma cannot corrupt the export.
 */
export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][]
): void {
  const escape = (cell: string | number | null | undefined) =>
    `"${String(cell ?? '').replace(/"/g, '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map(escape).join(','))
    .join('\r\n');

  const blob = new Blob([`﻿${csv}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
