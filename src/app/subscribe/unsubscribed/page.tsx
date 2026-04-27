import Link from 'next/link';
import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '已取消訂閱',
  robots: { index: false, follow: false },
};

export default function UnsubscribedPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center py-20">
      <Container>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            UNSUBSCRIBED
          </p>
          <h1 className="text-h1 text-text-primary">已取消訂閱</h1>
          <p className="text-body text-text-secondary">
            已經把你從名單上移掉,不會再寄信。如果是誤點、或之後想回來,首頁的訂閱表單隨時開著。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/" className={buttonVariants({ size: 'lg' })}>
              回首頁
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
