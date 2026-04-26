export type ToolStatus = 'active' | 'beta' | 'coming-soon' | 'archived';

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  githubRepo: string | null;
  homepageUrl: string | null;
  language: string | null;
  category: string;
  status: ToolStatus;
  featured: boolean;
  sortOrder: number;
  install: string | null;
  problemStatement: string | null;
  coverImage?: string | null;
}
