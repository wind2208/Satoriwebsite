import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { marked } from 'marked';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { getAdjacentNews, getAllNews, getNewsBySlug } from '@/lib/news';
import { CATEGORY_LABEL } from '@/types/news';

interface PageParams {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  const news = await getAllNews(50);
  return news.map((n) => ({ slug: n.slug }));
}

marked.use({ gfm: true, breaks: false });

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary ?? undefined,
    alternates: { canonical: `/news/${item.slug}` },
    openGraph: {
      title: `${item.title} · SatoriAI Lab News`,
      description: item.summary ?? undefined,
      type: 'article',
      url: `/news/${item.slug}`,
      publishedTime: item.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} · SatoriAI Lab News`,
      description: item.summary ?? undefined,
    },
  };
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://satoriwebsite.vercel.app';

export default async function NewsDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();
  const { prev, next } = await getAdjacentNews(item.published_at);

  const relative = formatDistanceToNow(new Date(item.published_at), {
    addSuffix: true,
    locale: zhTW,
  });
  const categoryLabel = CATEGORY_LABEL[item.category] ?? item.category;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.summary ?? undefined,
    datePublished: item.published_at,
    author: {
      '@type': 'Organization',
      name: item.source_name ?? 'SatoriAI Lab',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SatoriAI Lab',
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/news/${item.slug}`,
    articleSection: categoryLabel,
    inLanguage: 'zh-Hant-TW',
  };

  return (
    <main className="py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Container>
        <nav aria-label="breadcrumb" className="mb-8 text-small text-text-tertiary">
          <Link href="/news" className="transition-colors hover:text-text-primary">
            News
          </Link>
          <span aria-hidden className="mx-2 text-text-muted">
            /
          </span>
          <span className="line-clamp-1 text-text-primary">{item.title}</span>
        </nav>

        <article className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-small text-text-tertiary">
              <Badge
                variant="outline"
                className="border-border-default text-[11px] tracking-wide text-text-secondary"
              >
                {categoryLabel}
              </Badge>
              <span>{relative}</span>
              {item.source_name ? <span>· {item.source_name}</span> : null}
            </div>
            <h1 className="text-h1 text-text-primary md:text-[40px] md:leading-tight">
              {item.title}
            </h1>
            {item.summary ? (
              <p className="text-body text-text-secondary">{item.summary}</p>
            ) : null}
          </header>

          {item.content ? (
            <div
              className="prose-news text-body text-text-secondary"
              // 來源是 server-side 自家 ingest webhook,內容由我們的爬蟲產生
              dangerouslySetInnerHTML={{ __html: marked.parse(item.content) as string }}
            />
          ) : null}

          {item.source_url ? (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-small text-brand transition-colors hover:underline"
            >
              讀原文 <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
        </article>

        {prev || next ? (
          <nav
            aria-label="news navigation"
            className="mx-auto mt-16 flex max-w-3xl flex-col gap-3 border-t border-border-subtle pt-8 md:flex-row md:justify-between md:gap-6"
          >
            {prev ? (
              <Link
                href={`/news/${prev.slug}`}
                className="group flex items-start gap-2 text-small text-text-tertiary transition-colors hover:text-text-primary"
              >
                <ArrowLeft className="mt-0.5 size-3.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="block text-caption uppercase">上一則</span>
                  <span className="line-clamp-1 block text-body text-text-secondary group-hover:text-text-primary">
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/news/${next.slug}`}
                className="group flex items-start gap-2 text-small text-text-tertiary transition-colors hover:text-text-primary md:flex-row-reverse md:text-right"
              >
                <ArrowRight className="mt-0.5 size-3.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="block text-caption uppercase">下一則</span>
                  <span className="line-clamp-1 block text-body text-text-secondary group-hover:text-text-primary">
                    {next.title}
                  </span>
                </div>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </Container>
    </main>
  );
}
