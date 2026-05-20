'use client';

import type { ReactNode } from 'react';
import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/auth/hooks';
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

  useEffect(() => {
    if (token === null) router.replace('/login');
  }, [token, router]);

  if (token === undefined || token === null) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm text-gray-500">
        Loading…
      </main>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-amber-200/70 bg-[var(--surface)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/tasks"
            className="text-lg font-semibold tracking-tight text-teal-900"
          >
            Task Manager
          </Link>
          <Button
            variant="ghost"
            className="text-teal-800 hover:bg-teal-100"
            onClick={() => {
              logout();
              router.replace('/login');
            }}
          >
            Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
