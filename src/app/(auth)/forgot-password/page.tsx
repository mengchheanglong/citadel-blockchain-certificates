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
import { CitadelLogo } from '@/components/ui/citadel-logo';

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
        description: 'Check your email inbox for password reset instructions.',
      });
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred.';
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
    <Card className="w-full border-slate-200/90 bg-white shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="space-y-2 text-center pb-6 bg-slate-50/70 border-b border-slate-100">
        <div className="mx-auto mb-2 flex items-center justify-center">
          <CitadelLogo className="h-14 w-14" size={64} />
        </div>
        <CardTitle className="text-2xl font-[900] tracking-tight text-slate-900">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your organization email and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {isSubmitted ? (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-[900] text-slate-900">Check Your Email</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We sent a secure password reset link to{' '}
                <span className="font-bold text-slate-800 font-mono">{email}</span>.
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              Click the link in the email to choose a new password.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="rounded-full text-xs font-semibold"
              >
                Send to another email
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 animate-in fade-in-50">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Registered Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@oxford.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                  className="pl-10 h-11 rounded-xl text-xs text-slate-900 border-slate-200 focus:border-[#C8102E]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-full bg-[#C8102E] text-white hover:bg-[#9E1B32] font-bold text-xs shadow-md shadow-[#C8102E]/25 transition hover:scale-[1.01] active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Password Reset Link'
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 py-4 text-center text-xs">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-[#C8102E] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
