import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted">
      <span>{label}</span>
      <input
        className={cn(
          'rounded-2xl border border-line bg-surface px-4 py-3 text-slate-900 outline-none transition placeholder:text-muted focus:border-accent',
          className
        )}
        {...props}
      />
    </label>
  );
}
