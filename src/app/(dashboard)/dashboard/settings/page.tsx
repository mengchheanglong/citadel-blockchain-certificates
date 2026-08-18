'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';
import {
  Building2,
  Mail,
  Cpu,
  Copy,
  Check,
  Info,
  KeyRound,
  FileCheck2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const { organization } = useSupabaseAuth();
  const { toast } = useToast();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Contract address (can be from env or default)
  const contractAddress =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const networkMode =
    process.env.NEXT_PUBLIC_NETWORK_MODE === 'sepolia'
      ? 'Sepolia Testnet'
      : 'Hardhat Local / Sepolia Testnet';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast({
      title: 'Copied to Clipboard',
      description: `${key} has been copied.`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Organization Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your organization profile, view smart contract parameters, and inspect blockchain infrastructure configurations.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Organization Account Info Card */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Building2 className="h-5 w-5" />
              <CardTitle className="text-lg">Organization Profile</CardTitle>
            </div>
            <CardDescription>
              Details of the authenticated issuing institution
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Organization Name */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Organization Name
                </span>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50/75 px-3 py-2.5">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {organization?.name || 'Issuer Organization'}
                  </span>
                </div>
              </div>

              {/* Admin Email */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Registered Email
                </span>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50/75 px-3 py-2.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-800">
                    {organization?.email || 'admin@organization.edu'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-800 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Issuer Authority Status: Verified (Supabase Auth)</p>
                <p className="mt-0.5 text-blue-700 leading-relaxed">
                  Your organization account is authenticated via Supabase and authorized to sign, anchor, and revoke cryptographic credentials on the blockchain registry.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Configuration Card */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Cpu className="h-5 w-5" />
              <CardTitle className="text-lg">Blockchain Configuration</CardTitle>
            </div>
            <CardDescription>
              Smart contract parameters and Ethereum decentralized ledger settings
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 text-sm">
            {/* Network Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Active Network
                </span>
                <p className="mt-0.5 font-medium text-slate-800">
                  {networkMode}
                </p>
              </div>
              <Badge variant="valid" className="w-fit text-xs">
                Live & Connected
              </Badge>
            </div>

            <Separator />

            {/* Smart Contract Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  CertificateRegistry Contract Address
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(contractAddress, 'Contract Address')}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                >
                  {copiedKey === 'Contract Address' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50/80 p-3">
                <span className="font-mono text-xs text-slate-900 break-all">
                  {contractAddress}
                </span>
              </div>
              <p className="text-[12px] text-slate-500">
                All issued certificates are anchored directly to this smart contract on the blockchain.
              </p>
            </div>

            <Separator />

            {/* Security Parameters */}
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <KeyRound className="h-4 w-4 text-blue-600" />
                  <span>Hash Algorithm</span>
                </div>
                <p className="mt-1 text-slate-600">
                  SHA-256 cryptographic hash calculated across certificate ID, recipient, course, and issuer signature.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <FileCheck2 className="h-4 w-4 text-blue-600" />
                  <span>Storage Model</span>
                </div>
                <p className="mt-1 text-slate-600">
                  Cryptographic proofs anchored on-chain; encrypted metadata persisted securely in PostgreSQL.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
