import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { ToolCard } from '@/components/tool-card';
import { getAllTools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'SatoriAI Lab 開源與自用工具總覽:GEO、新聞聚合、prompt 評測等。',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'Tools · SatoriAI Lab',
    description: 'SatoriAI Lab 開源與自用工具總覽。',
    url: '/tools',
  },
};

export default async function ToolsPage() {
  const tools = await getAllTools();

  return (
    <main className="py-16 md:py-24">
      <Container>
        <header className="mb-12 max-w-2xl space-y-3 md:mb-16">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            OPEN · TOOLS
          </p>
          <h1 className="text-h1 text-text-primary">Tools</h1>
          <p className="text-body text-text-secondary">
            這裡收錄 SatoriAI 自己每天在用的工具 — 上線中的、Beta 的、即將推出的都會列在這裡。
            點任何一張卡看更詳細的「為什麼有這個工具」與安裝方式。
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="full" />
          ))}
        </div>
      </Container>
    </main>
  );
}
