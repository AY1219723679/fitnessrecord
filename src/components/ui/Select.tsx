import type { PropsWithChildren, SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends PropsWithChildren, SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, children, className, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted">
      <span>{label}</span>
      <select
        className={cn(
          'rounded-2xl border border-line bg-surface px-4 py-3 text-slate-900 outline-none transition focus:border-accent',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
