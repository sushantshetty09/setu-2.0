import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiSchemeService } from '../src/services/apiSchemeService';
import { UserProfile } from '../src/types/scheme';

describe('ApiSchemeService Adapter', () => {
  const profile: UserProfile = {
    state: 'Maharashtra',
    age: 30,
    occupation: 'Worker',
    category: 'Healthcare',
    language: 'en',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should parse valid schemes returned by backend successfully', async () => {
    const mockApiResponse = {
      success: true,
      schemes: [
        {
          id: 'backend-test-01',
          name: 'Teammate Test Health Scheme',
          category: 'Healthcare',
          state: 'Maharashtra',
          description: 'A test scheme from teammate API',
          benefits: '₹5 Lakh coverage',
          eligibilitySummary: 'All resident workers',
          requiredDocuments: ['Aadhaar Card'],
          applicationSteps: ['Apply on portal'],
          officialUrl: 'https://jeevandayee.gov.in',
          lastVerifiedAt: '2025-01-20',
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockApiResponse,
    } as any);

    const service = new ApiSchemeService({
      baseUrl: 'http://localhost:4000',
      timeoutMs: 1000,
    });

    const schemes = await service.getRelevantSchemes(profile);
    expect(schemes).toHaveLength(1);
    expect(schemes[0].id).toBe('backend-test-01');
    expect(schemes[0].name).toBe('Teammate Test Health Scheme');
  });

  it('should throw clear error on HTTP non-200 status', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => 'Service Unavailable',
    } as any);

    const service = new ApiSchemeService({
      baseUrl: 'http://localhost:4000',
    });

    await expect(service.getRelevantSchemes(profile)).rejects.toThrow(
      'Teammate backend returned HTTP status 503'
    );
  });

  it('should throw clear error on request timeout', async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        const error = new Error('The operation was aborted');
        error.name = 'AbortError';
        setTimeout(() => reject(error), 20);
      });
    });

    const service = new ApiSchemeService({
      baseUrl: 'http://localhost:4000',
      timeoutMs: 10,
    });

    await expect(service.getRelevantSchemes(profile)).rejects.toThrow(
      'Teammate backend request timed out'
    );
  });
});
