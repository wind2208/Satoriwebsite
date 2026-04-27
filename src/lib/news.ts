import 'server-only';

import { getServerClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import type { NewsItem } from '@/types/news';

type NewsRow = Database['public']['Tables']['news']['Row'];

function rowToItem(row: NewsRow): NewsItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    source_url: row.source_url,
    source_name: row.source_name,
    category: row.category ?? 'ai',
    tags: row.tags ?? [],
    cover_image: row.cover_image,
    published_at: row.published_at,
  };
}

export async function getLatestNews(limit = 5): Promise<NewsItem[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[news] getLatestNews failed:', error.message);
    return [];
  }
  return (data ?? []).map(rowToItem);
}

export async function getAllNews(limit = 50): Promise<NewsItem[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[news] getAllNews failed:', error.message);
    return [];
  }
  return (data ?? []).map(rowToItem);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`[news] getNewsBySlug(${slug}) failed:`, error.message);
    return null;
  }
  return data ? rowToItem(data) : null;
}

export async function getAdjacentNews(
  publishedAt: string,
): Promise<{ prev: { slug: string; title: string } | null; next: { slug: string; title: string } | null }> {
  const supabase = getServerClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from('news')
      .select('slug, title')
      .lt('published_at', publishedAt)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('news')
      .select('slug, title')
      .gt('published_at', publishedAt)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    prev: prevRes.data ?? null,
    next: nextRes.data ?? null,
  };
}
