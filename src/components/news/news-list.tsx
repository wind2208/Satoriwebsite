'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { NewsRow } from '@/components/news-item';
import { getBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';
import { CATEGORY_LABEL, type NewsItem } from '@/types/news';

type NewsRowDB = Database['public']['Tables']['news']['Row'];

const CATEGORY_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'ai', label: CATEGORY_LABEL.ai },
  { value: 'tools', label: CATEGORY_LABEL.tools },
  { value: 'paper', label: CATEGORY_LABEL.paper },
  { value: 'crypto', label: CATEGORY_LABEL.crypto },
] as const;

type FilterValue = (typeof CATEGORY_FILTERS)[number]['value'];

function rowToItem(row: NewsRowDB): NewsItem {
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
  const [filter, setFilter] = useState<FilterValue>('all');
  const [newIds, setNewIds] = useState<Set<string>>(() => new Set());
  const newIdsTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timers = newIdsTimers.current;
    const supabase = getBrowserClient();
    const channel = supabase
      .channel('news-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news' },
        (payload) => {
          const next = rowToItem(payload.new as NewsRowDB);
          setItems((prev) => (prev.some((p) => p.id === next.id) ? prev : [next, ...prev]));
          setNewIds((prev) => {
            const updated = new Set(prev);
            updated.add(next.id);
            return updated;
          });
          // Drop the "new" marker after the animation finishes
          const timer = setTimeout(() => {
            setNewIds((prev) => {
              if (!prev.has(next.id)) return prev;
              const updated = new Set(prev);
              updated.delete(next.id);
              return updated;
            });
            timers.delete(next.id);
          }, 700);
          timers.set(next.id, timer);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.category === filter)),
    [items, filter],
  );

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="News category filter"
        className="-mx-1 flex flex-wrap items-center gap-1 overflow-x-auto"
      >
        {CATEGORY_FILTERS.map((tab) => {
          const active = tab.value === filter;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-small font-medium transition-colors',
                active
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="rounded-lg border border-border-subtle bg-bg-card/40">
          {filtered.map((item) => (
            <NewsRow
              key={item.id}
              item={item}
              className={cn('px-4 md:px-6', newIds.has(item.id) && 'news-row-new')}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border-subtle bg-bg-card/40 px-6 py-16 text-center text-small text-text-tertiary">
          {filter === 'all'
            ? (emptyMessage ?? '新聞流還沒接好。第一筆 webhook 進來後這裡會立刻出現。')
            : `這個分類目前還沒有新聞。`}
        </div>
      )}
    </div>
  );
}
