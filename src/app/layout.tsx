import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://satoriai.lab';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SatoriAI Lab — 把 AI 算力,變成現實生產力',
    template: '%s · SatoriAI Lab',
  },
  description:
    'SatoriAI 實驗室 — 為技術人與內容創作者打造的 AI 工具集。展示開源工具、聚合 AI 新聞,把算力變成現實生產力。',
  keywords: ['SatoriAI', 'AI 工具', 'GEO', 'geofix', 'AI 新聞', '繁體中文'],
  authors: [{ name: 'SatoriAI Lab' }],
  creator: 'SatoriAI Lab',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: siteUrl,
    siteName: 'SatoriAI Lab',
    title: 'SatoriAI Lab — 把 AI 算力,變成現實生產力',
    description:
      'SatoriAI 實驗室 — 為技術人與內容創作者打造的 AI 工具集。展示開源工具、聚合 AI 新聞,把算力變成現實生產力。',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LL830813',
    creator: '@LL830813',
    title: 'SatoriAI Lab — 把 AI 算力,變成現實生產力',
    description:
      'SatoriAI 實驗室 — 為技術人與內容創作者打造的 AI 工具集。',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SatoriAI Lab',
  alternateName: 'SatoriAI 實驗室',
  url: siteUrl,
  description:
    'SatoriAI 實驗室 — 為技術人與內容創作者打造的 AI 工具集。展示開源工具、聚合 AI 新聞,把算力變成現實生產力。',
  sameAs: [
    'https://www.youtube.com/@satoriai_lab',
    'https://x.com/LL830813',
    'https://github.com/satoriai-lab',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <script
          type="application/ld+json"
          // 靜態 organization 結構化資料 — 給搜尋引擎跟 AI 爬蟲識別品牌
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
