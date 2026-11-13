import type { Request } from 'express';
import crypto from 'node:crypto';
import QRCode from 'qrcode';
import { and, eq } from 'drizzle-orm';
import { getSecret } from '#airo/secrets';
import { db } from '../db/client.js';
import { marathaxRegistrations } from '../db/schema.js';
import { sendEmail } from '../email.js';
import { getCategoryPrizes } from './categoryServerConfig.js';

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers for MARATHAX registrations
//  • admin auth
//  • unique registration codes
//  • signed per-registration QR (check-in link)
//  • finalizePaid(): the ONLY place a registration becomes 'confirmed' online
// ─────────────────────────────────────────────────────────────────────────────

export const PAID_STATUS = 'confirmed';

/** Admin token. Set ADMIN_TOKEN in Secrets. Falls back to the old _PLACEHOLDER name. */
export function getAdminToken(): string {
  return String(getSecret('ADMIN_TOKEN') ?? getSecret('_PLACEHOLDER') ?? '');
}

export function isAdminRequest(req: Request): boolean {
  const adminToken = getAdminToken();
  const header = String(req.headers['authorization'] ?? '');
  const provided = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!adminToken || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(adminToken);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ── Razorpay credentials ─────────────────────────────────────────────────────
export function razorpayCreds(): { keyId: string; keySecret: string } {
  const keyId = String(getSecret('RAZORPAY_KEY_ID') ?? '');
  const keySecret = String(getSecret('RAZORPAY_KEY_SECRET') ?? '');
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).');
  }
  return { keyId, keySecret };
}

export function razorpayAuthHeader(): string {
  const { keyId, keySecret } = razorpayCreds();
  return 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
}

// ── Registration code ────────────────────────────────────────────────────────
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusion

export async function generateUniqueRegCode(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 8; attempt++) {
    let suffix = '';
    for (let i = 0; i < 5; i++) suffix += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
    const code = `MX-${year}-${suffix}`;
    const clash = await db
      .select({ id: marathaxRegistrations.id })
      .from(marathaxRegistrations)
      .where(eq(marathaxRegistrations.regCode, code))
      .limit(1);
    if (!clash.length) return code;
  }
  throw new Error('Could not generate a unique registration code.');
}

export const REG_CODE_RE = /^MX-\d{4}-[A-Z0-9]{4,8}$/;

// ── Signed QR / check-in link ────────────────────────────────────────────────
function qrSecret(): string {
  const s = String(getSecret('QR_SIGNING_SECRET') ?? getSecret('RAZORPAY_KEY_SECRET') ?? getSecret('ADMIN_TOKEN') ?? getSecret('_PLACEHOLDER') ?? '');
  if (!s) throw new Error('No signing secret configured (set QR_SIGNING_SECRET).');
  return s;
}

export function signRegCode(regCode: string): string {
  return crypto.createHmac('sha256', qrSecret()).update(regCode).digest('hex').slice(0, 20);
}

export function verifyRegCodeSig(regCode: string, sig: string): boolean {
  if (!REG_CODE_RE.test(regCode) || typeof sig !== 'string' || sig.length !== 20) return false;
  const expected = Buffer.from(signRegCode(regCode));
  const given = Buffer.from(sig);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

export function siteBaseUrl(req?: Request): string {
  const configured = String(getSecret('PUBLIC_SITE_URL') ?? '').replace(/\/+$/, '');
  if (configured) return configured;
  if (req) return `${req.protocol}://${req.get('host')}`;
  return 'https://marathax.com';
}

export function checkinUrl(base: string, regCode: string): string {
  return `${base}/marathax/checkin?code=${encodeURIComponent(regCode)}&s=${signRegCode(regCode)}`;
}

export async function qrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, { type: 'png', width: 512, margin: 2, errorCorrectionLevel: 'H' });
}

// ── Escape for HTML emails ───────────────────────────────────────────────────
export function esc(v: unknown): string {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

// ── Pass email (with QR) ─────────────────────────────────────────────────────
const PRIZE_LABELS = ['1st Place', '2nd Place', '3rd Place', '4th Place', '5th Place'];

function buildPassEmail(d: {
  fullName: string; phone: string; bloodGroup: string; category: string; fee: number;
  prizes: string[]; regCode: string; passRefId: string; qrImgUrl: string; verifyLink: string;
}): string {
  const prizeRows = d.prizes.map((p, i) =>
    `<tr><td style="padding:6px 0;color:#888;font-size:12px;">${PRIZE_LABELS[i]}</td><td style="padding:6px 0;text-align:right;font-weight:700;font-size:13px;color:${i === 0 ? '#d4af37' : '#ccc'};">${esc(p)}</td></tr>`).join('');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #333;max-width:600px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#E8820C,#C4700A);padding:32px 40px;text-align:center;">
    <p style="margin:0 0 6px;color:rgba(255,255,255,.8);font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:700;">OFFICIAL ENTRY PASS</p>
    <h1 style="margin:0;color:#fff;font-size:28px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">MARATHA X</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.75);font-size:12px;">FITNESS CHALLENGE — 10 JANUARY 2027 · MUMBAI</p>
  </td></tr>
  <tr><td style="padding:20px 40px 0;text-align:center;"><span style="display:inline-block;background:#0d2e1a;border:1px solid #22c55e;border-radius:20px;padding:8px 20px;color:#22c55e;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">✓ PAYMENT VERIFIED BY RAZORPAY</span></td></tr>
  <tr><td style="padding:20px 40px 0;text-align:center;">
    <h2 style="margin:0 0 8px;color:#d4af37;font-size:22px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">WELCOME TO THE ARENA!</h2>
    <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6;">Congratulations <strong style="color:#fff;">${esc(d.fullName)}</strong>! Your spot is secured for <strong style="color:#E8820C;">${esc(d.category)}</strong>.</p>
  </td></tr>
  <tr><td style="padding:20px 40px 0;text-align:center;">
    <div style="display:inline-block;background:#fff;padding:12px;border-radius:12px;"><img src="${esc(d.qrImgUrl)}" width="200" height="200" alt="Your unique entry QR" style="display:block;"></div>
    <p style="margin:10px 0 0;color:#888;font-size:12px;">Show this QR at the check-in desk. It is unique to you — do not share it.</p>
    <p style="margin:4px 0 0;color:#666;font-size:11px;">(QR image is also attached to this email as a PNG.)</p>
  </td></tr>
  <tr><td style="padding:16px 40px 0;"><table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:8px 0;border-bottom:1px solid #2a2a2a;"><span style="color:#888;font-size:11px;text-transform:uppercase;">Participant</span><br><span style="color:#fff;font-size:15px;font-weight:700;">${esc(d.fullName)}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;text-align:right;"><span style="color:#888;font-size:11px;text-transform:uppercase;">Category</span><br><span style="color:#E8820C;font-size:14px;font-weight:700;">${esc(d.category)}</span></td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #2a2a2a;"><span style="color:#888;font-size:11px;text-transform:uppercase;">Phone</span><br><span style="color:#fff;font-size:14px;">${esc(d.phone)}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;text-align:right;"><span style="color:#888;font-size:11px;text-transform:uppercase;">Blood Group</span><br><span style="color:#ef4444;font-size:14px;font-weight:700;">${esc(d.bloodGroup || '—')}</span></td></tr>
  </table></td></tr>
  <tr><td style="padding:16px 40px 0;"><div style="background:#111;border:1px solid #333;border-radius:8px;padding:14px 16px;"><table width="100%"><tr><td style="color:#888;font-size:12px;text-transform:uppercase;">Registration Fee Paid</td><td style="text-align:right;color:#d4af37;font-size:20px;font-weight:900;">₹${d.fee.toLocaleString('en-IN')}</td></tr></table></div></td></tr>
  ${d.prizes.length ? `<tr><td style="padding:16px 40px 0;"><div style="background:#111;border:1px solid #333;border-radius:8px;padding:14px 16px;"><p style="margin:0 0 10px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Prize Pool — ${esc(d.category)}</p><table width="100%">${prizeRows}</table></div></td></tr>` : ''}
  <tr><td style="padding:20px 40px 0;text-align:center;"><p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Registration Code</p><p style="margin:0;color:#d4af37;font-size:24px;font-weight:900;letter-spacing:4px;">${esc(d.regCode)}</p><p style="margin:4px 0 0;color:#555;font-size:11px;">Pass Ref: ${esc(d.passRefId)}</p></td></tr>
  <tr><td style="padding:16px 40px 24px;"><div style="background:#111;border:1px dashed #444;border-radius:8px;padding:14px;text-align:center;"><p style="margin:0;color:#ccc;font-size:13px;">Present your QR (or code <strong style="color:#d4af37;">${esc(d.regCode)}</strong>) at check-in on 10 January 2027.</p></div></td></tr>
  <tr><td style="background:#111;padding:16px 40px;text-align:center;border-top:1px solid #222;"><p style="margin:0 0 4px;color:#666;font-size:11px;">Questions? <a href="mailto:reservation@marathax.com" style="color:#E8820C;">reservation@marathax.com</a></p></td></tr>
</table></td></tr></table></body></html>`;
}

// ── finalizePaid ─────────────────────────────────────────────────────────────
export interface FinalizeResult {
  alreadyConfirmed: boolean;
  regCode: string;
  passRefId: string;
}

/**
 * Mark an online (Razorpay) registration as paid.
 * Idempotent and race-safe: the UPDATE only succeeds while status = 'pending',
 * so if the webhook and /verify-payment fire at the same time, exactly one of
 * them issues the code and sends the email.
 *
 * Caller MUST already have verified (a) signature and (b) amount === feePaise.
 */
export async function finalizePaid(
  orderId: string,
  paymentId: string,
  amountPaidPaise: number,
  baseUrl: string,
): Promise<FinalizeResult> {
  const rows = await db.select().from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.razorpayOrderId, orderId)).limit(1);
  const reg = rows[0];
  if (!reg) throw new Error('Registration not found for order.');

  if (reg.status === PAID_STATUS && reg.regCode) {
    return { alreadyConfirmed: true, regCode: reg.regCode, passRefId: reg.passRefId ?? '' };
  }

  const regCode = await generateUniqueRegCode();
  const passRefId = `PASS-${Date.now().toString(36).toUpperCase()}`;

  const upd = await db.update(marathaxRegistrations)
    .set({
      status: PAID_STATUS,
      razorpayPaymentId: paymentId,
      amountPaidPaise,
      paymentAmount: String(amountPaidPaise / 100),
      paymentDate: new Date().toISOString().slice(0, 10),
      utrNumber: paymentId,
      regCode,
      passRefId,
    })
    .where(and(eq(marathaxRegistrations.razorpayOrderId, orderId), eq(marathaxRegistrations.status, 'pending')));

  const affected = (upd as unknown as [{ affectedRows?: number }])[0]?.affectedRows ?? 0;
  if (affected === 0) {
    // Someone else won the race — return what they wrote.
    const again = await db.select().from(marathaxRegistrations)
      .where(eq(marathaxRegistrations.razorpayOrderId, orderId)).limit(1);
    return { alreadyConfirmed: true, regCode: again[0]?.regCode ?? '', passRefId: again[0]?.passRefId ?? '' };
  }

  // Email with unique QR
  try {
    const link = checkinUrl(baseUrl, regCode);
    const png = await qrPng(link);
    const prizes = getCategoryPrizes(reg.category) ?? [];
    await sendEmail({
      fromName: 'MARATHA X',
      to: reg.email,
      subject: `Your MARATHA X Entry Pass — ${regCode}`,
      html: buildPassEmail({
        fullName: reg.fullName, phone: reg.phone, bloodGroup: reg.bloodGroup, category: reg.category,
        fee: reg.feePaise / 100, prizes, regCode, passRefId,
        qrImgUrl: `${baseUrl}/api/marathax/qr/${encodeURIComponent(regCode)}?s=${signRegCode(regCode)}`,
        verifyLink: link,
      }),
      text: `MARATHA X\n\nWelcome ${reg.fullName}!\nReg Code: ${regCode}\nCategory: ${reg.category}\nFee: ₹${reg.feePaise / 100}\n\nShow the attached QR at check-in on 10 Jan 2027.\nreservation@marathax.com`,
      attachments: [{ filename: `MARATHAX-${regCode}.png`, content: png, contentType: 'image/png' }],
    });
    await db.update(marathaxRegistrations).set({ emailSentAt: new Date() })
      .where(eq(marathaxRegistrations.razorpayOrderId, orderId));
  } catch (err) {
    console.error('marathax.finalize.email.failed', String(err));
  }

  return { alreadyConfirmed: false, regCode, passRefId };
}
