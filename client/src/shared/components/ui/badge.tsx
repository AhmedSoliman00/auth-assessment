import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'indigo' | 'emerald' | 'violet' | 'rose';
}

export function Badge({ variant = 'indigo', className, ...props }: BadgeProps) {
  const variantStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
