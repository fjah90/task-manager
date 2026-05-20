import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    const errorId = error ? `${inputId}-error` : undefined;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`rounded-lg border border-amber-200 bg-[var(--surface)] px-3 py-2 text-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100 ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...rest}
        />
        {error && (
          <span id={errorId} className="text-xs text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
