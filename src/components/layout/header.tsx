'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/brand/logo';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/tools', label: 'Tools' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
] as const;

const SUBSCRIBE_HREF = '#subscribe';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="rounded-sm">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="主要導覽">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-small font-medium transition-colors',
                  active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={SUBSCRIBE_HREF} />}
          >
            訂閱
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? '關閉選單' : '開啟選單'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="grid size-9 place-items-center rounded-sm text-text-secondary hover:text-text-primary md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          'overflow-hidden border-t border-border-subtle md:hidden',
          open ? 'max-h-[260px]' : 'max-h-0',
          'transition-[max-height] duration-200 ease-out',
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  'rounded-sm py-2 text-body font-medium transition-colors',
                  active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={SUBSCRIBE_HREF} onClick={close} />}
            className="mt-2 self-start"
          >
            訂閱
          </Button>
        </Container>
      </div>
    </header>
  );
}
