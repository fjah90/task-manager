import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
      {/* Teal glow orbs */}
      <div className="pointer-events-none absolute -left-16 top-8 h-52 w-52 rounded-full bg-[var(--brand)] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-6 h-56 w-56 rounded-full bg-[var(--brand-dark)] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 rounded-full bg-[var(--brand-light)] opacity-8 blur-3xl" />

      <div className="panel-enter w-full max-w-sm rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-7 shadow-[0_20px_60px_rgba(0,196,178,0.14)]">
        <Link href="/" className="mb-5 flex flex-col items-center gap-2 no-underline">
          <Image
            src="/logo.png"
            alt="Task Manager logo"
            width={64}
            height={72}
            priority
          />
          <span className="text-xs font-bold uppercase tracking-[0.26em] text-[var(--brand-dark)]">
            Task Manager
          </span>
        </Link>
        <p className="mb-6 text-center text-sm text-[var(--charcoal)] opacity-70">
          Organiza tus tareas con foco.
        </p>
        {children}
      </div>
    </main>
  );
}
