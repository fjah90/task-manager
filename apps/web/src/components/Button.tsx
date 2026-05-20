import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    'bg-[var(--brand)] text-white shadow-[0_10px_22px_rgba(15,118,110,0.26)] hover:bg-[var(--brand-strong)] disabled:opacity-50',
  secondary:
    'bg-[var(--surface)] text-gray-900 border border-amber-200 hover:bg-[var(--surface-strong)] disabled:opacity-50',
  danger:
    'bg-[var(--danger)] text-white hover:bg-red-800 disabled:opacity-50',
  ghost:
    'bg-transparent text-gray-700 hover:bg-amber-100 disabled:opacity-50',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-px ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
