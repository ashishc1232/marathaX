import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { marathaxRegistrations } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { getCategoryFee } from '../../../marathax/categoryServerConfig.js';
import { PAID_STATUS, razorpayAuthHeader, razorpayCreds } from '../../../marathax/registrationCore.js';

// Creates a Razorpay Order whose amount is decided ON THE SERVER from the category.
// Checkout can only pay exactly this amount — ₹0 / ₹1 / any other amount is impossible,
// because the amount belongs to the order, not to the browser.

interface Body {
  fullName?: string; email?: string; phone?: string; whatsapp?: string;
  dob?: string; age?: string; gender?: string; bloodGroup?: string;
  city?: string; state?: string; address?: string;
  emergencyContact?: string; emergencyPhone?: string;
  guardianName?: string; guardianPhone?: string; guardianConsent?: string;
  medicalCondition?: string; medicalDetails?: string;
  photoConsent?: string; rulesAccepted?: string; digitalSignature?: string;
  category?: string;
}

const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);

async function createRazorpayOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: razorpayAuthHeader() },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt, notes }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { description?: string } };
    throw new Error(err?.error?.description ?? `Razorpay API error: ${res.status}`);
  }
  return res.json() as Promise<{ id: string; amount: number; currency: string }>;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const b = (req.body ?? {}) as Body;

  const missing: string[] = [];
  for (const k of ['fullName', 'email', 'phone', 'whatsapp', 'dob', 'gender', 'city', 'state', 'address',
    'emergencyContact', 'emergencyPhone', 'digitalSignature', 'category'] as const) {
    if (!b[k]?.toString().trim()) missing.push(k);
  }
  if (b.rulesAccepted !== 'yes') missing.push('rulesAccepted');
  if (missing.length) {
    res.status(400).json({ error: `Required fields missing: ${missing.join(', ')}` });
    return;
  }

  const email = clip(b.email, 255).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({ error: 'Invalid email address.' }); return; }
  const phone = clip(b.phone, 20);
  if (!/^\d{10}$/.test(phone)) { res.status(400).json({ error: 'Phone must be a 10-digit number.' }); return; }

  const ageNum = parseInt(b.age ?? '0', 10);
  if (ageNum > 0 && ageNum < 18) {
    if (!b.guardianName?.trim() || !b.guardianPhone?.trim() || b.guardianConsent !== 'yes') {
      res.status(400).json({ error: 'Guardian name, phone, and consent are required for participants under 18.' });
      return;
    }
  }

  // ── Fee is resolved here. The client never sends an amount. ──
  const category = clip(b.category, 100);
  const fee = getCategoryFee(category);
  if (fee === null || fee < 1) { res.status(400).json({ error: 'Invalid category.' }); return; }
  const feePaise = fee * 100;

  // One confirmed registration per email
  const existing = await db
    .select({ status: marathaxRegistrations.status, regCode: marathaxRegistrations.regCode })
    .from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.email, email))
    .limit(20);
  const dup = existing.find((r) => r.status === PAID_STATUS && r.regCode);
  if (dup) {
    res.status(409).json({
      error: 'duplicate',
      message: `A confirmed registration already exists for ${email}. Code: ${dup.regCode}`,
      regCode: dup.regCode,
    });
    return;
  }

  let creds: { keyId: string };
  try { creds = razorpayCreds(); } catch (err) {
    console.error('razorpay.creds.missing', String(err));
    res.status(500).json({ error: 'Online payment is not configured yet. Please contact the organisers.' });
    return;
  }

  const receipt = `MX-${Date.now().toString(36).toUpperCase()}`;
  let order: { id: string; amount: number; currency: string };
  try {
    order = await createRazorpayOrder(feePaise, receipt, { athlete: clip(b.fullName, 100), category, email });
  } catch (err) {
    console.error('razorpay.order.create.failed', String(err));
    res.status(502).json({ error: 'Could not start payment. Please try again.' });
    return;
  }

  await db.insert(marathaxRegistrations).values({
    fullName: clip(b.fullName, 255), email, phone,
    whatsapp: clip(b.whatsapp, 20), dob: clip(b.dob, 20), age: clip(b.age, 10),
    gender: clip(b.gender, 20), bloodGroup: clip(b.bloodGroup, 10),
    city: clip(b.city, 100), state: clip(b.state, 100), address: clip(b.address, 1000),
    emergencyContact: clip(b.emergencyContact, 255), emergencyPhone: clip(b.emergencyPhone, 20),
    guardianName: clip(b.guardianName, 255), guardianPhone: clip(b.guardianPhone, 20),
    guardianConsent: clip(b.guardianConsent, 5),
    medicalCondition: b.medicalCondition === 'yes' ? 'yes' : 'no',
    medicalDetails: clip(b.medicalDetails, 2000),
    photoConsent: b.photoConsent === 'yes' ? 'yes' : 'no',
    rulesAccepted: 'yes',
    digitalSignature: clip(b.digitalSignature, 255),
    category, feePaise, feeDisplay: String(fee),
    razorpayOrderId: order.id,
    status: 'pending',
  });

  res.status(201).json({
    orderId: order.id,
    amount: order.amount,        // paise — locked by Razorpay for this order
    currency: order.currency,
    keyId: creds.keyId,          // public key id only
    fee,
    category,
    fullName: clip(b.fullName, 255), email, phone,
  });
}
