import { z } from 'zod';
import { Scheme, UserProfile, ISchemeService, SchemeCategory, OccupationType } from '../types/scheme';

// Schema for validating schemes returned by teammates' backend
const SchemeCategorySchema = z.enum([
  'Agriculture',
  'Education',
  'Employment',
  'Housing',
  'Healthcare',
  'Pension',
  "Women's Welfare",
  'Other',
]);

export const BackendSchemeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: SchemeCategorySchema.catch('Other'),
  state: z.string().default('Central / All India'),
  description: z.string(),
  benefits: z.string().default(''),
  eligibilitySummary: z.string().default(''),
  requiredDocuments: z.array(z.string()).default([]),
  applicationSteps: z.array(z.string()).default([]),
  officialUrl: z.string().url().or(z.string()).default('https://www.myscheme.gov.in'),
  lastVerifiedAt: z.string().default(new Date().toISOString().split('T')[0]),
});

export const BackendMatchingApiResponseSchema = z.object({
  success: z.boolean().optional(),
  schemes: z.array(BackendSchemeResponseSchema),
});

export interface ApiSchemeServiceOptions {
  baseUrl: string;
  endpointPath?: string;
  timeoutMs?: number;
}

export class ApiSchemeService implements ISchemeService {
  private baseUrl: string;
  private endpointPath: string;
  private timeoutMs: number;

  constructor(options: ApiSchemeServiceOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.endpointPath = options.endpointPath || '/api/schemes/match';
    this.timeoutMs = options.timeoutMs || 5000;
  }

  /**
   * Calls teammates' backend matching endpoint.
   * If the API is down or returns an error, throws a clear Error
   * so the caller can provide a friendly fallback to the user.
   */
  async getRelevantSchemes(profile: UserProfile): Promise<Scheme[]> {
    const fullUrl = `${this.baseUrl}${this.endpointPath}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          state: profile.state,
          age: profile.age,
          occupation: profile.occupation,
          category: profile.category,
          language: profile.language,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Teammate backend returned HTTP status ${response.status}`);
      }

      const rawJson = await response.json();

      // Handle either { schemes: [...] } or direct array [...]
      let rawList: unknown[];
      if (Array.isArray(rawJson)) {
        rawList = rawJson;
      } else {
        const parsedWrapper = BackendMatchingApiResponseSchema.safeParse(rawJson);
        if (parsedWrapper.success) {
          rawList = parsedWrapper.data.schemes;
        } else if (rawJson && typeof rawJson === 'object' && 'data' in rawJson && Array.isArray((rawJson as any).data)) {
          rawList = (rawJson as any).data;
        } else {
          rawList = [];
        }
      }

      const validatedSchemes: Scheme[] = [];
      for (const item of rawList) {
        const parsed = BackendSchemeResponseSchema.safeParse(item);
        if (parsed.success) {
          validatedSchemes.push(parsed.data as Scheme);
        }
      }

      return validatedSchemes.slice(0, 3);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error(`Teammate backend request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
