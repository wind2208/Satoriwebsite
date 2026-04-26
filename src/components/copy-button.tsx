'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export function CopyButton({
  value,
  label = '複製',
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore — clipboard API can fail on insecure context */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? '已複製' : label}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-small text-text-tertiary transition-colors',
        'hover:bg-bg-elevated hover:text-text-primary',
        copied && 'text-success hover:text-success',
        className,
      )}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span>{copied ? '已複製' : label}</span>
    </button>
  );
}
