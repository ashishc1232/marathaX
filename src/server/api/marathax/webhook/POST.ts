import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../../../db/client.js';
import { marathaxRegistrations } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { getSecret } from '#airo/secrets';
import { finalizePaid, PAID_STATUS, siteBaseUrl } from '../../../marathax/registrationCore.js';

// Razorpay webhook (safety net). If the customer closes the tab after paying,
// this still issues the pass. Subscribe to: payment.captured, payment.failed.

export default async function handler(req: Request, res: Response): Promise<void> {
  const webhookSecret = getSecret('RAZORPAY_WEBHOOK_SECRET');
  if (!webhookSecret) { res.status(500).json({ error: 'Webhook secret not configured.' }); return; }

  const signature = String(req.headers['x-razorpay-signature'] ?? '');
  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!signature || !rawBody) { res.status(400).json({ error: 'Missing signature or body.' }); return; }

  const expected = crypto.createHmac('sha256', String(webhookSecret)).update(rawBody).digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    console.warn('marathax.webhook: signature mismatch');
    res.status(400).json({ error: 'Signature verification failed.' });
    return;
  }

  const event = req.body as {
    event: string;
    payload?: { payment?: { entity?: { id: string; order_id: string; amount: number; currency?: string; status: string } } };
  };
  const payment = event?.payload?.payment?.entity;
  if (!payment?.order_id) { res.status(200).json({ ok: true, note: 'No payment entity — ignored.' }); return; }

  const rows = await db.select().from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.razorpayOrderId, payment.order_id)).limit(1);
  const reg = rows[0];
  if (!reg) { res.status(200).json({ ok: true, note: 'Order not found — ignored.' }); return; }

  if (event.event === 'payment.captured') {
    if (reg.status === PAID_STATUS) { res.status(200).json({ ok: true, note: 'Already confirmed.' }); return; }

    // Exact match required — anything else (₹0, ₹1, under- OR over-payment) is NOT confirmed.
    if (payment.amount !== reg.feePaise || (payment.currency && payment.currency !== 'INR')) {
      console.error(`marathax.webhook: amount mismatch order=${payment.order_id} expected=${reg.feePaise} got=${payment.amount}`);
      await db.update(marathaxRegistrations)
        .set({ status: 'failed', razorpayPaymentId: payment.id, amountPaidPaise: payment.amount })
        .where(eq(marathaxRegistrations.razorpayOrderId, payment.order_id));
      res.status(200).json({ ok: true, note: 'Amount mismatch — not confirmed.' });
      return;
    }

    try {
      const r = await finalizePaid(payment.order_id, payment.id, payment.amount, siteBaseUrl(req));
      console.log(`marathax.webhook: CONFIRMED ${r.regCode}`);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('marathax.webhook.finalize.failed', String(err));
      res.status(500).json({ error: 'Finalize failed — Razorpay will retry.' });
    }
    return;
  }

  if (event.event === 'payment.failed') {
    if (reg.status === 'pending') {
      await db.update(marathaxRegistrations).set({ razorpayPaymentId: payment.id })
        .where(eq(marathaxRegistrations.razorpayOrderId, payment.order_id));
      // keep 'pending' — customer may retry inside the same Checkout session
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(200).json({ ok: true, note: `Event ${event.event} not handled.` });
}
