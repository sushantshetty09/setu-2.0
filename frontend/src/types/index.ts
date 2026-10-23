export interface Scheme {
  id: string;
  code: string;
  name: string;
  name_native?: string;
  category: string;
  scheme_type: string;
  state?: string;
  ministry: string;
  summary: string;
  description: string;
  benefit_amount: string;
  benefit_type: string;
  application_mode: string;
  status: string;
  deadline?: string;
  apply_url: string;
  min_age?: number;
  max_age?: number;
  gender_allowed?: string;
  income_ceiling?: number;
  caste_eligibility?: string[];
  bpl_required?: boolean;
  disability_required?: boolean;
  student_only?: boolean;
  farmer_only?: boolean;
  additional_eligibility?: string[];
  highlights?: string[];
  benefits_breakdown?: string[];
  documents_required?: string[];
  application_steps?: string[];
  faqs?: Array<{ q: string; a: string }>;
  last_updated?: string;
  view_count?: number;
  match_percentage?: number;
}

export interface SchemeCategory {
  id: string;
  name: string;
  native_name: string;
  count: number;
  icon: string;
  color: string;
}

export interface StateData {
  name: string;
  code: string;
  schemes_count: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tool_call?: {
    tool: string;
    input: any;
  };
  tool_result?: any;
  action?: {
    action: string;
    data: any;
  };
  suggestions?: string[];
}

export interface WizardState {
  age?: number;
  gender: string;
  state: string;
  is_differently_abled: boolean;
  income_annual?: number;
  caste_category: string;
  is_bpl: boolean;
  needs: string[];
}

export interface DigiLockerUser {
  name: string;
  aadhaar_last4: string;
  state: string;
  dob: string;
  gender: string;
  verified_documents: Array<{
    type: string;
    status: string;
    issuer: string;
  }>;
}
