import { describe, it, expect } from 'vitest';
import { SCHEMES_DATABASE } from '../src/data/schemesDatabase';
import { MockSchemeService } from '../src/services/mockSchemeService';
import { UserProfile } from '../src/types/scheme';

describe('Farmer Schemes Database Catalogue', () => {
  const service = new MockSchemeService(SCHEMES_DATABASE);

  it('should contain at least 50 schemes specifically for farmers', () => {
    const farmerSchemes = service.getFarmerSchemes();
    console.log(`Verified ${farmerSchemes.length} schemes available for farmers.`);
    expect(farmerSchemes.length).toBeGreaterThanOrEqual(50);
  });

  it('should have at least 50 schemes in the Agriculture category', () => {
    const agriSchemes = service.getSchemesByCategory('Agriculture');
    console.log(`Verified ${agriSchemes.length} schemes in Agriculture category.`);
    expect(agriSchemes.length).toBeGreaterThanOrEqual(50);
  });

  it('should find relevant schemes for an Indian farmer looking for Agriculture support', async () => {
    const profile: UserProfile = {
      state: 'Uttar Pradesh',
      age: 35,
      occupation: 'Farmer',
      category: 'Agriculture',
      language: 'en',
    };

    const matches = await service.getRelevantSchemes(profile);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.length).toBeLessThanOrEqual(3);

    for (const scheme of matches) {
      expect(scheme.name).toBeDefined();
      expect(scheme.category).toBe('Agriculture');
      expect(scheme.officialUrl).toContain('http');
      expect(scheme.requiredDocuments.length).toBeGreaterThan(0);
      expect(scheme.applicationSteps.length).toBeGreaterThan(0);
    }
  });

  it('should prioritize state-specific farmer schemes when available', async () => {
    const mpFarmerProfile: UserProfile = {
      state: 'Madhya Pradesh',
      age: 42,
      occupation: 'Farmer',
      category: 'Agriculture',
      language: 'hi',
    };

    const matches = await service.getRelevantSchemes(mpFarmerProfile);
    expect(matches.length).toBeGreaterThanOrEqual(1);

    // State scheme should be ranked high
    const schemeIds = matches.map((s) => s.id);
    expect(schemeIds).toContain('MP-KISAN-KALYAN');
  });

  it('should support farmer pension matching via PM-KMY', async () => {
    const pensionProfile: UserProfile = {
      state: 'All India',
      age: 28,
      occupation: 'Farmer',
      category: 'Pension',
      language: 'en',
    };

    const matches = await service.getRelevantSchemes(pensionProfile);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const kmy = matches.find((s) => s.id === 'PM-KMY');
    expect(kmy).toBeDefined();
    expect(kmy?.name).toContain('Pradhan Mantri Kisan Maandhan');
  });

  it('should ensure all schemes have non-empty required fields', () => {
    for (const s of SCHEMES_DATABASE) {
      expect(s.id).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.category).toBeTruthy();
      expect(s.benefits).toBeTruthy();
      expect(s.eligibilitySummary).toBeTruthy();
      expect(s.officialUrl).toBeTruthy();
      expect(s.requiredDocuments.length).toBeGreaterThan(0);
      expect(s.applicationSteps.length).toBeGreaterThan(0);
    }
  });
});
