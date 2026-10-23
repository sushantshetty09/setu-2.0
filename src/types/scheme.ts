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
  targetGroups?: string[];
  verificationStatus?: string;
  sourceNote?: string;
}

export type GenderType = 'Female' | 'Male' | 'Other';

export type IncomeBracket =
  | 'Below ₹1 Lakh (BPL)'
  | '₹1 Lakh - ₹3 Lakh'
  | '₹3 Lakh - ₹8 Lakh'
  | 'Above ₹8 Lakh';

export interface UserProfile {
  name?: string;
  gender?: GenderType;
  state: string;
  age: number;
  occupation: OccupationType;
  annualIncome?: IncomeBracket;
  category: SchemeCategory;
  language: 'en' | 'hi' | 'kn';
  phoneNumber?: string;
}

export interface ISchemeService {
  getRelevantSchemes(profile: UserProfile): Promise<Scheme[]>;
}
