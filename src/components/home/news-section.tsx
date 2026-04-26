import { Container } from '@/components/layout/container';
import { NewsRow } from '@/components/news-item';
import { SectionHeading } from '@/components/section-heading';
import type { NewsItem } from '@/lib/mock-news';

export function NewsSection({ news }: { news: NewsItem[] }) {
  return (
    <section className="border-t border-border-subtle bg-bg-secondary py-20 md:py-32">
      <Container>
        <SectionHeading
          caption="LATEST · NEWS"
          title="今天 AI 圈又發生了什麼"
          description="自家爬蟲過濾、LLM 寫摘要;Phase 2 上線後會即時刷新。"
          action={{ href: '/news', label: '查看全部' }}
        />
        <div className="rounded-lg border border-border-subtle bg-bg-card/40">
          {news.map((item) => (
            <NewsRow key={item.id} item={item} className="px-4 md:px-6" />
          ))}
        </div>
      </Container>
    </section>
  );
}
