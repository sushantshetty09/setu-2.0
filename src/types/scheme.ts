export type SchemeCategory =
  | 'Agriculture'
  | 'Education'
  | 'Employment'
  | 'Housing'
  | 'Healthcare'
  | 'Pension'
  | "Women's Welfare"
  | 'Other';

export type OccupationType =
  | 'Farmer'
  | 'Student'
  | 'Worker'
  | 'Business Owner'
  | 'Other';

export interface Scheme {
  id: string;
  name: string;
  category: SchemeCategory;
  state: string; // "Central / All India" or specific state
  description: string;
  benefits: string;
  eligibilitySummary: string;
  minAge?: number;
  maxAge?: number;
  targetOccupations?: Array<OccupationType | 'All'>;
  requiredDocuments: string[];
  applicationSteps: string[];
  officialUrl: string;
  lastVerifiedAt: string; // ISO date or formatted date
}

export interface UserProfile {
  state: string;
  age: number;
  occupation: OccupationType;
  category: SchemeCategory;
  language: 'en' | 'hi';
}

export interface ISchemeService {
  getRelevantSchemes(profile: UserProfile): Promise<Scheme[]>;
}
