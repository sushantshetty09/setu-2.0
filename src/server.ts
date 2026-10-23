import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { webhookRouter } from './routes/webhook';
import { simulateRouter } from './routes/simulate';
import { enquiriesRouter } from './routes/enquiries';
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
app.use('/api/enquiries', enquiriesRouter);

// Serve static assets for the WhatsApp Web demo UI
app.use(express.static(path.join(process.cwd(), 'public')));

// WhatsApp Web Demo Route
app.get('/demo', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Root route: serves WhatsApp Web UI for browser, JSON for API clients
app.get('/', (req: Request, res: Response) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
    return;
  }
  res.status(200).json({
    name: 'Scheme Saathi — WhatsApp Government Scheme Chatbot',
    version: '1.0.0',
    description: 'WhatsApp chatbot helping Indian citizens discover government schemes.',
    endpoints: {
      demoUI: 'GET /demo',
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
