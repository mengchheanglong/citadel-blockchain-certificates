'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2.5 p-4 sm:top-auto md:max-w-[400px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  [
    'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden',
    'rounded-lg border bg-surface p-4 pr-9 shadow-lg',
    'data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
    'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-slide-out-right',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-line',
        success: 'border-success-line',
        destructive: 'border-danger-line',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

/** The accent rail and icon that identify a toast's severity at a glance. */
const TONE = {
  default: { rail: 'bg-brand', icon: Info, color: 'text-brand' },
  success: { rail: 'bg-success', icon: CheckCircle2, color: 'text-success-fg' },
  destructive: { rail: 'bg-danger', icon: AlertTriangle, color: 'text-danger-fg' },
} as const;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, children, ...props }, ref) => {
  const tone = TONE[(variant ?? 'default') as keyof typeof TONE];
  const Icon = tone.icon;

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <span className={cn('absolute inset-y-0 left-0 w-1', tone.rail)} aria-hidden />
      <Icon className={cn('mt-px h-4 w-4 shrink-0', tone.color)} aria-hidden />
      <div className="flex-1 space-y-0.5">{children}</div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'mt-2 inline-flex h-7 shrink-0 items-center rounded-md border border-line-strong bg-surface px-2.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-muted',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-ink-subtle opacity-0 transition-all hover:bg-surface-muted hover:text-ink focus:opacity-100 group-hover:opacity-100',
      className
    )}
    toast-close=""
    aria-label="Dismiss notification"
    {...props}
  >
    <X className="h-3.5 w-3.5" aria-hidden />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold text-ink', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-xs leading-relaxed text-ink-muted', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
