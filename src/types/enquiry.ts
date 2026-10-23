import { GenderType, IncomeBracket, OccupationType, SchemeCategory } from './scheme';
import { Language } from './conversation';

export interface CitizenEnquiry {
  id: string;
  senderId: string;
  phoneNumber: string;
  name: string;
  gender: GenderType;
  state: string;
  age: number;
  occupation: OccupationType;
  annualIncome: IncomeBracket;
  category: SchemeCategory;
  language: Language;
  matchedSchemesCount: number;
  matchedSchemeNames: string[];
  createdAt: string; // ISO 8601 string
}

export interface EnquiryStats {
  totalEnquiries: number;
  byState: Record<string, number>;
  byGender: Record<string, number>;
  byOccupation: Record<string, number>;
  byIncome: Record<string, number>;
  byLanguage: Record<string, number>;
  lastRecordedAt?: string;
}
