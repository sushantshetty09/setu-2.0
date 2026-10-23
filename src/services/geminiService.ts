import { GoogleGenAI } from '@google/genai';
import { SCHEMES_DATABASE } from '../data/schemesDatabase';
import { Scheme, UserProfile } from '../types/scheme';
import { matchIndianState } from '../chatbot/translations';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ConversationContext {
  language?: 'en' | 'hi';
  state?: string;
  occupation?: string;
  age?: number;
  history?: ChatMessage[];
}

export class GeminiService {
  private client: GoogleGenAI | null = null;
  private modelName: string;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    if (this.isConfigured()) {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  isConfigured(): boolean {
    return (
      Boolean(this.apiKey) &&
      this.apiKey !== 'your_gemini_api_key_here' &&
      this.apiKey !== 'dummy_key' &&
      this.apiKey.length > 10
    );
  }

  /**
   * Builds the system grounding prompt with curated knowledge of verified schemes.
   */
  private buildSystemPrompt(): string {
    // Generate a compact catalogue summary for context grounding
    const catalogueSummary = SCHEMES_DATABASE.map(
      (s, idx) =>
        `${idx + 1}. [${s.id}] ${s.name} (${s.category}, State: ${s.state})
• Benefits: ${s.benefits}
• Eligibility: ${s.eligibilitySummary}
• Target: ${s.targetOccupations?.join(', ') || 'All'}
• Documents: ${s.requiredDocuments.slice(0, 3).join(', ')}
• Official Portal: ${s.officialUrl}`
    ).join('\n\n');

    return `You are "Scheme Saathi" (स्कीम साथी) 🇮🇳, a helpful, respectful, and expert AI government welfare assistant for Indian citizens, especially farmers, rural families, workers, women, youth, and elderly citizens.

YOUR MISSION:
Help citizens discover legitimate government schemes, understand eligibility criteria, required documents, and application steps.

RULES AND CONSTRAINTS:
1. LANGUAGE: Always respond in the SAME language and tone used by the citizen.
   - If the citizen writes in Hindi (हिंदी), reply in clear, respectful Hindi (Devanagari script).
   - If they write in Hinglish (e.g. "kisan ke liye loan"), reply in friendly, conversational Hinglish.
   - If they write in English, reply in English.
2. GROUNDING & ACCURACY:
   - Base all scheme recommendations, benefit figures, eligibility rules, and official links strictly on the verified catalogue provided below.
   - NEVER invent fake schemes, imaginary grant amounts, or false promises of government approval.
   - If a citizen asks about a scheme not in the catalogue, share general awareness and direct them to the National Portal: https://www.myscheme.gov.in.
3. PRIVACY & SAFETY:
   - NEVER ask for Aadhaar numbers, bank account numbers, passwords, OTPs, or document uploads.
   - Explicitly remind citizens that Scheme Saathi recommendations are guidance suggestions and they must verify official rules on the respective government portal before applying.
4. WHATSAPP FORMATTING:
   - Use bold for headings: *Scheme Name*
   - Use emojis tastefully (🏛️, 💰, 👥, 📄, 🚀, 🔗).
   - Keep messages concise, well-spaced, and easy to read on a mobile phone screen (under 1200 characters per response).
   - Show maximum 2-3 most relevant schemes per response to avoid overwhelming the citizen.
   - Always include the official portal link for the recommended schemes.

VERIFIED GOVERNMENT SCHEMES CATALOGUE:
${catalogueSummary}`;
  }

  /**
   * Generates a conversational AI answer to a citizen's query.
   * If Gemini API is not configured or fails, gracefully falls back to local search.
   */
  async answerSchemeQuery(
    userQuery: string,
    context?: ConversationContext
  ): Promise<string> {
    if (!this.isConfigured() || !this.client) {
      return this.localSearchFallback(userQuery, context);
    }

    try {
      const systemInstruction = this.buildSystemPrompt();

      let contextPrefix = '';
      if (context?.state) contextPrefix += `[Citizen State: ${context.state}] `;
      if (context?.occupation) contextPrefix += `[Citizen Occupation: ${context.occupation}] `;
      if (context?.age) contextPrefix += `[Citizen Age: ${context.age}] `;

      const promptText = contextPrefix
        ? `${contextPrefix}\nCitizen Query: "${userQuery}"`
        : `Citizen Query: "${userQuery}"`;

      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const replyText = response.text?.trim();
      if (replyText) {
        return replyText;
      }
      return this.localSearchFallback(userQuery, context);
    } catch (error: any) {
      console.warn('[GeminiService Warning] API request failed, falling back to local search:', error.message || error);
      return this.localSearchFallback(userQuery, context);
    }
  }

  /**
   * Intelligently extracts user profile parameters (state, age, occupation, category) from natural language.
   */
  async extractProfileFromQuery(text: string): Promise<Partial<UserProfile> & { isQuestion?: boolean }> {
    const lower = text.toLowerCase();
    const result: Partial<UserProfile> & { isQuestion?: boolean } = {};

    // Check if it looks like a question or free-form query
    const questionWords = ['kya', 'kaise', 'what', 'how', 'which', 'scheme', 'yojana', 'batao', 'subsidy', 'loan', 'pension', 'bima', 'documents', 'eligibility', 'apply'];
    result.isQuestion = questionWords.some((w) => lower.includes(w)) || text.includes('?') || text.length > 25;

    // 1. Detect State
    const matchedState = matchIndianState(text);
    if (matchedState) {
      result.state = matchedState;
    }

    // 2. Detect Age
    const ageMatch = text.match(/\b(1[8-9]|[2-8][0-9]|90)\b/);
    if (ageMatch && (lower.includes('age') || lower.includes('saal') || lower.includes('year') || lower.includes('umar'))) {
      result.age = parseInt(ageMatch[0], 10);
    }

    // 3. Detect Occupation
    if (lower.includes('kisan') || lower.includes('farmer') || lower.includes('kheti') || lower.includes('krishi')) {
      result.occupation = 'Farmer';
    } else if (lower.includes('student') || lower.includes('vidyarthi') || lower.includes('chhatra') || lower.includes('padhai')) {
      result.occupation = 'Student';
    } else if (lower.includes('mazdoor') || lower.includes('worker') || lower.includes('shramik') || lower.includes('labour')) {
      result.occupation = 'Worker';
    } else if (lower.includes('vyapari') || lower.includes('business') || lower.includes('dukan') || lower.includes('entrepreneur')) {
      result.occupation = 'Business Owner';
    }

    // 4. Detect Category
    if (lower.includes('kisan') || lower.includes('fasal') || lower.includes('crop') || lower.includes('tractor') || lower.includes('pump') || lower.includes('agri')) {
      result.category = 'Agriculture';
    } else if (lower.includes('scholarship') || lower.includes('padhai') || lower.includes('school') || lower.includes('college') || lower.includes('education')) {
      result.category = 'Education';
    } else if (lower.includes('job') || lower.includes('naukri') || lower.includes('rozgar') || lower.includes('skill') || lower.includes('training')) {
      result.category = 'Employment';
    } else if (lower.includes('ghar') || lower.includes('makan') || lower.includes('awas') || lower.includes('housing')) {
      result.category = 'Housing';
    } else if (lower.includes('health') || lower.includes('ilaj') || lower.includes('hospital') || lower.includes('dawa') || lower.includes('ayushman')) {
      result.category = 'Healthcare';
    } else if (lower.includes('pension') || lower.includes('vriddha') || lower.includes('retirement')) {
      result.category = 'Pension';
    } else if (lower.includes('mahila') || lower.includes('women') || lower.includes('beti') || lower.includes('matru')) {
      result.category = "Women's Welfare";
    }

    return result;
  }

  /**
   * Resilient local keyword-based fallback when Gemini API key is absent or unreachable.
   */
  private localSearchFallback(userQuery: string, context?: ConversationContext): string {
    let q = userQuery.toLowerCase();
    const isHindi = context?.language === 'hi' || /[\u0900-\u097F]/.test(userQuery);

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

    // Score schemes by keyword relevance
    const matchedSchemes = SCHEMES_DATABASE.map((scheme) => {
      let score = 0;
      const combined = `${scheme.name} ${scheme.description} ${scheme.benefits} ${scheme.category} ${scheme.targetGroups?.join(' ') || ''}`.toLowerCase();

      // Keyword boosts
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      for (const word of words) {
        if (combined.includes(word)) score += 2;
        if (scheme.name.toLowerCase().includes(word)) score += 4;
      }

      // Context boost
      if (context?.state && scheme.state.toLowerCase().includes(context.state.toLowerCase())) score += 3;
      if (context?.occupation && scheme.targetOccupations?.includes(context.occupation as any)) score += 2;

      return { scheme, score };
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item) => item.scheme);

    if (matchedSchemes.length === 0) {
      if (isHindi) {
        return (
          `नमस्ते! 🇮🇳\n\n` +
          `मुझे आपके प्रश्न "${userQuery}" के अनुसार कुछ विशिष्ट योजनाएं खोजने में सहायता चाहिए।\n\n` +
          `💡 *सुझाव:*\n` +
          `• आप चरण-दर-चरण योजना खोज के लिए *START* लिख सकते हैं।\n` +
          `• अपने राज्य और व्यवसाय का नाम लिखकर पुनः पूछें (जैसे: "UP kisan solar pump")।\n` +
          `• राष्ट्रीय पोर्टल देखें: https://www.myscheme.gov.in`
        );
      }
      return (
        `Hello! 🇮🇳\n\n` +
        `I searched our database for "${userQuery}", but could not locate an exact match.\n\n` +
        `💡 *Tip:*\n` +
        `• Type *START* to use our step-by-step personalized eligibility checker.\n` +
        `• Mention your state and occupation (e.g. "Maharashtra farmer crop loan").\n` +
        `• Browse the national portal: https://www.myscheme.gov.in`
      );
    }

    // Format top matched schemes
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
      response += `⚠️ *सूचना:* ये परिणाम मार्गदर्शन के लिए हैं। आवेदन करने से पहले आधिकारिक पोर्टल पर नियमों की पुष्टि अवश्य करें।\n\n` +
        `💡 नया सत्र शुरू करने के लिए *START* लिखें।`;
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
    response += `⚠️ *Notice:* Matches are guidance suggestions. Please verify rules on the official portal before applying.\n\n` +
      `💡 Type *START* for a personalized eligibility check.`;
    return response;
  }
}

export const defaultGeminiService = new GeminiService();
