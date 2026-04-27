export type NewsCategory = 'ai' | 'crypto' | 'tools' | 'paper' | (string & {});

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  source_url: string | null;
  source_name: string | null;
  category: NewsCategory;
  tags: string[];
  cover_image: string | null;
  published_at: string;
}

export const CATEGORY_LABEL: Record<string, string> = {
  ai: 'AI',
  crypto: 'Crypto',
  tools: 'Tools',
  paper: 'Paper',
};
