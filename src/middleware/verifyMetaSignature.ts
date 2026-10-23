import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

/**
 * Express middleware to verify x-hub-signature-256 header sent by Meta Webhooks.
 */
export function verifyMetaSignature(
  req: RequestWithRawBody,
  res: Response,
  next: NextFunction
): void {
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  // In local development / test without an App Secret configured, bypass with a warning
  if (!appSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Security Error] WHATSAPP_APP_SECRET is not configured in production.');
      res.status(500).json({ error: 'Server misconfiguration: Webhook secret missing' });
      return;
    }
    return next();
  }

  const signatureHeader = req.headers['x-hub-signature-256'] as string | undefined;

  if (!signatureHeader) {
    console.warn('[Security Warning] Webhook request missing x-hub-signature-256 header');
    res.status(401).json({ error: 'Missing x-hub-signature-256 header' });
    return;
  }

  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') {
    console.warn('[Security Warning] Malformed x-hub-signature-256 header format');
    res.status(401).json({ error: 'Malformed signature header format' });
    return;
  }

  const signatureHex = parts[1];

  // Raw body buffer must be captured in express json middleware
  const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body) || '', 'utf8');

  const expectedSignature = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const actualBuffer = Buffer.from(signatureHex, 'utf8');

  if (
    expectedBuffer.length !== actualBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    console.warn('[Security Warning] Webhook signature verification failed');
    res.status(403).json({ error: 'Invalid webhook signature' });
    return;
  }

  next();
}
