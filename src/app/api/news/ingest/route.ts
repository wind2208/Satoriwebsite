import 'server-only';

import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { getAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_CATEGORIES = ['ai', 'crypto', 'tools', 'paper'] as const;
type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number];

interface IngestPayload {
  title?: unknown;
  summary?: unknown;
  content?: unknown;
  source_url?: unknown;
  source_name?: unknown;
  category?: unknown;
  tags?: unknown;
  cover_image?: unknown;
  published_at?: unknown;
  external_id?: unknown;
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function makeSlug(seed: string): string {
  const cleaned = seed
    .toLowerCase()
    .replace(/[^\w-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return cleaned.length > 0 ? cleaned : `news-${crypto.randomUUID().slice(0, 8)}`;
}

export async function POST(req: NextRequest) {
  const expected = process.env.NEWS_INGEST_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'NEWS_INGEST_SECRET not set' }, { status: 500 });
  }

  const token = req.headers.get('x-ingest-token');
  if (!token || token !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: IngestPayload;
  try {
    body = (await req.json()) as IngestPayload;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 422 });
  }

  const title = asString(body.title);
  const sourceUrl = asString(body.source_url);
  const category = asString(body.category);

  if (!title || !sourceUrl || !category) {
    return NextResponse.json(
      { error: 'missing required: title / source_url / category' },
      { status: 422 },
    );
  }

  if (!ALLOWED_CATEGORIES.includes(category as AllowedCategory)) {
    return NextResponse.json(
      { error: `category must be one of: ${ALLOWED_CATEGORIES.join(', ')}` },
      { status: 422 },
    );
  }

  const externalId = asString(body.external_id);
  const ingestSource = 'webhook';

  const supabase = getAdminClient();

  if (externalId) {
    const { data: existing } = await supabase
      .from('news')
      .select('*')
      .eq('ingest_source', ingestSource)
      .eq('external_id', externalId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }
  }

  const baseSlug = makeSlug(externalId ?? title);
  const insertPayload: Database['public']['Tables']['news']['Insert'] = {
    slug: baseSlug,
    title,
    summary: asString(body.summary),
    content: asString(body.content),
    source_url: sourceUrl,
    source_name: asString(body.source_name),
    category,
    tags: asStringArray(body.tags),
    cover_image: asString(body.cover_image),
    published_at: asString(body.published_at) ?? new Date().toISOString(),
    ingest_source: ingestSource,
    external_id: externalId,
  };

  let result = await supabase.from('news').insert(insertPayload).select('*').single();

  // Slug collision retry — append short random suffix once
  if (result.error && result.error.code === '23505') {
    const retried = { ...insertPayload, slug: `${baseSlug}-${crypto.randomUUID().slice(0, 6)}` };
    result = await supabase.from('news').insert(retried).select('*').single();
  }

  if (result.error) {
    console.error('[ingest] insert failed:', result.error.message);
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  // Wake stale caches so the new row appears on / and /news within seconds
  revalidatePath('/');
  revalidatePath('/news');

  return NextResponse.json(result.data, { status: 201 });
}
