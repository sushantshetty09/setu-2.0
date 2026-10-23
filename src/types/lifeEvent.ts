import { Scheme } from './scheme';

export type BenefitType =
  | 'Direct Cash Transfer (DBT)'
  | 'Interest / Capital Subsidy'
  | 'Low-Interest Loan / Credit'
  | 'Crop / Health Insurance Claim'
  | 'Free Public Service / Healthcare'
  | 'Social Security Pension'
  | 'Skill Training & Toolkit';

export interface LifeEventDiscoveryRequest {
  userSituation: string;
  state?: string;
  occupation?: string;
  age?: number;
  language?: 'en' | 'hi' | 'kn';
}

export interface LifeEventMatch {
  scheme: Scheme;
  whyMatched: string;
  benefitType: BenefitType;
  financialAssistanceDetails: string;
  apparentEligibility: string;
  importantExclusions: string[];
  requiredDocuments: string[];
  officialApplicationUrl: string;
  verificationSource: string;
  lastVerifiedAt: string;
  isLoan: boolean; // Flag to ensure loans are never described as free money
}

export interface LifeEventDiscoveryResult {
  identifiedLifeEvent: string;
  identifiedNeed: string;
  primaryCategory: string;
  summaryExplanation: string;
  matches: LifeEventMatch[];
  missingDetailsPrompt?: string; // Asked if state/district/occupation materially changes relevance
  disclaimer: string;
  formattedMessage: string;
}
