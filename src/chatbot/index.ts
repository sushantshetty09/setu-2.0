import { InMemoryConversationStore } from './conversationManager';
import { ConversationFlow } from './conversationFlow';
import { defaultSchemeService } from '../services/schemeService';

export const defaultConversationStore = new InMemoryConversationStore();
export const defaultConversationFlow = new ConversationFlow(
  defaultConversationStore,
  defaultSchemeService
);

export * from './conversationFlow';
export * from './conversationManager';
export * from './translations';
