import 'server-only';

import { createClient } from '@supabase/supabase-js';

import type { Database } from './types';

/**
 * Service-role client。**只在 server route handler 用**(/api/news/ingest、
 * /api/subscribe 之類),不要從 server component 呼叫。
 * 繞過 RLS,有完整讀寫權限 — 用之前確認 endpoint 自己有授權檢查。
 */
export function getAdminClient() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set — admin client requires it. ' +
        '檢查 Vercel Project Settings → Environment Variables。',
    );
  }
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
