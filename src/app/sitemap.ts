import type { MetadataRoute } from 'next';

import { getAllTools } from '@/lib/tools';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://satoriai.lab';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getAllTools();
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, priority: 1, changeFrequency: 'weekly', lastModified: now },
    { url: `${SITE_URL}/tools`, priority: 0.8, changeFrequency: 'weekly', lastModified: now },
    { url: `${SITE_URL}/about`, priority: 0.5, changeFrequency: 'monthly', lastModified: now },
    ...tools.map((t) => ({
      url: `${SITE_URL}/tools/${t.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: now,
    })),
  ];
}
