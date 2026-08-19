'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Building2, CheckCircle2, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';

const MIN_PASSWORD_LENGTH = 8;

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setValue = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.name.trim()) {
      next.name = 'Enter the name recipients will see on their certificates.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'The two passwords do not match.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!validate()) return;

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            name: form.name.trim(),
            organizationName: form.name.trim(),
          },
        },
      });

      if (authError) {
        setErrorMessage(authError.message);
        setIsLoading(false);
        return;
      }

      /* Mirror the account into the application database. A failure here is
         recoverable on first sign-in, so it must not block registration. */
      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: authData.user?.id,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
          }),
        });
      } catch (syncError) {
        console.warn('Organization profile sync error:', syncError);
      }

      if (authData.session) {
        setSuccessMessage('Account created. Taking you to your dashboard…');
        toast({
          variant: 'success',
          title: 'Organisation registered',
          description: 'Welcome to Citadel.',
        });
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1200);
      } else {
        setSuccessMessage(
          'Account created. Check your inbox to confirm your email, then sign in.'
        );
        toast({
          variant: 'success',
          title: 'Organisation registered',
          description: 'Confirm your email address to continue.',
        });
        setTimeout(() => router.push('/login'), 2000);
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
          Register your institution
        </h1>
        <p className="text-sm leading-relaxed text-ink-muted">
          Create an issuer account to start anchoring certificates to the
          blockchain.
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

      {successMessage ? (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-lg border border-success-line bg-success-soft p-3 text-sm text-success-fg"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span className="leading-relaxed">{successMessage}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field
          htmlFor="name"
          label="Organisation name"
          required
          error={errors.name}
          hint="Appears on every certificate you issue."
        >
          <Input
            id="name"
            name="name"
            placeholder="University of Example"
            leading={<Building2 />}
            value={form.name}
            disabled={isLoading}
            invalid={Boolean(errors.name)}
            onChange={(event) => setValue('name', event.target.value)}
          />
        </Field>

        <Field
          htmlFor="email"
          label="Administrative email"
          required
          error={errors.email}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="registrar@university.edu"
            leading={<Mail />}
            value={form.email}
            disabled={isLoading}
            invalid={Boolean(errors.email)}
            onChange={(event) => setValue('email', event.target.value)}
          />
        </Field>

        <Field
          htmlFor="password"
          label="Password"
          required
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            leading={<Lock />}
            value={form.password}
            disabled={isLoading}
            invalid={Boolean(errors.password)}
            onChange={(event) => setValue('password', event.target.value)}
          />
        </Field>

        <Field
          htmlFor="confirmPassword"
          label="Confirm password"
          required
          error={errors.confirmPassword}
        >
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            leading={<Lock />}
            value={form.confirmPassword}
            disabled={isLoading}
            invalid={Boolean(errors.confirmPassword)}
            onChange={(event) => setValue('confirmPassword', event.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          {isLoading ? 'Creating account…' : 'Create issuer account'}
        </Button>
      </form>

      <p className="border-t border-line pt-6 text-sm text-ink-muted">
        Already registered?{' '}
        <Link
          href="/login"
          className="rounded-sm font-medium text-brand transition-colors hover:text-brand-strong hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
