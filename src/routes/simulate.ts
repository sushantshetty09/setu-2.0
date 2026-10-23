import { Router, Request, Response } from 'express';
import { defaultConversationFlow, defaultConversationStore } from '../chatbot';

export const simulateRouter = Router();

/**
 * POST /simulate
 * Simulate sending a message to Scheme Saathi without requiring WhatsApp or Meta credentials.
 * Request body: { senderId?: string, text: string }
 */
simulateRouter.post('/', async (req: Request, res: Response) => {
  const { senderId = 'simulator-user-1', text } = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({
      error: 'Missing or invalid "text" field in request body.',
      example: { senderId: 'simulator-user-1', text: 'HI' },
    });
    return;
  }

  try {
    const replies = await defaultConversationFlow.handleMessage(senderId, text);
    const state = await defaultConversationStore.get(senderId);

    res.status(200).json({
      senderId,
      input: text,
      replies,
      session: {
        step: state?.step || 'UNKNOWN',
        language: state?.language || 'en',
        consentGiven: state?.consent === true,
        answersRecordedCount: state?.answers ? Object.keys(state.answers).length : 0,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Simulation error' });
  }
});

/**
 * DELETE /simulate/session/:senderId
 * Reset state for a simulated user
 */
simulateRouter.delete('/session/:senderId', async (req: Request, res: Response) => {
  const senderId = Array.isArray(req.params.senderId)
    ? req.params.senderId[0]
    : req.params.senderId;
  if (senderId) {
    await defaultConversationStore.delete(senderId);
  }
  res.status(200).json({ message: `Session cleared for ${senderId}` });
});
