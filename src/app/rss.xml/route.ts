import { getAllNews } from '@/lib/news';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://satoriwebsite.vercel.app';

export const revalidate = 300;

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const news = await getAllNews(50);

  const items = news
    .map((item) => {
      const link = `${SITE_URL}/news/${item.slug}`;
      const pubDate = new Date(item.published_at).toUTCString();
      const summary = item.summary ?? '';
      const category = item.category
        ? `\n  <category>${escapeXml(item.category)}</category>`
        : '';
      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${escapeXml(link)}</link>
  <guid isPermaLink="true">${escapeXml(link)}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${escapeXml(summary)}</description>${category}
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>SatoriAI Lab — News</title>
  <link>${SITE_URL}/news</link>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  <description>AI / Tools / Paper / Crypto 圈每日訊號 — SatoriAI 自家爬蟲過濾 + LLM 摘要。</description>
  <language>zh-Hant-TW</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
