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

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
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
    <Card className="w-full border-slate-200 bg-white shadow-xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
          <Shield className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Organization Sign In
        </CardTitle>
        <CardDescription className="text-slate-500">
          Enter your organization credentials to manage and issue certificates
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
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
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col border-t border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-600">
        <p>
          Don&apos;t have an organization account yet?{' '}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Register your Organization
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full border-slate-200 bg-white shadow-xl p-12 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">Loading sign in form...</p>
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
