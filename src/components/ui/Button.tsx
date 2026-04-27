import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-2xl px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' &&
          'bg-accent text-white shadow-sm hover:bg-[#3f80c1] active:bg-[#356da5]',
        variant === 'secondary' &&
          'border border-line bg-surface text-ink hover:bg-panel active:bg-[#e3eefc]',
        variant === 'ghost' &&
          'text-muted hover:bg-panel hover:text-ink active:bg-[#eaf3ff]',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
