import 'server-only';

import { getServerClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import type { Tool } from '@/types/tool';

type ToolRow = Database['public']['Tables']['tools']['Row'];

function rowToTool(row: ToolRow): Tool {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description ?? '',
    githubRepo: row.github_repo,
    homepageUrl: row.homepage_url,
    language: row.language,
    category: row.category ?? 'Misc',
    status: row.status,
    featured: row.featured,
    sortOrder: row.sort_order,
    install: row.install,
    problemStatement: row.problem_statement,
    coverImage: row.cover_image,
  };
}

export async function getAllTools(): Promise<Tool[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[tools] getAllTools failed:', error.message);
    return [];
  }
  return (data ?? []).map(rowToTool);
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`[tools] getToolBySlug(${slug}) failed:`, error.message);
    return null;
  }
  return data ? rowToTool(data) : null;
}

export async function getFeaturedTools(limit = 3): Promise<Tool[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[tools] getFeaturedTools failed:', error.message);
    return [];
  }
  return (data ?? []).map(rowToTool);
}

export async function getRelatedTools(
  slug: string,
  category: string,
  limit = 2,
): Promise<Tool[]> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('category', category)
    .neq('slug', slug)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error(`[tools] getRelatedTools(${slug}) failed:`, error.message);
    return [];
  }
  return (data ?? []).map(rowToTool);
}
