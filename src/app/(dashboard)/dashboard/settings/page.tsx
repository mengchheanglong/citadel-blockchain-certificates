'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';
import { createClient } from '@/utils/supabase/client';
import {
  Building2,
  Mail,
  Cpu,
  Copy,
  Check,
  Info,
  KeyRound,
  FileCheck2,
  Lock,
  Loader2,
  ShieldCheck,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { CitadelLogo } from '@/components/ui/citadel-logo';

export default function SettingsPage() {
  const { organization } = useSupabaseAuth();
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Change Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const orgName = organization?.name || 'Oxford Institute of Technology';
  const orgEmail = organization?.email || 'admin@oxford.edu';

  // Contract address
  const contractAddress =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const networkMode =
    process.env.NEXT_PUBLIC_NETWORK_MODE === 'sepolia'
      ? 'Sepolia Testnet'
      : 'Hardhat Local / Sepolia EVM';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast({
      title: 'Copied to Clipboard',
      description: `${key} copied.`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: error.message,
        });
        return;
      }

      toast({
        title: 'Password Updated',
        description: 'Your account password has been updated successfully.',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.message || 'Error updating password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-[900] tracking-tight text-slate-900 sm:text-3xl">
          Organization Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your verified institution profile, smart contract connection, and account security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Profile Card */}
        <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-[900] text-slate-900">
                Verified Authority Profile
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Identity details stamped onto issued blockchain certificates
              </CardDescription>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Authority
            </span>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#9E1B32] to-[#C8102E] text-white text-xl font-[900] shadow-sm">
                {orgName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-[900] text-slate-900">{orgName}</h3>
                <p className="text-xs text-slate-500 font-mono">{orgEmail}</p>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block">Authority Type:</span>
                <span className="font-semibold text-slate-800">Higher Education / Accredited Institution</span>
              </div>
              <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block">Verification Engine:</span>
                <span className="font-semibold text-[#C8102E]">Citadel Ethereum Sepolia EVM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Node & Smart Contract Settings */}
        <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-[900] text-slate-900">
                  Smart Contract Ledger Configuration
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  On-chain parameters for CertificateRegistry.sol
                </CardDescription>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-mono font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {networkMode}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 font-sans">
                Deployed Contract Address
              </Label>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-800">
                <span className="truncate text-xs">{contractAddress}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(contractAddress, 'Contract Address')}
                  className="ml-2 text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === 'Contract Address' ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 font-sans">
                Public JSON-RPC Endpoint
              </Label>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-800">
                <span className="truncate text-xs">http://127.0.0.1:8545 / https://rpc.sepolia.org</span>
                <button
                  type="button"
                  onClick={() => handleCopy('https://rpc.sepolia.org', 'RPC Endpoint')}
                  className="ml-2 text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === 'RPC Endpoint' ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <Card className="border-slate-200/90 bg-white shadow-xs rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-[900] text-slate-900">
              Account Security & Password
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Update your organization password
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              {passwordError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {passwordError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-slate-200 text-xs focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-slate-200 text-xs focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUpdatingPassword}
                className="rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-xs"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
