import { Router, Request, Response } from 'express';
import { defaultLifeEventService } from '../services/lifeEventService';
import { LifeEventDiscoveryRequest } from '../types/lifeEvent';

export const lifeEventsRouter = Router();

/**
 * POST /api/life-events/discover
 * Discovers verified government welfare schemes based on ordinary natural language descriptions
 * of real-life situations (e.g. crop loss, starting small enterprise, college funding, elderly pension).
 */
lifeEventsRouter.post('/discover', async (req: Request, res: Response) => {
  try {
    const { userSituation, state, occupation, age, language } = req.body;

    if (!userSituation || typeof userSituation !== 'string' || !userSituation.trim()) {
      res.status(400).json({
        success: false,
        error: 'Please describe your situation or need in ordinary language.',
      });
      return;
    }

    const payload: LifeEventDiscoveryRequest = {
      userSituation: userSituation.trim(),
      state: typeof state === 'string' && state.trim() ? state.trim() : undefined,
      occupation: typeof occupation === 'string' && occupation.trim() ? occupation.trim() : undefined,
      age: typeof age === 'number' ? age : (parseInt(String(age), 10) || undefined),
      language: language === 'hi' || language === 'kn' ? language : 'en',
    };

    const result = await defaultLifeEventService.discoverBenefits(payload);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('[Life Events API Error]:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while discovering benefits. Please try again.',
      details: error.message || error,
    });
  }
});
