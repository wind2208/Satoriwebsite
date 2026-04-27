'use client';

import { Rss } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const RSS_HREF = '/rss.xml';

type Status = 'idle' | 'submitting' | 'sent' | 'error';

export function SubscribeCTA() {
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'home_cta', topics: ['ai'] }),
      });
      // 後端統一回 200,不論 email 是否已存在
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="subscribe" className="bg-bg-secondary py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <p className="text-caption font-medium text-text-tertiary uppercase">
            STAY · IN · THE · LOOP
          </p>
          <h2 className="text-h1 text-text-primary md:text-[40px] md:leading-tight">
            把訊號 push 進你的 inbox
          </h2>
          <p className="text-body text-text-secondary">
            一週一封,精選 AI / 工具 / paper。寫得短、可以略過、隨時退訂。
          </p>

          <form
            onSubmit={onSubmit}
            className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              required
              placeholder="you@inbox.com"
              aria-label="你的 email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'submitting' || status === 'sent'}
              className="h-11 flex-1 bg-bg-card"
            />
            <Button
              type="submit"
              size="lg"
              disabled={status === 'submitting' || status === 'sent'}
              className={cn('h-11 px-5', status === 'sent' && 'pointer-events-none')}
            >
              {status === 'submitting' ? '寄送中…' : status === 'sent' ? '已寄出 ✓' : '訂閱'}
            </Button>
          </form>

          {status === 'sent' ? (
            <p className="text-small text-text-secondary">
              如果這個 email 沒訂過,我們已經寄了一封確認信過去 — 點裡面的按鈕完成訂閱。
            </p>
          ) : null}

          {status === 'error' ? (
            <p className="text-small text-warning">
              網路有點不順,等一下再試一次。
            </p>
          ) : null}

          <p className="flex items-center justify-center gap-2 text-small text-text-muted">
            <Rss className="size-3.5" />
            也支援 RSS:
            <a
              href={RSS_HREF}
              className="text-text-tertiary hover:text-text-primary"
            >
              {RSS_HREF}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
