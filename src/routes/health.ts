import { Router, Request, Response } from 'express';
import { defaultSchemeService } from '../services/schemeService';
import { defaultWhatsAppService } from '../services/whatsappService';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'scheme-saathi-whatsapp-bot',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    config: {
      schemeServiceMode: defaultSchemeService.getMode(),
      whatsappConfigured: defaultWhatsAppService.isConfigured(),
      nodeEnv: process.env.NODE_ENV || 'development',
    },
  });
});
