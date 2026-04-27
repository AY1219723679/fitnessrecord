import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted">
      <span>{label}</span>
      <textarea
        className={cn(
          'min-h-28 rounded-2xl border border-line bg-surface px-4 py-3 text-slate-900 outline-none transition placeholder:text-muted focus:border-accent',
          className
        )}
        {...props}
      />
    </label>
  );
}
