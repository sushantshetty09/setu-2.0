import { describe, it, expect } from 'vitest';
import { defaultLifeEventService } from '../src/services/lifeEventService';
import { LifeEventDiscoveryRequest } from '../src/types/lifeEvent';

describe('Feature 2: Life-Event Benefit Discovery', () => {
  it('should identify agriculture & crop-loss category when user describes crop damage', async () => {
    const req: LifeEventDiscoveryRequest = {
      userSituation: 'Meri fasal baarish ki वजह se kharab ho gayi hai.',
      language: 'en',
    };

    const res = await defaultLifeEventService.discoverBenefits(req);

    expect(res).toBeDefined();
    expect(res.identifiedLifeEvent).toContain('Crop Loss');
    expect(res.primaryCategory).toContain('Agriculture');
    expect(res.matches.length).toBeGreaterThanOrEqual(1);

    // Should include PMFBY or disaster relief
    const schemeNames = res.matches.map((m) => m.scheme.name);
    const hasPmfby = schemeNames.some((n) => n.includes('Fasal Bima') || n.includes('PMFBY'));
    expect(hasPmfby).toBe(true);

    // Crop loss match card verification
    const cropMatch = res.matches.find((m) => m.scheme.name.includes('Fasal Bima') || m.scheme.name.includes('PMFBY'));
    expect(cropMatch?.benefitType).toBe('Crop / Health Insurance Claim');
    expect(cropMatch?.officialApplicationUrl).toContain('pmfby.gov.in');
    expect(cropMatch?.isLoan).toBe(false);
  });

  it('should identify small business / entrepreneurship and clearly label credit/loans without describing them as free money', async () => {
    const req: LifeEventDiscoveryRequest = {
      userSituation: 'I want to start a small business but I have very little money.',
      language: 'en',
    };

    const res = await defaultLifeEventService.discoverBenefits(req);

    expect(res.identifiedLifeEvent).toContain('Entrepreneurship');
    expect(res.matches.length).toBeGreaterThan(0);

    // Must identify Mudra or PMEGP or credit schemes
    const mudraMatch = res.matches.find((m) => m.scheme.name.includes('Mudra') || m.scheme.name.includes('PMMY'));
    if (mudraMatch) {
      expect(mudraMatch.isLoan).toBe(true);
      expect(mudraMatch.benefitType).toBe('Low-Interest Loan / Credit');
      // Must not claim it is free grant money
      expect(mudraMatch.financialAssistanceDetails.toLowerCase()).not.toContain('free money');
    }

    // Formatted message must carry the loan caution note
    expect(res.formattedMessage).toContain('Credit Facility');
  });

  it('should identify education & student scholarship category when student needs college funding', async () => {
    const req: LifeEventDiscoveryRequest = {
      userSituation: 'My daughter is going to college and I need financial assistance for higher studies.',
      language: 'en',
    };

    const res = await defaultLifeEventService.discoverBenefits(req);

    expect(res.identifiedLifeEvent).toContain('Education');
    expect(res.primaryCategory).toContain('Education');
    expect(res.matches.length).toBeGreaterThan(0);

    const hasEducation = res.matches.some((m) => m.scheme.category === 'Education' || m.scheme.name.includes('Scholarship') || m.scheme.name.includes('Pragati'));
    expect(hasEducation).toBe(true);
  });

  it('should identify social security pensions when elderly parent support is requested', async () => {
    const req: LifeEventDiscoveryRequest = {
      userSituation: 'My father is elderly and needs pension support.',
      language: 'en',
    };

    const res = await defaultLifeEventService.discoverBenefits(req);

    expect(res.identifiedLifeEvent).toContain('Pensions');
    expect(res.primaryCategory).toContain('Pension');
    expect(res.matches.length).toBeGreaterThan(0);

    const hasPension = res.matches.some((m) => m.scheme.category === 'Pension' || m.scheme.name.includes('Pension') || m.scheme.name.includes('IGNOAPS') || m.scheme.name.includes('Maandhan'));
    expect(hasPension).toBe(true);
  });

  it('should request state information when missing and materially relevant', async () => {
    const req: LifeEventDiscoveryRequest = {
      userSituation: 'I lost my job and need help finding government benefits.',
      language: 'en',
    };

    const res = await defaultLifeEventService.discoverBenefits(req);

    expect(res.missingDetailsPrompt).toBeDefined();
    expect(res.missingDetailsPrompt).toContain('state');
  });

  it('should support Kannada language formatting for Karnataka citizens', async () => {
    const req: LifeEventDiscoveryRequest = {
      userSituation: 'ಮಳೆಯಿಂದ ನನ್ನ ಬೆಳೆ ಹಾಳಾಗಿದೆ (Crop damaged by heavy rain)',
      state: 'Karnataka',
      language: 'kn',
    };

    const res = await defaultLifeEventService.discoverBenefits(req);

    expect(res.formattedMessage).toMatch(/[\u0C80-\u0CFF]/); // Kannada text
    expect(res.matches.length).toBeGreaterThan(0);
  });
});
