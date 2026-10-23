import { SchemeCategory, OccupationType, GenderType, IncomeBracket } from './scheme';

export type Language = 'en' | 'hi' | 'kn';

export type ConversationStep =
  | 'WELCOME'
  | 'LANGUAGE_SELECTION'
  | 'CONSENT'
  | 'ASK_NAME'
  | 'ASK_GENDER'
  | 'ASK_STATE'
  | 'ASK_AGE'
  | 'ASK_OCCUPATION'
  | 'ASK_INCOME'
  | 'ASK_CATEGORY'
  | 'RESULTS'
  | 'STOPPED';

export interface UserAnswers {
  name?: string;
  gender?: GenderType;
  state?: string;
  age?: number;
  occupation?: OccupationType;
  annualIncome?: IncomeBracket;
  category?: SchemeCategory;
}

export interface ConversationHistoryEntry {
  step: ConversationStep;
  answers: UserAnswers;
}

export interface ConversationState {
  senderId: string;
  language: Language;
  step: ConversationStep;
  consent: boolean | null;
  answers: UserAnswers;
  history: ConversationHistoryEntry[];
  chatHistory?: Array<{ role: 'user' | 'model'; text: string }>;
  lastShownSchemes?: string[];
  lastMessageId?: string;
  updatedAt: number;
}

export interface IConversationStore {
  get(senderId: string): Promise<ConversationState | null>;
  set(senderId: string, state: ConversationState): Promise<void>;
  delete(senderId: string): Promise<void>;
  hasProcessedMessage(messageId: string): Promise<boolean>;
  markMessageProcessed(messageId: string): Promise<void>;
}
