import { createBrowserClient } from '@supabase/ssr';

import type { Database } from './types';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Browser / client-component 用。Singleton — 同一個 tab 只會建一個。
 * 用於 Phase 2 的 /news realtime 訂閱。
 */
export function getBrowserClient() {
  browserClient ??= createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return browserClient;
}
