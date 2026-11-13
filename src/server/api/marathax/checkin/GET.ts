import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { marathaxRegistrations } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { isAdminRequest, PAID_STATUS, verifyRegCodeSig } from '../../../marathax/registrationCore.js';

// Called by the /marathax/checkin page that the QR opens.
//  • Valid signature, no admin token  → only "valid pass" + name + category
//  • Valid signature + admin token    → FULL registration details
export default async function handler(req: Request, res: Response): Promise<void> {
  const code = String(req.query.code ?? '').toUpperCase();
  const sig = String(req.query.s ?? '');
  if (!verifyRegCodeSig(code, sig)) {
    res.status(404).json({ valid: false, error: 'Invalid or tampered QR.' });
    return;
  }
  const rows = await db.select().from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.regCode, code)).limit(1);
  const r = rows[0];
  if (!r) { res.status(404).json({ valid: false, error: 'Registration not found.' }); return; }

  const confirmed = r.status === PAID_STATUS;
  if (!isAdminRequest(req)) {
    res.json({ valid: confirmed, status: r.status, regCode: r.regCode, fullName: r.fullName, category: r.category, staff: false });
    return;
  }
  res.json({
    valid: confirmed, staff: true, status: r.status, regCode: r.regCode,
    details: {
      fullName: r.fullName, email: r.email, phone: r.phone, whatsapp: r.whatsapp,
      dob: r.dob, age: r.age, gender: r.gender, bloodGroup: r.bloodGroup,
      city: r.city, state: r.state, address: r.address,
      emergencyContact: r.emergencyContact, emergencyPhone: r.emergencyPhone,
      guardianName: r.guardianName, guardianPhone: r.guardianPhone,
      medicalCondition: r.medicalCondition, medicalDetails: r.medicalDetails,
      category: r.category, feePaid: (r.amountPaidPaise || r.feePaise) / 100,
      paymentRef: r.razorpayPaymentId || r.utrNumber, passRefId: r.passRefId,
      registeredAt: r.createdAt,
    },
  });
}
