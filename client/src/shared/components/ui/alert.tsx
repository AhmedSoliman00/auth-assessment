import { type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface AlertProps {
  variant?: 'error' | 'success' | 'info';
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'error', children, className }: AlertProps) {
  const variantStyles = {
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    info: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
  };

  const iconStyles = {
    error: 'text-rose-400',
    success: 'text-emerald-400',
    info: 'text-indigo-400',
  };

  return (
    <div
      className={cn(
        'p-4 rounded-xl border text-sm flex items-start gap-3',
        variantStyles[variant],
        className,
      )}
    >
      <svg
        className={cn('w-5 h-5 shrink-0 mt-0.5', iconStyles[variant])}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        {variant === 'error' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        )}
        {variant === 'success' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        )}
        {variant === 'info' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        )}
      </svg>
      <span>{children}</span>
    </div>
  );
}
