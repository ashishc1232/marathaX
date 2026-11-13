import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { marathaxRegistrations } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../../../../email.js';
import { isAdminRequest, generateUniqueRegCode, checkinUrl, qrPng, signRegCode, siteBaseUrl } from '../../../../marathax/registrationCore.js';

function buildArenaPassEmail(d: {
  fullName: string; email: string; category: string;
  fee: number; regCode: string; qrImgUrl: string;
}): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #333;max-width:600px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#E8820C,#C4700A);padding:28px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">MARATHA X</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:12px;font-family:Arial,sans-serif;">FITNESS CHALLENGE · 10 JANUARY 2027 · MUMBAI</p>
  </td></tr>
  <tr><td style="padding:24px 40px 0;text-align:center;">
    <span style="display:inline-block;background:#1a2e1a;border:1px solid #22c55e;border-radius:20px;padding:8px 20px;color:#22c55e;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">✅ PAYMENT CONFIRMED — ARENA PASS ISSUED</span>
  </td></tr>
  <tr><td style="padding:20px 40px 0;">
    <h2 style="margin:0 0 8px;color:#fff;font-size:18px;font-weight:900;font-family:Arial,sans-serif;">You're In, ${d.fullName}!</h2>
    <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">
      Your payment has been verified. You are officially registered for <strong style="color:#E8820C;">${d.category}</strong>.
    </p>
  </td></tr>
  <tr><td style="padding:16px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border-radius:8px;border:1px solid #2a2a2a;">
      <tr><td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;">
        <span style="color:#888;font-size:11px;font-family:Arial,sans-serif;">REGISTRATION ID</span><br>
        <strong style="color:#E8820C;font-size:16px;letter-spacing:1px;font-family:Arial,sans-serif;">${d.regCode}</strong>
      </td></tr>
      <tr><td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;">
        <span style="color:#888;font-size:11px;font-family:Arial,sans-serif;">CATEGORY</span><br>
        <strong style="color:#fff;font-size:14px;font-family:Arial,sans-serif;">${d.category}</strong>
      </td></tr>
      <tr><td style="padding:12px 16px;">
        <span style="color:#888;font-size:11px;font-family:Arial,sans-serif;">REGISTRATION FEE PAID</span><br>
        <strong style="color:#fff;font-size:14px;font-family:Arial,sans-serif;">₹${d.fee.toLocaleString('en-IN')}</strong>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:16px 40px 0;text-align:center;">
    <div style="display:inline-block;background:#fff;padding:12px;border-radius:12px;"><img src="${d.qrImgUrl}" width="200" height="200" alt="Your unique entry QR" style="display:block;"></div>
    <p style="margin:8px 0 0;color:#888;font-size:12px;font-family:Arial,sans-serif;">Show this unique QR at check-in. Do not share it.</p>
  </td></tr>
  <tr><td style="padding:16px 40px 24px;">
    <p style="margin:0;color:#888;font-size:12px;line-height:1.6;font-family:Arial,sans-serif;">
      Please carry this Registration ID on event day. For queries, contact us at <a href="mailto:reservation@marathax.com" style="color:#E8820C;">reservation@marathax.com</a> or WhatsApp <a href="https://wa.me/917304103956" style="color:#E8820C;">+91 73041 03956</a>.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: 'Unauthorised.' });
    return;
  }

  const { id } = req.body as { id?: number };
  if (!id || typeof id !== 'number') {
    res.status(400).json({ error: 'Registration id is required.' });
    return;
  }

  const rows = await db.select().from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.id, id)).limit(1);
  const reg = rows[0];
  if (!reg) {
    res.status(404).json({ error: 'Registration not found.' });
    return;
  }
  if (reg.status === 'confirmed') {
    res.json({ ok: true, message: 'Already confirmed.' });
    return;
  }

  // Generate reg code if missing
  let regCode = reg.regCode ?? '';
  if (!regCode) {
    regCode = await generateUniqueRegCode();
  }

  await db.update(marathaxRegistrations)
    .set({ status: 'confirmed', regCode })
    .where(eq(marathaxRegistrations.id, id));

  // Send Arena Pass email
  const fee = Math.round((reg.feePaise ?? 0) / 100);
  try {
    const base = siteBaseUrl(req);
    const png = await qrPng(checkinUrl(base, regCode));
    await sendEmail({
      to: reg.email,
      subject: `✅ MARATHAX Arena Pass — ${regCode}`,
      html: buildArenaPassEmail({
        fullName: reg.fullName, email: reg.email, category: reg.category, fee, regCode,
        qrImgUrl: `${base}/api/marathax/qr/${encodeURIComponent(regCode)}?s=${signRegCode(regCode)}`,
      }),
      attachments: [{ filename: `MARATHAX-${regCode}.png`, content: png, contentType: 'image/png' }],
    });
  } catch {
    // Email failure is non-fatal — admin can retry
    res.json({ ok: true, regCode, emailSent: false, message: 'Confirmed. Email delivery failed — retry from dashboard.' });
    return;
  }

  res.json({ ok: true, regCode, emailSent: true });
}
