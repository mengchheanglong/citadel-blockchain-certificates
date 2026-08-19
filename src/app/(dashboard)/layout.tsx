'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/components/auth/supabase-provider';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Search,
  ScanLine,
  ChevronDown,
  Link2,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip } from '@/components/ui/tooltip';
import { Wordmark } from '@/components/ui/citadel-logo';
import { cn, getInitials } from '@/lib/utils';

/** Matches the label shown on the settings page, so the two never disagree. */
const NETWORK_NAME =
  process.env.NEXT_PUBLIC_NETWORK_MODE === 'sepolia'
    ? 'Ethereum Sepolia'
    : 'Local Hardhat node';

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  exact: boolean;
  description: string;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        exact: true,
        description: 'Issuance activity and credential health',
      },
    ],
  },
  {
    label: 'Credentials',
    items: [
      {
        title: 'Issue certificate',
        href: '/dashboard/certificates/new',
        icon: PlusCircle,
        exact: true,
        description: 'Create and anchor a new credential',
      },
      {
        title: 'Registry',
        href: '/dashboard/certificates',
        icon: FileText,
        exact: true,
        description: 'Search, audit and revoke issued credentials',
      },
    ],
  },
  {
    label: 'Organisation',
    items: [
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        exact: false,
        description: 'Profile, ledger configuration and security',
      },
    ],
  },
];

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
  const searchRef = React.useRef<HTMLInputElement>(null);

  const orgName = organization?.name || 'Your organisation';
  const orgEmail = organization?.email || '';

  /* Close the mobile drawer whenever navigation completes. */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* "/" focuses search — the shortcut every records system has. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleGlobalSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = globalSearch.trim();
    if (!query) return;
    router.push(`/dashboard/certificates?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Scrim behind the mobile drawer */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Sidebar                                                          */}
      {/* ---------------------------------------------------------------- */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-line bg-surface',
          'transition-transform duration-200 ease-emphasis lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Primary"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Link href="/dashboard" className="rounded-md">
            <Wordmark size="sm" subtitle="Issuer portal" />
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X aria-hidden />
          </Button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-2 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-subtle">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150',
                          active
                            ? 'bg-brand-soft font-medium text-brand-strong'
                            : 'text-ink-secondary hover:bg-surface-muted hover:text-ink'
                        )}
                      >
                        {active ? (
                          <span
                            className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand"
                            aria-hidden
                          />
                        ) : null}
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            active ? 'text-brand' : 'text-ink-subtle'
                          )}
                          aria-hidden
                        />
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div>
            <p className="px-3 pb-2 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-subtle">
              Public pages
            </p>
            <ul className="space-y-0.5">
              <li>
                <ExternalNavLink href="/verify" icon={ScanLine}>
                  Verification portal
                </ExternalNavLink>
              </li>
              <li>
                <ExternalNavLink href="/" icon={ExternalLink}>
                  Landing page
                </ExternalNavLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* Ledger status — the one piece of infrastructure a registrar
            needs to trust before issuing anything. */}
        <div className="border-t border-line p-3">
          <div className="rounded-lg border border-line bg-surface-muted/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Ledger
              </span>
              <span className="inline-flex items-center gap-1.5 text-2xs font-semibold text-success-fg">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                Connected
              </span>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
              <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {NETWORK_NAME}
            </p>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Content column                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-md sm:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu aria-hidden />
          </Button>

          <form
            onSubmit={handleGlobalSearch}
            className="relative hidden max-w-sm flex-1 sm:block"
            role="search"
          >
            <label htmlFor="global-search" className="sr-only">
              Search certificates
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
              aria-hidden
            />
            <input
              id="global-search"
              ref={searchRef}
              type="search"
              placeholder="Search recipients, courses or certificate IDs"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              className="h-9 w-full rounded-md border border-line bg-surface-muted/70 pl-9 pr-10 text-sm text-ink transition-colors placeholder:text-ink-subtle hover:border-line-strong focus:border-brand focus:bg-surface focus:outline-none focus:ring-[3px] focus:ring-brand/15"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-surface px-1.5 py-0.5 text-2xs font-medium text-ink-subtle md:block">
              /
            </kbd>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Tooltip content="Open the public verification portal">
              <Link
                href="/verify"
                target="_blank"
                className="hidden h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink sm:inline-flex"
                aria-label="Open the public verification portal in a new tab"
              >
                <ScanLine className="h-4 w-4" aria-hidden />
              </Link>
            </Tooltip>

            <Button asChild size="sm">
              <Link href="/dashboard/certificates/new">
                <PlusCircle aria-hidden />
                <span className="hidden sm:inline">Issue certificate</span>
                <span className="sm:hidden">Issue</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-md py-1 pl-1 pr-1.5 transition-colors hover:bg-surface-muted"
                  aria-label="Account menu"
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-2xs font-semibold text-brand-foreground"
                    aria-hidden
                  >
                    {getInitials(orgName)}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-[15rem]">
                <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                <div className="px-2.5 pb-2">
                  <p className="truncate text-sm font-medium text-ink">{orgName}</p>
                  {orgEmail ? (
                    <p className="truncate text-xs text-ink-muted">{orgEmail}</p>
                  ) : null}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings aria-hidden />
                    Organisation settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/verify" target="_blank">
                    <ScanLine aria-hidden />
                    Verification portal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem tone="danger" onSelect={() => signOut()}>
                  <LogOut aria-hidden />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main id="main" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

function ExternalNavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink"
    >
      <Icon className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
      <span className="flex-1">{children}</span>
      <ExternalLink
        className="h-3 w-3 text-ink-subtle opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}
