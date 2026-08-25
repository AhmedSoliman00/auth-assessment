import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all',
          error
            ? 'border-rose-500 focus:ring-rose-500/50'
            : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/30',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
