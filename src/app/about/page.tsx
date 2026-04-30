import { ArrowUpRight, Mail } from 'lucide-react';
import type { Metadata } from 'next';

import { GithubIcon } from '@/components/icons/github-icon';
import { XIcon } from '@/components/icons/x-icon';
import { YoutubeIcon } from '@/components/icons/youtube-icon';
import { Container } from '@/components/layout/container';
import type { ComponentType, SVGProps } from 'react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'SatoriAI Lab — 把 AI 算力變成現實生產力。台灣製造,給技術人與內容創作者用的 AI 工具實驗室。',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About · SatoriAI Lab',
    description:
      'SatoriAI Lab — 把 AI 算力變成現實生產力。台灣製造,給技術人與內容創作者用的 AI 工具實驗室。',
    url: '/about',
  },
};

interface ConnectCard {
  href: string;
  label: string;
  handle: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
}

const CONNECT_CARDS: ConnectCard[] = [
  {
    href: 'https://www.youtube.com/@satoriai_lab',
    label: 'YouTube',
    handle: '@satoriai_lab',
    description: 'AI 工具開箱、實作教學、自家工具進度。3,460 訂閱、持續更新。',
    Icon: YoutubeIcon,
    external: true,
  },
  {
    href: 'https://x.com/LL830813',
    label: 'X',
    handle: '@LL830813',
    description: 'AI 圈即時新聞 + 自家踩雷紀錄,3,905 跟隨。',
    Icon: XIcon,
    external: true,
  },
  {
    href: 'https://github.com/satoriai-lab',
    label: 'GitHub',
    handle: 'satoriai-lab',
    description: '所有開源工具、experiments、issue 都在這裡 — PR 歡迎。',
    Icon: GithubIcon,
    external: true,
  },
  {
    href: 'https://linktr.ee/satoriai',
    label: 'Linktree',
    handle: 'linktr.ee/satoriai',
    description: '集中管理所有平台的 hub。新來的可以從這裡開始。',
    Icon: ArrowUpRight,
    external: true,
  },
  {
    href: 'mailto:hello@satoriai.org',
    label: 'Email',
    handle: 'hello@satoriai.org',
    description: '合作、媒體、想跟我們講話 — 寫信最快。',
    Icon: Mail,
  },
];

export default function AboutPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        <header className="mb-14 max-w-2xl space-y-3 md:mb-20">
          <p className="text-caption font-medium text-text-tertiary uppercase">ABOUT · LAB</p>
          <h1 className="text-h1 text-text-primary">把 AI 算力,變成現實生產力</h1>
          <p className="text-body text-text-secondary">
            SatoriAI Lab 是一個實驗室,不是公司。我們做的事很單純:把每天追到的 AI 進展,做成台灣使用者今天就能用的工具。
          </p>
        </header>

        <section className="mx-auto max-w-2xl space-y-6 text-body text-text-secondary">
          <p>
            這個 lab 從 YouTube 頻道
            <a
              href="https://www.youtube.com/@satoriai_lab"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-text-primary hover:text-brand"
            >
              @satoriai_lab
            </a>
            開始。一開始只是把試過的 AI 工具、踩過的雷錄起來;久了訂閱數累積、社群裡有人開始問
            「能不能直接給我 prompt」、「能不能寫一個小工具」 — 於是就有了 geofix、有了之後一連串會釋出的東西。
          </p>
          <p>
            「Satori」(悟) 是禪宗的詞,指的不是「學會新東西」,而是「把已知的東西看清楚」。
            AI 不會發明你不會做的事,但會把你已經會但太貴、太慢、太煩的事壓到可承受的成本。
            這個 lab 想做的就是這件事 — 找出那些「壓下去就會解放生產力」的角落,做工具、寫教學、收新聞、串起來。
          </p>
          <p>
            我們不追大模型訓練、不做學術 benchmark、不出 SaaS 產品 — 開源工具 + 教學 + 內容,是這個 lab 的全部。
            如果你跟我們的方向一致,訂閱、follow、star 都很歡迎;有想合作的事情,寫信最快。
          </p>
        </section>

        <section className="mt-20 md:mt-28">
          <p className="mb-2 text-caption font-medium text-text-tertiary uppercase">
            CONNECT · WITH · US
          </p>
          <h2 className="mb-8 text-h2 text-text-primary">在這幾個地方都找得到我們</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CONNECT_CARDS.map((card) => {
              const isExternal = card.external ?? false;
              return (
                <a
                  key={card.href}
                  href={card.href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex h-full flex-col gap-4 rounded-lg border border-border-subtle bg-bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-border-default hover:bg-bg-elevated"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-md bg-bg-elevated text-text-primary">
                      <card.Icon className="size-4" />
                    </span>
                    <ArrowUpRight className="size-4 text-text-muted transition-colors group-hover:text-text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-h3 text-text-primary">{card.label}</h3>
                    <p className="font-mono text-small text-text-tertiary">{card.handle}</p>
                  </div>
                  <p className="mt-auto text-small text-text-secondary">{card.description}</p>
                </a>
              );
            })}
          </div>
        </section>
      </Container>
    </main>
  );
}
