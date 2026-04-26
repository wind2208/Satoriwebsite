import Link from 'next/link';

import { Logo } from '@/components/brand/logo';
import { GithubIcon } from '@/components/icons/github-icon';
import { XIcon } from '@/components/icons/x-icon';
import { YoutubeIcon } from '@/components/icons/youtube-icon';
import { Container } from '@/components/layout/container';

const SITE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'Tools' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
] as const;

const TOOLS_LINKS = [
  { href: 'https://geofix.xyz', label: 'geofix.xyz', external: true },
  { href: '/tools', label: '所有工具' },
] as const;

const NEWS_LINKS = [
  { href: '/news', label: 'News' },
  { href: '/rss.xml', label: 'RSS', external: true },
] as const;

const SOCIAL_LINKS = [
  {
    href: 'https://www.youtube.com/@satoriai_lab',
    label: 'YouTube',
    Icon: YoutubeIcon,
  },
  {
    href: 'https://x.com/LL830813',
    label: 'X',
    Icon: XIcon,
  },
  {
    href: 'https://github.com/satoriai-lab',
    label: 'GitHub',
    Icon: GithubIcon,
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-bg-secondary">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)] md:py-20">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-[260px] text-small text-text-tertiary">
            把 AI 算力,變成「現實生產力」。 <br />
            台灣製造的 AI 工具實驗室。
          </p>
        </div>

        <FooterColumn title="Site">
          {SITE_LINKS.map((item) => (
            <FooterLink key={item.href} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Tools">
          {TOOLS_LINKS.map((item) => (
            <FooterLink key={item.href} href={item.href} external={'external' in item ? item.external : false}>
              {item.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="News">
          {NEWS_LINKS.map((item) => (
            <FooterLink key={item.href} href={item.href} external={'external' in item ? item.external : false}>
              {item.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Social">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-small text-text-tertiary transition-colors hover:text-text-primary"
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </a>
          ))}
        </FooterColumn>
      </Container>

      <div className="border-t border-border-subtle">
        <Container className="flex flex-col gap-2 py-6 text-small text-text-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} SatoriAI Lab. All rights reserved.</span>
          <span className="italic">「先把刀磨利,再下山。」</span>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-caption font-medium text-text-muted uppercase">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-small text-text-tertiary transition-colors hover:text-text-primary"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="text-small text-text-tertiary transition-colors hover:text-text-primary"
    >
      {children}
    </Link>
  );
}
