'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  ExternalLink,
  Search,
  ShieldCheck,
  Activity,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CitadelLogo } from '@/components/ui/citadel-logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { organization, signOut } = useSupabaseAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const orgName = organization?.name || 'Organization';
  const orgEmail = organization?.email || '';

  const navItems = [
    {
      title: 'Dashboard Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'Issue Certificate',
      href: '/dashboard/certificates/new',
      icon: PlusCircle,
      exact: true,
    },
    {
      title: 'Certificate Registry',
      href: '/dashboard/certificates',
      icon: FileText,
      exact: true,
    },
    {
      title: 'Organization Settings',
      href: '/dashboard/settings',
      icon: Settings,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    router.push(`/dashboard/certificates?search=${encodeURIComponent(globalSearch.trim())}`);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 shadow-xs',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3.5 group">
            <CitadelLogo className="h-11 w-11 transition-transform group-hover:scale-105" size={56} />
            <div>
              <span className="text-[22px] font-[900] tracking-[-0.03em] text-slate-900 block leading-tight">
                Citadel
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E]">
                Issuer Portal
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-slate-500 hover:text-slate-900"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Management
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-[13.5px] font-semibold transition-all duration-150',
                      active
                        ? 'bg-[#C8102E]/10 text-[#C8102E] font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        active ? 'text-[#C8102E]' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <Separator className="bg-slate-100" />

          {/* Public Verification & Tools */}
          <div>
            <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Verification & Tools
            </div>
            <nav className="space-y-1.5">
              <Link
                href="/verify"
                target="_blank"
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-slate-600 transition hover:bg-slate-100/80 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  <span>Public QR Scanner</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-slate-600 transition hover:bg-slate-100/80 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                  <span>Platform Landing Page</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Sepolia Smart Contract Status Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Network Status
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live EVM
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Connected to Ethereum Sepolia Ledger
            </p>
          </div>
        </div>

        {/* Sidebar Footer / User & Logout */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#9E1B32] to-[#C8102E] text-white font-bold text-sm shadow-xs">
              {orgName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-bold text-slate-900">
                  {orgName}
                </p>
                <ShieldCheck className="h-3.5 w-3.5 text-[#C8102E] shrink-0" />
              </div>
              <p className="truncate text-xs text-slate-500">{orgEmail || 'Authorized Authority'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start rounded-xl border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 sm:px-8 backdrop-blur-md">
          {/* Mobile Menu & Global Search */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 text-slate-600"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <form onSubmit={handleGlobalSearch} className="relative w-full hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Quick search Certificate ID, recipient, course..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#C8102E] focus:bg-white transition"
              />
            </form>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard/certificates/new">
              <Button className="h-10 px-5 rounded-full bg-[#C8102E] hover:bg-[#9E1B32] text-white font-bold text-xs shadow-md shadow-[#C8102E]/20 transition-all hover:scale-105 active:scale-95">
                <PlusCircle className="mr-1.5 h-4 w-4" />
                Issue Certificate
              </Button>
            </Link>

            <div className="hidden md:flex items-center gap-2.5 border-l border-slate-200 pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#9E1B32] to-[#C8102E] text-white text-xs font-extrabold shadow-xs">
                {orgName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {orgName}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  Verified Authority
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
