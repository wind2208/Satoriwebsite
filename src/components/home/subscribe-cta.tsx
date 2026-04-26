'use client';

import { Rss } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { XIcon } from '@/components/icons/x-icon';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const X_HANDLE_URL = 'https://x.com/LL830813';
const RSS_HREF = '/rss.xml';

export function SubscribeCTA() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
              className="h-11 flex-1 bg-bg-card"
            />
            <Button
              type="submit"
              size="lg"
              className="h-11 px-5"
            >
              訂閱
            </Button>
          </form>

          {submitted ? (
            <p className="text-small text-text-secondary">
              我們正在準備訂閱系統,先{' '}
              <a
                href={X_HANDLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand hover:underline"
              >
                <XIcon className="size-3.5" /> follow X
              </a>{' '}
              不迷路。
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
