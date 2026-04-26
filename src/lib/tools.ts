import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Tool } from '@/types/tool';

const TOOLS_DIR = path.join(process.cwd(), 'src', 'content', 'tools');

let cache: Tool[] | null = null;

async function loadTools(): Promise<Tool[]> {
  if (cache) return cache;

  const files = await fs.readdir(TOOLS_DIR);
  const items = await Promise.all(
    files
      .filter((f) => f.endsWith('.json'))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(TOOLS_DIR, f), 'utf8');
        return JSON.parse(raw) as Tool;
      }),
  );

  items.sort((a, b) => a.sortOrder - b.sortOrder);
  cache = items;
  return items;
}

export async function getAllTools(): Promise<Tool[]> {
  return loadTools();
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const tools = await loadTools();
  return tools.find((t) => t.slug === slug) ?? null;
}

export async function getFeaturedTools(limit = 3): Promise<Tool[]> {
  const tools = await loadTools();
  return tools.filter((t) => t.featured).slice(0, limit);
}

export async function getRelatedTools(slug: string, category: string, limit = 2): Promise<Tool[]> {
  const tools = await loadTools();
  return tools.filter((t) => t.slug !== slug && t.category === category).slice(0, limit);
}
