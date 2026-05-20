'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/features/auth/hooks';
import { tokenStorage } from '@/lib/api-client';
import { Button } from '@/components/Button';

function subscribeToken(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function useAuthToken(): string | null | undefined {
  return useSyncExternalStore(
    subscribeToken,
    () => tokenStorage.get(),
    () => undefined,
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAuthToken();
  const logout = useLogout();

  useEffect(() => {
    if (token === null) router.replace('/login');
  }, [token, router]);

  if (token === undefined || token === null) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>
        Cargando…
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/tasks" className="flex items-center gap-2.5 no-underline">
            <Image src="/logo.png" alt="logo" width={32} height={36} />
            <span className="text-base font-bold tracking-tight" style={{ color: 'var(--brand-dark)' }}>
              Task Manager
            </span>
          </Link>
          <Button
            variant="secondary"
            onClick={() => {
              logout();
              router.replace('/login');
            }}
            className="flex items-center gap-1.5"
          >
            <LogOut size={15} />
            Salir
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4">
        {children}
      </main>
    </div>
  );
}
