import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { webhookRouter } from './routes/webhook';
import { simulateRouter } from './routes/simulate';
import { RequestWithRawBody } from './middleware/verifyMetaSignature';

// Load environment variables from .env
dotenv.config();

export const app = express();

// Capture raw body buffer for Meta HMAC SHA256 signature verification
app.use(
  express.json({
    verify: (req: RequestWithRawBody, _res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRouter);
app.use('/webhook', webhookRouter);
app.use('/simulate', simulateRouter);

// Root route friendly welcome
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'Scheme Saathi — WhatsApp Government Scheme Chatbot',
    version: '1.0.0',
    description: 'WhatsApp chatbot helping Indian citizens discover government schemes.',
    endpoints: {
      health: 'GET /health',
      webhookVerification: 'GET /webhook',
      webhookReceiver: 'POST /webhook',
      localSimulator: 'POST /simulate',
    },
    documentation: 'See README.md for complete integration instructions.',
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]:', err.message || err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Only start listening if this file is run directly (not imported during tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🇮🇳 Scheme Saathi WhatsApp Bot running on port ${PORT}`);
    console.log(`• Health Check:      http://localhost:${PORT}/health`);
    console.log(`• Webhook URL:       http://localhost:${PORT}/webhook`);
    console.log(`• Local Simulator:   http://localhost:${PORT}/simulate`);
    console.log(`• Scheme Mode:       ${process.env.SCHEME_SERVICE_MODE || 'mock'}`);
    console.log(`====================================================`);
  });
}
