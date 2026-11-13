import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { marathaxRegistrations } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { getCategoryFee } from '../../../marathax/categoryServerConfig.js';
import { sendEmail } from '../../../email.js';
import { generateUniqueRegCode } from '../../../marathax/registrationCore.js';

// UPI registration — stores pending registration with all athlete details.
// Admin manually verifies payment and confirms via admin dashboard.

function buildAckEmail(d: {
  fullName: string; email: string; category: string;
  fee: number; utrNumber: string; regCode: string;
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
    <span style="display:inline-block;background:#1a2e1a;border:1px solid #f59e0b;border-radius:20px;padding:8px 20px;color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">⏳ PAYMENT VERIFICATION PENDING</span>
  </td></tr>
  <tr><td style="padding:20px 40px 0;">
    <h2 style="margin:0 0 8px;color:#fff;font-size:18px;font-weight:900;font-family:Arial,sans-serif;">Registration Received, ${d.fullName}!</h2>
    <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">
      We've received your registration for <strong style="color:#E8820C;">${d.category}</strong>. Our team will verify your UPI payment and send your Arena Pass within 2–4 hours.
    </p>
  </td></tr>
  <tr><td style="padding:16px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border-radius:8px;border:1px solid #2a2a2a;">
      <tr><td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;">
        <span style="color:#888;font-size:11px;font-family:Arial,sans-serif;">REFERENCE CODE</span><br>
        <strong style="color:#E8820C;font-size:16px;letter-spacing:1px;font-family:Arial,sans-serif;">${d.regCode}</strong>
      </td></tr>
      <tr><td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;">
        <span style="color:#888;font-size:11px;font-family:Arial,sans-serif;">CATEGORY</span><br>
        <strong style="color:#fff;font-size:14px;font-family:Arial,sans-serif;">${d.category}</strong>
      </td></tr>
      <tr><td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;">
        <span style="color:#888;font-size:11px;font-family:Arial,sans-serif;">REGISTRATION FEE</span><br>
        <strong style="color:#fff;font-size:14px;font-family:Arial,sans-serif;">₹${d.fee.toLocaleString('en-IN')}</strong>
      </td></tr>
      <tr><td style="padding:12px 16px;">
        <span style="color:#888;font-size:11px;font-family:Arial,sans-serif;">UTR / TRANSACTION REF</span><br>
        <strong style="color:#fff;font-size:14px;font-family:Arial,sans-serif;">${d.utrNumber}</strong>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:16px 40px 24px;">
    <p style="margin:0;color:#888;font-size:12px;line-height:1.6;font-family:Arial,sans-serif;">
      For queries, contact us at <a href="mailto:reservation@marathax.com" style="color:#E8820C;">reservation@marathax.com</a> or WhatsApp <a href="https://wa.me/917304103956" style="color:#E8820C;">+91 73041 03956</a>.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`.trim();
}

function buildAdminNotifEmail(d: {
  fullName: string; email: string; phone: string; whatsapp: string;
  dob: string; age: string; gender: string; bloodGroup: string;
  city: string; state: string; address: string;
  emergencyContact: string; emergencyPhone: string;
  guardianName: string; guardianPhone: string;
  medicalCondition: string; medicalDetails: string;
  category: string; fee: number; utrNumber: string;
  paymentDate: string; paymentAmount: string;
  digitalSignature: string; regCode: string; screenshotPath: string;
}): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #333;max-width:600px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#E8820C,#C4700A);padding:20px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:900;font-family:Arial,sans-serif;">NEW REGISTRATION — ADMIN ALERT</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:12px;font-family:Arial,sans-serif;">Ref: ${d.regCode} | Status: PENDING VERIFICATION</p>
  </td></tr>
  <tr><td style="padding:20px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border-radius:8px;border:1px solid #2a2a2a;font-size:13px;font-family:Arial,sans-serif;">
      <tr><td colspan="2" style="padding:10px 16px;background:#1e1e1e;color:#E8820C;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:1px;">ATHLETE DETAILS</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;width:40%;">Full Name</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.fullName}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Email</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.email}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Mobile</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.phone}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">WhatsApp</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.whatsapp}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">DOB / Age</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.dob} (Age: ${d.age})</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Gender</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.gender}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Blood Group</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.bloodGroup}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">City / State</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.city}, ${d.state}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Address</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.address}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Emergency Contact</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.emergencyContact} — ${d.emergencyPhone}</td></tr>
      ${d.guardianName ? `<tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Guardian</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.guardianName} — ${d.guardianPhone}</td></tr>` : ''}
      <tr><td colspan="2" style="padding:10px 16px;background:#1e1e1e;color:#E8820C;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:1px;">MEDICAL</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Medical Condition</td><td style="padding:8px 16px;color:${d.medicalCondition === 'yes' ? '#f87171' : '#4ade80'};border-bottom:1px solid #222;">${d.medicalCondition.toUpperCase()}${d.medicalDetails ? ': ' + d.medicalDetails : ''}</td></tr>
      <tr><td colspan="2" style="padding:10px 16px;background:#1e1e1e;color:#E8820C;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:1px;">PAYMENT</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Category</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.category}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Fee</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">₹${d.fee.toLocaleString('en-IN')}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">UTR Number</td><td style="padding:8px 16px;color:#E8820C;font-weight:700;border-bottom:1px solid #222;">${d.utrNumber}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Payment Date</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.paymentDate}</td></tr>
      <tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Amount Paid</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">₹${d.paymentAmount}</td></tr>
      ${d.screenshotPath ? `<tr><td style="padding:8px 16px;color:#888;border-bottom:1px solid #222;">Screenshot</td><td style="padding:8px 16px;color:#fff;border-bottom:1px solid #222;">${d.screenshotPath}</td></tr>` : ''}
      <tr><td style="padding:8px 16px;color:#888;">Digital Signature</td><td style="padding:8px 16px;color:#fff;">${d.digitalSignature}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:16px 40px 24px;">
    <p style="margin:0;color:#888;font-size:12px;font-family:Arial,sans-serif;">Verify UTR against Kotak bank statement, then confirm or reject in the admin dashboard.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`.trim();
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const body = req.body as {
    fullName?: string; email?: string; phone?: string; whatsapp?: string;
    dob?: string; age?: string; gender?: string; bloodGroup?: string;
    city?: string; state?: string; address?: string;
    emergencyContact?: string; emergencyPhone?: string;
    guardianName?: string; guardianPhone?: string; guardianConsent?: string;
    medicalCondition?: string; medicalDetails?: string;
    photoConsent?: string; rulesAccepted?: string; digitalSignature?: string;
    category?: string; utrNumber?: string;
    paymentDate?: string; paymentAmount?: string; screenshotPath?: string;
  };

  const {
    fullName, email, phone, whatsapp, dob, age, gender, bloodGroup,
    city, state, address, emergencyContact, emergencyPhone,
    guardianName, guardianPhone, guardianConsent,
    medicalCondition, medicalDetails, photoConsent, rulesAccepted,
    digitalSignature, category, utrNumber, paymentDate, paymentAmount, screenshotPath,
  } = body;

  // Mandatory field validation
  const missing: string[] = [];
  if (!fullName?.trim())         missing.push('fullName');
  if (!email?.trim())            missing.push('email');
  if (!phone?.trim())            missing.push('phone');
  if (!whatsapp?.trim())         missing.push('whatsapp');
  if (!dob?.trim())              missing.push('dob');
  if (!gender?.trim())           missing.push('gender');
  if (!city?.trim())             missing.push('city');
  if (!state?.trim())            missing.push('state');
  if (!address?.trim())          missing.push('address');
  if (!emergencyContact?.trim()) missing.push('emergencyContact');
  if (!emergencyPhone?.trim())   missing.push('emergencyPhone');
  if (!rulesAccepted || rulesAccepted !== 'yes') missing.push('rulesAccepted');
  if (!digitalSignature?.trim()) missing.push('digitalSignature');
  if (!category?.trim())         missing.push('category');
  if (!utrNumber?.trim())        missing.push('utrNumber');
  if (!paymentDate?.trim())      missing.push('paymentDate');
  if (!paymentAmount?.trim())    missing.push('paymentAmount');

  if (missing.length > 0) {
    res.status(400).json({ error: `Required fields missing: ${missing.join(', ')}` });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email!)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }
  if (!/^\d{10}$/.test(phone!.trim())) {
    res.status(400).json({ error: 'Phone must be a 10-digit number.' });
    return;
  }

  // Under-18 guardian check
  const ageNum = parseInt(age ?? '0', 10);
  if (ageNum > 0 && ageNum < 18) {
    if (!guardianName?.trim() || !guardianPhone?.trim() || guardianConsent !== 'yes') {
      res.status(400).json({ error: 'Guardian name, phone, and consent are required for participants under 18.' });
      return;
    }
  }

  const fee = getCategoryFee(category!);
  if (fee === null) {
    res.status(400).json({ error: 'Invalid category.' });
    return;
  }

  // ── Amount must EXACTLY equal the category fee (blocks ₹0 / ₹1 / partial payments) ──
  if (!/^\d+$/.test(paymentAmount!.trim()) || Number(paymentAmount) !== fee) {
    res.status(400).json({ error: `Amount paid must be exactly ₹${fee} for this category.` });
    return;
  }
  if (!/^\d{12}$/.test(utrNumber!.trim())) {
    res.status(400).json({ error: 'UTR must be the 12-digit number from your UPI app.' });
    return;
  }
  const utrUsed = await db.select({ id: marathaxRegistrations.id }).from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.utrNumber, utrNumber!.trim())).limit(1);
  if (utrUsed.length) {
    res.status(409).json({ error: 'This UTR has already been used for another registration.' });
    return;
  }

  // Duplicate guard — one confirmed registration per email
  const existing = await db
    .select({ status: marathaxRegistrations.status, regCode: marathaxRegistrations.regCode })
    .from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.email, email!.toLowerCase().trim()))
    .limit(10);

  const confirmed = existing.find(r => r.status === 'confirmed');
  if (confirmed) {
    res.status(409).json({
      error: 'duplicate',
      message: `A confirmed registration already exists for ${email}. Code: ${confirmed.regCode}`,
      regCode: confirmed.regCode,
    });
    return;
  }

  // Generate reference code
  const regCode = await generateUniqueRegCode();

  await db.insert(marathaxRegistrations).values({
    fullName:         fullName!.trim(),
    email:            email!.toLowerCase().trim(),
    phone:            phone!.trim(),
    whatsapp:         whatsapp!.trim(),
    dob:              dob!.trim(),
    age:              age?.trim() ?? '',
    gender:           gender!.trim(),
    bloodGroup:       bloodGroup?.trim() ?? '',
    city:             city!.trim(),
    state:            state!.trim(),
    address:          address!.trim(),
    emergencyContact: emergencyContact!.trim(),
    emergencyPhone:   emergencyPhone!.trim(),
    guardianName:     guardianName?.trim() ?? '',
    guardianPhone:    guardianPhone?.trim() ?? '',
    guardianConsent:  guardianConsent?.trim() ?? '',
    medicalCondition: medicalCondition?.trim() ?? 'no',
    medicalDetails:   medicalDetails?.trim() ?? '',
    photoConsent:     photoConsent?.trim() ?? 'no',
    rulesAccepted:    'yes',
    digitalSignature: digitalSignature!.trim(),
    category:         category!,
    feePaise:         fee * 100,
    feeDisplay:       String(fee),
    razorpayOrderId:  `UPI-${Date.now()}`,
    utrNumber:        utrNumber!.trim(),
    paymentDate:      paymentDate!.trim(),
    paymentAmount:    paymentAmount!.trim(),
    screenshotPath:   screenshotPath?.trim() ?? '',
    status:           'pending_upi',
    regCode,
    passRefId:        utrNumber!.trim(),
  });

  // Send acknowledgement to athlete
  try {
    await sendEmail({
      fromName: 'MARATHA X',
      to: email!.toLowerCase().trim(),
      subject: `Registration Received — ${regCode} | MARATHA X`,
      html: buildAckEmail({ fullName: fullName!.trim(), email: email!, category: category!, fee, utrNumber: utrNumber!.trim(), regCode }),
      text: `MARATHA X\n\nHi ${fullName},\nYour registration is received.\nCategory: ${category}\nAmount: ₹${fee}\nUTR: ${utrNumber}\nRef Code: ${regCode}\n\nWe'll verify your payment and send your Arena Pass within 2–4 hours.\nreservation@marathax.com`,
    });
  } catch (err) {
    console.error('marathax.register-upi.ack-email.failed', String(err));
  }

  // Send admin notification
  try {
    await sendEmail({
      fromName: 'MARATHA X System',
      to: 'reservation@marathax.com',
      subject: `[NEW REG] ${regCode} — ${fullName} — ${category}`,
      html: buildAdminNotifEmail({
        fullName: fullName!.trim(), email: email!, phone: phone!.trim(),
        whatsapp: whatsapp!.trim(), dob: dob!.trim(), age: age?.trim() ?? '',
        gender: gender!.trim(), bloodGroup: bloodGroup?.trim() ?? '',
        city: city!.trim(), state: state!.trim(), address: address!.trim(),
        emergencyContact: emergencyContact!.trim(), emergencyPhone: emergencyPhone!.trim(),
        guardianName: guardianName?.trim() ?? '', guardianPhone: guardianPhone?.trim() ?? '',
        medicalCondition: medicalCondition?.trim() ?? 'no', medicalDetails: medicalDetails?.trim() ?? '',
        category: category!, fee, utrNumber: utrNumber!.trim(),
        paymentDate: paymentDate!.trim(), paymentAmount: paymentAmount!.trim(),
        digitalSignature: digitalSignature!.trim(), regCode,
        screenshotPath: screenshotPath?.trim() ?? '',
      }),
      text: `New registration: ${regCode} | ${fullName} | ${category} | UTR: ${utrNumber}`,
    });
  } catch (err) {
    console.error('marathax.register-upi.admin-email.failed', String(err));
  }

  res.status(201).json({ regCode, message: 'Registration received. Payment verification pending.' });
}
