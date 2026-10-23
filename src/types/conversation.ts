import { SchemeCategory, OccupationType } from './scheme';

export type Language = 'en' | 'hi';

export type ConversationStep =
  | 'WELCOME'
  | 'LANGUAGE_SELECTION'
  | 'CONSENT'
  | 'ASK_STATE'
  | 'ASK_AGE'
  | 'ASK_OCCUPATION'
  | 'ASK_CATEGORY'
  | 'RESULTS'
  | 'STOPPED';

export interface UserAnswers {
  state?: string;
  age?: number;
  occupation?: OccupationType;
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
