import { Hero } from '@/components/home/hero';
import { NewsSection } from '@/components/home/news-section';
import { SubscribeCTA } from '@/components/home/subscribe-cta';
import { ToolsSection } from '@/components/home/tools-section';
import { getLatestNews } from '@/lib/news';
import { getFeaturedTools } from '@/lib/tools';

export default async function HomePage() {
  const [tools, news] = await Promise.all([getFeaturedTools(3), getLatestNews(5)]);
  return (
    <main>
      <Hero />
      <ToolsSection tools={tools} />
      <NewsSection news={news} />
      <SubscribeCTA />
    </main>
  );
}
