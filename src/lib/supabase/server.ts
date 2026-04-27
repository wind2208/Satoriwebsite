import 'server-only';

import { createClient } from '@supabase/supabase-js';

import type { Database } from './types';

/**
 * Server component / server route 用 anon key 的 client。
 * 公開資料(tools / news read)走這個。
 * 不需要 cookie / session — 這個專案目前沒有使用者登入。
 */
export function getServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
