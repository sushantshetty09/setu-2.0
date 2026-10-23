import { Router, Request, Response } from 'express';
import { verifyMetaSignature, RequestWithRawBody } from '../middleware/verifyMetaSignature';
import { defaultConversationFlow } from '../chatbot';
import { defaultWhatsAppService } from '../services/whatsappService';

export const webhookRouter = Router();

/**
 * GET /webhook
 * Verification endpoint for Meta WhatsApp Cloud API Webhook challenge.
 */
webhookRouter.get('/', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[Webhook] Meta verification succeeded.');
      res.status(200).send(challenge);
      return;
    } else {
      console.warn('[Webhook] Verification token mismatch.');
      res.status(403).send('Forbidden: Token mismatch');
      return;
    }
  }

  res.status(400).send('Bad Request: Missing parameters');
});

/**
 * POST /webhook
 * Receives incoming WhatsApp messages, status updates, and interactive responses.
 */
webhookRouter.post(
  '/',
  verifyMetaSignature,
  async (req: RequestWithRawBody, res: Response): Promise<void> => {
    // Acknowledge receipt to Meta immediately within the 5000ms window
    res.status(200).send('EVENT_RECEIVED');

    const body = req.body;

    if (!body || body.object !== 'whatsapp_business_account') {
      return;
    }

    try {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          if (!value || value.messaging_product !== 'whatsapp') continue;

          // Ignore status-only updates (sent, delivered, read)
          if (value.statuses && (!value.messages || value.messages.length === 0)) {
            continue;
          }

          const messages = value.messages || [];
          for (const msg of messages) {
            const senderId = msg.from;
            const messageId = msg.id;
            let incomingText: string | null = null;

            if (msg.type === 'text' && msg.text?.body) {
              incomingText = msg.text.body;
            } else if (msg.type === 'interactive') {
              if (msg.interactive?.type === 'button_reply') {
                incomingText = msg.interactive.button_reply?.title || msg.interactive.button_reply?.id;
              } else if (msg.interactive?.type === 'list_reply') {
                incomingText = msg.interactive.list_reply?.title || msg.interactive.list_reply?.id;
              }
            } else if (msg.type === 'button' && msg.button?.text) {
              incomingText = msg.button.text;
            }

            if (!incomingText || !senderId) {
              continue;
            }

            // Log receipt with sanitized sender (never log message body or personal info!)
            console.log(
              `[Webhook] Processing incoming message ID ${messageId} from sender ${senderId.slice(0, 4)}***`
            );

            // Process message through conversation flow
            const replies = await defaultConversationFlow.handleMessage(
              senderId,
              incomingText,
              messageId
            );

            // Send replies to WhatsApp
            if (replies && replies.length > 0) {
              await defaultWhatsAppService.sendMessages(senderId, replies);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('[Webhook Error] Error processing incoming webhook:', err?.message || err);
    }
  }
);
