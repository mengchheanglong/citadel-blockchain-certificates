import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function shortenHash(hash: string, chars: number = 6): string {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function getEtherscanUrl(txHash: string, network: string = 'sepolia'): string {
  const baseUrl =
    network === 'sepolia'
      ? 'https://sepolia.etherscan.io'
      : 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'VALID':
      return 'text-valid bg-valid-light';
    case 'EXPIRED':
      return 'text-expired bg-expired-light';
    case 'REVOKED':
      return 'text-revoked bg-revoked-light';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}
