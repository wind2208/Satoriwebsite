import 'server-only';

import { type NextRequest, NextResponse } from 'next/server';

import { sendUnsubscribedEmail } from '@/lib/resend';
import { getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://satoriai.org';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/subscribe/invalid`, 302);
  }

  const supabase = getAdminClient();
  const { data: row } = await supabase
    .from('subscribers')
    .select('id, email, status')
    .eq('confirm_token', token)
    .maybeSingle();

  if (!row) {
    return NextResponse.redirect(`${SITE_URL}/subscribe/invalid`, 302);
  }

  if (row.status === 'unsubscribed') {
    return NextResponse.redirect(`${SITE_URL}/subscribe/unsubscribed`, 302);
  }

  const { error } = await supabase
    .from('subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('id', row.id);

  if (error) {
    console.error('[unsubscribe] update failed:', error.message);
    return NextResponse.redirect(`${SITE_URL}/subscribe/invalid`, 302);
  }

  try {
    await sendUnsubscribedEmail(row.email);
  } catch (err) {
    console.error('[unsubscribe] email failed:', (err as Error).message);
  }

  return NextResponse.redirect(`${SITE_URL}/subscribe/unsubscribed`, 302);
}
