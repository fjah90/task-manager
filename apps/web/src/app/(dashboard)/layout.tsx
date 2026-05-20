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
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/tasks" className="text-lg font-semibold">
            Task Manager
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              router.replace('/login');
            }}
          >
            Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
