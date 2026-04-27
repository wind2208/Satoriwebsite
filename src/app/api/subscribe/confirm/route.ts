import 'server-only';

import { type NextRequest, NextResponse } from 'next/server';

import { sendWelcomeEmail } from '@/lib/resend';
import { getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://satoriwebsite.vercel.app';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/subscribe/invalid`, 302);
  }

  const supabase = getAdminClient();
  const { data: row, error: fetchError } = await supabase
    .from('subscribers')
    .select('id, email, status, confirm_token')
    .eq('confirm_token', token)
    .maybeSingle();

  if (fetchError || !row) {
    return NextResponse.redirect(`${SITE_URL}/subscribe/invalid`, 302);
  }

  // 已 active 的話也視為成功(使用者重新點 link 不應該爆)
  if (row.status === 'active') {
    return NextResponse.redirect(`${SITE_URL}/subscribe/confirmed`, 302);
  }

  // unsubscribed 已退訂的不重新啟用
  if (row.status === 'unsubscribed') {
    return NextResponse.redirect(`${SITE_URL}/subscribe/invalid`, 302);
  }

  const { error: updateError } = await supabase
    .from('subscribers')
    .update({ status: 'active', confirmed_at: new Date().toISOString() })
    .eq('id', row.id);

  if (updateError) {
    console.error('[confirm] update failed:', updateError.message);
    return NextResponse.redirect(`${SITE_URL}/subscribe/invalid`, 302);
  }

  try {
    await sendWelcomeEmail(row.email, token);
  } catch (err) {
    console.error('[confirm] welcome email failed:', (err as Error).message);
  }

  return NextResponse.redirect(`${SITE_URL}/subscribe/confirmed`, 302);
}
