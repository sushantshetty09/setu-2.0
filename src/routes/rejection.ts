import { Router, Request, Response } from 'express';
import { defaultRejectionRecoveryService } from '../services/rejectionRecoveryService';
import { RejectionAnalysisRequest } from '../types/rejection';

export const rejectionRouter = Router();

/**
 * POST /api/rejection/analyze
 * Decodes and analyzes government scheme rejection notices, SMS alerts, or rejection reasons.
 */
rejectionRouter.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { rawText, schemeName, state, language, imageBase64, imageMimeType } = req.body;

    if ((!rawText || typeof rawText !== 'string' || !rawText.trim()) && !imageBase64) {
      res.status(400).json({
        success: false,
        error: 'Please provide either a rejection notice text message or an image.',
      });
      return;
    }

    // Mask any accidental 12-digit Aadhaar-like numbers or 16-digit bank numbers for privacy safety
    const sanitizedText = typeof rawText === 'string'
      ? rawText.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[AADHAAR MASKED FOR PRIVACY]')
          .replace(/\b\d{11,18}\b/g, '[ACCOUNT NUMBER MASKED]')
      : '';

    const payload: RejectionAnalysisRequest = {
      rawText: sanitizedText || (rawText || ''),
      schemeName: typeof schemeName === 'string' && schemeName.trim() ? schemeName.trim() : undefined,
      state: typeof state === 'string' && state.trim() ? state.trim() : undefined,
      language: language === 'hi' || language === 'kn' ? language : 'en',
      imageBase64: typeof imageBase64 === 'string' && imageBase64.startsWith('data:')
        ? imageBase64.split(',')[1]
        : imageBase64,
      imageMimeType: typeof imageMimeType === 'string' ? imageMimeType : undefined,
    };

    const result = await defaultRejectionRecoveryService.analyzeNotice(payload);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('[Rejection API Error]:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while analyzing the rejection notice. Please try again.',
      details: error.message || error,
    });
  }
});
