import 'server-only';

import { type NextRequest, NextResponse } from 'next/server';

import { sendConfirmEmail } from '@/lib/resend';
import { getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribePayload {
  email?: unknown;
  source?: unknown;
  topics?: unknown;
}

function generateToken(): string {
  // 32 random bytes → 64 hex chars,base64url encoded a touch shorter
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  let body: SubscribePayload;
  try {
    body = (await req.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source : 'unknown';
  const topics = Array.isArray(body.topics)
    ? body.topics.filter((t): t is string => typeof t === 'string')
    : ['ai'];

  // 不論 email 格式對錯都回 200,避免 enumeration
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const supabase = getAdminClient();

  // 已存在 → 也回 200 不洩漏狀態,但已存在的不再寄 confirm 信(不騷擾使用者)
  const { data: existing } = await supabase
    .from('subscribers')
    .select('id, status')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const token = generateToken();
  const { error } = await supabase.from('subscribers').insert({
    email,
    status: 'pending',
    confirm_token: token,
    source,
    topics: topics.length > 0 ? topics : ['ai'],
  });

  if (error) {
    console.error('[subscribe] insert failed:', error.message);
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    await sendConfirmEmail(email, token);
  } catch (err) {
    // Email 寄不出去也不告訴使用者(避免暴露我方狀態),但留 log 方便我們追
    console.error('[subscribe] send confirm email failed:', (err as Error).message);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
