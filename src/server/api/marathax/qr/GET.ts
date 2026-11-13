import type { Request, Response } from 'express';
import { checkinUrl, qrPng, siteBaseUrl, verifyRegCodeSig } from '../../../marathax/registrationCore.js';

// PNG of a registration's unique QR. The QR only contains a signed link —
// no personal data — so this endpoint leaks nothing. Needs ?s=<signature>.
export default async function handler(req: Request<{ code: string }>, res: Response): Promise<void> {
  const code = String(req.params.code ?? '').toUpperCase();
  const sig = String(req.query.s ?? '');
  if (!verifyRegCodeSig(code, sig)) { res.status(404).end(); return; }
  const png = await qrPng(checkinUrl(siteBaseUrl(req), code));
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'private, max-age=3600');
  res.send(png);
}
