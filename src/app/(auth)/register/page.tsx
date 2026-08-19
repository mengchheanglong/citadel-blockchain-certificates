'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Loader2,
  AlertCircle,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Globe,
  ArrowRight,
} from 'lucide-react';
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

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [supabase] = useState(() => createClient());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    website: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Organization name is required.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('A valid email address is required.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
            organizationName: formData.name.trim(),
          },
        },
      });

      if (authError) {
        setErrorMessage(authError.message);
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: authError.message,
        });
        setIsLoading(false);
        return;
      }

      // 2. Sync / Upsert Organization profile in Prisma
      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: authData.user?.id,
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
          }),
        });
      } catch (syncErr) {
        console.warn('Organization profile sync error:', syncErr);
      }

      // 3. Check if session was automatically created or email confirmation is pending
      if (authData.session) {
        setSuccessMessage('Registration successful! Redirecting to dashboard...');
        toast({
          title: 'Account Created',
          description: 'Welcome to Citadel! Redirecting...',
        });
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1200);
      } else {
        setSuccessMessage('Account created! Please sign in with your credentials.');
        toast({
          title: 'Account Created',
          description: 'Your organization has been registered successfully.',
        });
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (err: any) {
      const msg = err?.message || 'Network error occurred. Please try again.';
      setErrorMessage(msg);
      toast({
        variant: 'destructive',
        title: 'Registration Error',
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
          Register Organization
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Create an issuer account to anchor certificates to Ethereum
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

          {successMessage && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 animate-in fade-in-50">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-slate-700">
              Organization / Institution Name <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Oxford Institute of Technology"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="pl-10 h-11 rounded-xl text-xs text-slate-900 border-slate-200 focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-slate-700">
              Organization Official Email <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@oxford.edu"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="email"
                required
                className="pl-10 h-11 rounded-xl text-xs text-slate-900 border-slate-200 focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min 8 chars"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                  className="pl-10 h-11 rounded-xl text-xs text-slate-900 border-slate-200 focus:border-[#C8102E]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                Confirm Password <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                  className="pl-10 h-11 rounded-xl text-xs text-slate-900 border-slate-200 focus:border-[#C8102E]"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full bg-[#C8102E] text-white hover:bg-[#9E1B32] font-bold text-xs shadow-md shadow-[#C8102E]/25 transition hover:scale-[1.01] active:scale-95 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Authority Account...
              </>
            ) : (
              'Create Organization Account'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 border-t border-slate-100 bg-slate-50/50 py-4 text-center text-xs text-slate-600">
        <div>
          Already have an organization account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#C8102E] hover:text-[#9E1B32] hover:underline"
          >
            Sign in here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
