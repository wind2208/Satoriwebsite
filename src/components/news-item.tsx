import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABEL, type NewsItem } from '@/types/news';
import { cn } from '@/lib/utils';

export function NewsRow({ item, className }: { item: NewsItem; className?: string }) {
  const relative = formatDistanceToNow(new Date(item.published_at), {
    addSuffix: true,
    locale: zhTW,
  });
  const categoryLabel = CATEGORY_LABEL[item.category] ?? item.category;
  const rowClass = cn(
    'group flex flex-col gap-3 border-b border-border-subtle py-5 transition-colors',
    'last:border-b-0 hover:bg-bg-card/40',
    'md:grid md:grid-cols-[120px_72px_1fr] md:items-center md:gap-6 md:px-2',
    className,
  );

  const inner = (
    <>
      <span className="text-small text-text-muted md:text-caption md:tracking-wider">
        {relative}
      </span>
      <Badge
        variant="outline"
        className="self-start border-border-default text-[11px] font-medium tracking-wide text-text-secondary"
      >
        {categoryLabel}
      </Badge>
      <div className="flex items-start justify-between gap-3">
        <span className="text-body text-text-primary transition-colors group-hover:text-brand">
          {item.title}
        </span>
        <span aria-hidden className="hidden text-small text-text-muted md:inline">
          →
        </span>
      </div>
    </>
  );

  return (
    <Link href={`/news/${item.slug}`} className={rowClass}>
      {inner}
    </Link>
  );
}
