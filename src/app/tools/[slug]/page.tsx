import { ArrowUpRight, Star } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { CopyButton } from '@/components/copy-button';
import { GithubIcon } from '@/components/icons/github-icon';
import { Container } from '@/components/layout/container';
import { ToolCard } from '@/components/tool-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getRepoSnapshot } from '@/lib/github';
import { getAllTools, getRelatedTools, getToolBySlug } from '@/lib/tools';
import type { Tool } from '@/types/tool';

const STATUS_LABEL: Record<Tool['status'], string> = {
  active: '上線中',
  beta: 'Beta',
  'coming-soon': '即將推出',
  archived: '已封存',
};

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.name,
    description: tool.tagline,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: `${tool.name} · SatoriAI Lab`,
      description: tool.tagline,
      url: `/tools/${tool.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} · SatoriAI Lab`,
      description: tool.tagline,
    },
  };
}

export default async function ToolDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const related = await getRelatedTools(tool.slug, tool.category, 2);

  return (
    <main className="py-12 md:py-16">
      <Container>
        <nav aria-label="breadcrumb" className="mb-8 text-small text-text-tertiary">
          <Link href="/tools" className="transition-colors hover:text-text-primary">
            Tools
          </Link>
          <span aria-hidden className="mx-2 text-text-muted">/</span>
          <span className="text-text-primary">{tool.name}</span>
        </nav>

        <header className="grid gap-10 md:grid-cols-[280px_1fr] md:gap-12">
          <ToolGlyph tool={tool} />

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {tool.language ? (
                <Badge variant="secondary" className="text-[11px] tracking-wide">
                  {tool.language}
                </Badge>
              ) : null}
              <Badge
                variant="outline"
                className="border-border-default text-[11px] tracking-wide text-text-secondary"
              >
                {STATUS_LABEL[tool.status]}
              </Badge>
              <Badge
                variant="outline"
                className="border-border-default text-[11px] tracking-wide text-text-secondary"
              >
                {tool.category}
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="text-h1 text-text-primary md:text-[40px] md:leading-tight">
                {tool.name}
              </h1>
              <p className="max-w-2xl text-body text-text-secondary">{tool.tagline}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {tool.githubRepo ? (
                <Button
                  size="lg"
                  nativeButton={false}
                  render={
                    <a
                      href={`https://github.com/${tool.githubRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <GithubIcon className="mr-1 size-4" /> GitHub
                </Button>
              ) : null}
              {tool.homepageUrl ? (
                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={
                    <a
                      href={tool.homepageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  Live demo <ArrowUpRight className="ml-1 size-4" />
                </Button>
              ) : null}
              {tool.install ? (
                <CopyButton
                  value={tool.install}
                  label={tool.install}
                  className="rounded-md border border-border-subtle bg-bg-card px-3 py-2 font-mono text-small"
                />
              ) : null}
            </div>
          </div>
        </header>

        {tool.githubRepo ? (
          <Suspense fallback={<StatsRowFallback />}>
            <StatsRow repo={tool.githubRepo} />
          </Suspense>
        ) : null}

        {tool.problemStatement ? (
          <section className="mt-16 max-w-3xl space-y-3 md:mt-20">
            <p className="text-caption font-medium text-text-tertiary uppercase">
              WHY · THIS · EXISTS
            </p>
            <h2 className="text-h2 text-text-primary">為什麼有這個工具</h2>
            <p className="text-body text-text-secondary">{tool.problemStatement}</p>
          </section>
        ) : null}

        {tool.install ? (
          <section className="mt-16 max-w-3xl space-y-3 md:mt-20">
            <p className="text-caption font-medium text-text-tertiary uppercase">
              INSTALL · & · USE
            </p>
            <h2 className="text-h2 text-text-primary">安裝與使用</h2>
            <p className="text-body text-text-secondary">
              第一次跑可以直接這樣開始,設定檔會在第一次執行時自動建立。
            </p>
            <div className="flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-bg-card px-4 py-3">
              <code className="font-mono text-small text-text-primary">{tool.install}</code>
              <CopyButton value={tool.install} />
            </div>
          </section>
        ) : null}

        <section className="mt-16 max-w-3xl space-y-3 md:mt-20">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            ABOUT · THIS · TOOL
          </p>
          <h2 className="text-h2 text-text-primary">完整介紹</h2>
          <p className="text-body whitespace-pre-line text-text-secondary">{tool.description}</p>
        </section>

        {related.length > 0 ? (
          <section className="mt-20 md:mt-28">
            <Separator className="mb-12 bg-border-subtle" />
            <p className="mb-6 text-caption font-medium text-text-tertiary uppercase">
              RELATED · TOOLS
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}

function ToolGlyph({ tool }: { tool: Tool }) {
  return (
    <div
      aria-hidden
      className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-xl border border-border-subtle bg-bg-card"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 0%, var(--color-brand-glow), transparent 65%)',
        }}
      />
      <span className="relative font-mono text-[80px] leading-none font-medium text-text-primary md:text-[96px]">
        {tool.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

async function StatsRow({ repo }: { repo: string }) {
  const snap = await getRepoSnapshot(repo);
  const items = [
    {
      label: 'Stars',
      value: snap.stars !== null ? snap.stars.toLocaleString() : '—',
      icon: <Star className="size-3.5" />,
    },
    { label: 'Latest release', value: snap.latestRelease ?? '—' },
    { label: 'Open issues', value: snap.openIssues !== null ? String(snap.openIssues) : '—' },
  ];

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 rounded-lg border border-border-subtle bg-bg-card p-6 md:grid-cols-3 md:gap-12">
      {items.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <p className="text-caption font-medium text-text-muted uppercase">{item.label}</p>
          <p className="flex items-center gap-2 text-h3 text-text-primary">
            {item.icon}
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatsRowFallback() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 rounded-lg border border-border-subtle bg-bg-card p-6 md:grid-cols-3 md:gap-12">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <span className="block h-3 w-16 animate-pulse rounded-sm bg-bg-elevated" />
          <span className="block h-5 w-24 animate-pulse rounded-sm bg-bg-elevated" />
        </div>
      ))}
    </div>
  );
}
