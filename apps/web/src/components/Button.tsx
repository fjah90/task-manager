import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50',
  secondary:
    'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-50',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`rounded px-3 py-2 text-sm font-medium transition ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
