'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const next: typeof errors = {};
    if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (password !== confirmPassword) {
      next.confirm = 'The two passwords do not match.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast({
        variant: 'success',
        title: 'Password updated',
        description: 'Signing you in to your dashboard.',
      });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-7 text-center">
        <div className="flex justify-center">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-success-line bg-success-soft text-success-fg"
            aria-hidden
          >
            <CheckCircle2 className="h-5 w-5" />
          </span>
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Password updated
          </h1>
          <p className="text-sm text-ink-muted">
            Taking you to your dashboard…
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
          Choose a new password
        </h1>
        <p className="text-sm leading-relaxed text-ink-muted">
          This replaces the password for your issuer account.
        </p>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-danger-line bg-danger-soft p-3 text-sm text-danger-fg"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field
          htmlFor="password"
          label="New password"
          required
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            autoFocus
            placeholder="••••••••"
            leading={<Lock />}
            value={password}
            disabled={isLoading}
            invalid={Boolean(errors.password)}
            onChange={(event) => {
              setPassword(event.target.value);
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
            placeholder="••••••••"
            leading={<Lock />}
            value={confirmPassword}
            disabled={isLoading}
            invalid={Boolean(errors.confirm)}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setErrors((prev) => ({ ...prev, confirm: undefined }));
            }}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          {isLoading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}
