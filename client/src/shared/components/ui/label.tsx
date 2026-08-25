import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2',
          className,
        )}
        {...props}
      />
    );
  },
);

Label.displayName = 'Label';
