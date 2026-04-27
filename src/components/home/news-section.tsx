import { Container } from '@/components/layout/container';
import { NewsRow } from '@/components/news-item';
import { SectionHeading } from '@/components/section-heading';
import type { NewsItem } from '@/types/news';

export function NewsSection({ news }: { news: NewsItem[] }) {
  return (
    <section className="border-t border-border-subtle bg-bg-secondary py-20 md:py-32">
      <Container>
        <SectionHeading
          caption="LATEST · NEWS"
          title="今天 AI 圈又發生了什麼"
          description="自家爬蟲過濾、LLM 寫摘要,Realtime 推送 — 新訊號一進 DB 就出現在這裡。"
          action={{ href: '/news', label: '查看全部' }}
        />
        {news.length > 0 ? (
          <div className="rounded-lg border border-border-subtle bg-bg-card/40">
            {news.map((item) => (
              <NewsRow key={item.id} item={item} className="px-4 md:px-6" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border-subtle bg-bg-card/40 px-6 py-12 text-center text-small text-text-tertiary">
            新聞流還沒接好,訂閱 RSS 或 X 帳號先 — 第一筆進來這裡會自動出現。
          </div>
        )}
      </Container>
    </section>
  );
}
