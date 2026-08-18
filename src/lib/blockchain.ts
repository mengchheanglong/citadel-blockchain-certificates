import { ethers } from 'ethers';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// ABI will be loaded after contract compilation
let contractABI: any[] = [];

try {
  // Try to load compiled contract ABI from src/contracts/
  const artifactPath = path.join(process.cwd(), 'src', 'contracts', 'CertificateRegistry.json');
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    contractABI = artifact.abi;
  } else {
    console.warn('Contract ABI not found at', artifactPath, '. Run deploy script first.');
  }
} catch {
  // Contract not yet compiled - will be available after deployment
  console.warn('Contract ABI not found. Deploy the contract first.');
}

const RPC_URL =
  process.env.NETWORK_MODE === 'hardhat'
    ? 'http://127.0.0.1:8545'
    : process.env.SEPOLIA_RPC_URL || 'http://127.0.0.1:8545';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getReadOnlyContract() {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
}

export function getIssuerContract() {
  const provider = getProvider();
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
}

export function computeCertificateHash(data: {
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  issuerName: string;
  issueDate: string;
  expiryDate?: string | null;
}): string {
  const canonical = JSON.stringify(data, Object.keys(data).sort());
  return '0x' + createHash('sha256').update(canonical).digest('hex');
}

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CERT-${year}-${random}`;
}

export async function issueCertOnChain(
  certId: string,
  certHash: string,
  expiryUnix: number
): Promise<{ txHash: string; blockNumber: number }> {
  const contract = getIssuerContract();
  const certIdHash = ethers.keccak256(ethers.toUtf8Bytes(certId));

  const tx = await contract.issueCertificate(certIdHash, certHash, expiryUnix);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: Number(receipt.blockNumber),
  };
}

export async function verifyCertOnChain(
  certId: string,
  certHash: string
): Promise<{ isValid: boolean; status: number }> {
  const contract = getReadOnlyContract();
  const certIdHash = ethers.keccak256(ethers.toUtf8Bytes(certId));

  const [isValid, status] = await contract.verifyCertificate(certIdHash, certHash);
  return { isValid, status: Number(status) };
}

export async function revokeCertOnChain(
  certId: string
): Promise<{ txHash: string; blockNumber: number }> {
  const contract = getIssuerContract();
  const certIdHash = ethers.keccak256(ethers.toUtf8Bytes(certId));

  const tx = await contract.revokeCertificate(certIdHash);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: Number(receipt.blockNumber),
  };
}

export async function getCertFromChain(certId: string) {
  const contract = getReadOnlyContract();
  const certIdHash = ethers.keccak256(ethers.toUtf8Bytes(certId));

  const result = await contract.getCertificate(certIdHash);
  return {
    certHash: result[0],
    issuer: result[1],
    issueTimestamp: Number(result[2]),
    expirationDate: Number(result[3]),
    isRevoked: result[4],
    revokedTimestamp: Number(result[5]),
    exists: result[6],
  };
}

// Status code mapping
export const CERT_STATUS = {
  NOT_FOUND: 0,
  VALID: 1,
  EXPIRED: 2,
  REVOKED: 3,
  HASH_MISMATCH: 4,
} as const;

export const CERT_STATUS_LABELS: Record<number, string> = {
  0: 'Not Found',
  1: 'Valid',
  2: 'Expired',
  3: 'Revoked',
  4: 'Hash Mismatch',
};
