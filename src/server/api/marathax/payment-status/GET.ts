import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { marathaxRegistrations } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { getCategoryPrizes } from '../../../marathax/categoryServerConfig.js';

// Frontend polls this after Razorpay checkout closes.
// Returns status + pass data if paid.

export default async function handler(req: Request<{ orderId: string }>, res: Response): Promise<void> {
  const { orderId } = req.params;
  if (!orderId) {
    res.status(400).json({ error: 'orderId required.' });
    return;
  }

  const rows = await db
    .select()
    .from(marathaxRegistrations)
    .where(eq(marathaxRegistrations.razorpayOrderId, orderId))
    .limit(1);

  if (!rows.length) {
    res.status(404).json({ error: 'Order not found.' });
    return;
  }

  const reg = rows[0];

  if (reg.status === 'confirmed' && reg.regCode) {
    const prizes = getCategoryPrizes(reg.category) ?? [];
    res.json({
      status: 'confirmed',
      regCode: reg.regCode,
      passRefId: reg.passRefId,
      participant: {
        fullName:   reg.fullName,
        email:      reg.email,
        phone:      reg.phone,
        age:        reg.age,
        gender:     reg.gender,
        bloodGroup: reg.bloodGroup,
        category:   reg.category,
        fee:        reg.feePaise / 100,
        prizes,
      },
    });
    return;
  }

  res.json({ status: reg.status }); // pending | failed | cancelled
}
