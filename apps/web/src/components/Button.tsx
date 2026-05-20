import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    'bg-[var(--brand)] text-white shadow-[0_8px_20px_var(--brand-glow)] hover:bg-[var(--brand-dark)] disabled:opacity-50',
  secondary:
    'bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-alt)] disabled:opacity-50',
  danger:
    'bg-[var(--danger)] text-white hover:bg-red-700 disabled:opacity-50',
  ghost:
    'bg-transparent text-[var(--charcoal)] hover:bg-[var(--brand-muted)] disabled:opacity-50',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed motion-reduce:transform-none motion-reduce:transition-none ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
