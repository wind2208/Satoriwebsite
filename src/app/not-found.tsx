import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center py-20">
      <Container>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            404 · NOT FOUND
          </p>
          <h1 className="text-h1 text-text-primary">這條路不在我們地圖上</h1>
          <p className="text-body text-text-secondary">
            連結可能改了、或是頁面還沒上線。從首頁、工具列表或 News 開始,通常找得到你要的東西。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/" className={buttonVariants({ size: 'lg' })}>
              回首頁
            </Link>
            <Link
              href="/tools"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              逛工具
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
