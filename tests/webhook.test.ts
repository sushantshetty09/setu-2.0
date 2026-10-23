import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { app } from '../src/server';

describe('Webhook and API Endpoints', () => {
  beforeEach(() => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'test_verify_token_123';
    process.env.WHATSAPP_APP_SECRET = ''; // empty in default tests to allow straightforward payload test
  });

  describe('GET /health', () => {
    it('should return 200 OK with service health details', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('scheme-saathi-whatsapp-bot');
      expect(res.body.config).toBeDefined();
    });
  });

  describe('GET /webhook (Meta Challenge Verification)', () => {
    it('should return challenge with 200 when verify token matches', async () => {
      const challenge = 'random_challenge_string_12345';
      const res = await request(app)
        .get('/webhook')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': 'test_verify_token_123',
          'hub.challenge': challenge,
        });

      expect(res.status).toBe(200);
      expect(res.text).toBe(challenge);
    });

    it('should return 403 when verify token does not match', async () => {
      const res = await request(app)
        .get('/webhook')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': 'wrong_token',
          'hub.challenge': 'some_challenge',
        });

      expect(res.status).toBe(403);
      expect(res.text).toContain('Forbidden');
    });

    it('should return 400 when query parameters are missing', async () => {
      const res = await request(app).get('/webhook');
      expect(res.status).toBe(400);
    });
  });

  describe('POST /webhook (Meta Event Receiving & Signature)', () => {
    it('should acknowledge valid WhatsApp message payload with 200 EVENT_RECEIVED', async () => {
      const payload = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '15550001234',
                    phone_number_id: '1234567890',
                  },
                  contacts: [{ profile: { name: 'Test User' }, wa_id: '919876543210' }],
                  messages: [
                    {
                      from: '919876543210',
                      id: 'wamid.HBgLMTIzNDU2Nzg5',
                      timestamp: '1700000000',
                      type: 'text',
                      text: { body: 'HI' },
                    },
                  ],
                },
                field: 'messages',
              },
            ],
          },
        ],
      };

      const res = await request(app)
        .post('/webhook')
        .send(payload)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.text).toBe('EVENT_RECEIVED');
    });

    it('should ignore status-only updates without error', async () => {
      const statusPayload = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  statuses: [
                    {
                      id: 'wamid.123',
                      status: 'delivered',
                      timestamp: '1700000001',
                      recipient_id: '919876543210',
                    },
                  ],
                },
                field: 'messages',
              },
            ],
          },
        ],
      };

      const res = await request(app).post('/webhook').send(statusPayload);
      expect(res.status).toBe(200);
      expect(res.text).toBe('EVENT_RECEIVED');
    });

    it('should enforce signature verification when WHATSAPP_APP_SECRET is set', async () => {
      const secret = 'test_meta_app_secret_abc123';
      process.env.WHATSAPP_APP_SECRET = secret;

      const payload = {
        object: 'whatsapp_business_account',
        entry: [],
      };
      const rawBody = JSON.stringify(payload);

      // 1. Missing signature header -> 401
      const resMissing = await request(app)
        .post('/webhook')
        .send(payload);
      expect(resMissing.status).toBe(401);

      // 2. Invalid signature header -> 403
      const resInvalid = await request(app)
        .post('/webhook')
        .set('x-hub-signature-256', 'sha256=invalidhash')
        .send(payload);
      expect(resInvalid.status).toBe(403);

      // 3. Valid signature header -> 200
      const validSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      const resValid = await request(app)
        .post('/webhook')
        .set('x-hub-signature-256', `sha256=${validSignature}`)
        .send(payload);
      expect(resValid.status).toBe(200);

      // Reset
      process.env.WHATSAPP_APP_SECRET = '';
    });
  });

  describe('POST /simulate (Local Testing Route)', () => {
    it('should allow simulating chat without WhatsApp credentials', async () => {
      const res = await request(app)
        .post('/simulate')
        .send({ senderId: 'sim-user-supertest', text: 'HI' });

      expect(res.status).toBe(200);
      expect(res.body.senderId).toBe('sim-user-supertest');
      expect(res.body.replies[0]).toContain('Welcome to *Scheme Saathi*!');
      expect(res.body.session.step).toBe('LANGUAGE_SELECTION');
    });
  });
});
