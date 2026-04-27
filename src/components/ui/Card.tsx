import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  rightSlot,
  className,
  children
}: CardProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-line bg-surface/95 p-5 shadow-panel backdrop-blur',
        className
      )}
    >
      {(title || rightSlot) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          {rightSlot}
        </div>
      )}
      {children}
    </section>
  );
}
