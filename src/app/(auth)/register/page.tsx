'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
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

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Organization Name is required.');
      return false;
    }

    if (formData.name.trim().length < 2) {
      setErrorMessage('Organization Name must be at least 2 characters.');
      return false;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Email address is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (!formData.password) {
      setErrorMessage('Password is required.');
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg =
          data.message ||
          (data.errors ? Object.values(data.errors).flat().join(', ') : 'Failed to register organization');
        setErrorMessage(errorMsg);
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: errorMsg,
        });
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Registration successful! Redirecting to sign in...');
      toast({
        title: 'Account Created',
        description: 'Your organization has been registered successfully.',
      });

      // Brief delay so user sees feedback before redirection
      setTimeout(() => {
        router.push('/login');
      }, 1500);
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
    <Card className="w-full border-slate-200 bg-white shadow-xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
          <Building2 className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Register Organization
        </CardTitle>
        <CardDescription className="text-slate-500">
          Create an issuer account to anchor certificates to the blockchain
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

          {successMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700 animate-in fade-in-50">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Organization Name
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Oxford Academy / Tech University"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading || Boolean(successMessage)}
                required
                className="pl-9 text-slate-900 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Official Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="issuer@organization.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading || Boolean(successMessage)}
                required
                className="pl-9 text-slate-900 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading || Boolean(successMessage)}
                required
                className="pl-9 text-slate-900 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading || Boolean(successMessage)}
                required
                className="pl-9 text-slate-900 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || Boolean(successMessage)}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Organization...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col border-t border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-600">
        <p>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign In here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
