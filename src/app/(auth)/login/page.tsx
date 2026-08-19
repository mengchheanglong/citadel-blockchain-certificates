'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Loader2, AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error.message,
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast({
          title: 'Signed in successfully',
          description: 'Redirecting to your organization dashboard...',
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred during sign in.';
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
          Organization Sign In
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your organization credentials to manage and issue certificates
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-slate-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="org@oxford.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                required
                className="pl-10 h-11 rounded-xl text-xs text-slate-900 border-slate-200 focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#C8102E] hover:text-[#9E1B32] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
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
                Signing In...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 border-t border-slate-100 bg-slate-50/50 py-4 text-center text-xs text-slate-600">
        <div>
          Don&apos;t have an organization account?{' '}
          <Link
            href="/register"
            className="font-bold text-[#C8102E] hover:text-[#9E1B32] hover:underline"
          >
            Register your institution
          </Link>
        </div>

        <div>
          Looking to verify a student diploma?{' '}
          <Link
            href="/verify"
            className="font-bold text-slate-800 hover:text-[#C8102E] hover:underline"
          >
            Open Public Verification
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#C8102E]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
