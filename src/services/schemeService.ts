import { Scheme, UserProfile, ISchemeService } from '../types/scheme';
import { MockSchemeService } from './mockSchemeService';
import { ApiSchemeService } from './apiSchemeService';

export class SchemeService implements ISchemeService {
  private delegate: ISchemeService;
  private mode: 'mock' | 'api';

  constructor(mode?: 'mock' | 'api') {
    this.mode = mode || (process.env.SCHEME_SERVICE_MODE === 'api' ? 'api' : 'mock');

    if (this.mode === 'api') {
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:4000';
      const timeoutMs = parseInt(process.env.BACKEND_API_TIMEOUT_MS || '5000', 10);
      this.delegate = new ApiSchemeService({
        baseUrl: backendUrl,
        timeoutMs,
      });
    } else {
      this.delegate = new MockSchemeService();
    }
  }

  getMode(): 'mock' | 'api' {
    return this.mode;
  }

  async getRelevantSchemes(profile: UserProfile): Promise<Scheme[]> {
    return this.delegate.getRelevantSchemes(profile);
  }
}

// Default singleton instance
export const defaultSchemeService = new SchemeService();
