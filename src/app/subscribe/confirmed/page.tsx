import Link from 'next/link';
import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '訂閱確認完成',
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center py-20">
      <Container>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            YOU · ARE · IN
          </p>
          <h1 className="text-h1 text-text-primary">訂閱完成</h1>
          <p className="text-body text-text-secondary">
            從這週開始,我們會在每週日早上 9 點(台灣時間)寄一封精選 — 過去 7 天最值得看的 AI / 工具 / paper。
          </p>
          <p className="text-body text-text-secondary">
            想看更即時的訊號,News 流是 Realtime 推送的。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/news" className={buttonVariants({ size: 'lg' })}>
              看 News
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              回首頁
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
