import {
  ConversationHistoryEntry,
  ConversationState,
  ConversationStep,
  IConversationStore,
  Language,
  UserAnswers,
} from '../types/conversation';
import {
  ISchemeService,
  OccupationType,
  Scheme,
  SchemeCategory,
  UserProfile,
} from '../types/scheme';
import {
  CATEGORY_MAP,
  matchIndianState,
  OCCUPATION_MAP,
  TRANSLATIONS,
} from './translations';
import { createInitialState } from './conversationManager';

export class ConversationFlow {
  private store: IConversationStore;
  private schemeService: ISchemeService;

  constructor(store: IConversationStore, schemeService: ISchemeService) {
    this.store = store;
    this.schemeService = schemeService;
  }

  /**
   * Main entry point for handling an incoming message from a WhatsApp sender.
   * Returns an array of WhatsApp text messages to send sequentially.
   */
  async handleMessage(
    senderId: string,
    rawText: string,
    messageId?: string
  ): Promise<string[]> {
    // 1. Message ID deduplication check (idempotency for retries)
    if (messageId) {
      const alreadyProcessed = await this.store.hasProcessedMessage(messageId);
      if (alreadyProcessed) {
        // Repeated webhook delivery: safely ignore to prevent duplicate enquiries or advancing state
        return [];
      }
      await this.store.markMessageProcessed(messageId);
    }

    const trimmed = rawText.trim();
    const normalized = trimmed.toLowerCase();

    // 2. Load existing state or initialize
    let state = await this.store.get(senderId);
    if (!state) {
      state = createInitialState(senderId);
    }

    const lang = state.language || 'en';
    const t = TRANSLATIONS[lang];

    // 3. Handle global commands

    // Command: STOP (Revoke consent, delete session, acknowledge)
    if (
      normalized === 'stop' ||
      normalized === 'रोकें' ||
      normalized === 'रद्द' ||
      normalized === 'बंद'
    ) {
      state.consent = false;
      state.answers = {};
      state.history = [];
      state.step = 'STOPPED';
      await this.store.set(senderId, state);
      return [t.consentRevoked];
    }

    // Command: HELP
    if (normalized === 'help' || normalized === 'मदद' || normalized === '?') {
      return [t.helpMessage];
    }

    // Command: RESTART
    if (
      normalized === 'restart' ||
      normalized === 'रीस्टार्ट' ||
      normalized === 'पुनः'
    ) {
      state = createInitialState(senderId, state.language);
      state.step = 'LANGUAGE_SELECTION';
      await this.store.set(senderId, state);
      return [TRANSLATIONS.en.welcome];
    }

    // Command: BACK
    if (normalized === 'back' || normalized === 'वापस' || normalized === 'पीछे') {
      return this.handleBackCommand(senderId, state);
    }

    // Welcome triggers: HI, HELLO, START, नमस्ते
    if (
      normalized === 'hi' ||
      normalized === 'hello' ||
      normalized === 'start' ||
      normalized === 'नमस्ते' ||
      normalized === 'हेलो' ||
      normalized === 'हाय' ||
      state.step === 'WELCOME'
    ) {
      state = createInitialState(senderId, state.language);
      state.step = 'LANGUAGE_SELECTION';
      await this.store.set(senderId, state);
      return [TRANSLATIONS.en.welcome];
    }

    // 4. State-dependent transitions
    switch (state.step) {
      case 'LANGUAGE_SELECTION':
        return this.handleLanguageSelection(senderId, state, trimmed);

      case 'CONSENT':
        return this.handleConsent(senderId, state, trimmed);

      case 'ASK_STATE':
        return this.handleStateAnswer(senderId, state, trimmed);

      case 'ASK_AGE':
        return this.handleAgeAnswer(senderId, state, trimmed);

      case 'ASK_OCCUPATION':
        return this.handleOccupationAnswer(senderId, state, trimmed);

      case 'ASK_CATEGORY':
        return this.handleCategoryAnswer(senderId, state, trimmed);

      case 'RESULTS':
        // After results are shown, guide the user on next steps
        return [
          lang === 'hi'
            ? `आप पहले ही परिणाम देख चुके हैं।\n• दोबारा खोजने के लिए *RESTART* लिखें।\n• श्रेणी बदलने के लिए *BACK* लिखें।\n• सहायता के लिए *HELP* लिखें।`
            : `You have completed the enquiry.\n• Type *RESTART* to start a new search.\n• Type *BACK* to change category.\n• Type *HELP* for available commands.`,
        ];

      case 'STOPPED':
        return [t.consentDeclined];

      default:
        state = createInitialState(senderId);
        state.step = 'LANGUAGE_SELECTION';
        await this.store.set(senderId, state);
        return [TRANSLATIONS.en.welcome];
    }
  }

  // --- Step Handlers ---

  private async handleLanguageSelection(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const trimmed = input.trim().toLowerCase();

    let chosenLang: Language | null = null;
    if (trimmed === '1' || trimmed === 'hindi' || trimmed === 'हिंदी') {
      chosenLang = 'hi';
    } else if (trimmed === '2' || trimmed === 'english' || trimmed === 'अंग्रेजी') {
      chosenLang = 'en';
    }

    if (!chosenLang) {
      return [TRANSLATIONS.en.selectLanguage];
    }

    state.language = chosenLang;
    state.step = 'CONSENT';
    await this.store.set(senderId, state);

    return [TRANSLATIONS[chosenLang].consentPrompt];
  }

  private async handleConsent(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];
    const trimmed = input.trim().toLowerCase();

    // Check Yes (1, yes, y, हाँ, haan)
    if (
      trimmed === '1' ||
      trimmed === 'yes' ||
      trimmed === 'y' ||
      trimmed === 'हाँ' ||
      trimmed === 'हां' ||
      trimmed === 'haan'
    ) {
      state.consent = true;
      state.step = 'ASK_STATE';
      state.history = [{ step: 'CONSENT', answers: {} }];
      await this.store.set(senderId, state);
      return [t.askState];
    }

    // Check No (2, no, n, नहीं, nahi)
    if (
      trimmed === '2' ||
      trimmed === 'no' ||
      trimmed === 'n' ||
      trimmed === 'नहीं' ||
      trimmed === 'nahi'
    ) {
      state.consent = false;
      state.answers = {};
      state.step = 'STOPPED';
      await this.store.set(senderId, state);
      return [t.consentDeclined];
    }

    // Invalid response to consent
    return [t.consentPrompt];
  }

  private async handleStateAnswer(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];

    // Enforce consent on server
    if (state.consent !== true) {
      return [t.consentDeclined];
    }

    const matchedState = matchIndianState(input);
    if (!matchedState) {
      return [t.invalidState];
    }

    this.pushHistory(state, 'ASK_STATE');
    state.answers.state = matchedState;
    state.step = 'ASK_AGE';
    await this.store.set(senderId, state);

    return [t.askAge];
  }

  private async handleAgeAnswer(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];

    // Enforce consent on server
    if (state.consent !== true) {
      return [t.consentDeclined];
    }

    const ageNum = parseInt(input.trim(), 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      return [t.invalidAge];
    }

    this.pushHistory(state, 'ASK_AGE');
    state.answers.age = ageNum;
    state.step = 'ASK_OCCUPATION';
    await this.store.set(senderId, state);

    return [t.askOccupation];
  }

  private async handleOccupationAnswer(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];

    // Enforce consent on server
    if (state.consent !== true) {
      return [t.consentDeclined];
    }

    const trimmed = input.trim();
    const num = parseInt(trimmed, 10);
    let occupation: OccupationType | null = null;

    if (!isNaN(num) && OCCUPATION_MAP[num]) {
      occupation = OCCUPATION_MAP[num];
    } else {
      const lower = trimmed.toLowerCase();
      if (lower.includes('farm') || lower.includes('किसान')) occupation = 'Farmer';
      else if (lower.includes('stud') || lower.includes('छात्र') || lower.includes('विद्यार्थी'))
        occupation = 'Student';
      else if (lower.includes('work') || lower.includes('labour') || lower.includes('मज़दूर') || lower.includes('श्रमिक'))
        occupation = 'Worker';
      else if (lower.includes('busin') || lower.includes('shop') || lower.includes('व्यापार') || lower.includes('स्वरोजगार'))
        occupation = 'Business Owner';
      else if (lower.includes('oth') || lower.includes('अन्य'))
        occupation = 'Other';
    }

    if (!occupation) {
      return [t.invalidOccupation];
    }

    this.pushHistory(state, 'ASK_OCCUPATION');
    state.answers.occupation = occupation;
    state.step = 'ASK_CATEGORY';
    await this.store.set(senderId, state);

    return [t.askCategory];
  }

  private async handleCategoryAnswer(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];

    // Enforce consent on server
    if (state.consent !== true) {
      return [t.consentDeclined];
    }

    const trimmed = input.trim();
    const num = parseInt(trimmed, 10);
    let category: SchemeCategory | null = null;

    if (!isNaN(num) && CATEGORY_MAP[num]) {
      category = CATEGORY_MAP[num];
    } else {
      const lower = trimmed.toLowerCase();
      if (lower.includes('agri') || lower.includes('कृषि')) category = 'Agriculture';
      else if (lower.includes('edu') || lower.includes('शिक्षा')) category = 'Education';
      else if (lower.includes('emp') || lower.includes('job') || lower.includes('रोजगार')) category = 'Employment';
      else if (lower.includes('hous') || lower.includes('आवास')) category = 'Housing';
      else if (lower.includes('health') || lower.includes('स्वास्थ्य')) category = 'Healthcare';
      else if (lower.includes('pen') || lower.includes('पेंशन')) category = 'Pension';
      else if (lower.includes('wom') || lower.includes('महिला')) category = "Women's Welfare";
      else if (lower.includes('oth') || lower.includes('अन्य')) category = 'Other';
    }

    if (!category) {
      return [t.invalidCategory];
    }

    this.pushHistory(state, 'ASK_CATEGORY');
    state.answers.category = category;
    state.step = 'RESULTS';
    await this.store.set(senderId, state);

    // Build user profile
    const profile: UserProfile = {
      state: state.answers.state || 'All India',
      age: state.answers.age || 30,
      occupation: state.answers.occupation || 'Other',
      category: category,
      language: state.language,
    };

    try {
      const schemes = await this.schemeService.getRelevantSchemes(profile);
      return this.formatSchemeResults(schemes, lang);
    } catch (error) {
      // Return friendly service error without crashing
      return [t.serviceError];
    }
  }

  private async handleBackCommand(
    senderId: string,
    state: ConversationState
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];

    if (!state.history || state.history.length === 0) {
      return [t.cannotGoBack];
    }

    const lastEntry = state.history.pop()!;
    state.step = lastEntry.step;
    state.answers = { ...lastEntry.answers };
    await this.store.set(senderId, state);

    switch (state.step) {
      case 'CONSENT':
        return [t.backAcknowledgment('Consent'), t.consentPrompt];
      case 'ASK_STATE':
        return [t.backAcknowledgment('State / UT'), t.askState];
      case 'ASK_AGE':
        return [t.backAcknowledgment('Age'), t.askAge];
      case 'ASK_OCCUPATION':
        return [t.backAcknowledgment('Occupation'), t.askOccupation];
      case 'ASK_CATEGORY':
        return [t.backAcknowledgment('Category'), t.askCategory];
      default:
        return [t.cannotGoBack];
    }
  }

  private pushHistory(state: ConversationState, currentStep: ConversationStep): void {
    if (!state.history) state.history = [];
    state.history.push({
      step: currentStep,
      answers: JSON.parse(JSON.stringify(state.answers)),
    });
  }

  /**
   * Formats scheme results into clean WhatsApp messages.
   * Splits into:
   * 1. Header message
   * 2. Detailed scheme cards (max 3)
   * 3. Guidance disclaimer
   */
  public formatSchemeResults(schemes: Scheme[], lang: Language): string[] {
    const t = TRANSLATIONS[lang];

    if (!schemes || schemes.length === 0) {
      return [t.noSchemesFound];
    }

    const messages: string[] = [];
    messages.push(t.resultsHeader(schemes.length));

    for (let i = 0; i < schemes.length; i++) {
      const s = schemes[i];
      const card =
        `🏛️ *${i + 1}. ${s.name}*\n` +
        `📍 _Coverage: ${s.state}_\n\n` +
        `${t.schemeItem.purpose} ${s.description}\n\n` +
        `${t.schemeItem.benefits} ${s.benefits}\n\n` +
        `${t.schemeItem.eligibility} ${s.eligibilitySummary}\n\n` +
        `${t.schemeItem.documents}\n` +
        s.requiredDocuments.map((doc) => `• ${doc}`).join('\n') +
        `\n\n` +
        `${t.schemeItem.application}\n` +
        s.applicationSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n') +
        `\n\n` +
        `${t.schemeItem.officialLink} ${s.officialUrl}\n` +
        `${t.schemeItem.lastVerified} ${s.lastVerifiedAt}`;

      messages.push(card);
    }

    messages.push(t.disclaimer);
    return messages;
  }
}
