import { GoogleGenAI } from '@google/genai';
import { SCHEMES_DATABASE } from '../data/schemesDatabase';
import { Scheme } from '../types/scheme';
import { matchIndianState } from '../chatbot/translations';
import {
  BenefitType,
  LifeEventDiscoveryRequest,
  LifeEventDiscoveryResult,
  LifeEventMatch,
} from '../types/lifeEvent';

interface LifeEventScenarioDefinition {
  id: string;
  category: string;
  keywords: string[];
  kannadaKeywords: string[];
  hindiKeywords: string[];
  schemeIds: string[];
  defaultBenefitType: BenefitType;
  requiresStateNotice?: boolean;
}

const LIFE_EVENT_SCENARIOS: LifeEventScenarioDefinition[] = [
  // 1. Crop Damage / Rainfall / Drought / Flood
  {
    id: 'crop_damage',
    category: 'Agriculture & Crop Loss Assistance',
    keywords: ['crop', 'fasal', 'damage', 'rain', 'flood', 'drought', 'storm', 'harvest', 'loss', 'destroyed', 'ruined', 'hailstorm', 'baarish', 'barish', 'kharab'],
    kannadaKeywords: ['ಬೆಳೆ', 'ಹಾಳು', 'ಮಳೆ', 'ಹಾನಿ', 'ನಷ್ಟ', 'ಬರಗಾಲ', 'ಪ್ರವಾಹ', 'ವಿಮೆ'],
    hindiKeywords: ['फसल', 'खराब', 'बारिश', 'नुकसान', 'बाढ़', 'सूखा', 'ओला', 'बीमा'],
    schemeIds: ['PMFBY', 'PM-KISAN', 'KCC', 'RAD-NMSA'],
    defaultBenefitType: 'Crop / Health Insurance Claim',
    requiresStateNotice: true,
  },
  // 2. Starting a Small Business / Self-Employment / Shop
  {
    id: 'small_business',
    category: 'Entrepreneurship & Self-Employment',
    keywords: ['business', 'shop', 'startup', 'dukan', 'vyapar', 'microenterprise', 'self-employed', 'capital', 'enterprise', 'start', 'invest'],
    kannadaKeywords: ['ವ್ಯಾಪಾರ', 'ಉದ್ಯಮ', 'ಅಂಗಡಿ', 'ಸ್ವಯಂ ಉದ್ಯೋಗ', 'ಸಾಲ', 'ಬಂಡವಾಳ'],
    hindiKeywords: ['व्यापार', 'दुकान', 'व्यवसाय', 'स्वरोजगार', 'उद्योग', 'कारोबार', 'पूंजी', 'ऋण'],
    schemeIds: ['PMEGP', 'PMMY', 'STANDUP-INDIA', 'PM-SVANIDHI', 'PM-VISHWAKARMA'],
    defaultBenefitType: 'Low-Interest Loan / Credit',
  },
  // 3. College & Higher Education / Scholarship for Daughter or Son
  {
    id: 'higher_education',
    category: 'Education & Student Support',
    keywords: ['college', 'daughter', 'son', 'school', 'scholarship', 'study', 'education', 'fees', 'student', 'padhai', 'chhatravritti', 'university'],
    kannadaKeywords: ['ಕಾಲೇಜು', 'ಮಗಳು', 'ಮಗ', 'ವಿದ್ಯಾರ್ಥಿ', 'ವಿದ್ಯಾರ್ಥಿವೇತನ', 'ಶಿಕ್ಷಣ', 'ಶುಲ್ಕ'],
    hindiKeywords: ['कॉलेज', 'बेटी', 'बेटा', 'छात्र', 'छात्रवृत्ति', 'पढ़ाई', 'शिक्षा', 'फीस', 'विश्वविद्यालय'],
    schemeIds: ['NSP-POST-MATRIC-SC', 'NSP-POST-MATRIC-OBC', 'PMKVY', 'NAPS'],
    defaultBenefitType: 'Direct Cash Transfer (DBT)',
  },
  // 4. Elderly Father / Mother / Old Age Pension Support
  {
    id: 'elderly_pension',
    category: 'Social Security & Senior Citizen Pensions',
    keywords: ['father', 'mother', 'elderly', 'old', 'pension', 'senior', 'aged', '60', 'bujurg', 'pitaji', 'mataji', 'vriddha'],
    kannadaKeywords: ['ತಂದೆ', 'ತಾಯಿ', 'ವೃದ್ಧ', 'ಹಿರಿಯ', 'ಪಿಂಚಣಿ', '೬೦', 'ವಯಸ್ಸಾದ'],
    hindiKeywords: ['पिताजी', 'माताजी', 'बुजुर्ग', 'वृद्ध', 'पेंशन', 'वृद्धावस्था', 'वरिष्ठ'],
    schemeIds: ['NSAP-IGNOAPS', 'PM-KMY', 'NSAP-IGNWPS'],
    defaultBenefitType: 'Social Security Pension',
  },
  // 5. Job Loss / Unemployment / Livelihood Support
  {
    id: 'unemployment',
    category: 'Employment & Livelihood Security',
    keywords: ['lost job', 'unemployed', 'jobless', 'naukri', 'berojgar', 'work', 'labor', 'labour', 'shramik', 'unorganized'],
    kannadaKeywords: ['ಕೆಲಸ ಕಳೆದುಕೊಂಡ', 'ನಿರುದ್ಯೋಗಿ', 'ಉದ್ಯೋಗ', 'ಕೂಲಿ', 'ಕಾರ್ಮಿಕ'],
    hindiKeywords: ['नौकरी छूट गई', 'बेरोजगार', 'काम नहीं', 'मजदूर', 'श्रमिक', 'रोजगार'],
    schemeIds: ['MGNREGA', 'PMKVY', 'ESHRAM', 'PM-SVANIDHI'],
    defaultBenefitType: 'Skill Training & Toolkit',
  },
  // 6. Farm Machinery / Tractor / Solar Pump Subsidy
  {
    id: 'farm_equipment',
    category: 'Agricultural Mechanization & Irrigation Subsidy',
    keywords: ['equipment', 'tractor', 'machinery', 'tools', 'pump', 'solar pump', 'kusum', 'irrigation', 'motor', 'borewell', 'yantra', 'tubewell'],
    kannadaKeywords: ['ಟ್ರಾಕ್ಟರ್', 'ಯಂತ್ರ', 'ಉಪಕರಣ', 'ಪಂಪ್', 'ಸೋಲಾರ್', 'ನೀರಾವರಿ', 'ಕೃಷಿ ಉಪಕರಣ'],
    hindiKeywords: ['ट्रैक्टर', 'यंत्र', 'उपकरण', 'सोलर पंप', 'सिंचाई', 'मोटर', 'कृषि मशीनरी', 'कुसुम'],
    schemeIds: ['SMAM-FARM-MACHINERY', 'PM-KUSUM-A', 'PM-KUSUM-B', 'PM-KUSUM-C'],
    defaultBenefitType: 'Interest / Capital Subsidy',
  },
  // 7. Housing / Shelter Support
  {
    id: 'housing',
    category: 'Housing & Shelter Assistance',
    keywords: ['house', 'housing', 'home', 'shelter', 'makan', 'ghar', 'chhat', 'awas', 'kaccha ghar'],
    kannadaKeywords: ['ಮನೆ', 'ವಸತಿ', 'ಆಶ್ರಯ', 'ಸೂರು'],
    hindiKeywords: ['घर', 'मकान', 'आवास', 'कच्चा मकान', 'छत', 'बसेरा'],
    schemeIds: ['PMAY-G', 'PMAY-U'],
    defaultBenefitType: 'Interest / Capital Subsidy',
  },
  // 8. Healthcare / Hospitalization / Critical Illness
  {
    id: 'healthcare',
    category: 'Healthcare & Medical Assistance',
    keywords: ['hospital', 'illness', 'treatment', 'medicine', 'health', 'disease', 'surgery', 'doctor', 'dawa', 'ilaj', 'bimar', 'aspatal'],
    kannadaKeywords: ['ಆಸ್ಪತ್ರೆ', 'ಚಿಕಿತ್ಸೆ', 'ಔಷಧಿ', 'ಆರೋಗ್ಯ', 'ಕಾಯಿಲೆ', 'ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ'],
    hindiKeywords: ['अस्पताल', 'इलाज', 'दवा', 'बीमारी', 'स्वास्थ्य', 'सर्जरी', 'डॉक्टर'],
    schemeIds: ['PMJAY', 'PMBI-JANAUSHADHI', 'PMSSY', 'AB-HWCS'],
    defaultBenefitType: 'Free Public Service / Healthcare',
  },
  // 9. Women & Maternity Support
  {
    id: 'women_welfare',
    category: "Women's Welfare & Motherhood Support",
    keywords: ['pregnant', 'maternity', 'pregnancy', 'delivery', 'mother', 'women', 'mahila', 'garbhwati', 'shg', 'lakhpati didi'],
    kannadaKeywords: ['ಗರ್ಭಿಣಿ', 'ತಾಯಿ', 'ಮಹಿಳೆ', 'ಹೆರಿಗೆ', 'ಸ್ತ್ರೀ'],
    hindiKeywords: ['गर्भवती', 'माता', 'महिला', 'प्रसूति', 'डिलीवरी', 'लखपति दीदी'],
    schemeIds: ['PMMVY', 'LAKHPATI-DIDI', 'SUKANYA'],
    defaultBenefitType: 'Direct Cash Transfer (DBT)',
  },
];

export class LifeEventService {
  private client: GoogleGenAI | null = null;
  private candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
  ];

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY || '';
    if (key && key !== 'your_gemini_api_key_here' && key.length > 10) {
      this.client = new GoogleGenAI({ apiKey: key });
    }
  }

  /**
   * Main entrypoint to discover government schemes based on real-life events.
   */
  async discoverBenefits(request: LifeEventDiscoveryRequest): Promise<LifeEventDiscoveryResult> {
    const lang = request.language || 'en';
    const cleanSituation = request.userSituation.trim();
    const detectedState = request.state || matchIndianState(cleanSituation) || undefined;

    // 1. Identify matching scenario from verified catalogue
    const matchedScenario = this.matchScenario(cleanSituation);

    // 2. Try Gemini AI synthesis if configured
    if (this.client) {
      try {
        const aiResult = await this.discoverWithGemini(cleanSituation, matchedScenario, detectedState, lang);
        if (aiResult && aiResult.matches.length > 0) {
          return aiResult;
        }
      } catch (err: any) {
        console.warn('[LifeEventService] Gemini AI call failed, using verified database match:', err.message || err);
      }
    }

    // 3. Resilient rule-based discovery grounded in SCHEMES_DATABASE
    return this.discoverWithVerifiedDatabase(cleanSituation, matchedScenario, detectedState, lang);
  }

  /**
   * Detects which life event scenario the user's message matches.
   */
  private matchScenario(text: string): LifeEventScenarioDefinition {
    const lower = text.toLowerCase();

    let bestScenario = LIFE_EVENT_SCENARIOS[0];
    let highestScore = 0;

    for (const scenario of LIFE_EVENT_SCENARIOS) {
      let score = 0;
      // English keywords
      for (const kw of scenario.keywords) {
        if (lower.includes(kw)) score += 2;
      }
      // Hindi keywords
      for (const kw of scenario.hindiKeywords) {
        if (lower.includes(kw)) score += 3;
      }
      // Kannada keywords
      for (const kw of scenario.kannadaKeywords) {
        if (lower.includes(kw)) score += 3;
      }

      if (score > highestScore) {
        highestScore = score;
        bestScenario = scenario;
      }
    }

    return bestScenario;
  }

  /**
   * Queries Gemini AI to provide situational reasoning while strictly grounding facts on SCHEMES_DATABASE.
   */
  private async discoverWithGemini(
    userSituation: string,
    scenario: LifeEventScenarioDefinition,
    state: string | undefined,
    lang: 'en' | 'hi' | 'kn'
  ): Promise<LifeEventDiscoveryResult | null> {
    if (!this.client) return null;

    // Retrieve candidate schemes from verified database
    const candidateSchemes = SCHEMES_DATABASE.filter(
      (s) =>
        scenario.schemeIds.includes(s.id) ||
        s.category.toLowerCase().includes(scenario.category.toLowerCase())
    ).slice(0, 5);

    const catalogueContext = candidateSchemes
      .map(
        (s) => `### SCHEME ID: ${s.id}
Name: ${s.name}
Category: ${s.category}
Coverage: ${s.state}
Benefits: ${s.benefits}
Eligibility: ${s.eligibilitySummary}
Required Documents: ${s.requiredDocuments.join(', ')}
Official Portal: ${s.officialUrl}
Last Verified: ${s.lastVerifiedAt}`
      )
      .join('\n\n');

    const systemInstruction = `You are the "Life-Event Benefit Discovery Advisor" of Scheme Saathi 🇮🇳.
Your mission is to understand a citizen's real-life problem or life transition in ordinary language and match them with legitimate, verified government welfare schemes.

CRITICAL TRUTHFULNESS & FINANCIAL RULES:
1. Ground all recommendations strictly on the provided verified schemes list below. Never invent non-existent schemes or false benefits.
2. Clearly distinguish LOANS from GRANTS/SUBSIDIES. Never describe a loan (like Mudra, KCC, or Education Loans) as "free money" or "guaranteed grant". Explicitly state interest rate, subsidy percentage, or repayment obligation.
3. Distinguish "apparent relevance" from "confirmed official eligibility".
4. If location (state/district) materially alters eligibility and was not provided, gently note it as a recommendation rather than blocking the citizen.
5. In your explanations, answer: "Why this scheme matches your situation".
6. Language: Reply in the user's requested language ('hi' for Hindi, 'kn' for Kannada, 'en' for English).

OUTPUT FORMAT: Return strictly valid JSON:
{
  "identifiedLifeEvent": "Brief name of life event, e.g. Crop Damage / Rainfall Loss",
  "identifiedNeed": "What the user needs, e.g. Financial compensation for destroyed crops",
  "primaryCategory": "${scenario.category}",
  "summaryExplanation": "Compassionate, citizen-friendly summary of available government assistance",
  "matches": [
    {
      "schemeId": "Scheme ID matching one from the verified catalogue",
      "whyMatched": "Specific explanation of why this scheme helps in the citizen's situation",
      "benefitType": "Direct Cash Transfer (DBT) | Interest / Capital Subsidy | Low-Interest Loan / Credit | Crop / Health Insurance Claim | Free Public Service / Healthcare | Social Security Pension",
      "financialAssistanceDetails": "Exact numbers, installment amounts, or subsidy percentages from verified data",
      "apparentEligibility": "Key eligibility criteria from verified data",
      "importantExclusions": ["Exclusion 1", "Exclusion 2"],
      "requiredDocuments": ["Doc 1", "Doc 2"],
      "isLoan": false
    }
  ],
  "missingDetailsPrompt": "Optional question if state or occupation is needed for deeper match"
}`;

    const promptText = `Citizen Situation:\n"""${userSituation}"""\n\nState Provided: ${state || 'Not specified'}\nRequested Language: ${lang}\n\nVERIFIED SCHEMES CATALOGUE TO GROUND FROM:\n${catalogueContext}`;

    for (const model of this.candidateModels) {
      try {
        const response = await this.client.models.generateContent({
          model,
          contents: promptText,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        const reply = response.text?.trim();
        if (reply) {
          const parsed = JSON.parse(reply);
          return this.formatAiResult(parsed, candidateSchemes, lang, state);
        }
      } catch (err: any) {
        console.warn(`[LifeEventService] Model ${model} generation failed:`, err.message || err);
      }
    }

    return null;
  }

  /**
   * Resilient local matching using SCHEMES_DATABASE.
   */
  private discoverWithVerifiedDatabase(
    userSituation: string,
    scenario: LifeEventScenarioDefinition,
    state: string | undefined,
    lang: 'en' | 'hi' | 'kn'
  ): LifeEventDiscoveryResult {
    // 1. Retrieve matching verified schemes
    let matchedSchemes = SCHEMES_DATABASE.filter((s) => scenario.schemeIds.includes(s.id));
    if (matchedSchemes.length === 0) {
      matchedSchemes = SCHEMES_DATABASE.slice(0, 3);
    }

    // 2. Filter or prioritize by state if state is provided
    if (state) {
      matchedSchemes.sort((a, b) => {
        const aMatches = a.state.toLowerCase().includes(state.toLowerCase());
        const bMatches = b.state.toLowerCase().includes(state.toLowerCase());
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });
    }

    // Limit to top 3 best matching schemes
    const topSchemes = matchedSchemes.slice(0, 3);

    const matches: LifeEventMatch[] = topSchemes.map((scheme) => {
      const isLoan =
        scheme.id.includes('MUDRA') ||
        scheme.id.includes('PMMY') ||
        scheme.id.includes('KCC') ||
        scheme.id.includes('STANDUP') ||
        scheme.id.includes('LOAN') ||
        scheme.benefits.toLowerCase().includes('loan') ||
        scheme.benefits.toLowerCase().includes('credit limit');

      let benefitType: BenefitType = scenario.defaultBenefitType;
      if (isLoan) {
        benefitType = 'Low-Interest Loan / Credit';
      } else if (scheme.benefits.toLowerCase().includes('subsidy')) {
        benefitType = 'Interest / Capital Subsidy';
      } else if (scheme.benefits.toLowerCase().includes('pension')) {
        benefitType = 'Social Security Pension';
      } else if (scheme.benefits.toLowerCase().includes('claim') || scheme.benefits.toLowerCase().includes('insurance')) {
        benefitType = 'Crop / Health Insurance Claim';
      }

      return {
        scheme,
        whyMatched: this.generateWhyMatched(scenario.id, scheme, lang),
        benefitType,
        financialAssistanceDetails: scheme.benefits,
        apparentEligibility: scheme.eligibilitySummary,
        importantExclusions: this.getExclusions(scheme),
        requiredDocuments: scheme.requiredDocuments,
        officialApplicationUrl: scheme.officialUrl,
        verificationSource: scheme.sourceNote || 'Official government portal verification',
        lastVerifiedAt: scheme.lastVerifiedAt,
        isLoan,
      };
    });

    let summaryExplanation = '';
    if (lang === 'hi') {
      summaryExplanation = `हमने आपकी परिस्थिति (*${scenario.category}*) का विश्लेषण किया है। आपके लिए सरकार द्वारा संचालित ये सत्यापित योजनाएं अत्यधिक प्रासंगिक प्रतीत होती हैं:`;
    } else if (lang === 'kn') {
      summaryExplanation = `ನಾವು ನಿಮ್ಮ ಸನ್ನಿವೇಶವನ್ನು (*${scenario.category}*) ವಿಶ್ಲೇಷಿಸಿದ್ದೇವೆ. ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ಸೂಕ್ತವಾದ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ವಿವರ ಇಲ್ಲಿದೆ:`;
    } else {
      summaryExplanation = `Based on your situation (*${scenario.category}*), we identified the following verified government programs that directly address your requirements:`;
    }

    let missingDetailsPrompt: string | undefined;
    if (!state && scenario.requiresStateNotice) {
      if (lang === 'hi') {
        missingDetailsPrompt = `💡 _(सुझाव: अपना राज्य या जिला बताएं ताकि राज्य सरकार की विशेष आपदा राहत योजनाएं भी दिखाई जा सकें)_`;
      } else if (lang === 'kn') {
        missingDetailsPrompt = `💡 _(ಸಲಹೆ: ನಿಮ್ಮ ರಾಜ್ಯ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ತಿಳಿಸಿದರೆ ರಾಜ್ಯ ಸರ್ಕಾರದ ನಿರ್ದಿಷ್ಟ ಪರಿಹಾರ ಯೋಜನೆಗಳನ್ನು ನೀಡಬಹುದು)_`;
      } else {
        missingDetailsPrompt = `💡 _(Tip: Share your State or District to see state-specific disaster/compensation schemes as well)_`;
      }
    }

    const result: LifeEventDiscoveryResult = {
      identifiedLifeEvent: scenario.category,
      identifiedNeed: userSituation,
      primaryCategory: scenario.category,
      summaryExplanation,
      matches,
      missingDetailsPrompt,
      disclaimer:
        '⚠️ Notice: These recommendations are based on verified official program guidelines matching your described situation. Apparent matches do not guarantee government approval. Verify specific guidelines on the official portal before applying.',
      formattedMessage: '',
    };

    result.formattedMessage = this.formatWhatsAppMessage(result, lang);
    return result;
  }

  private generateWhyMatched(scenarioId: string, scheme: Scheme, lang: 'en' | 'hi' | 'kn'): string {
    if (lang === 'hi') {
      if (scenarioId === 'crop_damage') {
        return `यह योजना प्राकृतिक आपदा, भारी बारिश या सूखे के कारण फसल नुकसान होने पर वित्तीय बीमा सुरक्षा व क्षतिपूर्ति प्रदान करती है।`;
      }
      if (scenarioId === 'small_business') {
        return `यह योजना नए उद्यम, दुकान या लघु व्यवसाय की शुरुआत हेतु रियायती ऋण अथवा पूंजी सब्सिडी उपलब्ध कराती है।`;
      }
      if (scenarioId === 'higher_education') {
        return `यह योजना कॉलेज व उच्च शिक्षा के अध्ययन खर्च, फीस और छात्रवृत्ति हेतु वित्तीय सहायता प्रदान करती है।`;
      }
      if (scenarioId === 'elderly_pension') {
        return `यह योजना 60 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिकों को नियमित मासिक वित्तीय सुरक्षा पेंशन प्रदान करती है।`;
      }
      return `यह योजना आपकी वर्तमान परिस्थिति के अनुरूप सरकारी सहायता और सहायता लाभ प्रदान करती है।`;
    }

    if (lang === 'kn') {
      if (scenarioId === 'crop_damage') {
        return `ಈ ಯೋಜನೆಯು ಅತಿಯಾದ ಮಳೆ, ಪ್ರವಾಹ ಅಥವಾ ನೈಸರ್ಗಿಕ ವಿಕೋಪದಿಂದ ಬೆಳೆ ನಷ್ಟವಾದಾಗ ಆರ್ಥಿಕ ವಿಮಾ ಪರಿಹಾರವನ್ನು ನೀಡುತ್ತದೆ.`;
      }
      if (scenarioId === 'small_business') {
        return `ಹೊಸ ಸಣ್ಣ ವ್ಯಾಪಾರ, ಅಂಗಡಿ ಅಥವಾ ಉದ್ಯಮವನ್ನು ಪ್ರಾರಂಭಿಸಲು ರಿಯಾಯಿತಿ ಸಾಲ ಮತ್ತು ಬಂಡವಾಳ ಸಹಾಯಧನವನ್ನು ಒದಗಿಸುತ್ತದೆ.`;
      }
      if (scenarioId === 'higher_education') {
        return `ಕಾಲೇಜು ಮತ್ತು ಉನ್ನತ ಶಿಕ್ಷಣದ ಶುಲ್ಕ ಭರಿಸಲು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕಾಗಿ ಆರ್ಥಿಕ ನೆರವು ನೀಡುತ್ತದೆ.`;
      }
      if (scenarioId === 'elderly_pension') {
        return `೬೦ ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ಖಾತರಿಪಡಿಸಿದ ಪಿಂಚಣಿ ಒದಗಿಸುತ್ತದೆ.`;
      }
      return `ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸನ್ನಿವೇಶಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳನ್ನು ಈ ಯೋಜನೆ ನೀಡುತ್ತದೆ.`;
    }

    // English
    if (scenarioId === 'crop_damage') {
      return 'Provides insurance cover and financial claim compensation against non-preventable natural risks and heavy rain crop loss.';
    }
    if (scenarioId === 'small_business') {
      return 'Provides collateral-free low-interest credit and capital subsidy to help initiate microenterprises and small shops.';
    }
    if (scenarioId === 'higher_education') {
      return 'Provides financial assistance and merit-cum-means scholarships to cover college and university tuition fees.';
    }
    if (scenarioId === 'elderly_pension') {
      return 'Provides assured monthly social security pension to senior citizens aged 60 and above.';
    }
    return `Matches your described situation by providing targeted government support in ${scheme.category}.`;
  }

  private getExclusions(scheme: Scheme): string[] {
    const exclusions: string[] = [];
    if (scheme.id.includes('PM-KISAN')) {
      exclusions.push('Institutional landholders and serving/retired government employees are excluded.');
      exclusions.push('Income-tax payees in previous assessment years are not eligible.');
    } else if (scheme.id.includes('PMFBY')) {
      exclusions.push('Post-harvest losses not intimated within 72 hours are ineligible for localized claims.');
      exclusions.push('Losses due to war or malicious damage are excluded.');
    } else if (scheme.id.includes('PMMY')) {
      exclusions.push('Loan must be utilized for business/income-generating activities, not personal consumption.');
    } else {
      exclusions.push('Standard statutory scheme guidelines and document verification apply.');
    }
    return exclusions;
  }

  private formatAiResult(
    parsed: any,
    candidateSchemes: Scheme[],
    lang: 'en' | 'hi' | 'kn',
    state?: string
  ): LifeEventDiscoveryResult {
    const matches: LifeEventMatch[] = [];

    if (Array.isArray(parsed.matches)) {
      for (const m of parsed.matches) {
        const found = candidateSchemes.find(
          (s) => s.id === m.schemeId || s.name.toLowerCase().includes((m.schemeId || '').toLowerCase())
        );
        if (found) {
          matches.push({
            scheme: found,
            whyMatched: m.whyMatched || 'Directly addresses your specified situation.',
            benefitType: (m.benefitType as BenefitType) || 'Direct Cash Transfer (DBT)',
            financialAssistanceDetails: m.financialAssistanceDetails || found.benefits,
            apparentEligibility: m.apparentEligibility || found.eligibilitySummary,
            importantExclusions: Array.isArray(m.importantExclusions) ? m.importantExclusions : this.getExclusions(found),
            requiredDocuments: Array.isArray(m.requiredDocuments) ? m.requiredDocuments : found.requiredDocuments,
            officialApplicationUrl: found.officialUrl,
            verificationSource: found.sourceNote || 'Official verified government portal',
            lastVerifiedAt: found.lastVerifiedAt,
            isLoan: Boolean(m.isLoan),
          });
        }
      }
    }

    // Fallback if AI didn't match cleanly
    if (matches.length === 0 && candidateSchemes.length > 0) {
      return this.discoverWithVerifiedDatabase('Situation query', LIFE_EVENT_SCENARIOS[0], state, lang);
    }

    const result: LifeEventDiscoveryResult = {
      identifiedLifeEvent: parsed.identifiedLifeEvent || 'Identified Welfare Need',
      identifiedNeed: parsed.identifiedNeed || 'Citizen assistance request',
      primaryCategory: parsed.primaryCategory || 'Government Schemes',
      summaryExplanation: parsed.summaryExplanation || 'Here are the verified schemes matching your situation:',
      matches: matches.slice(0, 3),
      missingDetailsPrompt: parsed.missingDetailsPrompt,
      disclaimer:
        '⚠️ Notice: Apparent matches based on situation description do not constitute an official government eligibility decision. Verify rules on the official government portal before applying.',
      formattedMessage: '',
    };

    result.formattedMessage = this.formatWhatsAppMessage(result, lang);
    return result;
  }

  /**
   * Formats matched schemes into WhatsApp message cards with clear benefit types and actions.
   */
  public formatWhatsAppMessage(r: LifeEventDiscoveryResult, lang: 'en' | 'hi' | 'kn'): string {
    const isKannada = lang === 'kn';
    const isHindi = lang === 'hi';

    const header = isKannada
      ? `🌱 *ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತವಾದ ಯೋಜನೆಗಳ ಶೋಧನೆ (Life-Event Discovery)*\n\n${r.summaryExplanation}`
      : isHindi
      ? `🌱 *आपकी परिस्थिति के अनुसार योजनाएं (Life-Event Discovery)*\n\n${r.summaryExplanation}`
      : `🌱 *Life-Event Benefit Discovery*\n\n${r.summaryExplanation}`;

    const cards = r.matches.map((m, idx) => {
      const loanWarning = m.isLoan
        ? isKannada
          ? `\n💳 *ಸೂಚನೆ:* ಇದು ರಿಯಾಯಿತಿ ಬಡ್ಡಿದರದ ಸಾಲ ಯೋಜನೆಯಾಗಿದೆ (ಉಚಿತ ಅನುದಾನವಲ್ಲ). ಮರುಪಾವತಿ ಅನ್ವಯಿಸುತ್ತದೆ.`
          : isHindi
          ? `\n💳 *महत्वपूर्ण:* यह रियायती ऋण योजना है (मुफ्त अनुदान नहीं)। पुनर्भುगतान शर्तें लागू होंगी।`
          : `\n💳 *Important:* This is a low-interest credit/loan scheme (NOT free money). Repayment conditions apply.`
        : '';

      const labels = isKannada
        ? {
            why: '💡 *ಈ ಯೋಜನೆ ಏಕೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ:*',
            benefit: '💰 *ಸಹಾಯಧನ / ಸೌಲಭ್ಯದ ವಿವರ:*',
            eligibility: '👥 *ಅರ್ಹತೆಯ ಮುಖ್ಯ ಷರತ್ತುಗಳು:*',
            exclusions: '⚠️ *ಪ್ರಮುಖ ಹೊರಗಿಡುವಿಕೆಗಳು (ಯಾರಿಗೆ ಸಿಗುವುದಿಲ್ಲ):*',
            docs: '📄 *ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು:*',
            portal: '🔗 *ಅಧಿಕೃತ ಅರ್ಜಿ ಪೋರ್ಟಲ್:*',
            verified: '🗓️ *ಪರಿಶೀಲಿಸಿದ ದಿನಾಂಕ:*',
          }
        : isHindi
        ? {
            why: '💡 *यह योजना आपकी स्थिति में क्यों उपयोगी है:*',
            benefit: '💰 *सहायता / लाभ विवरण:*',
            eligibility: '👥 *मुख्य पात्रता शर्तें:*',
            exclusions: '⚠️ *प्रमुख बहिಷ್करण (किसे लाभ नहीं मिलेगा):*',
            docs: '📄 *आवश्यक दस्तावेज:*',
            portal: '🔗 *आधिकारिक आवेदन पोर्टल:*',
            verified: '🗓️ *सत्यापित तिथि:*',
          }
        : {
            why: '💡 *Why this matches your situation:*',
            benefit: '💰 *Assistance & Benefit Type:*',
            eligibility: '👥 *Apparent Eligibility Criteria:*',
            exclusions: '⚠️ *Important Exclusions:*',
            docs: '📄 *Documents Required:*',
            portal: '🔗 *Official Portal & Application:*',
            verified: '🗓️ *Verified:*',
          };

      return (
        `🏛️ *${idx + 1}. ${m.scheme.name}*\n` +
        `🏷️ _Type: ${m.benefitType} | Coverage: ${m.scheme.state}_\n\n` +
        `${labels.why}\n${m.whyMatched}\n\n` +
        `${labels.benefit}\n${m.financialAssistanceDetails}${loanWarning}\n\n` +
        `${labels.eligibility}\n${m.apparentEligibility}\n\n` +
        `${labels.exclusions}\n` +
        m.importantExclusions.map((ex) => `• ${ex}`).join('\n') +
        `\n\n` +
        `${labels.docs}\n` +
        m.requiredDocuments.slice(0, 4).map((d) => `• ${d}`).join('\n') +
        `\n\n` +
        `${labels.portal}\n${m.officialApplicationUrl}\n` +
        `${labels.verified} ${m.lastVerifiedAt}`
      );
    });

    const parts = [header, ...cards];
    if (r.missingDetailsPrompt) {
      parts.push(r.missingDetailsPrompt);
    }
    parts.push(r.disclaimer);

    return parts.join('\n\n---\n\n');
  }
}

export const defaultLifeEventService = new LifeEventService();
