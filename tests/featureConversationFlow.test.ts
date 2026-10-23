import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationFlow } from '../src/chatbot/conversationFlow';
import { InMemoryConversationStore } from '../src/chatbot/conversationManager';
import { MockSchemeService } from '../src/services/mockSchemeService';

describe('Conversational Integration: Rejection Recovery & Life-Event Discovery', () => {
  let store: InMemoryConversationStore;
  let flow: ConversationFlow;
  const user = '919876543999';

  beforeEach(() => {
    store = new InMemoryConversationStore();
    flow = new ConversationFlow(store, new MockSchemeService());
  });

  describe('Feature 1: Rejection Recovery Conversational Trigger', () => {
    it('should trigger rejection assistant prompt when user asks "My application was rejected"', async () => {
      const replies = await flow.handleMessage(user, 'My application was rejected');
      expect(replies.length).toBeGreaterThanOrEqual(1);
      expect(replies[0]).toContain('Rejection Recovery Assistant');
      expect(replies[0]).toContain('paste the rejection SMS');

      const state = await store.get(user);
      expect(state?.step).toBe('REJECTION_RECOVERY');
    });

    it('should immediately decode concrete rejection notice sent by citizen', async () => {
      const notice = 'Your application for PM-KISAN registration has been rejected due to beneficiary name mismatch with Aadhaar database.';
      const replies = await flow.handleMessage(user, notice);

      expect(replies.length).toBeGreaterThanOrEqual(1);
      expect(replies[0]).toContain('What the rejection message means');
      expect(replies[0]).toContain('Why this may have happened');
      expect(replies[0]).toContain('What you should do now');
      expect(replies[0]).toContain('Official Next Steps');
      expect(replies[0]).toContain('pmkisan.gov.in');

      const state = await store.get(user);
      expect(state?.step).toBe('REJECTION_RECOVERY');
    });

    it('should allow toggling to Hindi during rejection recovery state', async () => {
      const notice = 'Your application for PM-KISAN registration has been rejected due to beneficiary name mismatch with Aadhaar database.';
      await flow.handleMessage(user, notice);

      const replies = await flow.handleMessage(user, 'HINDI');
      expect(replies.length).toBeGreaterThanOrEqual(1);
      expect(replies[0]).toContain('अस्वीकृति');
    });

    it('should allow asking for simpler explanation ("SIMPLIFY")', async () => {
      const notice = 'Your application for PM-KISAN registration has been rejected due to beneficiary name mismatch with Aadhaar database.';
      await flow.handleMessage(user, notice);

      const replies = await flow.handleMessage(user, 'SIMPLIFY');
      expect(replies.length).toBeGreaterThanOrEqual(1);
      expect(replies[0]).toContain('Simplified Citizen Action Plan');
    });
  });

  describe('Feature 2: Life-Event Benefit Discovery Conversational Trigger', () => {
    it('should trigger prompt when user asks "Find schemes for my situation"', async () => {
      const replies = await flow.handleMessage(user, 'Find schemes for my situation');
      expect(replies.length).toBeGreaterThanOrEqual(1);
      expect(replies[0]).toContain('Life-Event Benefit Discovery');

      const state = await store.get(user);
      expect(state?.step).toBe('LIFE_EVENT_DISCOVERY');
    });

    it('should immediately discover crop loss schemes when citizen describes rain damage', async () => {
      const replies = await flow.handleMessage(user, 'Meri fasal baarish ki वजह se kharab ho gayi hai.');
      expect(replies.length).toBeGreaterThanOrEqual(1);
      expect(replies[0]).toContain('Crop Loss');
      expect(replies[0]).toContain('PMFBY');

      const state = await store.get(user);
      expect(state?.step).toBe('LIFE_EVENT_DISCOVERY');
    });

    it('should allow refining life event results with state name', async () => {
      await flow.handleMessage(user, 'Meri fasal baarish ki वजह se kharab ho gayi hai.');
      const replies = await flow.handleMessage(user, 'Karnataka');

      expect(replies.length).toBeGreaterThanOrEqual(1);
      expect(replies[0]).toContain('Crop');
    });

    it('should seamlessly transition to 7-question wizard when citizen types "ELIGIBILITY"', async () => {
      await flow.handleMessage(user, 'I want to start a small business');
      const replies = await flow.handleMessage(user, 'ELIGIBILITY');

      expect(replies.length).toBeGreaterThanOrEqual(1);
      expect(replies[0]).toContain('Privacy & Consent Notice');

      const state = await store.get(user);
      expect(state?.step).toBe('CONSENT');
    });
  });
});
