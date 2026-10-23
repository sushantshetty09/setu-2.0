import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationFlow } from '../src/chatbot/conversationFlow';
import { InMemoryConversationStore } from '../src/chatbot/conversationManager';
import { MockSchemeService } from '../src/services/mockSchemeService';

describe('Scheme Saathi Conversation Flow', () => {
  let store: InMemoryConversationStore;
  let mockSchemeService: MockSchemeService;
  let flow: ConversationFlow;
  const user = '919876543210';

  beforeEach(() => {
    store = new InMemoryConversationStore();
    mockSchemeService = new MockSchemeService();
    flow = new ConversationFlow(store, mockSchemeService);
  });

  describe('Step 1: Welcome & Language Selection', () => {
    it('should send welcome message and prompt language selection on "HI"', async () => {
      const replies = await flow.handleMessage(user, 'HI');
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('Welcome to *Scheme Saathi*!');
      expect(replies[0]).toContain('1. Hindi');
      expect(replies[0]).toContain('2. English');
      expect(replies[0]).toContain('3. Kannada');

      const state = await store.get(user);
      expect(state?.step).toBe('LANGUAGE_SELECTION');
    });

    it('should recognize Hindi greeting "नमस्ते"', async () => {
      const replies = await flow.handleMessage(user, 'नमस्ते');
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('Scheme Saathi');
    });

    it('should select English when user chooses 2', async () => {
      await flow.handleMessage(user, 'HI');
      const replies = await flow.handleMessage(user, '2');

      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('Privacy & Consent Notice');
      expect(replies[0]).toContain('Do you consent?');

      const state = await store.get(user);
      expect(state?.language).toBe('en');
      expect(state?.step).toBe('CONSENT');
    });

    it('should select Hindi when user chooses 1', async () => {
      await flow.handleMessage(user, 'HI');
      const replies = await flow.handleMessage(user, '1');

      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('गोपनीयता और सहमति सूचना');

      const state = await store.get(user);
      expect(state?.language).toBe('hi');
      expect(state?.step).toBe('CONSENT');
    });

    it('should select Kannada when user chooses 3', async () => {
      await flow.handleMessage(user, 'HI');
      const replies = await flow.handleMessage(user, '3');

      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('ಗೌಪ್ಯತೆ ಮತ್ತು ಸಮ್ಮತಿ ಸೂಚನೆ');

      const state = await store.get(user);
      expect(state?.language).toBe('kn');
      expect(state?.step).toBe('CONSENT');
    });
  });

  describe('Step 2: Privacy Consent Enforcement', () => {
    beforeEach(async () => {
      await flow.handleMessage(user, 'HI');
      await flow.handleMessage(user, '2'); // English
    });

    it('should record consent and ask Question 1 (Name) when user consents (Yes / 1)', async () => {
      const replies = await flow.handleMessage(user, '1'); // Yes
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('Question 1 of 7');
      expect(replies[0]).toContain('full name');

      const state = await store.get(user);
      expect(state?.consent).toBe(true);
      expect(state?.step).toBe('ASK_NAME');
    });

    it('should stop conversation and record NO consent when user declines (No / 2)', async () => {
      const replies = await flow.handleMessage(user, '2'); // No
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('chosen not to share personal information');

      const state = await store.get(user);
      expect(state?.consent).toBe(false);
      expect(state?.step).toBe('STOPPED');
      expect(state?.answers).toEqual({});
    });

    it('should immediately revoke consent and delete session on STOP', async () => {
      // User consented first
      await flow.handleMessage(user, '1');
      await flow.handleMessage(user, 'Ramesh Kumar');

      // Now user sends STOP
      const replies = await flow.handleMessage(user, 'STOP');
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('Your consent has been revoked');

      const state = await store.get(user);
      expect(state?.consent).toBe(false);
      expect(state?.answers).toEqual({});
      expect(state?.step).toBe('STOPPED');
    });
  });

  describe('Step 3: Sequential Detail Collection & Validation (7 Questions)', () => {
    beforeEach(async () => {
      await flow.handleMessage(user, 'HI');
      await flow.handleMessage(user, '2'); // English
      await flow.handleMessage(user, '1'); // Consent Yes
    });

    it('should validate and accept valid name, then ask for gender (Q2)', async () => {
      const replies = await flow.handleMessage(user, 'Ramesh Kumar');
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('Question 2 of 7');
      expect(replies[0]).toContain('gender');

      const state = await store.get(user);
      expect(state?.answers.name).toBe('Ramesh Kumar');
      expect(state?.step).toBe('ASK_GENDER');
    });

    it('should reject invalid name (digits only or too short) and prompt again', async () => {
      const replies = await flow.handleMessage(user, '12345');
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('Please enter a valid name');

      const state = await store.get(user);
      expect(state?.step).toBe('ASK_NAME');
    });

    it('should validate and accept gender, then ask for state (Q3)', async () => {
      await flow.handleMessage(user, 'Ramesh Kumar');
      const replies = await flow.handleMessage(user, '2'); // Male
      expect(replies[0]).toContain('Question 3 of 7');
      expect(replies[0]).toContain('state or Union Territory');

      const state = await store.get(user);
      expect(state?.answers.gender).toBe('Male');
      expect(state?.step).toBe('ASK_STATE');
    });

    it('should validate state, then ask for age (Q4)', async () => {
      await flow.handleMessage(user, 'Ramesh Kumar');
      await flow.handleMessage(user, '2'); // Male
      const replies = await flow.handleMessage(user, 'Maharashtra');
      expect(replies[0]).toContain('Question 4 of 7');
      expect(replies[0]).toContain('age in years');

      const state = await store.get(user);
      expect(state?.answers.state).toBe('Maharashtra');
      expect(state?.step).toBe('ASK_AGE');
    });

    it('should reject invalid state and prompt again', async () => {
      await flow.handleMessage(user, 'Ramesh Kumar');
      await flow.handleMessage(user, '2'); // Male
      const replies = await flow.handleMessage(user, 'AtlantisCity');
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain("couldn't recognize that state");

      const state = await store.get(user);
      expect(state?.step).toBe('ASK_STATE');
      expect(state?.answers.state).toBeUndefined();
    });

    it('should validate age correctly, then ask for occupation (Q5)', async () => {
      await flow.handleMessage(user, 'Ramesh Kumar');
      await flow.handleMessage(user, '2');
      await flow.handleMessage(user, 'Delhi');

      // Invalid age (letters)
      const errReply = await flow.handleMessage(user, 'twenty five');
      expect(errReply[0]).toContain('Please enter a valid age as a whole number between 1 and 120');

      // Valid age
      const validReply = await flow.handleMessage(user, '32');
      expect(validReply[0]).toContain('Question 5 of 7');
      expect(validReply[0]).toContain('occupation');

      const state = await store.get(user);
      expect(state?.answers.age).toBe(32);
      expect(state?.step).toBe('ASK_OCCUPATION');
    });

    it('should validate occupation option (1-5), then ask for annual income (Q6)', async () => {
      await flow.handleMessage(user, 'Ramesh Kumar');
      await flow.handleMessage(user, '2');
      await flow.handleMessage(user, 'Bihar');
      await flow.handleMessage(user, '29');

      // Valid option 1: Farmer
      const reply = await flow.handleMessage(user, '1');
      expect(reply[0]).toContain('Question 6 of 7');
      expect(reply[0]).toContain('annual household income');

      const state = await store.get(user);
      expect(state?.answers.occupation).toBe('Farmer');
      expect(state?.step).toBe('ASK_INCOME');
    });

    it('should validate income range (1-4), then ask for category (Q7)', async () => {
      await flow.handleMessage(user, 'Ramesh Kumar');
      await flow.handleMessage(user, '2');
      await flow.handleMessage(user, 'Bihar');
      await flow.handleMessage(user, '29');
      await flow.handleMessage(user, '1'); // Farmer

      // Valid income option 1: Below 1 Lakh
      const reply = await flow.handleMessage(user, '1');
      expect(reply[0]).toContain('Question 7 of 7');
      expect(reply[0]).toContain('category of government assistance');

      const state = await store.get(user);
      expect(state?.answers.annualIncome).toBe('Below ₹1 Lakh (BPL)');
      expect(state?.step).toBe('ASK_CATEGORY');
    });

    it('should complete flow, return scheme results, and record enquiry into database', async () => {
      await flow.handleMessage(user, 'Sunita Devi');
      await flow.handleMessage(user, '1'); // Female
      await flow.handleMessage(user, 'Uttar Pradesh');
      await flow.handleMessage(user, '35');
      await flow.handleMessage(user, '1'); // Farmer
      await flow.handleMessage(user, '1'); // Below 1 Lakh

      // Category 1: Agriculture
      const replies = await flow.handleMessage(user, '1');

      // Should return header, database enquiry badge, scheme card(s), and disclaimer
      expect(replies.length).toBeGreaterThanOrEqual(3);
      expect(replies[0]).toContain('We found');
      expect(replies[0]).toContain('relevant government');

      // Database enquiry confirmation badge
      expect(replies[1]).toContain('Citizen Enquiry Recorded in Website Database');
      expect(replies[1]).toContain('Sunita Devi');
      expect(replies[1]).toContain('#ENQ-');

      // Scheme details check
      const allText = replies.join(' ');
      expect(allText).toContain('Pradhan Mantri Kisan Samman Nidhi');
      expect(allText).toContain('Purpose:');
      expect(allText).toContain('Key Benefits:');
      expect(allText).toContain('Eligibility Summary:');
      expect(allText).toContain('Required Documents:');
      expect(allText).toContain('How to Apply:');
      expect(allText).toContain('Official Portal:');
      expect(allText).toContain('Notice:'); // Disclaimer
    });
  });

  describe('Step 4 & 5: Results Formatting and Safeguards', () => {
    it('should return a maximum of 3 schemes', async () => {
      await flow.handleMessage(user, 'HI');
      await flow.handleMessage(user, '2'); // English
      await flow.handleMessage(user, '1'); // Yes
      await flow.handleMessage(user, 'Gopal Das');
      await flow.handleMessage(user, '2'); // Male
      await flow.handleMessage(user, 'Maharashtra');
      await flow.handleMessage(user, '40');
      await flow.handleMessage(user, '3'); // Worker
      await flow.handleMessage(user, '2'); // 1-3 Lakh
      const replies = await flow.handleMessage(user, '5'); // Healthcare

      // Card count should be at most 3 + header + badge + disclaimer
      const schemeCards = replies.filter((m) => m.includes('🏛️'));
      expect(schemeCards.length).toBeLessThanOrEqual(3);
      expect(schemeCards.length).toBeGreaterThanOrEqual(1);
    });

    it('should inform user respectfully if no schemes match criteria', async () => {
      // Empty mock service
      const emptySchemeService = new MockSchemeService([]);
      const customFlow = new ConversationFlow(store, emptySchemeService);

      await customFlow.handleMessage(user, 'HI');
      await customFlow.handleMessage(user, '2');
      await customFlow.handleMessage(user, '1');
      await customFlow.handleMessage(user, 'Maya Verma');
      await customFlow.handleMessage(user, '1'); // Female
      await customFlow.handleMessage(user, 'Goa');
      await customFlow.handleMessage(user, '22');
      await customFlow.handleMessage(user, '2'); // Student
      await customFlow.handleMessage(user, '4'); // Above 8L
      const replies = await customFlow.handleMessage(user, '8'); // Other

      expect(replies.length).toBeGreaterThanOrEqual(1);
      const allText = replies.join(' ');
      expect(allText).toContain('No direct matches found in our current catalogue');
      expect(allText).toContain('mean you are ineligible for government assistance');
    });
  });

  describe('Navigation & Commands: BACK, RESTART, HELP', () => {
    it('should navigate back to previous question using BACK', async () => {
      await flow.handleMessage(user, 'HI');
      await flow.handleMessage(user, '2'); // English
      await flow.handleMessage(user, '1'); // Consent
      await flow.handleMessage(user, 'Ramesh');
      await flow.handleMessage(user, '2'); // Male
      await flow.handleMessage(user, 'Punjab');
      await flow.handleMessage(user, '28');

      const stateBefore = await store.get(user);
      expect(stateBefore?.step).toBe('ASK_OCCUPATION');

      // User types BACK
      const replies = await flow.handleMessage(user, 'BACK');
      expect(replies[0]).toContain('Going back to *Age*');

      const stateAfter = await store.get(user);
      expect(stateAfter?.step).toBe('ASK_AGE');
    });

    it('should restart conversation from beginning on RESTART', async () => {
      await flow.handleMessage(user, 'HI');
      await flow.handleMessage(user, '2');
      await flow.handleMessage(user, '1');
      await flow.handleMessage(user, 'Ramesh');

      const replies = await flow.handleMessage(user, 'RESTART');
      expect(replies[0]).toContain('Welcome to *Scheme Saathi*!');

      const state = await store.get(user);
      expect(state?.step).toBe('LANGUAGE_SELECTION');
      expect(state?.answers).toEqual({});
    });

    it('should show help menu without losing conversation step on HELP', async () => {
      await flow.handleMessage(user, 'HI');
      await flow.handleMessage(user, '2');
      await flow.handleMessage(user, '1');

      const replies = await flow.handleMessage(user, 'HELP');
      expect(replies[0]).toContain('Scheme Saathi Commands');
      expect(replies[0]).toContain('BACK');
      expect(replies[0]).toContain('RESTART');
      expect(replies[0]).toContain('STOP');

      // Step should remain ASK_NAME
      const state = await store.get(user);
      expect(state?.step).toBe('ASK_NAME');
    });
  });

  describe('Deduplication & Webhook Retries', () => {
    it('should process a message once and ignore duplicate message ID', async () => {
      const msgId = 'wamid.HBgLMTIzNDU2';

      const firstReplies = await flow.handleMessage(user, 'HI', msgId);
      expect(firstReplies).toHaveLength(1);

      // Same message arrives again from Meta retry
      const duplicateReplies = await flow.handleMessage(user, 'HI', msgId);
      expect(duplicateReplies).toHaveLength(0); // Safely ignored
    });
  });

  describe('Kannada (ಕನ್ನಡ) Language Flow & Commands', () => {
    it('should welcome user and allow choosing Kannada via option 3', async () => {
      const welcomeReplies = await flow.handleMessage(user, 'ನಮಸ್ಕಾರ');
      expect(welcomeReplies[0]).toContain('Scheme Saathi');
      expect(welcomeReplies[0]).toContain('3. Kannada (ಕನ್ನಡ)');

      const replies = await flow.handleMessage(user, '3');
      expect(replies).toHaveLength(1);
      expect(replies[0]).toContain('ಗೌಪ್ಯತೆ ಮತ್ತು ಸಮ್ಮತಿ ಸೂಚನೆ');
      expect(replies[0]).toContain('ನೀವು ಸಮ್ಮತಿಸುತ್ತೀರಾ?');

      const state = await store.get(user);
      expect(state?.language).toBe('kn');
      expect(state?.step).toBe('CONSENT');
    });

    it('should complete the entire 7-question Kannada wizard for a Karnataka farmer', async () => {
      // 1. Start with Kannada greeting
      await flow.handleMessage(user, 'ನಮಸ್ತೆ');
      // 2. Select Kannada
      await flow.handleMessage(user, 'ಕನ್ನಡ');
      // 3. Consent with Kannada "ಹೌದು"
      const consentReplies = await flow.handleMessage(user, 'ಹೌದು');
      expect(consentReplies[0]).toContain('ಪ್ರಶ್ನೆ 1 / 7');
      expect(consentReplies[0]).toContain('ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರೇನು');

      // 4. Enter name: ಬಸವರಾಜ್ ಗೌಡ
      const nameReplies = await flow.handleMessage(user, 'ಬಸವರಾಜ್ ಗೌಡ');
      expect(nameReplies[0]).toContain('ಪ್ರಶ್ನೆ 2 / 7');
      expect(nameReplies[0]).toContain('ನಿಮ್ಮ ಲಿಂಗ');

      // 5. Enter gender: 2 (Male / ಪುರುಷ)
      const genderReplies = await flow.handleMessage(user, '2');
      expect(genderReplies[0]).toContain('ಪ್ರಶ್ನೆ 3 / 7');
      expect(genderReplies[0]).toContain('ನೀವು ಯಾವ ಭಾರತೀಯ ರಾಜ್ಯ');

      // 6. Enter state: ಕರ್ನಾಟಕ
      const stateReplies = await flow.handleMessage(user, 'ಕರ್ನಾಟಕ');
      expect(stateReplies[0]).toContain('ಪ್ರಶ್ನೆ 4 / 7');
      expect(stateReplies[0]).toContain('ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು ವರ್ಷಗಳು');

      // 7. Enter age: 40
      const ageReplies = await flow.handleMessage(user, '40');
      expect(ageReplies[0]).toContain('ಪ್ರಶ್ನೆ 5 / 7');
      expect(ageReplies[0]).toContain('ನಿಮ್ಮ ಮುಖ್ಯ ವೃತ್ತಿ ಯಾವುದು');
      expect(ageReplies[0]).toContain('1. ರೈತ');

      // 8. Enter occupation: 1 (Farmer / ರೈತ)
      const occReplies = await flow.handleMessage(user, '1');
      expect(occReplies[0]).toContain('ಪ್ರಶ್ನೆ 6 / 7');
      expect(occReplies[0]).toContain('ಕುಟುಂಬದ ಆದಾಯ');

      // 9. Enter income: 1 (Below 1 Lakh / BPL)
      const incReplies = await flow.handleMessage(user, '1');
      expect(incReplies[0]).toContain('ಪ್ರಶ್ನೆ 7 / 7');
      expect(incReplies[0]).toContain('ನೀವು ಯಾವ ವರ್ಗದ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ');
      expect(incReplies[0]).toContain('1. ಕೃಷಿ');

      // 10. Enter category: 1 (Agriculture / ಕೃಷಿ)
      const resultsReplies = await flow.handleMessage(user, '1');
      expect(resultsReplies.length).toBeGreaterThanOrEqual(3);
      expect(resultsReplies[0]).toContain('ಸೂಕ್ತ ಸರ್ಕಾರಿ');

      // Kannada enquiry confirmation badge
      expect(resultsReplies[1]).toContain('ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ');
      expect(resultsReplies[1]).toContain('ಬಸವರಾಜ್ ಗೌಡ');

      // Scheme cards should use Kannada labels
      const card = resultsReplies[2];
      expect(card).toContain('ಉದ್ದೇಶ:');
      expect(card).toContain('ಪ್ರಮುಖ ಸೌಲಭ್ಯಗಳು/ಲಾಭಗಳು:');
      expect(card).toContain('ಅರ್ಹತಾ ಸಾರಾಂಶ:');
      expect(card).toContain('ಅಗತ್ಯ ದಾಖಲೆಗಳು:');
      expect(card).toContain('ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ:');
      expect(card).toContain('ಅಧಿಕೃತ ಪೋರ್ಟಲ್:');

      const state = await store.get(user);
      expect(state?.step).toBe('RESULTS');
      expect(state?.answers.name).toBe('ಬಸವರಾಜ್ ಗೌಡ');
      expect(state?.answers.gender).toBe('Male');
      expect(state?.answers.state).toBe('Karnataka');
      expect(state?.answers.age).toBe(40);
      expect(state?.answers.occupation).toBe('Farmer');
      expect(state?.answers.annualIncome).toBe('Below ₹1 Lakh (BPL)');
      expect(state?.answers.category).toBe('Agriculture');
    });

    it('should support Kannada commands: ಸಹಾಯ (HELP), ಹಿಂದೆ (BACK), ಮರುಪ್ರಾರಂಭ (RESTART), ನಿಲ್ಲಿಸಿ (STOP)', async () => {
      await flow.handleMessage(user, 'HI');
      await flow.handleMessage(user, '3'); // Kannada
      await flow.handleMessage(user, '1'); // Consent Yes
      await flow.handleMessage(user, 'ಬಸವರಾಜ್'); // Name

      // Test HELP in Kannada
      const helpReplies = await flow.handleMessage(user, 'ಸಹಾಯ');
      expect(helpReplies[0]).toContain('ಸ್ಕೀಮ್ ಸಾಥಿ ಆಜ್ಞೆಗಳ ಮಾರ್ಗದರ್ಶಿ');
      expect(helpReplies[0]).toContain('BACK');
      expect(helpReplies[0]).toContain('RESTART');

      // Test BACK in Kannada
      const backReplies = await flow.handleMessage(user, 'ಹಿಂದೆ');
      expect(backReplies[0]).toContain('ಹಿಂದಿನ ಹಂತ');
      const stateAfterBack = await store.get(user);
      expect(stateAfterBack?.step).toBe('ASK_NAME');

      // Test STOP in Kannada
      const stopReplies = await flow.handleMessage(user, 'ನಿಲ್ಲಿಸಿ');
      expect(stopReplies[0]).toContain('ನಿಮ್ಮ ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಲಾಗಿದೆ');
      const stateAfterStop = await store.get(user);
      expect(stateAfterStop?.step).toBe('STOPPED');
      expect(stateAfterStop?.consent).toBe(false);
    });
  });
});
