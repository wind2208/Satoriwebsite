import 'server-only';

import { Resend } from 'resend';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://satoriai.org';

const FROM = process.env.RESEND_FROM_EMAIL ?? 'SatoriAI Lab <onboarding@resend.dev>';

let cached: Resend | null = null;
function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY not set — Resend client unavailable');
  }
  cached ??= new Resend(key);
  return cached;
}

const baseStyles = {
  body: 'background:#0A0E1A;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;padding:0;',
  container:
    'max-width:560px;margin:0 auto;padding:48px 32px;background:#0A0E1A;color:#FFFFFF;',
  caption:
    'font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6B8AB5;font-weight:500;margin:0 0 24px;',
  h1: 'font-size:28px;line-height:1.25;font-weight:500;color:#FFFFFF;margin:0 0 16px;',
  body_p:
    'font-size:15px;line-height:1.7;color:#A8B5C7;margin:0 0 16px;',
  button:
    'display:inline-block;background:#3D7BCC;color:#FFFFFF;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:500;margin:24px 0;',
  hr: 'border:none;border-top:1px solid rgba(255,255,255,0.06);margin:40px 0 24px;',
  small:
    'font-size:13px;line-height:1.6;color:#6B8AB5;margin:0 0 8px;',
  link: 'color:#3D7BCC;text-decoration:none;',
};

function shellHtml(title: string, inner: string): string {
  return `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
</head>
<body style="${baseStyles.body}">
<div style="${baseStyles.container}">
${inner}
<hr style="${baseStyles.hr}" />
<p style="${baseStyles.small}">SatoriAI Lab · 把 AI 算力,變成現實生產力</p>
<p style="${baseStyles.small}">
<a href="${SITE_URL}" style="${baseStyles.link}">satoriai.org</a> ·
<a href="https://www.youtube.com/@satoriai_lab" style="${baseStyles.link}">YouTube</a> ·
<a href="https://x.com/LL830813" style="${baseStyles.link}">X</a>
</p>
</div>
</body>
</html>`;
}

function confirmHtml(confirmUrl: string): string {
  return shellHtml(
    '確認訂閱 · SatoriAI Lab',
    `
<p style="${baseStyles.caption}">SATORI · AI · LAB</p>
<h1 style="${baseStyles.h1}">最後一步,確認你的訂閱</h1>
<p style="${baseStyles.body_p}">嗨,有人(我們希望就是你)用這個 email 訂閱了 SatoriAI Lab 的新聞。點下面這顆按鈕完成確認:</p>
<a href="${confirmUrl}" style="${baseStyles.button}">確認訂閱 →</a>
<p style="${baseStyles.body_p}">如果你沒有訂閱,直接忽略這封信就好,我們不會繼續寄信給你。</p>
<p style="${baseStyles.small}">如果按鈕點不開,把這串貼到瀏覽器:<br /><a href="${confirmUrl}" style="${baseStyles.link}">${confirmUrl}</a></p>
`,
  );
}

function welcomeHtml(unsubscribeUrl: string): string {
  return shellHtml(
    '歡迎加入 · SatoriAI Lab',
    `
<p style="${baseStyles.caption}">YOU · ARE · IN</p>
<h1 style="${baseStyles.h1}">歡迎加入 SatoriAI Lab</h1>
<p style="${baseStyles.body_p}">確認完成。從這週開始,我們會在每週日早上 9 點(台灣時間)寄一封精選 — 過去 7 天最值得看的 AI / 工具 / paper。</p>
<p style="${baseStyles.body_p}">如果想看更即時的訊號,我們的 News 流是 Realtime 推送,進站就看得到:</p>
<a href="${SITE_URL}/news" style="${baseStyles.button}">看 News →</a>
<p style="${baseStyles.body_p}">想退訂隨時都可以,信底下會永遠有一條退訂連結。</p>
<p style="${baseStyles.small}">已經想退了?<a href="${unsubscribeUrl}" style="${baseStyles.link}">點這裡退訂</a></p>
`,
  );
}

function unsubscribedHtml(): string {
  return shellHtml(
    '已取消訂閱 · SatoriAI Lab',
    `
<p style="${baseStyles.caption}">UNSUBSCRIBED</p>
<h1 style="${baseStyles.h1}">已取消訂閱</h1>
<p style="${baseStyles.body_p}">已經把你從訂閱者名單裡移除,不會再寄信給你。</p>
<p style="${baseStyles.body_p}">如果是誤點或之後想回來,首頁的訂閱表單隨時都歡迎你。</p>
<a href="${SITE_URL}" style="${baseStyles.button}">回首頁 →</a>
`,
  );
}

export async function sendConfirmEmail(email: string, token: string): Promise<void> {
  const url = `${SITE_URL}/api/subscribe/confirm?token=${encodeURIComponent(token)}`;
  await getClient().emails.send({
    from: FROM,
    to: email,
    subject: '確認訂閱 SatoriAI Lab',
    html: confirmHtml(url),
  });
}

export async function sendWelcomeEmail(email: string, token: string): Promise<void> {
  const url = `${SITE_URL}/api/subscribe/unsubscribe?token=${encodeURIComponent(token)}`;
  await getClient().emails.send({
    from: FROM,
    to: email,
    subject: '歡迎加入 SatoriAI Lab',
    html: welcomeHtml(url),
  });
}

export async function sendUnsubscribedEmail(email: string): Promise<void> {
  await getClient().emails.send({
    from: FROM,
    to: email,
    subject: '已取消訂閱 · SatoriAI Lab',
    html: unsubscribedHtml(),
  });
}
