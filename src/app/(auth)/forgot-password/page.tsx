'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Loader2, AlertCircle, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?next=/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
        toast({
          variant: 'destructive',
          title: 'Request Failed',
          description: error.message,
        });
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      toast({
        title: 'Reset Link Sent',
        description: 'Please check your email inbox for instructions to reset your password.',
      });
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred. Please try again.';
      setErrorMessage(msg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-slate-200 bg-white shadow-xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
          <KeyRound className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Reset Password
        </CardTitle>
        <CardDescription className="text-slate-500">
          Enter your organization email and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">Check Your Email</h3>
              <p className="text-sm text-slate-600">
                We sent a secure password reset link to{' '}
                <span className="font-semibold text-slate-800">{email}</span>.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Didn&apos;t receive the email? Check your spam folder or try again in a few minutes.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="mt-2 w-full border-slate-200 text-slate-700"
            >
              Try another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-in fade-in-50">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Registered Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="org@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                  className="pl-9 text-slate-900 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col border-t border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-600">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
