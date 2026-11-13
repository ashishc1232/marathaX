import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { marathaxRegistrations } from '../../../../db/schema.js';
import { desc, eq, like, or } from 'drizzle-orm';
import { isAdminRequest } from '../../../../marathax/registrationCore.js';

export default async function handler(req: Request, res: Response): Promise<void> {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const { status, search, limit = '200', offset = '0' } = req.query as {
    status?: string; search?: string; limit?: string; offset?: string;
  };

  let query = db.select().from(marathaxRegistrations).$dynamic();

  if (status && ['pending','pending_upi','confirmed','failed'].includes(status)) {
    query = query.where(eq(marathaxRegistrations.status, status));
  }

  if (search) {
    query = query.where(
      or(
        like(marathaxRegistrations.fullName, `%${search}%`),
        like(marathaxRegistrations.email,    `%${search}%`),
        like(marathaxRegistrations.regCode,  `%${search}%`),
        like(marathaxRegistrations.phone,    `%${search}%`),
        like(marathaxRegistrations.utrNumber, `%${search}%`),
      )
    );
  }

  const rows = await query
    .orderBy(desc(marathaxRegistrations.createdAt))
    .limit(Math.min(Number(limit), 500))
    .offset(Number(offset));

  const all = await db.select({ status: marathaxRegistrations.status }).from(marathaxRegistrations);
  const counts = { total: all.length, confirmed: 0, pending_upi: 0, failed: 0 };
  for (const r of all) {
    if (r.status === 'confirmed')    counts.confirmed++;
    else if (r.status === 'pending_upi' || r.status === 'pending') counts.pending_upi++;
    else if (r.status === 'failed')  counts.failed++;
  }

  res.json({ counts, registrations: rows });
}
