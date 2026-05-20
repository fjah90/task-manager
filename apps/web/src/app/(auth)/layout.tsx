import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -left-14 top-10 h-40 w-40 rounded-full bg-amber-300/35 blur-2xl" />
      <div className="pointer-events-none absolute -right-12 bottom-8 h-44 w-44 rounded-full bg-teal-300/30 blur-2xl" />
      <div className="panel-enter w-full max-w-sm rounded-2xl border border-amber-200/60 bg-[var(--surface)]/90 p-6 shadow-[0_16px_45px_rgba(31,41,55,0.14)] backdrop-blur">
        <Link
          href="/"
          className="mb-1 block text-center text-xs font-semibold uppercase tracking-[0.24em] text-teal-700"
        >
          Task Manager
        </Link>
        <p className="mb-6 text-center text-sm text-gray-600">
          Organiza tus tareas con foco.
        </p>
        {children}
      </div>
    </main>
  );
}
