'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';
import { createClient } from '@/utils/supabase/client';
import {
  Lock,
  ShieldCheck,
  Building2,
  Mail,
  Network,
  FileCode2,
  Server,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { DataList, DataRow } from '@/components/ui/data-list';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getInitials } from '@/lib/utils';

const MIN_PASSWORD_LENGTH = 8;

export default function SettingsPage() {
  const { organization } = useSupabaseAuth();
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const orgName = organization?.name || 'Your organisation';
  const orgEmail = organization?.email || '';

  const contractAddress =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const isSepolia = process.env.NEXT_PUBLIC_NETWORK_MODE === 'sepolia';
  const networkName = isSepolia ? 'Ethereum Sepolia' : 'Local Hardhat node';
  const rpcEndpoint = isSepolia
    ? 'https://rpc.sepolia.org'
    : 'http://127.0.0.1:8545';

  const handleUpdatePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    const next: typeof errors = {};
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (newPassword !== confirmPassword) {
      next.confirm = 'The two passwords do not match.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setErrors({ password: error.message });
        return;
      }

      toast({
        variant: 'success',
        title: 'Password updated',
        description: 'Use your new password the next time you sign in.',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrors({ password: err?.message || 'The password could not be updated.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Organisation settings"
        description="Your issuing identity, the ledger you write to, and account security."
      />

      {/* ---------------------------------------------------------------- */}
      {/* Issuing identity                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Issuing identity</CardTitle>
            <CardDescription>
              Printed on every certificate and shown to anyone verifying one
            </CardDescription>
          </div>
          <Badge variant="valid">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            Verified issuer
          </Badge>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand text-lg font-semibold text-brand-foreground"
              aria-hidden
            >
              {getInitials(orgName)}
            </span>
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold text-ink">{orgName}</p>
              {orgEmail ? (
                <p className="truncate text-sm text-ink-muted">{orgEmail}</p>
              ) : null}
            </div>
          </div>

          <DataList>
            <DataRow
              icon={<Building2 />}
              label="Organisation name"
              value={orgName}
            />
            <DataRow
              icon={<Mail />}
              label="Administrative contact"
              value={orgEmail}
              fallback="Not set"
            />
            <DataRow
              icon={<ShieldCheck />}
              label="Signing authority"
              value="Certificates are signed by the Citadel registry contract on your behalf"
            />
          </DataList>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* Ledger                                                            */}
      {/* ---------------------------------------------------------------- */}
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Ledger configuration</CardTitle>
            <CardDescription>
              Where credential hashes are written and verified
            </CardDescription>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-success-line bg-success-soft px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.06em] text-success-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
            Connected
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <DataList className="rounded-none border-0">
            <DataRow icon={<Network />} label="Network" value={networkName} />
            <DataRow
              icon={<FileCode2 />}
              label="Registry contract"
              value={contractAddress}
              mono
              copyValue={contractAddress}
            />
            <DataRow
              icon={<Server />}
              label="JSON-RPC endpoint"
              value={rpcEndpoint}
              mono
              copyValue={rpcEndpoint}
            />
          </DataList>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* Security                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Account security</CardTitle>
          <CardDescription>
            Change the password used to sign in to the issuer portal
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdatePassword} noValidate className="max-w-sm space-y-5">
            <Field
              htmlFor="newPassword"
              label="New password"
              required
              error={errors.password}
              hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
            >
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                leading={<Lock />}
                value={newPassword}
                invalid={Boolean(errors.password)}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />
            </Field>

            <Field
              htmlFor="confirmPassword"
              label="Confirm new password"
              required
              error={errors.confirm}
            >
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                leading={<Lock />}
                value={confirmPassword}
                invalid={Boolean(errors.confirm)}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, confirm: undefined }));
                }}
              />
            </Field>

            <Button type="submit" loading={isUpdating}>
              {isUpdating ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
