import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { marathaxRegistrations } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { isAdminRequest } from '../../../../marathax/registrationCore.js';

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

  await db.update(marathaxRegistrations)
    .set({ status: 'failed' })
    .where(eq(marathaxRegistrations.id, id));

  res.json({ ok: true });
}
