'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast({
          variant: 'success',
          title: 'Signed in',
          description: 'Taking you to your dashboard.',
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
          Sign in
        </h1>
        <p className="text-sm text-ink-muted">
          Access your organisation&apos;s certificate registry.
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
            placeholder="registrar@university.edu"
            leading={<Mail />}
            value={email}
            disabled={isLoading}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field
          htmlFor="password"
          label="Password"
          required
          action={
            <Link
              href="/forgot-password"
              className="rounded-sm text-xs font-medium text-brand transition-colors hover:text-brand-strong hover:underline"
            >
              Forgot password?
            </Link>
          }
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            leading={<Lock />}
            value={password}
            disabled={isLoading}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="space-y-3 border-t border-line pt-6 text-sm">
        <p className="text-ink-muted">
          Don&apos;t have an issuer account?{' '}
          <Link
            href="/register"
            className="rounded-sm font-medium text-brand transition-colors hover:text-brand-strong hover:underline"
          >
            Register your institution
          </Link>
        </p>
        <p className="text-ink-muted">
          Checking someone&apos;s credential?{' '}
          <Link
            href="/verify"
            className="rounded-sm font-medium text-ink-secondary transition-colors hover:text-brand hover:underline"
          >
            Use the public verification portal
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden />
          <span className="sr-only">Loading</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
