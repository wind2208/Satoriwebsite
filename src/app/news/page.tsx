import { Rss } from 'lucide-react';
import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { NewsList } from '@/components/news/news-list';
import { getAllNews } from '@/lib/news';

export const metadata: Metadata = {
  title: 'News',
  description:
    'AI / Tools / Paper / Crypto 圈每日訊號 — SatoriAI 自家爬蟲過濾、LLM 寫摘要、Realtime 推送。',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'News · SatoriAI Lab',
    description: 'AI / Tools / Paper / Crypto 圈每日訊號。',
    url: '/news',
    type: 'website',
  },
};

export const revalidate = 60;

export default async function NewsPage() {
  const news = await getAllNews(50);

  return (
    <main className="py-16 md:py-24">
      <Container>
        <header className="mb-12 max-w-2xl space-y-3 md:mb-16">
          <p className="text-caption font-medium text-text-tertiary uppercase">LATEST · NEWS</p>
          <h1 className="text-h1 text-text-primary">News</h1>
          <p className="text-body text-text-secondary">
            自家爬蟲過濾、LLM 寫摘要、Realtime 推送。最新訊號一進 DB 就出現在這裡,不用 refresh。
          </p>
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-2 text-small text-text-tertiary transition-colors hover:text-text-primary"
          >
            <Rss className="size-3.5" />
            訂閱 RSS
          </a>
        </header>

        <NewsList initial={news} />
      </Container>
    </main>
  );
}
