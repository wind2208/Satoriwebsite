import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  caption?: string;
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  caption,
  title,
  description,
  action,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <header className={cn('mb-10 flex items-end justify-between gap-6 md:mb-12', className)}>
      <div className="space-y-2">
        {caption ? (
          <p className="text-caption font-medium text-text-tertiary uppercase">{caption}</p>
        ) : null}
        <h2 className="text-h2 text-text-primary">{title}</h2>
        {description ? (
          <p className="max-w-xl text-small text-text-secondary">{description}</p>
        ) : null}
        {children}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="hidden text-small font-medium text-text-secondary transition-colors hover:text-text-primary md:inline-flex"
        >
          {action.label} <span aria-hidden className="ml-1">→</span>
        </Link>
      ) : null}
    </header>
  );
}
