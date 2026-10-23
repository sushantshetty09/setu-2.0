import {
  ConversationState,
  ConversationStep,
  IConversationStore,
  Language,
} from '../types/conversation';

export class InMemoryConversationStore implements IConversationStore {
  private store: Map<string, ConversationState> = new Map();
  private processedMessageIds: Set<string> = new Set();
  private maxProcessedIds: number = 5000;

  async get(senderId: string): Promise<ConversationState | null> {
    const state = this.store.get(senderId);
    if (!state) return null;
    // Return a clone to prevent mutation side-effects
    return JSON.parse(JSON.stringify(state));
  }

  async set(senderId: string, state: ConversationState): Promise<void> {
    state.updatedAt = Date.now();
    this.store.set(senderId, JSON.parse(JSON.stringify(state)));
  }

  async delete(senderId: string): Promise<void> {
    this.store.delete(senderId);
  }

  async hasProcessedMessage(messageId: string): Promise<boolean> {
    return this.processedMessageIds.has(messageId);
  }

  async markMessageProcessed(messageId: string): Promise<void> {
    if (this.processedMessageIds.size >= this.maxProcessedIds) {
      // Clear oldest half
      const iter = this.processedMessageIds.values();
      for (let i = 0; i < 1000; i++) {
        const next = iter.next();
        if (next.done) break;
        this.processedMessageIds.delete(next.value);
      }
    }
    this.processedMessageIds.add(messageId);
  }

  // Helper for testing
  clear(): void {
    this.store.clear();
    this.processedMessageIds.clear();
  }
}

export function createInitialState(
  senderId: string,
  language: Language = 'en'
): ConversationState {
  return {
    senderId,
    language,
    step: 'WELCOME',
    consent: null,
    answers: {},
    history: [],
    updatedAt: Date.now(),
  };
}
