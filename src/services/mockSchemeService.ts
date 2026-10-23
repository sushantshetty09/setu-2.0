import { Scheme, UserProfile, ISchemeService, SchemeCategory } from '../types/scheme';
import { SCHEMES_DATABASE } from '../data/schemesDatabase';

export const MOCK_SCHEMES_CATALOGUE: Scheme[] = SCHEMES_DATABASE;

export class MockSchemeService implements ISchemeService {
  private schemes: Scheme[];

  constructor(schemes: Scheme[] = SCHEMES_DATABASE) {
    this.schemes = schemes;
  }

  /**
   * Returns all schemes currently loaded in the database catalogue.
   */
  getAllSchemes(): Scheme[] {
    return this.schemes;
  }

  /**
   * Returns all schemes specifically targeted for farmers.
   */
  getFarmerSchemes(): Scheme[] {
    return this.schemes.filter(
      (scheme) =>
        scheme.targetOccupations?.includes('Farmer') ||
        scheme.category === 'Agriculture' ||
        scheme.targetGroups?.includes('farmers') ||
        scheme.targetGroups?.includes('small_and_marginal_farmers') ||
        scheme.targetGroups?.includes('livestock_farmers')
    );
  }

  /**
   * Returns schemes matching a specific category.
   */
  getSchemesByCategory(category: SchemeCategory): Scheme[] {
    return this.schemes.filter((scheme) => scheme.category === category);
  }

  /**
   * Matches schemes based on UserProfile:
   * 1. Category: Exact match or "Other" matches general schemes
   * 2. State: Exact match or "Central / All India"
   * 3. Age: Between minAge and maxAge (if defined)
   * 4. Occupation: Matches targetOccupations (or if targetOccupations includes 'All' or is undefined)
   *
   * Ranks schemes:
   * - State-specific matches prioritized higher
   * - Direct category match prioritized
   * - Direct occupation match prioritized
   *
   * Returns up to 3 results.
   */
  async getRelevantSchemes(profile: UserProfile): Promise<Scheme[]> {
    // Brief async yield for realism
    await new Promise((resolve) => setTimeout(resolve, 10));

    const matches = this.schemes.filter((scheme) => {
      // 1. Category check
      const matchesCategory =
        profile.category === 'Other' ||
        scheme.category === profile.category ||
        scheme.category === 'Other';

      if (!matchesCategory) return false;

      // 2. State check: scheme must be Central/All India OR match user's state
      const isCentral =
        scheme.state.toLowerCase().includes('central') ||
        scheme.state.toLowerCase().includes('all india');
      const matchesState =
        isCentral ||
        scheme.state.toLowerCase().includes(profile.state.toLowerCase()) ||
        profile.state.toLowerCase().includes(scheme.state.toLowerCase());

      if (!matchesState) return false;

      // 3. Age check (if scheme defines minAge/maxAge)
      if (scheme.minAge !== undefined && profile.age < scheme.minAge) {
        return false;
      }
      if (scheme.maxAge !== undefined && profile.age > scheme.maxAge) {
        return false;
      }

      // 4. Occupation check
      if (scheme.targetOccupations && scheme.targetOccupations.length > 0) {
        const matchesOccupation =
          scheme.targetOccupations.includes('All') ||
          scheme.targetOccupations.includes(profile.occupation) ||
          profile.occupation === 'Other';

        if (!matchesOccupation) return false;
      }

      return true;
    });

    // Score and rank matches
    const scored = matches.map((scheme) => {
      let score = 0;
      // Category match boost
      if (scheme.category === profile.category) score += 4;
      // State-specific boost over central schemes
      const isCentral =
        scheme.state.toLowerCase().includes('central') ||
        scheme.state.toLowerCase().includes('all india');
      if (!isCentral) score += 5;
      // Occupation match boost
      if (
        scheme.targetOccupations &&
        scheme.targetOccupations.includes(profile.occupation)
      ) {
        score += 3;
      }
      return { scheme, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Return maximum 3 results as per specification
    return scored.slice(0, 3).map((item) => item.scheme);
  }
}
