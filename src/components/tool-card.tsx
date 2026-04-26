import { Star } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { getRepoStars } from '@/lib/github';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types/tool';

const STATUS_LABEL: Record<Tool['status'], string> = {
  active: '上線中',
  beta: 'Beta',
  'coming-soon': '即將推出',
  archived: '已封存',
};

function formatStars(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

async function GitHubStars({ repo }: { repo: string }) {
  const stars = await getRepoStars(repo);
  if (stars === null) {
    return (
      <span className="inline-flex items-center gap-1 text-small text-text-muted">
        <Star className="size-3.5" /> —
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-small text-text-secondary">
      <Star className="size-3.5" /> {formatStars(stars)}
    </span>
  );
}

function StarsFallback() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-10 animate-pulse rounded-sm bg-bg-elevated"
    />
  );
}

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'full';
  className?: string;
}

export function ToolCard({ tool, variant = 'default', className }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        'group relative flex h-full flex-col gap-5 rounded-lg border border-border-subtle bg-bg-card p-6 transition-all',
        'hover:-translate-y-0.5 hover:border-border-default hover:bg-bg-elevated',
        'focus-visible:border-brand',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {tool.language ? (
            <Badge variant="secondary" className="text-[11px] font-medium tracking-wide">
              {tool.language}
            </Badge>
          ) : null}
          {tool.status !== 'active' ? (
            <Badge
              variant="outline"
              className={cn(
                'text-[11px] tracking-wide',
                tool.status === 'beta' && 'border-warning/40 text-warning',
                tool.status === 'coming-soon' && 'border-brand/40 text-brand',
              )}
            >
              {STATUS_LABEL[tool.status]}
            </Badge>
          ) : null}
        </div>
        {tool.githubRepo ? (
          <Suspense fallback={<StarsFallback />}>
            <GitHubStars repo={tool.githubRepo} />
          </Suspense>
        ) : null}
      </div>

      <div className="space-y-2">
        <h3 className="text-h3 text-text-primary">{tool.name}</h3>
        <p className="text-small text-text-secondary line-clamp-2">{tool.tagline}</p>
      </div>

      {variant === 'full' ? (
        <p className="mt-auto line-clamp-3 text-small text-text-tertiary">{tool.description}</p>
      ) : null}

      <div className="mt-auto flex items-center justify-between text-small text-text-tertiary">
        <span>{tool.category}</span>
        <span
          aria-hidden
          className="opacity-60 transition-opacity group-hover:opacity-100"
        >
          →
        </span>
      </div>
    </Link>
  );
}
