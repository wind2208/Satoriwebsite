import Link from 'next/link';
import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '連結失效',
  robots: { index: false, follow: false },
};

export default function InvalidPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center py-20">
      <Container>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            LINK · EXPIRED
          </p>
          <h1 className="text-h1 text-text-primary">連結失效</h1>
          <p className="text-body text-text-secondary">
            這個確認 / 退訂連結已經用過、或者拼錯了。從首頁重新訂一次就好。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/#subscribe" className={buttonVariants({ size: 'lg' })}>
              重新訂閱
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
