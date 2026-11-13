import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../../../db/client.js';
import { marathaxRegistrations } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { checkinUrl, finalizePaid, razorpayAuthHeader, razorpayCreds, signRegCode, siteBaseUrl } from '../../../marathax/registrationCore.js';
import { getCategoryPrizes } from '../../../marathax/categoryServerConfig.js';

// Called by the browser right after Razorpay Checkout succeeds.
// We do NOT trust the browser: we (1) verify Razorpay's HMAC signature,
// (2) ask Razorpay directly for the payment and check order, currency, status
// AND that amount === the fee stored when the order was created.

interface RzpPayment { id: string; order_id: string; amount: number; currency: string; status: string }

async function fetchPayment(paymentId: string): Promise<RzpPayment> {
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: razorpayAuthHeader() },
  });
  if (!res.ok) throw new Error(`Razorpay payment lookup failed (${res.status})`);
  return res.json() as Promise<RzpPayment>;
}

async function capturePayment(paymentId: string, amount: number): Promise<RzpPayment> {
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: razorpayAuthHeader() },
    body: JSON.stringify({ amount, currency: 'INR' }),
  });
  if (!res.ok) throw new Error(`Razorpay capture failed (${res.status})`);
  return res.json() as Promise<RzpPayment>;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = (req.body ?? {}) as {
    razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string;
  };
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing payment details.' });
    return;
  }

  let keySecret: string;
  try { keySecret = razorpayCreds().keySecret; } catch {
    res.status(500).json({ error: 'Payment not configured.' });
    return;
  }

  // 1) Signature
  const expected = crypto.createHmac('sha256', keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    console.warn('marathax.verify: signature mismatch');
    res.status(400).json({ error: 'Payment signature verification failed.' });
    return;
  }

  // 2) Our own record for this order
  const rows = await db.select().from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.razorpayOrderId, razorpay_order_id)).limit(1);
  const reg = rows[0];
  if (!reg) { res.status(404).json({ error: 'Order not found.' }); return; }

  // 3) Ask Razorpay what was REALLY paid
  try {
    let p = await fetchPayment(razorpay_payment_id);
    if (p.order_id !== razorpay_order_id || p.currency !== 'INR') {
      res.status(400).json({ error: 'Payment does not belong to this order.' });
      return;
    }
    if (p.amount !== reg.feePaise) {
      console.error(`marathax.verify: AMOUNT MISMATCH order=${razorpay_order_id} expected=${reg.feePaise} got=${p.amount}`);
      res.status(400).json({ error: 'Paid amount does not match the registration fee. Please contact the organisers.' });
      return;
    }
    if (p.status === 'authorized') p = await capturePayment(razorpay_payment_id, reg.feePaise);
    if (p.status !== 'captured') {
      res.status(402).json({ error: `Payment not completed (status: ${p.status}).`, status: p.status });
      return;
    }

    const base = siteBaseUrl(req);
    const result = await finalizePaid(razorpay_order_id, razorpay_payment_id, p.amount, base);
    res.json({
      status: 'confirmed',
      regCode: result.regCode,
      passRefId: result.passRefId,
      qrImageUrl: `/api/marathax/qr/${encodeURIComponent(result.regCode)}?s=${signRegCode(result.regCode)}`,
      checkinUrl: checkinUrl(base, result.regCode),
      participant: {
        fullName: reg.fullName, email: reg.email, phone: reg.phone, age: reg.age, gender: reg.gender,
        bloodGroup: reg.bloodGroup, category: reg.category, fee: reg.feePaise / 100,
        prizes: getCategoryPrizes(reg.category) ?? [],
      },
    });
  } catch (err) {
    console.error('marathax.verify.failed', String(err));
    res.status(502).json({ error: 'Could not verify payment right now. If money was deducted, your pass will be emailed automatically.' });
  }
}
