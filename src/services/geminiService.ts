import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';
import { SCHEMES_DATABASE } from '../data/schemesDatabase';
import { GenderType, IncomeBracket, Scheme, UserProfile } from '../types/scheme';
import { matchIndianState } from '../chatbot/translations';
import { defaultRejectionRecoveryService } from './rejectionRecoveryService';
import { defaultLifeEventService } from './lifeEventService';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ConversationContext {
  language?: 'en' | 'hi' | 'kn';
  name?: string;
  gender?: GenderType;
  annualIncome?: IncomeBracket;
  state?: string;
  occupation?: string;
  age?: number;
  lastShownSchemes?: string[];
  history?: ChatMessage[];
}

export class GeminiService {
  private client: GoogleGenAI | null = null;
  private modelName: string;
  private apiKey: string;
  private candidateModels: string[];

  constructor(apiKey?: string, modelName?: string) {
    this.apiKey = apiKey || '';
    this.modelName = modelName || '';
    this.candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
    ];
  }

  getApiKey(): string {
    return process.env.GEMINI_API_KEY || this.apiKey || '';
  }

  getModelName(): string {
    return process.env.GEMINI_MODEL || this.modelName || 'gemini-3.5-flash-lite';
  }

  isConfigured(): boolean {
    const key = this.getApiKey();
    return (
      Boolean(key) &&
      key !== 'your_gemini_api_key_here' &&
      key !== 'dummy_key' &&
      key.length > 10
    );
  }

  private getClient(): GoogleGenAI | null {
    if (!this.isConfigured()) return null;
    const currentKey = this.getApiKey();
    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: currentKey });
    }
    return this.client;
  }

  /**
   * Builds the system grounding prompt with curated knowledge of verified schemes,
   * injecting focused scheme details if a user is asking for more depth.
   */
  private buildSystemPrompt(context?: ConversationContext): string {
    // Generate a compact catalogue summary for context grounding
    const catalogueSummary = SCHEMES_DATABASE.map(
      (s, idx) =>
        `${idx + 1}. [${s.id}] ${s.name} (${s.category}, State: ${s.state})
• Benefits: ${s.benefits}
• Eligibility: ${s.eligibilitySummary}
• Target: ${s.targetOccupations?.join(', ') || 'All'}
• Documents: ${s.requiredDocuments.join(', ')}
• Application: ${s.applicationSteps.join(' -> ')}
• Official Portal: ${s.officialUrl}`
    ).join('\n\n');

    let focusedSchemesSection = '';
    if (context?.lastShownSchemes && context.lastShownSchemes.length > 0) {
      const focused = SCHEMES_DATABASE.filter((s) =>
        context.lastShownSchemes!.some(
          (name) =>
            s.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(s.name.toLowerCase()) ||
            s.id.toLowerCase().includes(name.toLowerCase())
        )
      );

      if (focused.length > 0) {
        focusedSchemesSection = `\n\nRECENTLY DISCUSSED SCHEMES IN THIS SESSION:\n` +
          focused
            .map(
              (f) => `### SCHEME: ${f.name}
- Coverage/State: ${f.state}
- Full Description: ${f.description}
- Detailed Benefits: ${f.benefits}
- Complete Eligibility Criteria: ${f.eligibilitySummary}
- All Required Documents:
  * ${f.requiredDocuments.join('\n  * ')}
- Step-by-Step How to Apply:
  1. ${f.applicationSteps.join('\n  2. ')}
- Official Website: ${f.officialUrl}
- Last Verified Date: ${f.lastVerifiedAt}`
            )
            .join('\n\n');
      }
    }

    return `You are "Scheme Saathi" (ಸ್ಕೀಮ್ ಸಾಥಿ / स्कीम साथी) 🇮🇳, an empathetic, highly knowledgeable AI government welfare advisor for Indian citizens, especially farmers, rural families, workers, women, youth, and elderly citizens.

YOUR MISSION:
Help citizens discover legitimate government schemes, understand eligibility criteria in depth, check required documents, and guide them step-by-step through application procedures.

CRITICAL INSTRUCTIONS FOR DETAILED/DEEP INFORMATION:
- When a citizen asks for "more information", "deeper details", "how to apply", "eligibility", "documents", or asks about a specific scheme from recent recommendations:
  DO NOT repeat a brief summary list!
  Instead, provide a comprehensive, deep-dive breakdown on that specific scheme with:
  1. 📋 *Detailed Eligibility Checklist & Exclusions* (who qualifies and who does not qualify)
  2. 💰 *Exact Benefits & Financial Support* (installment amounts, subsidies, interest rates)
  3. 📄 *Complete Document Checklist* (what documents to bring or upload)
  4. 🚀 *Step-by-Step Application Procedure* (online portal steps and offline routes like CSC / Gram Panchayat / Block Office)
  5. ⚠️ *Important Tips & Common Pitfalls* (e.g. e-KYC, Aadhaar-bank account seeding, land record verification)
  6. 🔗 *Official Portal Link & Helpline Phone Numbers*

LANGUAGE AND TONE:
- Always respond in the SAME language and script used by the citizen.
  * If the citizen writes in Kannada (ಕನ್ನಡ), reply in natural, fluent, respectful Kannada using Kannada script (ಕನ್ನಡ ಲಿಪಿ). Translate or explain technical terms clearly.
  * If they write in Kannada using English script (Kanglish, e.g. "raitarige yavudella schemes ide"), reply in friendly Kannada or Kanglish.
  * If the citizen writes in Hindi (हिंदी), reply in clear, respectful Hindi (Devanagari script).
  * If they write in Hinglish (e.g. "is scheme ke baare me aur detail do"), reply in friendly, conversational Hinglish.
  * If they write in English, reply in English.

GROUNDING & SAFETY:
- Ground all facts, numbers, and links strictly on the verified catalogue provided below. Never invent fake schemes or false promises of government approval.
- NEVER ask for Aadhaar numbers, bank account numbers, passwords, OTPs, or document uploads.
- Remind citizens that Scheme Saathi recommendations are guidance suggestions and they must verify official rules on the respective government portal before applying.

WHATSAPP FORMATTING:
- Use bold for headings: *Scheme Name*
- Use emojis tastefully (🏛️, 💰, 👥, 📄, 🚀, 🔗).
- Keep formatting clean and well-spaced with bullet points.
${focusedSchemesSection}

FULL VERIFIED GOVERNMENT SCHEMES CATALOGUE:
${catalogueSummary}`;
  }

  /**
   * Generates a conversational AI answer to a citizen's query.
   * Leverages Gemini with multiple candidate model fallbacks and contextual history.
   */
  async answerSchemeQuery(
    userQuery: string,
    context?: ConversationContext
  ): Promise<string> {
    const client = this.getClient();
    if (!client) {
      return this.localSearchFallback(userQuery, context);
    }

    const systemInstruction = this.buildSystemPrompt(context);

    // Build context-rich prompt
    let conversationThread = '';
    if (context?.history && context.history.length > 0) {
      const recent = context.history.slice(-6);
      conversationThread =
        'RECENT CONVERSATION HISTORY:\n' +
        recent.map((m) => `${m.role === 'user' ? 'Citizen' : 'Scheme Saathi'}: ${m.text}`).join('\n') +
        '\n\n';
    }

    let profileContext = '';
    if (context?.name) profileContext += `[Citizen Name: ${context.name}] `;
    if (context?.gender) profileContext += `[Gender: ${context.gender}] `;
    if (context?.annualIncome) profileContext += `[Annual Household Income: ${context.annualIncome}] `;
    if (context?.state) profileContext += `[State: ${context.state}] `;
    if (context?.occupation) profileContext += `[Occupation: ${context.occupation}] `;
    if (context?.age) profileContext += `[Age: ${context.age}] `;

    const finalPrompt = `${conversationThread}${profileContext}\nCitizen Query: "${userQuery}"`;

    // Try candidate models in order of speed and capability
    for (const model of this.candidateModels) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: finalPrompt,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        const replyText = response.text?.trim();
        if (replyText) {
          return replyText;
        }
      } catch (error: any) {
        console.warn(`[GeminiService] Model ${model} failed:`, error.message || error);
        // Continue to next candidate model
      }
    }

    // Fallback if all Gemini models failed
    return this.localSearchFallback(userQuery, context);
  }

  /**
   * Intelligently extracts user profile parameters (name, gender, income, state, age, occupation, category) from natural language.
   */
  async extractProfileFromQuery(text: string): Promise<Partial<UserProfile> & { isQuestion?: boolean }> {
    const lower = text.toLowerCase();
    const result: Partial<UserProfile> & { isQuestion?: boolean } = {};

    // Check if it looks like a question, detailed inquiry, or request for more information
    const inquiryWords = [
      'kya', 'kaise', 'what', 'how', 'which', 'scheme', 'yojana', 'batao',
      'subsidy', 'loan', 'pension', 'bima', 'documents', 'eligibility',
      'apply', 'detail', 'details', 'information', 'more', 'aur', 'jaankari',
      'process', 'steps', 'portal', 'website', 'second', 'first', 'third',
      'this', 'that', 'kcc', 'kisan', 'kusum', 'pmay', 'ayushman',
      'ಯಾವ', 'ಹೇಗೆ', 'ಯೋಜನೆ', 'ತಿಳಿಸಿ', 'ಅರ್ಜಿ', 'ದಾಖಲೆ', 'ಅರ್ಹತೆ', 'ಸಹಾಯಧನ', 'ಸಾಲ', 'ಮಾಹಿತಿ', 'ವಿವರ',
    ];
    result.isQuestion = inquiryWords.some((w) => lower.includes(w)) || text.includes('?') || text.length > 20;

    // 0a. Detect Name
    const namePattern = /(?:my name is|mera naam|nanna hesaru|i am|naam)\s+([A-Za-z\u0900-\u097F\u0C80-\u0CFF]{2,30})/i;
    const nameMatch = text.match(namePattern);
    if (nameMatch && nameMatch[1]) {
      const candidate = nameMatch[1].trim();
      const forbidden = ['kisan', 'farmer', 'student', 'worker', 'bpl', 'help', 'kannada', 'hindi', 'english'];
      if (!forbidden.includes(candidate.toLowerCase())) {
        result.name = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }

    // 0b. Detect Gender
    if (
      lower.includes('female') ||
      lower.includes('woman') ||
      lower.includes('mahila') ||
      lower.includes('aurat') ||
      lower.includes('ladki') ||
      lower.includes('ಮಹಿಳೆ') ||
      lower.includes('ಹೆಣ್ಣು') ||
      lower.includes('ಸ್ತ್ರೀ')
    ) {
      result.gender = 'Female';
    } else if (
      lower.includes('male') ||
      lower.includes('man') ||
      lower.includes('purush') ||
      lower.includes('aadmi') ||
      lower.includes('ladka') ||
      lower.includes('ಪುರುಷ') ||
      lower.includes('ಗಂಡು')
    ) {
      result.gender = 'Male';
    }

    // 0c. Detect Income Bracket
    if (
      lower.includes('bpl') ||
      lower.includes('below 1 lakh') ||
      lower.includes('1 lakh se kam') ||
      lower.includes('garib') ||
      lower.includes('1 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ')
    ) {
      result.annualIncome = 'Below ₹1 Lakh (BPL)';
    } else if (lower.includes('1 to 3') || lower.includes('1-3') || lower.includes('1 se 3')) {
      result.annualIncome = '₹1 Lakh - ₹3 Lakh';
    } else if (lower.includes('3 to 8') || lower.includes('3-8') || lower.includes('3 se 8')) {
      result.annualIncome = '₹3 Lakh - ₹8 Lakh';
    } else if (lower.includes('above 8') || lower.includes('8 lakh se jyada') || lower.includes('8 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು')) {
      result.annualIncome = 'Above ₹8 Lakh';
    }

    // 1. Detect State
    const matchedState = matchIndianState(text);
    if (matchedState) {
      result.state = matchedState;
    }

    // 2. Detect Age
    const ageMatch = text.match(/\b(1[8-9]|[2-8][0-9]|90)\b/);
    if (ageMatch && (lower.includes('age') || lower.includes('saal') || lower.includes('year') || lower.includes('umar') || lower.includes('ವರ್ಷ') || lower.includes('ವಯಸ್ಸು'))) {
      result.age = parseInt(ageMatch[0], 10);
    }

    // 3. Detect Occupation
    if (
      lower.includes('kisan') ||
      lower.includes('farmer') ||
      lower.includes('kheti') ||
      lower.includes('krishi') ||
      lower.includes('ರೈತ') ||
      lower.includes('ಕೃಷಿಕ')
    ) {
      result.occupation = 'Farmer';
    } else if (
      lower.includes('student') ||
      lower.includes('vidyarthi') ||
      lower.includes('chhatra') ||
      lower.includes('padhai') ||
      lower.includes('ವಿದ್ಯಾರ್ಥಿ')
    ) {
      result.occupation = 'Student';
    } else if (
      lower.includes('mazdoor') ||
      lower.includes('worker') ||
      lower.includes('shramik') ||
      lower.includes('labour') ||
      lower.includes('ಕಾರ್ಮಿಕ') ||
      lower.includes('ಕೂಲಿ')
    ) {
      result.occupation = 'Worker';
    } else if (
      lower.includes('vyapari') ||
      lower.includes('business') ||
      lower.includes('dukan') ||
      lower.includes('entrepreneur') ||
      lower.includes('ವ್ಯಾಪಾರ') ||
      lower.includes('ಸ್ವಯಂ')
    ) {
      result.occupation = 'Business Owner';
    }

    // 4. Detect Category
    if (
      lower.includes('kisan') ||
      lower.includes('fasal') ||
      lower.includes('crop') ||
      lower.includes('tractor') ||
      lower.includes('pump') ||
      lower.includes('agri') ||
      lower.includes('ಕೃಷಿ') ||
      lower.includes('ಬೆಳೆ') ||
      lower.includes('ರೈತ')
    ) {
      result.category = 'Agriculture';
    } else if (
      lower.includes('scholarship') ||
      lower.includes('padhai') ||
      lower.includes('school') ||
      lower.includes('college') ||
      lower.includes('education') ||
      lower.includes('ಶಿಕ್ಷಣ') ||
      lower.includes('ಶಾಲೆ') ||
      lower.includes('ವಿದ್ಯಾರ್ಥಿ')
    ) {
      result.category = 'Education';
    } else if (
      lower.includes('job') ||
      lower.includes('naukri') ||
      lower.includes('rozgar') ||
      lower.includes('skill') ||
      lower.includes('training') ||
      lower.includes('ಉದ್ಯೋಗ') ||
      lower.includes('ಕೆಲಸ')
    ) {
      result.category = 'Employment';
    } else if (
      lower.includes('ghar') ||
      lower.includes('makan') ||
      lower.includes('awas') ||
      lower.includes('housing') ||
      lower.includes('ವಸತಿ') ||
      lower.includes('ಮನೆ')
    ) {
      result.category = 'Housing';
    } else if (
      lower.includes('health') ||
      lower.includes('ilaj') ||
      lower.includes('hospital') ||
      lower.includes('dawa') ||
      lower.includes('ayushman') ||
      lower.includes('ಆರೋಗ್ಯ') ||
      lower.includes('ಚಿಕಿತ್ಸೆ')
    ) {
      result.category = 'Healthcare';
    } else if (
      lower.includes('pension') ||
      lower.includes('vriddha') ||
      lower.includes('retirement') ||
      lower.includes('ಪಿಂಚಣಿ')
    ) {
      result.category = 'Pension';
    } else if (
      lower.includes('mahila') ||
      lower.includes('women') ||
      lower.includes('beti') ||
      lower.includes('matru') ||
      lower.includes('ಮಹಿಳಾ') ||
      lower.includes('ಮಹಿಳೆ')
    ) {
      result.category = "Women's Welfare";
    }

    return result;
  }

  /**
   * Resilient local keyword-based fallback when Gemini API key is absent or unreachable.
   */
  private localSearchFallback(userQuery: string, context?: ConversationContext): string {
    let q = userQuery.toLowerCase();
    const isKannada = context?.language === 'kn' || /[\u0C80-\u0CFF]/.test(userQuery);
    const isHindi = !isKannada && (context?.language === 'hi' || /[\u0900-\u097F]/.test(userQuery));

    // Common Kannada word mappings to boost keyword matching
    const kannadaSynonyms: Record<string, string> = {
      ರೈತ: 'kisan farmer agriculture',
      ಕೃಷಿ: 'agriculture kisan farming',
      ಬೆಳೆ: 'crop harvest fasal pmfby',
      ವಿಮೆ: 'bima insurance pmfby',
      ಸಾಲ: 'loan credit kcc mudra',
      ಪಂಪ್: 'pump solar kusum irrigation',
      ಸೋಲಾರ್: 'solar kusum',
      ಟ್ರಾಕ್ಟರ್: 'tractor machinery smam',
      ಯೋಜನೆ: 'yojana scheme',
      ವಸತಿ: 'housing awas pmay',
      ಮನೆ: 'house housing awas pmay',
      ಪಿಂಚಣಿ: 'pension kmy nps',
      ಆರೋಗ್ಯ: 'health arogya ayushman hospital',
      ಔಷಧ: 'medicine janaushadhi',
      ವಿದ್ಯಾರ್ಥಿ: 'student scholarship nsp',
      ಶಿಕ್ಷಣ: 'education student school scholarship',
      ಉದ್ಯೋಗ: 'employment job mgnrega rozgar',
      ಮಹಿಳಾ: 'women matru mahila',
      ಕಾರ್ಮಿಕ: 'worker labour shramik',
      ಹೈನುಗಾರಿಕೆ: 'dairy gokul animal livestock',
      ಮೀನುಗಾರಿಕೆ: 'fisheries matsya fish',
      ಸಹಾಯಧನ: 'subsidy grant financial',
    };

    if (isKannada) {
      for (const [kanWord, engWords] of Object.entries(kannadaSynonyms)) {
        if (userQuery.includes(kanWord)) {
          q += ' ' + engWords;
        }
      }
    }

    // Common Hindi Devanagari word mappings to boost keyword matching
    const hindiSynonyms: Record<string, string> = {
      किसान: 'kisan farmer agriculture',
      क्रेडिट: 'credit kcc',
      कार्ड: 'card kcc',
      योजना: 'yojana scheme',
      आवास: 'awas housing pmay',
      पेंशन: 'pension apu kmy',
      बीमा: 'bima insurance pmfby',
      फसल: 'crop harvest fasal pmfby',
      सोलर: 'solar kusum',
      पंप: 'pump kusum irrigation',
      सिंचाई: 'sinchayee irrigation pmksy',
      खाद: 'fertilizer manure',
      ट्रैक्टर: 'tractor machinery smam',
      स्वास्थ्य: 'health arogya hospital ayushman',
      दवा: 'medicine janaushadhi',
      आयुष्मान: 'ayushman bharat pmjay',
      महिला: 'women matru mahila',
      बेटी: 'girl child sukanya',
      छात्रवृत्ति: 'scholarship student nsp',
      रोजगार: 'employment job mgnrega rozgar',
      ऋण: 'loan credit mudra',
      मजदूर: 'worker labour shramik',
      राशन: 'ration foodgrain nfs',
      मछली: 'fisheries matsya fish',
      पशु: 'livestock gokul dairy animal',
      डेयरी: 'dairy gokul milk',
    };

    for (const [hindiWord, engWords] of Object.entries(hindiSynonyms)) {
      if (userQuery.includes(hindiWord)) {
        q += ' ' + engWords;
      }
    }

    // Check if user is asking for more details about a specific scheme
    const isDetailRequest =
      q.includes('detail') ||
      q.includes('more') ||
      q.includes('aur') ||
      q.includes('document') ||
      q.includes('apply') ||
      q.includes('eligib') ||
      q.includes('ಮಾಹಿತಿ') ||
      q.includes('ವಿವರ') ||
      q.includes('ದಾಖಲೆ') ||
      q.includes('ಅರ್ಜಿ');

    // Score schemes by keyword relevance
    const matchedSchemes = SCHEMES_DATABASE.map((scheme) => {
      let score = 0;
      const combined = `${scheme.name} ${scheme.description} ${scheme.benefits} ${scheme.category} ${scheme.targetGroups?.join(' ') || ''}`.toLowerCase();

      // Keyword boosts
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      for (const word of words) {
        if (combined.includes(word)) score += 2;
        if (scheme.name.toLowerCase().includes(word)) score += 4;
        if (scheme.id.toLowerCase() === word) score += 6;
      }

      // Context boost
      if (context?.lastShownSchemes && context.lastShownSchemes.some((s) => scheme.name.includes(s) || s.includes(scheme.name))) {
        score += 3;
      }
      if (context?.state && scheme.state.toLowerCase().includes(context.state.toLowerCase())) score += 2;
      if (context?.occupation && scheme.targetOccupations?.includes(context.occupation as any)) score += 2;

      return { scheme, score };
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, isDetailRequest ? 1 : 2)
      .map((item) => item.scheme);

    if (matchedSchemes.length === 0) {
      if (isKannada) {
        return (
          `ನಮಸ್ಕಾರ! 🇮🇳\n\n` +
          `ನಿಮ್ಮ ಪ್ರಶ್ನೆ "${userQuery}" ಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ನಮ್ಮ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ನೇರ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ.\n\n` +
          `💡 *ಸಲಹೆ:*\n` +
          `• ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಯೋಜನೆಯ ಬಗ್ಗೆ ಕೇಳಿ (ಉದಾ: "PM-KISAN ಗೆ ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು ಯಾವುವು?").\n` +
          `• ಹಂತ-ಹಂತದ ಅರ್ಹತಾ ಪರಿಶೀಲನೆಗಾಗಿ *START* ಎಂದು ಟೈಪ್ ಮಾಡಿ.\n` +
          `• ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್: https://www.myscheme.gov.in ಗೆ ಭೇಟಿ ನೀಡಿ.`
        );
      }
      if (isHindi) {
        return (
          `नमस्ते! 🇮🇳\n\n` +
          `मुझे आपके प्रश्न "${userQuery}" के अनुसार कुछ विशिष्ट योजनाएं खोजने में सहायता चाहिए।\n\n` +
          `💡 *सुझाव:*\n` +
          `• आप किसी भी विशिष्ट योजना का नाम पूछ सकते हैं (जैसे: "PM KISAN के दस्तावेज़ क्या हैं?")।\n` +
          `• चरण-दर-चरण योजना खोज के लिए *START* लिख सकते हैं।\n` +
          `• राष्ट्रीय पोर्टल देखें: https://www.myscheme.gov.in`
        );
      }
      return (
        `Hello! 🇮🇳\n\n` +
        `I searched our database for "${userQuery}", but could not locate an exact match.\n\n` +
        `💡 *Tip:*\n` +
        `• Ask about a specific scheme (e.g. "How to apply for PM-KISAN" or "Documents for KCC").\n` +
        `• Type *START* to use our step-by-step personalized eligibility checker.\n` +
        `• Browse the national portal: https://www.myscheme.gov.in`
      );
    }

    // If citizen requested a deep-dive on a single scheme
    if (isDetailRequest && matchedSchemes.length >= 1) {
      const s = matchedSchemes[0];
      if (isKannada) {
        return (
          `🏛️ *${s.name} — ಸಮಗ್ರ ವಿವರ ಹಾಗೂ ಅರ್ಜಿ ಮಾರ್ಗದರ್ಶಿ*\n` +
          `📍 _ವ್ಯಾಪ್ತಿ/ರಾಜ್ಯ: ${s.state}_\n\n` +
          `📝 *ಉದ್ದೇಶ:* ${s.description}\n\n` +
          `💰 *ಸೌಲಭ್ಯಗಳು/ಲಾಭಗಳು:* ${s.benefits}\n\n` +
          `👥 *ಅರ್ಹತಾ ವಿವರ:* ${s.eligibilitySummary}\n\n` +
          `📄 *ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳ ಪಟ್ಟಿ:*\n• ${s.requiredDocuments.join('\n• ')}\n\n` +
          `🚀 *ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಹಂತಗಳು:*\n1. ${s.applicationSteps.join('\n2. ')}\n\n` +
          `🔗 *ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್:* ${s.officialUrl}\n\n` +
          `⚠️ *ಮುಖ್ಯ ಸೂಚನೆ:* ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನಿಯಮಗಳನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.`
        );
      }
      if (isHindi) {
        return (
          `🏛️ *${s.name} — विस्तृत विवरण एवं आवेदन मार्गदर्शिका*\n` +
          `📍 _क्षेत्र/राज्य: ${s.state}_\n\n` +
          `📝 *उद्देश्य:* ${s.description}\n\n` +
          `💰 *लाभ:* ${s.benefits}\n\n` +
          `👥 *पात्रता विवरण:* ${s.eligibilitySummary}\n\n` +
          `📄 *आवश्यक दस्तावेज़:*\n• ${s.requiredDocuments.join('\n• ')}\n\n` +
          `🚀 *आवेदन प्रक्रिया:*\n1. ${s.applicationSteps.join('\n2. ')}\n\n` +
          `🔗 *आधिकारिक वेबसाइट:* ${s.officialUrl}\n\n` +
          `⚠️ *महत्वपूर्ण:* आवेदन करने से पूर्व आधिकारिक पोर्टल पर नवीनतम नियमों की पुष्टि अवश्य करें।`
        );
      }
      return (
        `🏛️ *${s.name} — Detailed Guide & Application Steps*\n` +
        `📍 _Coverage: ${s.state}_\n\n` +
        `📝 *Purpose:* ${s.description}\n\n` +
        `💰 *Benefits:* ${s.benefits}\n\n` +
        `👥 *Eligibility Details:* ${s.eligibilitySummary}\n\n` +
        `📄 *Complete Document Checklist:*\n• ${s.requiredDocuments.join('\n• ')}\n\n` +
        `🚀 *Step-by-Step How to Apply:*\n1. ${s.applicationSteps.join('\n2. ')}\n\n` +
        `🔗 *Official Website:* ${s.officialUrl}\n\n` +
        `⚠️ *Notice:* Please confirm the latest guidelines on the official portal before applying.`
      );
    }

    // Format matched schemes list
    if (isKannada) {
      let response = `ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸೂಕ್ತವಾದ ಪ್ರಮುಖ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಇಲ್ಲಿವೆ:\n\n`;
      for (let i = 0; i < matchedSchemes.length; i++) {
        const s = matchedSchemes[i];
        response += `🏛️ *${i + 1}. ${s.name}*\n` +
          `📍 _ವ್ಯಾಪ್ತಿ: ${s.state}_\n` +
          `💰 *ಲಾಭಗಳು:* ${s.benefits}\n` +
          `👥 *ಅರ್ಹತೆ:* ${s.eligibilitySummary}\n` +
          `📄 *ದಾಖಲೆಗಳು:* ${s.requiredDocuments.slice(0, 3).join(', ')}\n` +
          `🔗 *ಪೋರ್ಟಲ್:* ${s.officialUrl}\n\n`;
      }
      response += `⚠️ *ಸೂಚನೆ:* ಈ ಫಲಿತಾಂಶಗಳು ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿವೆ. ಯಾವುದೇ ಯೋಜನೆಯ ಪೂರ್ಣ ವಿವರಗಳಿಗಾಗಿ ಅದರ ಹೆಸರು ಕೇಳಿ (ಉದಾ: "PM-KISAN ಬಗ್ಗೆ ತಿಳಿಸಿ").`;
      return response;
    }

    if (isHindi) {
      let response = `यहाँ आपके प्रश्न से संबंधित प्रमुख सरकारी योजनाएं हैं:\n\n`;
      for (let i = 0; i < matchedSchemes.length; i++) {
        const s = matchedSchemes[i];
        response += `🏛️ *${i + 1}. ${s.name}*\n` +
          `📍 _क्षेत्र: ${s.state}_\n` +
          `💰 *लाभ:* ${s.benefits}\n` +
          `👥 *पात्रता:* ${s.eligibilitySummary}\n` +
          `📄 *दस्तावेज़:* ${s.requiredDocuments.slice(0, 3).join(', ')}\n` +
          `🔗 *पोर्टल:* ${s.officialUrl}\n\n`;
      }
      response += `⚠️ *सूचना:* ये परिणाम मार्गदर्शन के लिए हैं। किसी योजना की विस्तृत जानकारी के लिए उसका नाम लिखें (जैसे: "PM KISAN के बारे में और बताओ")।`;
      return response;
    }

    let response = `Here are the relevant government schemes matching your query:\n\n`;
    for (let i = 0; i < matchedSchemes.length; i++) {
      const s = matchedSchemes[i];
      response += `🏛️ *${i + 1}. ${s.name}*\n` +
        `📍 _Coverage: ${s.state}_\n` +
        `💰 *Benefits:* ${s.benefits}\n` +
        `👥 *Eligibility:* ${s.eligibilitySummary}\n` +
        `📄 *Key Documents:* ${s.requiredDocuments.slice(0, 3).join(', ')}\n` +
        `🔗 *Official Portal:* ${s.officialUrl}\n\n`;
    }
    response += `⚠️ *Notice:* Matches are guidance suggestions. For deeper details, simply ask: "Tell me more about [Scheme Name]".`;
    return response;
  }

  /**
   * Feature 1: Rejection Recovery Assistant
   * Analyzes an official rejection notice and generates an actionable recovery plan.
   */
  async analyzeRejectionNotice(request: import('../types/rejection').RejectionAnalysisRequest): Promise<import('../types/rejection').RejectionAnalysisResult> {
    return defaultRejectionRecoveryService.analyzeNotice(request);
  }

  /**
   * Feature 2: Life-Event Benefit Discovery
   * Matches real-life situations to verified government welfare schemes.
   */
  async discoverLifeEventBenefits(request: import('../types/lifeEvent').LifeEventDiscoveryRequest): Promise<import('../types/lifeEvent').LifeEventDiscoveryResult> {
    return defaultLifeEventService.discoverBenefits(request);
  }
}

export const defaultGeminiService = new GeminiService();
