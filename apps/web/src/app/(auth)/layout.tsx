import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Link
          href="/"
          className="mb-6 block text-center text-lg font-semibold tracking-tight"
        >
          Task Manager
        </Link>
        {children}
      </div>
    </main>
  );
}
