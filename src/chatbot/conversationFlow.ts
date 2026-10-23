import {
  ConversationHistoryEntry,
  ConversationState,
  ConversationStep,
  IConversationStore,
  Language,
  UserAnswers,
} from '../types/conversation';
import {
  GenderType,
  IncomeBracket,
  ISchemeService,
  OccupationType,
  Scheme,
  SchemeCategory,
  UserProfile,
} from '../types/scheme';
import {
  CATEGORY_MAP,
  GENDER_MAP,
  INCOME_MAP,
  matchIndianState,
  OCCUPATION_MAP,
  TRANSLATIONS,
} from './translations';
import { createInitialState } from './conversationManager';
import { GeminiService, defaultGeminiService } from '../services/geminiService';
import { defaultEnquiryService, EnquiryService } from '../services/enquiryService';
import {
  RejectionRecoveryService,
  defaultRejectionRecoveryService,
} from '../services/rejectionRecoveryService';
import {
  LifeEventService,
  defaultLifeEventService,
} from '../services/lifeEventService';

export class ConversationFlow {
  private store: IConversationStore;
  private schemeService: ISchemeService;
  private geminiService: GeminiService;
  private enquiryService: EnquiryService;
  private rejectionService: RejectionRecoveryService;
  private lifeEventService: LifeEventService;

  constructor(
    store: IConversationStore,
    schemeService: ISchemeService,
    geminiService: GeminiService = defaultGeminiService,
    enquiryService: EnquiryService = defaultEnquiryService,
    rejectionService: RejectionRecoveryService = defaultRejectionRecoveryService,
    lifeEventService: LifeEventService = defaultLifeEventService
  ) {
    this.store = store;
    this.schemeService = schemeService;
    this.geminiService = geminiService;
    this.enquiryService = enquiryService;
    this.rejectionService = rejectionService;
    this.lifeEventService = lifeEventService;
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
      normalized === 'बंद' ||
      normalized === 'ನಿಲ್ಲಿಸಿ' ||
      normalized === 'ರದ್ದು' ||
      normalized === 'ಬೇಡ'
    ) {
      state.consent = false;
      state.answers = {};
      state.history = [];
      state.step = 'STOPPED';
      await this.store.set(senderId, state);
      return [t.consentRevoked];
    }

    // Command: HELP
    if (
      normalized === 'help' ||
      normalized === 'मदद' ||
      normalized === '?' ||
      normalized === 'ಸಹಾಯ' ||
      normalized === 'ನೆರವು'
    ) {
      return [t.helpMessage];
    }

    // Command: RESTART
    if (
      normalized === 'restart' ||
      normalized === 'रीस्टार्ट' ||
      normalized === 'पुनः' ||
      normalized === 'ಮರುಪ್ರಾರಂಭ' ||
      normalized === 'ಆರಂಭ'
    ) {
      state = createInitialState(senderId, state.language);
      state.step = 'LANGUAGE_SELECTION';
      await this.store.set(senderId, state);
      return [TRANSLATIONS.en.welcome];
    }

    // Command: BACK
    if (
      normalized === 'back' ||
      normalized === 'वापस' ||
      normalized === 'पीछे' ||
      normalized === 'ಹಿಂದೆ'
    ) {
      return this.handleBackCommand(senderId, state);
    }

    // Welcome triggers: HI, HELLO, START, नमस्ते, ನಮಸ್ಕಾರ
    if (
      normalized === 'hi' ||
      normalized === 'hello' ||
      normalized === 'start' ||
      normalized === 'नमस्ते' ||
      normalized === 'हेलो' ||
      normalized === 'हाय' ||
      normalized === 'ನಮಸ್ಕಾರ' ||
      normalized === 'ನಮಸ್ತೆ'
    ) {
      state = createInitialState(senderId, state.language);
      state.step = 'LANGUAGE_SELECTION';
      await this.store.set(senderId, state);
      return [TRANSLATIONS.en.welcome];
    }

    // Check if currently in specialized feature steps
    if (state.step === 'REJECTION_RECOVERY') {
      return this.handleRejectionState(senderId, state, trimmed);
    }

    if (state.step === 'LIFE_EVENT_DISCOVERY') {
      return this.handleLifeEventState(senderId, state, trimmed);
    }

    // Check if the user triggered Rejection Recovery or Life-Event Discovery
    const midFormSteps = ['ASK_GENDER', 'ASK_AGE', 'ASK_OCCUPATION', 'ASK_INCOME', 'ASK_CATEGORY'];
    const isMidForm = midFormSteps.includes(state.step);

    if (!isMidForm || trimmed.length > 25) {
      if (this.isRejectionIntent(trimmed)) {
        return this.handleRejectionIntent(senderId, state, trimmed);
      }
      if (this.isLifeEventIntent(trimmed)) {
        return this.handleLifeEventIntent(senderId, state, trimmed);
      }
    }

    // Direct question on first contact
    if (state.step === 'WELCOME') {
      const profile = await this.geminiService.extractProfileFromQuery(trimmed);
      if (profile.isQuestion || trimmed.length > 15) {
        state.step = 'LANGUAGE_SELECTION';
        await this.store.set(senderId, state);
        const aiAnswer = await this.geminiService.answerSchemeQuery(trimmed, {
          state: profile.state,
          occupation: profile.occupation,
        });
        return [
          aiAnswer,
          `\n💡 _(Tip: Reply *1* for Hindi, *2* for English, or *3* for Kannada (ಕನ್ನಡ) anytime to start the personalized eligibility check)_`,
        ];
      }
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

      case 'ASK_NAME':
        return this.handleNameAnswer(senderId, state, trimmed);

      case 'ASK_GENDER':
        return this.handleGenderAnswer(senderId, state, trimmed);

      case 'ASK_STATE':
        return this.handleStateAnswer(senderId, state, trimmed);

      case 'ASK_AGE':
        return this.handleAgeAnswer(senderId, state, trimmed);

      case 'ASK_OCCUPATION':
        return this.handleOccupationAnswer(senderId, state, trimmed);

      case 'ASK_INCOME':
        return this.handleIncomeAnswer(senderId, state, trimmed);

      case 'ASK_CATEGORY':
        return this.handleCategoryAnswer(senderId, state, trimmed);

      case 'RESULTS':
        // If user asks a question or asks for more info after viewing results, answer it with Gemini AI
        const followUpProfile = await this.geminiService.extractProfileFromQuery(trimmed);
        if (followUpProfile.isQuestion || trimmed.length >= 4) {
          const aiAnswer = await this.geminiService.answerSchemeQuery(trimmed, {
            language: state.language,
            name: state.answers.name,
            gender: state.answers.gender,
            annualIncome: state.answers.annualIncome,
            state: state.answers.state,
            occupation: state.answers.occupation,
            age: state.answers.age,
            lastShownSchemes: state.lastShownSchemes,
            history: state.chatHistory,
          });
          this.appendChatHistory(state, trimmed, aiAnswer);
          await this.store.set(senderId, state);
          return [aiAnswer];
        }
        return [
          lang === 'kn'
            ? `ನೀವು ಈಗಾಗಲೇ ಫಲಿತಾಂಶಗಳನ್ನು ಪರಿಶೀಲಿಸಿದ್ದೀರಿ.\n• ಯಾವುದೇ ಯೋಜನೆಯ ಬಗ್ಗೆ ಹೆಚ್ಚಿನ ವಿವರಗಳನ್ನು ಕೇಳಿ (ಉದಾ: "PM-KISAN ಬಗ್ಗೆ ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ನೀಡಿ" ಅಥವಾ "ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?")\n• ಹೊಸ ಹುಡುಕಾಟಕ್ಕಾಗಿ *RESTART* ಎಂದು ಟೈಪ್ ಮಾಡಿ.\n• ವರ್ಗ ಬದಲಾಯಿಸಲು *BACK* ಎಂದು ಟೈಪ್ ಮಾಡಿ.\n• ಆಜ್ಞೆಗಳಿಗಾಗಿ *HELP* ಎಂದು ಟೈಪ್ ಮಾಡಿ.`
            : lang === 'hi'
            ? `आप पहले ही परिणाम देख चुके हैं।\n• किसी भी योजना के बारे में विस्तृत जानकारी पूछें (जैसे: "PM-KISAN के बारे में और बताओ" या "आवेदन कैसे करें?")\n• दोबारा खोजने के लिए *RESTART* लिखें।\n• श्रेणी बदलने के लिए *BACK* लिखें।\n• सहायता के लिए *HELP* लिखें।`
            : `You have completed the enquiry.\n• Ask for more details on any scheme (e.g. "Tell me more about PM-KISAN" or "How to apply?")\n• Type *RESTART* to start a new search.\n• Type *BACK* to change category.\n• Type *HELP* for available commands.`,
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
    } else if (
      trimmed === '3' ||
      trimmed === 'kannada' ||
      trimmed === 'ಕನ್ನಡ' ||
      trimmed === 'kan' ||
      trimmed === 'kn'
    ) {
      chosenLang = 'kn';
    }

    if (!chosenLang) {
      // Check if user is asking a free-form scheme question right away!
      const profile = await this.geminiService.extractProfileFromQuery(input);
      if (profile.isQuestion || input.length > 15) {
        const aiAnswer = await this.geminiService.answerSchemeQuery(input, {
          state: profile.state,
          occupation: profile.occupation,
        });
        return [
          aiAnswer,
          `\n💡 _(Tip: Reply *1* for Hindi, *2* for English, or *3* for Kannada (ಕನ್ನಡ) anytime to start the personalized eligibility check)_`,
        ];
      }
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

    // Check Yes (1, yes, y, हाँ, haan, ಹೌದು, ಸರಿ, ಒಪ್ಪಿಗೆ)
    if (
      trimmed === '1' ||
      trimmed === 'yes' ||
      trimmed === 'y' ||
      trimmed === 'हाँ' ||
      trimmed === 'हां' ||
      trimmed === 'haan' ||
      trimmed === 'ಹೌದು' ||
      trimmed === 'ಸರಿ' ||
      trimmed === 'ಒಪ್ಪಿಗೆ'
    ) {
      state.consent = true;
      state.step = 'ASK_NAME';
      state.history = [{ step: 'CONSENT', answers: {} }];
      await this.store.set(senderId, state);
      return [t.askName];
    }

    // Check No (2, no, n, नहीं, nahi, ಇಲ್ಲ, ಬೇಡ)
    if (
      trimmed === '2' ||
      trimmed === 'no' ||
      trimmed === 'n' ||
      trimmed === 'नहीं' ||
      trimmed === 'nahi' ||
      trimmed === 'ಇಲ್ಲ' ||
      trimmed === 'ಬೇಡ'
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

  private async handleNameAnswer(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];

    if (state.consent !== true) {
      return [t.consentDeclined];
    }

    const trimmed = input.trim();
    const isAllDigits = /^\d+$/.test(trimmed);
    const isCommand = ['stop', 'help', 'restart', 'back', 'madad', 'sahay', 'rok'].includes(
      trimmed.toLowerCase()
    );

    if (trimmed.length < 2 || trimmed.length > 60 || isAllDigits || isCommand) {
      return [t.invalidName];
    }

    // Capitalize each word nicely
    const cleanedName = trimmed
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    this.pushHistory(state, 'ASK_NAME');
    state.answers.name = cleanedName;
    state.step = 'ASK_GENDER';
    await this.store.set(senderId, state);

    return [t.askGender];
  }

  private async handleGenderAnswer(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];

    if (state.consent !== true) {
      return [t.consentDeclined];
    }

    const trimmed = input.trim();
    const num = parseInt(trimmed, 10);
    let gender: GenderType | null = null;

    if (!isNaN(num) && GENDER_MAP[num]) {
      gender = GENDER_MAP[num];
    } else {
      const lower = trimmed.toLowerCase();
      if (
        lower.includes('female') ||
        lower.includes('woman') ||
        lower.includes('girl') ||
        lower.includes('mahila') ||
        lower.includes('महिला') ||
        lower.includes('औरत') ||
        lower.includes('ಮಹಿಳೆ') ||
        lower.includes('ಹೆಣ್ಣು') ||
        lower.includes('ಸ್ತ್ರೀ')
      ) {
        gender = 'Female';
      } else if (
        lower.includes('male') ||
        lower.includes('man') ||
        lower.includes('boy') ||
        lower.includes('purush') ||
        lower.includes('पुरुष') ||
        lower.includes('आदमी') ||
        lower.includes('ಪುರುಷ') ||
        lower.includes('ಗಂಡು')
      ) {
        gender = 'Male';
      } else if (
        lower.includes('other') ||
        lower.includes('trans') ||
        lower.includes('anya') ||
        lower.includes('अन्य') ||
        lower.includes('ಇತರೆ') ||
        lower.includes('ತೃತೀಯಲಿಂಗ')
      ) {
        gender = 'Other';
      }
    }

    if (!gender) {
      return [t.invalidGender];
    }

    this.pushHistory(state, 'ASK_GENDER');
    state.answers.gender = gender;
    state.step = 'ASK_STATE';
    await this.store.set(senderId, state);

    return [t.askState];
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
      if (
        lower.includes('farm') ||
        lower.includes('किसान') ||
        lower.includes('ರೈತ') ||
        lower.includes('ಕೃಷಿಕ')
      )
        occupation = 'Farmer';
      else if (
        lower.includes('stud') ||
        lower.includes('छात्र') ||
        lower.includes('विद्यार्थी') ||
        lower.includes('ವಿದ್ಯಾರ್ಥಿ')
      )
        occupation = 'Student';
      else if (
        lower.includes('work') ||
        lower.includes('labour') ||
        lower.includes('मज़दूर') ||
        lower.includes('श्रमिक') ||
        lower.includes('ಕಾರ್ಮಿಕ') ||
        lower.includes('ಕೂಲಿ')
      )
        occupation = 'Worker';
      else if (
        lower.includes('busin') ||
        lower.includes('shop') ||
        lower.includes('व्यापार') ||
        lower.includes('स्वरोजगार') ||
        lower.includes('ವ್ಯಾಪಾರ') ||
        lower.includes('ಸ್ವಯಂ')
      )
        occupation = 'Business Owner';
      else if (
        lower.includes('oth') ||
        lower.includes('अन्य') ||
        lower.includes('ಇತರೆ') ||
        lower.includes('ಬೇರೆ')
      )
        occupation = 'Other';
    }

    if (!occupation) {
      return [t.invalidOccupation];
    }

    this.pushHistory(state, 'ASK_OCCUPATION');
    state.answers.occupation = occupation;
    state.step = 'ASK_INCOME';
    await this.store.set(senderId, state);

    return [t.askIncome];
  }

  private async handleIncomeAnswer(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language;
    const t = TRANSLATIONS[lang];

    if (state.consent !== true) {
      return [t.consentDeclined];
    }

    const trimmed = input.trim();
    const num = parseInt(trimmed, 10);
    let income: IncomeBracket | null = null;

    if (!isNaN(num) && INCOME_MAP[num]) {
      income = INCOME_MAP[num];
    } else {
      const lower = trimmed.toLowerCase();
      if (
        lower.includes('bpl') ||
        lower.includes('below 1') ||
        lower.includes('1 lakh se kam') ||
        lower.includes('1ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ') ||
        lower.includes('kam')
      ) {
        income = 'Below ₹1 Lakh (BPL)';
      } else if (
        lower.includes('1 to 3') ||
        lower.includes('1-3') ||
        lower.includes('1 se 3') ||
        lower.includes('1 ರಿಂದ 3')
      ) {
        income = '₹1 Lakh - ₹3 Lakh';
      } else if (
        lower.includes('3 to 8') ||
        lower.includes('3-8') ||
        lower.includes('3 se 8') ||
        lower.includes('3 ರಿಂದ 8')
      ) {
        income = '₹3 Lakh - ₹8 Lakh';
      } else if (
        lower.includes('above 8') ||
        lower.includes('above') ||
        lower.includes('8 se jyada') ||
        lower.includes('8 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು') ||
        lower.includes('jyada')
      ) {
        income = 'Above ₹8 Lakh';
      }
    }

    if (!income) {
      return [t.invalidIncome];
    }

    this.pushHistory(state, 'ASK_INCOME');
    state.answers.annualIncome = income;
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
      if (
        lower.includes('agri') ||
        lower.includes('कृषि') ||
        lower.includes('ಕೃಷಿ') ||
        lower.includes('ಬೆಳೆ')
      )
        category = 'Agriculture';
      else if (
        lower.includes('edu') ||
        lower.includes('शिक्षा') ||
        lower.includes('ಶಿಕ್ಷಣ') ||
        lower.includes('ಶಾಲೆ')
      )
        category = 'Education';
      else if (
        lower.includes('emp') ||
        lower.includes('job') ||
        lower.includes('रोजगार') ||
        lower.includes('ಉದ್ಯೋಗ') ||
        lower.includes('ಕೆಲಸ')
      )
        category = 'Employment';
      else if (
        lower.includes('hous') ||
        lower.includes('आवास') ||
        lower.includes('ವಸತಿ') ||
        lower.includes('ಮನೆ')
      )
        category = 'Housing';
      else if (
        lower.includes('health') ||
        lower.includes('स्वास्थ्य') ||
        lower.includes('ಆರೋಗ್ಯ') ||
        lower.includes('ಚಿಕಿತ್ಸೆ')
      )
        category = 'Healthcare';
      else if (
        lower.includes('pen') ||
        lower.includes('पेंशन') ||
        lower.includes('ಪಿಂಚಣಿ')
      )
        category = 'Pension';
      else if (
        lower.includes('wom') ||
        lower.includes('महिला') ||
        lower.includes('ಮಹಿಳಾ') ||
        lower.includes('ಮಹಿಳೆ')
      )
        category = "Women's Welfare";
      else if (
        lower.includes('oth') ||
        lower.includes('अन्य') ||
        lower.includes('ಇತರೆ') ||
        lower.includes('ಸಾಮಾನ್ಯ')
      )
        category = 'Other';
    }

    if (!category) {
      return [t.invalidCategory];
    }

    this.pushHistory(state, 'ASK_CATEGORY');
    state.answers.category = category;
    state.step = 'RESULTS';
    await this.store.set(senderId, state);

    // Build complete user profile with all personal non-confidential details
    const profile: UserProfile = {
      name: state.answers.name,
      gender: state.answers.gender,
      annualIncome: state.answers.annualIncome,
      phoneNumber: senderId,
      state: state.answers.state || 'All India',
      age: state.answers.age || 30,
      occupation: state.answers.occupation || 'Other',
      category: category,
      language: state.language,
    };

    try {
      const schemes = await this.schemeService.getRelevantSchemes(profile);
      state.lastShownSchemes = schemes.map((s) => s.name);
      await this.store.set(senderId, state);

      // Record citizen enquiry into database for website portal / CRM
      let enquiryId: string | undefined;
      const citizenName = state.answers.name || 'Citizen';
      try {
        const enquiry = await this.enquiryService.recordEnquiry({
          senderId,
          phoneNumber: senderId.startsWith('+') ? senderId : `+${senderId}`,
          name: citizenName,
          gender: state.answers.gender || 'Other',
          annualIncome: state.answers.annualIncome || 'Below ₹1 Lakh (BPL)',
          state: state.answers.state || 'All India',
          age: state.answers.age || 30,
          occupation: state.answers.occupation || 'Other',
          category: category,
          language: state.language,
          matchedSchemesCount: schemes.length,
          matchedSchemeNames: schemes.map((s) => s.name),
        });
        enquiryId = enquiry.id;
      } catch (err) {
        console.error('[ConversationFlow] Error recording citizen enquiry:', err);
      }

      const results = this.formatSchemeResults(schemes, lang);
      if (enquiryId) {
        // Insert official confirmation badge right after the results header
        results.splice(1, 0, t.enquiryRecorded(enquiryId, citizenName));
      }
      return results;
    } catch (error) {
      // Return friendly service error without crashing
      return [t.serviceError];
    }
  }

  private appendChatHistory(state: ConversationState, userText: string, modelText: string): void {
    if (!state.chatHistory) state.chatHistory = [];
    state.chatHistory.push({ role: 'user', text: userText });
    state.chatHistory.push({ role: 'model', text: modelText });
    if (state.chatHistory.length > 10) {
      state.chatHistory = state.chatHistory.slice(-10);
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
      case 'ASK_NAME':
        return [t.backAcknowledgment('Name'), t.askName];
      case 'ASK_GENDER':
        return [t.backAcknowledgment('Gender'), t.askGender];
      case 'ASK_STATE':
        return [t.backAcknowledgment('State / UT'), t.askState];
      case 'ASK_AGE':
        return [t.backAcknowledgment('Age'), t.askAge];
      case 'ASK_OCCUPATION':
        return [t.backAcknowledgment('Occupation'), t.askOccupation];
      case 'ASK_INCOME':
        return [t.backAcknowledgment('Annual Income'), t.askIncome];
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

  // --- Feature 1: Rejection Recovery Assistant Handlers ---

  private isRejectionIntent(text: string): boolean {
    if (!text || text.length < 3) return false;
    const lower = text.toLowerCase().trim();

    // Explicit command triggers
    if (
      lower === 'my application was rejected' ||
      lower === 'application rejected' ||
      lower === 'application rejected?' ||
      lower === 'rejection recovery assistant' ||
      lower === 'rejection assistant' ||
      lower === 'मेरा आवेदन खारिज हो गया' ||
      lower === 'आवेदन खारिज' ||
      lower === 'अस्वीकार' ||
      lower === 'ತಿರಸ್ಕೃತ' ||
      lower === 'ನನ್ನ ಅರ್ಜಿ ತಿರಸ್ಕೃತಗೊಂಡಿದೆ' ||
      lower === 'ತಿರಸ್ಕಾರ'
    ) {
      return true;
    }

    // Notice patterns: must have a rejection root word
    const rejectionWords = [
      'reject',
      'rejected',
      'rejection',
      'khariz',
      'kharij',
      'खारिज',
      'अस्वीकार',
      'रद्द',
      'ತಿರಸ್ಕೃತ',
      'ತಿರಸ್ಕಾರ',
    ];
    const hasRejectionWord = rejectionWords.some((w) => lower.includes(w));
    if (!hasRejectionWord) return false;

    // And must have scheme / administrative context or be a full message
    const contextWords = [
      'application',
      'form',
      'pm-kisan',
      'kisan',
      'pmfby',
      'pmay',
      'ration',
      'scholarship',
      'registration',
      'portal',
      'status',
      'pfms',
      'dbt',
      'aadhaar',
      'due to',
      'because',
      'reason',
      'notice',
      'sms',
      'beneficiary',
      'dear applicant',
      'अर्जी',
      'आवेदन',
      'ಖಾತೆ',
      'ಅರ್ಜಿ',
    ];
    return contextWords.some((c) => lower.includes(c)) || lower.length >= 25;
  }

  private async handleRejectionIntent(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language || 'en';
    const clean = input.trim();
    const lower = clean.toLowerCase();

    const isEntryPromptOnly =
      lower === 'my application was rejected' ||
      lower === 'application rejected' ||
      lower === 'application rejected?' ||
      lower === 'mera aavedan kharij' ||
      lower === 'मेरा आवेदन खारिज हो गया' ||
      lower === 'ನನ್ನ ಅರ್ಜಿ ತಿರಸ್ಕೃತಗೊಂಡಿದೆ' ||
      lower === 'rejection recovery assistant' ||
      (clean.length < 25 && !lower.includes('due to') && !lower.includes('reason'));

    state.step = 'REJECTION_RECOVERY';

    if (isEntryPromptOnly) {
      await this.store.set(senderId, state);
      return [
        lang === 'kn'
          ? `📋 *ಸ್ಕೀಮ್ ಸಾಥಿ — ತಿರಸ್ಕಾರ ಪರಿಹಾರ ಸಹಾಯಕ (Rejection Recovery Assistant)*\n\nನಿಮ್ಮ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಅರ್ಜಿ ಏಕೆ ತಿರಸ್ಕೃತಗೊಂಡಿದೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಸರಿಪಡಿಸುವ ಅಧಿಕೃತ ಕ್ರಮಗಳನ್ನು ತಿಳಿಯಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.\n\n👉 *ದಯವಿಟ್ಟು ನಿಮಗೆ ಬಂದ SMS / ತಿರಸ್ಕಾರ ಸೂಚನೆಯನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ ಅಥವಾ ನಿಮ್ಮದೇ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ* (ಯೋಜನೆಯ ಹೆಸರು ಮತ್ತು ರಾಜ್ಯ ತಿಳಿದಿದ್ದರೆ ತಿಳಿಸಿ).\n\n🔒 _ಗೌಪ್ಯತೆ ಸೂಚನೆ: ಆಧಾರ್ ಸಂಖ್ಯೆ, ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆ ಅಥವಾ OTP ಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ._`
          : lang === 'hi'
          ? `📋 *स्कीम साथी — अस्वीकृति समाधान सहायक (Rejection Recovery Assistant)*\n\nमैं आपकी सरकारी योजना का आवेदन खारिज होने का कारण समझने, आधिकारिक शब्दावली को सरल बनाने और सही कदम उठाने में आपकी मदद करूँगा।\n\n👉 *कृपया आपको प्राप्त एसएमएस / अस्वीकृति संदेश यहाँ पेस्ट करें या अपने शब्दों में कारण लिखें* (यदि पता हो तो योजना का नाम और राज्य भी बताएं)।\n\n🔒 _गोपनीयता सूचना: कभी भी अपना आधार नंबर, बैंक खाता विवरण, पासवर्ड या ओटीपी साझा न करें।_`
          : `📋 *Scheme Saathi — Rejection Recovery Assistant*\n\nI can help you understand why your government scheme application was rejected, decode official terminology into simple language, and guide you through verified next steps.\n\n👉 *Please paste the rejection SMS / portal notice here, or describe the reason in your own words* (optionally mention the scheme name and state if known).\n\n🔒 _Privacy Safety: Never share sensitive numbers like Aadhaar, bank account numbers, passwords, or OTPs._`,
      ];
    }

    // Concrete rejection message provided
    state.rejectionContext = {
      lastNoticeText: clean,
    };
    await this.store.set(senderId, state);

    const result = await this.rejectionService.analyzeNotice({
      rawText: clean,
      language: lang,
      state: state.answers?.state,
    });

    const tips =
      lang === 'kn'
        ? `\n💡 _(ಆಯ್ಕೆಗಳು: ಸರಳ ವಿವರಣೆಗಾಗಿ *SIMPLIFY*, ಹಿಂದಿಯಲ್ಲಿ ನೋಡಲು *HINDI*, ಅಥವಾ ಹೊಸ ಹುಡುಕಾಟಕ್ಕಾಗಿ *RESTART* ಎಂದು ಟೈಪ್ ಮಾಡಿ)_`
        : lang === 'hi'
        ? `\n💡 _(विकल्प: और सरल भाषा के लिए *SIMPLIFY*, कन्नड़ के लिए *KANNADA*, या नई खोज के लिए *RESTART* लिखें)_`
        : `\n💡 _(Options: Reply *SIMPLIFY* to explain more simply, *HINDI* for Hindi, *KANNADA* for Kannada, or *RESTART* to explore schemes)_`;

    return [result.formattedMessage + '\n' + tips];
  }

  private async handleRejectionState(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    // Language toggle commands
    if (lower === 'hindi' || lower === 'हिंदी' || lower === 'explain in hindi' || lower === 'हिंदी में बताएं') {
      state.language = 'hi';
      const textToAnalyze = state.rejectionContext?.lastNoticeText || 'Application rejected';
      const res = await this.rejectionService.analyzeNotice({ rawText: textToAnalyze, language: 'hi' });
      await this.store.set(senderId, state);
      return [res.formattedMessage];
    }

    if (lower === 'kannada' || lower === 'ಕನ್ನಡ' || lower === 'explain in kannada' || lower === 'ಕನ್ನಡದಲ್ಲಿ ತಿಳಿಸಿ') {
      state.language = 'kn';
      const textToAnalyze = state.rejectionContext?.lastNoticeText || 'Application rejected';
      const res = await this.rejectionService.analyzeNotice({ rawText: textToAnalyze, language: 'kn' });
      await this.store.set(senderId, state);
      return [res.formattedMessage];
    }

    if (lower === 'english' || lower === 'explain in english') {
      state.language = 'en';
      const textToAnalyze = state.rejectionContext?.lastNoticeText || 'Application rejected';
      const res = await this.rejectionService.analyzeNotice({ rawText: textToAnalyze, language: 'en' });
      await this.store.set(senderId, state);
      return [res.formattedMessage];
    }

    if (lower === 'simplify' || lower === 'explain more simply' || lower === 'सरल' || lower === 'simple' || lower === 'ಸರಳ') {
      const textToAnalyze = state.rejectionContext?.lastNoticeText || trimmed;
      const res = await this.rejectionService.analyzeNotice({ rawText: textToAnalyze, language: state.language });
      const simplified =
        `🔍 *Simplified Citizen Action Plan:*\n\n` +
        `1. *What happened:* ${res.meaning}\n` +
        `2. *What to fix:* ${res.correctionsNeeded.join(', ') || 'Check name & IFSC in bank passbook against portal records'}\n` +
        `3. *Where to go:* Visit ${res.officialPortalUrl || 'https://pgportal.gov.in'} or call helpline ${res.verifiedHelpline || '1800-115-526'}.\n\n` +
        `⚠️ *Important:* No government employee will ever ask for money or OTPs to approve your application. Resubmit only through official government counters or portals.`;
      return [simplified];
    }

    // User provided state name or clarifying details
    const matchedState = matchIndianState(trimmed);
    const priorText = state.rejectionContext?.lastNoticeText || '';
    const combinedText = priorText ? `${priorText}. User State/Note: ${trimmed}` : trimmed;

    state.rejectionContext = {
      lastNoticeText: combinedText,
      detectedState: matchedState || state.rejectionContext?.detectedState,
    };
    await this.store.set(senderId, state);

    const res = await this.rejectionService.analyzeNotice({
      rawText: combinedText,
      state: matchedState || state.answers?.state,
      language: state.language,
    });

    return [res.formattedMessage];
  }

  // --- Feature 2: Life-Event Benefit Discovery Handlers ---

  private isLifeEventIntent(text: string): boolean {
    if (!text || text.length < 3) return false;
    const lower = text.toLowerCase().trim();

    // Explicit command triggers
    if (
      lower === 'find schemes for my situation' ||
      lower === 'life-event benefit discovery' ||
      lower === 'life event' ||
      lower === 'life-event' ||
      lower === 'मेरी स्थिति' ||
      lower === 'ನನ್ನ ಪರಿಸ್ಥಿತಿ'
    ) {
      return true;
    }

    // Natural language situation triggers
    const lifeEventTriggers = [
      'fasal',
      'crop',
      'kharab',
      'baarish',
      'damage',
      'loss',
      'flood',
      'barish',
      'सूखा',
      'बाढ़',
      'ಬೆಳೆ ಹಾನಿ',
      'ಬೆಳೆ ನಾಶ',
      'ಅತಿವೃಷ್ಟಿ',
      'small business',
      'start a business',
      'chhota business',
      'chhota vyapar',
      'dukan',
      'udyam',
      'entrepreneur',
      'ವ್ಯಾಪಾರ ಆರಂಭ',
      'ಹೊಸ ಉದ್ಯಮ',
      'daughter',
      'college',
      'scholarship',
      'higher studies',
      'university',
      'padhai',
      'ವಿದ್ಯಾರ್ಥಿವೇತನ',
      'ಕಾಲೇಜು',
      'pension',
      'elderly',
      'budhapa',
      'vriddha',
      'father is old',
      'mother is old',
      'ವೃದ್ಧಾಪ್ಯ ವೇತನ',
      'ಪಿಂಚಣಿ',
      'lost my job',
      'lost job',
      'berozgar',
      'unemployed',
      'naukri chali',
      'ಉದ್ಯೋಗ ನಷ್ಟ',
      'ಕೆಲಸ ಕಳೆದುಕೊಂಡೆ',
      'farm equipment',
      'small farm',
      'tractor',
      'kheti upkaran',
      'ಕೃಷಿ ಉಪಕರಣ',
      'help with housing',
      'makan banana',
      'ghar banana',
      'healthcare',
      'hospital',
      'ilaj',
      'bimar',
      'ಗೃಹ ನಿರ್ಮಾಣ',
      'ಆಸ್ಪತ್ರೆ ಖರ್ಚು',
    ];

    return lifeEventTriggers.some((t) => lower.includes(t));
  }

  private async handleLifeEventIntent(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const lang = state.language || 'en';
    const clean = input.trim();
    const lower = clean.toLowerCase();

    const isEntryPromptOnly =
      lower === 'find schemes for my situation' ||
      lower === 'life-event benefit discovery' ||
      lower === 'life event' ||
      lower === 'situation' ||
      lower === 'मेरी स्थिति के लिए योजनाएं';

    state.step = 'LIFE_EVENT_DISCOVERY';

    if (isEntryPromptOnly) {
      await this.store.set(senderId, state);
      return [
        lang === 'kn'
          ? `🌱 *ಸ್ಕೀಮ್ ಸಾಥಿ — ಜೀವನ ಘಟನೆಯ ಯೋಜನೆ ಅನ್ವೇಷಣೆ (Life-Event Benefit Discovery)*\n\nಯೋಜನೆಯ ಹೆಸರು ತಿಳಿದಿಲ್ಲದಿದ್ದರೂ ಪರವಾಗಿಲ್ಲ! ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿ ಅಥವಾ ಅಗತ್ಯವನ್ನು ನಿಮ್ಮ ಸಾಮಾನ್ಯ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ.\n\nಉದಾಹರಣೆಗೆ:\n• "ಮಳೆಯಿಂದ ನನ್ನ ಬೆಳೆ ಹಾಳಾಗಿದೆ"\n• "ನಾನು ಸಣ್ಣ ವ್ಯಾಪಾರ ಆರಂಭಿಸಲು ಬಯಸುತ್ತೇನೆ"\n• "ನನ್ನ ಮಗಳು ಕಾಲೇಜಿಗೆ ಹೋಗುತ್ತಿದ್ದಾಳೆ, ಧನಸಹಾಯ ಬೇಕು"\n• "ನನ್ನ ವೃದ್ಧ ತಂದೆಗೆ ಪಿಂಚಣಿ ಬೇಕಾಗಿದೆ"`
          : lang === 'hi'
          ? `🌱 *स्कीम साथी — जीवन स्थिति लाभ खोज (Life-Event Benefit Discovery)*\n\nयदि आपको किसी सरकारी योजना का नाम नहीं पता है, तब भी कोई बात नहीं! अपनी वास्तविक स्थिति या आवश्यकता को अपनी आम बोलचाल में बताएं।\n\nउदाहरण:\n• "मेरी फसल बारिश की वजह से खराब हो गई है"\n• "मैं अपना छोटा बिजनेस शुरू करना चाहता हूँ"\n• "मेरी बेटी कॉलेज जा रही है और मुझे आर्थिक सहायता चाहिए"\n• "मेरे वृद्ध पिता को पेंशन सहायता की आवश्यकता है"`
          : `🌱 *Scheme Saathi — Life-Event Benefit Discovery*\n\nEven if you do not know any scheme name, simply describe your real-life situation or need in ordinary language!\n\nExamples:\n• "Meri fasal baarish ki wajah se kharab ho gayi hai." (Crop loss)\n• "I want to start a small business but I have very little money."\n• "My daughter is going to college and I need financial assistance."\n• "My father is elderly and needs pension support."\n• "I lost my job and need help finding government benefits."`,
      ];
    }

    state.lifeEventContext = {
      lastSituation: clean,
    };
    await this.store.set(senderId, state);

    const result = await this.lifeEventService.discoverBenefits({
      userSituation: clean,
      state: state.answers?.state,
      occupation: state.answers?.occupation,
      language: lang,
    });

    const tips =
      lang === 'kn'
        ? `\n💡 _(ಸುಳಿವು: ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ಟೈಪ್ ಮಾಡಿ (ಉದಾ: Karnataka), ವಿವರಣೆಗಾಗಿ *HINDI* ಅಥವಾ ಸಂಪೂರ್ಣ ಪರಿಶೀಲನೆಗಾಗಿ *ELIGIBILITY* ಎಂದು ಉತ್ತರಿಸಿ)_`
        : lang === 'hi'
        ? `\n💡 _(सुझाव: अपने राज्य का नाम लिखें (जैसे Uttar Pradesh, Bihar), कन्नड़ के लिए *KANNADA*, या विस्तृत फॉर्म के लिए *ELIGIBILITY* लिखें)_`
        : `\n💡 _(Tip: Reply with your *State* (e.g., Uttar Pradesh, Karnataka) for localized state schemes, or type *ELIGIBILITY* to start the 7-step wizard)_`;

    return [result.formattedMessage + '\n' + tips];
  }

  private async handleLifeEventState(
    senderId: string,
    state: ConversationState,
    input: string
  ): Promise<string[]> {
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    // Check language toggles
    if (lower === 'hindi' || lower === 'हिंदी' || lower === 'explain in hindi') {
      state.language = 'hi';
      const situation = state.lifeEventContext?.lastSituation || 'Crop loss or business assistance';
      const res = await this.lifeEventService.discoverBenefits({
        userSituation: situation,
        state: state.answers?.state,
        language: 'hi',
      });
      await this.store.set(senderId, state);
      return [res.formattedMessage];
    }

    if (lower === 'kannada' || lower === 'ಕನ್ನಡ' || lower === 'explain in kannada') {
      state.language = 'kn';
      const situation = state.lifeEventContext?.lastSituation || 'Crop loss or business assistance';
      const res = await this.lifeEventService.discoverBenefits({
        userSituation: situation,
        state: state.answers?.state,
        language: 'kn',
      });
      await this.store.set(senderId, state);
      return [res.formattedMessage];
    }

    if (lower === 'english' || lower === 'explain in english') {
      state.language = 'en';
      const situation = state.lifeEventContext?.lastSituation || 'Crop loss or business assistance';
      const res = await this.lifeEventService.discoverBenefits({
        userSituation: situation,
        state: state.answers?.state,
        language: 'en',
      });
      await this.store.set(senderId, state);
      return [res.formattedMessage];
    }

    // Check if user wants to transition to the 7-question eligibility wizard
    if (
      lower === 'eligibility' ||
      lower === 'check eligibility' ||
      lower === 'check my eligibility' ||
      lower === 'पात्रता' ||
      lower === 'ಅರ್ಹತೆ'
    ) {
      state.step = 'CONSENT';
      await this.store.set(senderId, state);
      return [TRANSLATIONS[state.language || 'en'].consentPrompt];
    }

    // Check if user replied with their state to refine results
    const matchedState = matchIndianState(trimmed);
    const priorSituation = state.lifeEventContext?.lastSituation || trimmed;

    state.lifeEventContext = {
      lastSituation: priorSituation,
      missingParameter: undefined,
    };
    if (matchedState) {
      state.answers.state = matchedState;
    }
    await this.store.set(senderId, state);

    const res = await this.lifeEventService.discoverBenefits({
      userSituation: priorSituation,
      state: matchedState || state.answers?.state,
      occupation: state.answers?.occupation,
      language: state.language || 'en',
    });

    return [res.formattedMessage];
  }
}

