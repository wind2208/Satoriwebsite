'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Container } from '@/components/layout/container';
import { buttonVariants } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[error boundary]', error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center py-20">
      <Container>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            500 · UNEXPECTED
          </p>
          <h1 className="text-h1 text-text-primary">這邊出了點狀況</h1>
          <p className="text-body text-text-secondary">
            錯誤已經記下了。可以試重試一次,或先回首頁繞一圈再回來。
          </p>
          {error.digest ? (
            <p className="font-mono text-small text-text-muted">id · {error.digest}</p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              type="button"
              onClick={reset}
              className={buttonVariants({ size: 'lg' })}
            >
              重試
            </button>
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
