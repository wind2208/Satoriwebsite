import { Hero } from '@/components/home/hero';
import { NewsSection } from '@/components/home/news-section';
import { SubscribeCTA } from '@/components/home/subscribe-cta';
import { ToolsSection } from '@/components/home/tools-section';
import { MOCK_NEWS } from '@/lib/mock-news';
import { getFeaturedTools } from '@/lib/tools';

export default async function HomePage() {
  const tools = await getFeaturedTools(3);
  return (
    <main>
      <Hero />
      <ToolsSection tools={tools} />
      <NewsSection news={MOCK_NEWS} />
      <SubscribeCTA />
    </main>
  );
}
