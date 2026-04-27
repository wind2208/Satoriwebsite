'use client';

import { useEffect, useState } from 'react';

import { NewsRow } from '@/components/news-item';
import { getBrowserClient } from '@/lib/supabase/client';
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

interface NewsListProps {
  initial: NewsItem[];
  emptyMessage?: string;
}

export function NewsList({ initial, emptyMessage }: NewsListProps) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    const supabase = getBrowserClient();
    const channel = supabase
      .channel('news-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news' },
        (payload) => {
          const next = rowToItem(payload.new as NewsRow);
          setItems((prev) => (prev.some((p) => p.id === next.id) ? prev : [next, ...prev]));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border-subtle bg-bg-card/40 px-6 py-16 text-center text-small text-text-tertiary">
        {emptyMessage ?? '新聞流還沒接好。第一筆 webhook 進來後這裡會立刻出現。'}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-subtle bg-bg-card/40">
      {items.map((item) => (
        <NewsRow key={item.id} item={item} className="px-4 md:px-6" />
      ))}
    </div>
  );
}
