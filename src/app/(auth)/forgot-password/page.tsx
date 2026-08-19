'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Mail, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Enter the email address registered to your organisation.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setIsSubmitted(true);
      toast({
        variant: 'success',
        title: 'Reset link sent',
        description: 'Check your inbox for the next step.',
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-7 text-center">
        <div className="flex justify-center">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-success-line bg-success-soft text-success-fg"
            aria-hidden
          >
            <MailCheck className="h-5 w-5" />
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Check your email
          </h1>
          <p className="text-sm leading-relaxed text-ink-muted">
            If an account exists for{' '}
            <span className="metadata text-ink-secondary">{email}</span>, a reset
            link is on its way. It expires in one hour.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">
              <ArrowLeft aria-hidden />
              Back to sign in
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="rounded-sm text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Use a different email address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
          Reset your password
        </h1>
        <p className="text-sm leading-relaxed text-ink-muted">
          Enter your organisation&apos;s email address and we&apos;ll send a secure
          link to choose a new password.
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
        <Field htmlFor="email" label="Email address" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="registrar@university.edu"
            leading={<Mail />}
            value={email}
            disabled={isLoading}
            invalid={Boolean(errorMessage)}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          {isLoading ? 'Sending link…' : 'Send reset link'}
        </Button>
      </form>

      <p className="border-t border-line pt-6 text-sm text-ink-muted">
        Remembered it?{' '}
        <Link
          href="/login"
          className="rounded-sm font-medium text-brand transition-colors hover:text-brand-strong hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
