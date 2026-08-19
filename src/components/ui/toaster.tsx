'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={6000} swipeDirection="right">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          {title ? <ToastTitle>{title}</ToastTitle> : null}
          {description ? <ToastDescription>{description}</ToastDescription> : null}
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
