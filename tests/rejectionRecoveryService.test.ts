import { describe, it, expect } from 'vitest';
import { defaultRejectionRecoveryService } from '../src/services/rejectionRecoveryService';
import { RejectionAnalysisRequest } from '../src/types/rejection';

describe('Feature 1: Rejection Recovery Assistant', () => {
  it('should correctly decode and explain a clear rejection reason (PM-KISAN Aadhaar name mismatch)', async () => {
    const req: RejectionAnalysisRequest = {
      rawText: 'Your application for PM-KISAN registration has been rejected due to beneficiary name mismatch with Aadhaar database.',
      schemeName: 'PM-KISAN',
      language: 'en',
    };

    const res = await defaultRejectionRecoveryService.analyzeNotice(req);

    expect(res).toBeDefined();
    expect(res.needsClarification).toBe(false);

    // Section A: Meaning
    expect(res.meaning.toLowerCase()).toContain('name');

    // Section B: Stated reason vs possible reasons
    expect(res.statedReason.toLowerCase()).toContain('not match');

    // Section C: Action plan & docs to check
    expect(res.actionPlan.length).toBeGreaterThan(0);
    expect(res.documentsToCheck).toEqual(expect.arrayContaining([expect.stringContaining('Aadhaar')]));

    // Section D: Official verified next steps
    expect(res.officialPortalUrl).toContain('pmkisan.gov.in');
    expect(res.verifiedHelpline).toBeDefined();

    // Verification integrity: No invented deadlines
    expect(res.verifiedDeadline).toBeUndefined();

    // Privacy & safety notices
    expect(res.privacyNotice).toContain('Never share Aadhaar numbers');
    expect(res.disclaimer).toContain('informational interpretation');
  });

  it('should prompt for clarification on an ambiguous or brief rejection notice instead of hallucinating', async () => {
    const req: RejectionAnalysisRequest = {
      rawText: 'Rejected',
      language: 'en',
    };

    const res = await defaultRejectionRecoveryService.analyzeNotice(req);

    expect(res.needsClarification).toBe(true);
    expect(res.followUpQuestions).toBeDefined();
    expect(res.followUpQuestions!.length).toBeGreaterThanOrEqual(1);
    expect(res.formattedMessage).toContain('Needs Clarification');
  });

  it('should never invent unverified appeal deadlines or false approval guarantees', async () => {
    const req: RejectionAnalysisRequest = {
      rawText: 'Application rejected due to invalid land records document.',
      schemeName: 'PM-KISAN',
      language: 'en',
    };

    const res = await defaultRejectionRecoveryService.analyzeNotice(req);

    // Verified deadline must not be invented
    expect(res.verifiedDeadline).toBeUndefined();

    // Disclaimer must state it is not an official government decision
    expect(res.disclaimer).toContain('does not constitute an official government decision');
    expect(res.formattedMessage).not.toContain('guaranteed approval');
  });

  it('should provide verified 72-hour window and KCC contacts for PMFBY crop insurance claims', async () => {
    const req: RejectionAnalysisRequest = {
      rawText: 'Crop insurance claim rejected under PMFBY because damage was reported late.',
      schemeName: 'PMFBY',
      language: 'en',
    };

    const res = await defaultRejectionRecoveryService.analyzeNotice(req);

    expect(res.officialPortalUrl).toContain('pmfby.gov.in');
    expect(res.verifiedDeadline).toContain('72 hours');
    expect(res.verifiedHelpline).toBeDefined();
  });

  it('should support fluent Hindi explanations when requested', async () => {
    const req: RejectionAnalysisRequest = {
      rawText: 'Your PM-KISAN application was rejected due to bank account not linked with Aadhaar.',
      schemeName: 'PM-KISAN',
      language: 'hi',
    };

    const res = await defaultRejectionRecoveryService.analyzeNotice(req);

    expect(res.meaning).toMatch(/[\u0900-\u097F]/); // Hindi characters
    expect(res.formattedMessage).toContain('अस्वीकृति');
  });

  it('should support fluent Kannada explanations when requested', async () => {
    const req: RejectionAnalysisRequest = {
      rawText: 'Your application was rejected due to name mismatch with Aadhaar.',
      schemeName: 'PM-KISAN',
      language: 'kn',
    };

    const res = await defaultRejectionRecoveryService.analyzeNotice(req);

    expect(res.meaning).toMatch(/[\u0C80-\u0CFF]/); // Kannada characters
    expect(res.formattedMessage).toContain('ತಿರಸ್ಕಾರ');
  });
});
