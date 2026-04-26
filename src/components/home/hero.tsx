import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, var(--color-brand-glow), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
      />

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            SATORI · AI · LAB
          </p>

          <h1 className="text-balance text-[40px] leading-[1.15] font-medium text-text-primary md:text-display md:leading-[1.1]">
            把 AI 算力,<br className="hidden sm:inline" />
            變成「<span className="text-brand">現實生產力</span>」
          </h1>

          <p className="max-w-xl text-body text-text-secondary">
            為技術人與內容創作者打造的 AI 工具集。
            開源、繁體中文、台灣製造 — 把每天都看到的 AI 進展,做成你今天就能上手的工具。
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/tools" />}
              className="px-5"
            >
              瀏覽工具 <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="#subscribe" />}
              className="px-5"
            >
              訂閱新聞
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
