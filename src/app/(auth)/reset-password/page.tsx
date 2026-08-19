'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: error.message,
        });
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully reset. Redirecting...',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      const msg = err?.message || 'An error occurred while updating your password.';
      setErrorMessage(msg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: msg,
      });
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
          Create New Password
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Please enter your new secure password below
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-[900] text-slate-900">Password Changed!</h3>
              <p className="text-xs text-slate-600">
                You are being redirected to your organization dashboard...
              </p>
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
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                  className="pl-10 h-11 rounded-xl text-xs text-slate-900 border-slate-200 focus:border-[#C8102E]"
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
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
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
                  Updating Password...
                </>
              ) : (
                'Save New Password'
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 py-4 text-center text-xs">
        <Link
          href="/login"
          className="font-bold text-slate-700 hover:text-[#C8102E] transition"
        >
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
