import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/section-heading';
import { ToolCard } from '@/components/tool-card';
import type { Tool } from '@/types/tool';

export function ToolsSection({ tools }: { tools: Tool[] }) {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <SectionHeading
          caption="OPEN · TOOLS"
          title="自家工具,自家用、自家養"
          description="這些工具就是 SatoriAI 自己每天在用的東西 — 用得順了再開源、再更新。"
          action={{ href: '/tools', label: '查看全部' }}
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </Container>
    </section>
  );
}
