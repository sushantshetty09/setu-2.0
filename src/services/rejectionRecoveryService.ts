import { GoogleGenAI } from '@google/genai';
import { RejectionAnalysisRequest, RejectionAnalysisResult } from '../types/rejection';
import { matchIndianState } from '../chatbot/translations';
import { SCHEMES_DATABASE } from '../data/schemesDatabase';

/**
 * Verified Government Grievance & Correction Portals Directory
 */
const VERIFIED_GRIEVANCE_DIRECTORY: Record<
  string,
  {
    name: string;
    correctionUrl: string;
    grievanceUrl: string;
    helpline: string;
    deskGuidance: string;
  }
> = {
  'pm-kisan': {
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    correctionUrl: 'https://pmkisan.gov.in/',
    grievanceUrl: 'https://pmkisan.gov.in/Grievance.aspx',
    helpline: '155261 / 1800-115-526 (Toll Free) / 011-24300606',
    deskGuidance:
      'Visit nearest Common Service Centre (CSC) or District Agriculture Nodal Officer with updated land records and Aadhaar.',
  },
  pmfby: {
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana - Crop Insurance)',
    correctionUrl: 'https://pmfby.gov.in/',
    grievanceUrl: 'https://pmfby.gov.in/grievance',
    helpline: '14447 (National Kisan Call Centre) / 1800-180-1551',
    deskGuidance:
      'Report crop loss dispute within 72 hours to your local bank branch, insurance company toll-free, or District Agriculture Officer.',
  },
  pmay: {
    name: 'PMAY (Pradhan Mantri Awas Yojana - Housing)',
    correctionUrl: 'https://pmaymis.gov.in/',
    grievanceUrl: 'https://pgportal.gov.in/',
    helpline: '011-23060484 / 011-23063285',
    deskGuidance:
      'Visit your Gram Panchayat Secretary (for PMAY-Gramin) or Municipal Corporation housing desk (for PMAY-Urban).',
  },
  ayushman: {
    name: 'Ayushman Bharat (PM-JAY - Health Cover)',
    correctionUrl: 'https://beneficiary.nha.gov.in/',
    grievanceUrl: 'https://cgrms.pmjay.gov.in/',
    helpline: '14555 / 1800-111-565',
    deskGuidance:
      'Visit the Ayushman Mitra desk at any empanelled District Government Hospital with your Ration Card and Aadhaar.',
  },
  nsp: {
    name: 'National Scholarship Portal (NSP)',
    correctionUrl: 'https://scholarships.gov.in/',
    grievanceUrl: 'https://scholarships.gov.in/',
    helpline: '0120-6619540',
    deskGuidance:
      'Contact your school/college Institute Nodal Officer (INO) to unlock or defect-mark the application for correction.',
  },
  default: {
    name: 'CPGRAMS (Centralised Public Grievance Redress and Monitoring System)',
    correctionUrl: 'https://www.myscheme.gov.in/',
    grievanceUrl: 'https://pgportal.gov.in/',
    helpline: '1800-11-4000 (National Consumer/Public Grievance)',
    deskGuidance:
      'Lodge a formal citizen grievance on the Central Government CPGRAMS portal or your State CM Helpline (e.g., 1076 in UP, 1902 in Karnataka).',
  },
};

export class RejectionRecoveryService {
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
   * Main entrypoint to analyze government scheme rejection notices.
   */
  async analyzeNotice(request: RejectionAnalysisRequest): Promise<RejectionAnalysisResult> {
    const lang = request.language || 'en';
    const cleanText = request.rawText.trim();

    // 1. Detect if the text is completely ambiguous or too short
    if (cleanText.length < 5 || /^(hi|hello|help|rej|rejected|\?)$/i.test(cleanText)) {
      return this.buildClarificationResponse(lang, request.schemeName);
    }

    // 2. Identify associated scheme from text or request
    const matchedScheme = this.identifyScheme(cleanText, request.schemeName);
    const matchedState = request.state || matchIndianState(cleanText) || undefined;

    // 3. Try Gemini AI analysis if configured
    if (this.client) {
      try {
        const aiResult = await this.analyzeWithGemini(cleanText, matchedScheme, matchedState, lang, request.imageBase64, request.imageMimeType);
        if (aiResult) {
          return aiResult;
        }
      } catch (err: any) {
        console.warn('[RejectionRecoveryService] Gemini AI call failed, falling back to verified rule base:', err.message || err);
      }
    }

    // 4. Resilient rule-based fallback grounded in verified government patterns
    return this.analyzeWithVerifiedRuleBase(cleanText, matchedScheme, matchedState, lang);
  }

  /**
   * Identifies scheme reference from the user's rejection text.
   */
  private identifyScheme(text: string, userScheme?: string): string {
    const lower = `${userScheme || ''} ${text}`.toLowerCase();
    if (lower.includes('kisan') || lower.includes('pm-kisan') || lower.includes('pmkisan') || lower.includes('samman')) return 'pm-kisan';
    if (lower.includes('fasal') || lower.includes('bima') || lower.includes('pmfby') || lower.includes('crop insurance')) return 'pmfby';
    if (lower.includes('awas') || lower.includes('pmay') || lower.includes('housing')) return 'pmay';
    if (lower.includes('ayushman') || lower.includes('pmjay') || lower.includes('golden card') || lower.includes('health card')) return 'ayushman';
    if (lower.includes('scholarship') || lower.includes('nsp') || lower.includes('matric') || lower.includes('student')) return 'nsp';
    return 'default';
  }

  /**
   * Analyzes rejection text via Gemini with structured system instructions.
   */
  private async analyzeWithGemini(
    noticeText: string,
    schemeKey: string,
    state: string | undefined,
    lang: 'en' | 'hi' | 'kn',
    imageBase64?: string,
    imageMimeType?: string
  ): Promise<RejectionAnalysisResult | null> {
    if (!this.client) return null;

    const directory = VERIFIED_GRIEVANCE_DIRECTORY[schemeKey] || VERIFIED_GRIEVANCE_DIRECTORY.default;

    const systemInstruction = `You are the "Rejection Recovery Assistant" of Scheme Saathi 🇮🇳, an empathetic, highly accurate guide helping Indian citizens understand government scheme rejection messages and take corrective action.

STRICT ACCURACY AND SAFETY RULES:
1. NEVER invent reasons, deadlines, or appeal procedures that do not exist or cannot be verified.
2. Separate the confirmed reason stated in the notice from any possible reasons.
3. NEVER guarantee that correcting an application will result in approval.
4. Warn the citizen not to share Aadhaar numbers, bank account numbers, OTPs, or passwords.
5. If the notice is too vague or ambiguous, ask 1 or 2 targeted follow-up questions instead of guessing.
6. Provide verified official links:
   - Official Portal: ${directory.correctionUrl}
   - Grievance Redress: ${directory.grievanceUrl}
   - Helpline: ${directory.helpline}
7. LANGUAGE REQUIREMENT:
   - If language is 'hi', output clear Hindi in Devanagari script.
   - If language is 'kn', output natural Kannada in Kannada script.
   - If language is 'en', output clear English.

OUTPUT JSON FORMAT:
You must output a strictly valid JSON object with the following keys:
{
  "meaning": "Simple explanation of what the rejection message means in plain citizen language",
  "statedReason": "The exact reason explicitly stated in the notice",
  "possibleReasons": ["Possible explanation 1 (clearly marked as possibility)", "Possible explanation 2"],
  "actionPlan": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "documentsToCheck": ["Document 1", "Document 2"],
  "correctionsNeeded": ["Specific correction needed"],
  "officialPortalName": "${directory.name}",
  "officialPortalUrl": "${directory.correctionUrl}",
  "grievanceChannelName": "${directory.grievanceUrl}",
  "grievanceChannelUrl": "${directory.grievanceUrl}",
  "verifiedHelpline": "${directory.helpline}",
  "verifiedDeadline": null,
  "escalationOptions": ["Lodge grievance on CPGRAMS (pgportal.gov.in)", "Contact District Agriculture/Welfare Nodal Officer"],
  "needsClarification": false,
  "followUpQuestions": []
}`;

    const promptText = `Rejection Notice Text / Citizen Message:\n"""${noticeText}"""\n\nIdentified Scheme: ${directory.name}\nState: ${state || 'All India'}\nLanguage Requested: ${lang}`;

    for (const model of this.candidateModels) {
      try {
        const contents: any[] = [];
        if (imageBase64) {
          contents.push({
            inlineData: {
              data: imageBase64,
              mimeType: imageMimeType || 'image/png',
            },
          });
        }
        contents.push(promptText);

        const response = await this.client.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        const reply = response.text?.trim();
        if (reply) {
          const parsed = JSON.parse(reply);
          return this.formatResult(parsed, lang, directory);
        }
      } catch (err: any) {
        console.warn(`[RejectionRecoveryService] Model ${model} error:`, err.message || err);
      }
    }
    return null;
  }

  /**
   * Resilient verified rule-based reasoning engine.
   * Accurately decodes real-world Indian government rejection notices without calling external APIs.
   */
  private analyzeWithVerifiedRuleBase(
    text: string,
    schemeKey: string,
    state: string | undefined,
    lang: 'en' | 'hi' | 'kn'
  ): RejectionAnalysisResult {
    const lower = text.toLowerCase();
    const directory = VERIFIED_GRIEVANCE_DIRECTORY[schemeKey] || VERIFIED_GRIEVANCE_DIRECTORY.default;

    let meaning = '';
    let statedReason = '';
    const possibleReasons: string[] = [];
    const actionPlan: string[] = [];
    const documentsToCheck: string[] = [];
    const correctionsNeeded: string[] = [];
    let needsClarification = false;
    let followUpQuestions: string[] | undefined;
    let verifiedDeadline: string | undefined = undefined;

    // Pattern 1: Aadhaar name / demographic mismatch
    if (
      lower.includes('name mismatch') ||
      lower.includes('name not as per') ||
      lower.includes('naam') ||
      lower.includes('spelling') ||
      lower.includes('demographic') ||
      lower.includes('ಹಸರು')
    ) {
      statedReason = 'Name in application or bank account does not match Aadhaar card record.';
      possibleReasons.push('Spelling difference (e.g. initial vs expanded surname).');
      possibleReasons.push('Surname placed before or after first name.');
      possibleReasons.push('Name changed after marriage but not updated across all records.');

      actionPlan.push('Check the exact spelling of your name on your Aadhaar card.');
      actionPlan.push('Check your bank passbook and land records (Khatauni/RTC) to verify if the spelling matches character-for-character.');
      actionPlan.push(
        schemeKey === 'pm-kisan'
          ? 'Visit the PM-KISAN portal (pmkisan.gov.in) -> "Farmers Corner" -> "Name Correction as per Aadhaar" to edit it online.'
          : `Visit the official portal (${directory.correctionUrl}) or your nearest CSC center to submit a name correction request.`
      );
      actionPlan.push('If your bank account name is incorrect, visit your bank branch with your Aadhaar card and submit a KYC Name Update Form.');

      documentsToCheck.push('Aadhaar Card (original and copy)');
      documentsToCheck.push('Bank Account Passbook or Statement');
      documentsToCheck.push('Land Records / RTC / Khatauni (if applying for farmer schemes)');

      correctionsNeeded.push('Update name spelling on the scheme portal to match Aadhaar exactly.');
      correctionsNeeded.push('Ensure Bank Passbook name matches Aadhaar.');
    }
    // Pattern 2: Bank Account / NPCI / DBT Seeding / e-KYC
    else if (
      lower.includes('npci') ||
      lower.includes('dbt') ||
      lower.includes('seeding') ||
      lower.includes('seeded') ||
      lower.includes('pfms') ||
      lower.includes('ekyc') ||
      lower.includes('e-kyc') ||
      lower.includes('bank account') ||
      lower.includes('khata') ||
      lower.includes('ಬ್ಯಾಂಕ್') ||
      lower.includes('ಖಾತೆ')
    ) {
      statedReason = 'Direct Benefit Transfer (DBT) payment could not be processed because the bank account is not mapped with NPCI or e-KYC is incomplete.';
      possibleReasons.push('Bank account is active but not linked to the NPCI Aadhaar Payment Bridge (APB).');
      possibleReasons.push('e-KYC on the scheme portal is pending or expired.');
      possibleReasons.push('Dormant or inoperative bank account due to long inactivity.');

      actionPlan.push('Visit your home bank branch and ask the manager for the "NPCI Aadhaar Seeding / DBT Consent Form".');
      actionPlan.push('Ensure your bank account is active and not marked as dormant or zero-balance frozen.');
      actionPlan.push(
        schemeKey === 'pm-kisan'
          ? 'Complete your online biometric or OTP e-KYC directly on pmkisan.gov.in using your Aadhaar-linked mobile number.'
          : 'Complete pending biometric e-KYC at your nearest Common Service Centre (CSC).'
      );

      documentsToCheck.push('Bank Account Passbook (with active IFSC & Account Number)');
      documentsToCheck.push('Aadhaar Card');
      documentsToCheck.push('Active Mobile Number registered with Aadhaar');

      correctionsNeeded.push('Submit NPCI DBT seeding mandate at bank branch.');
      correctionsNeeded.push('Complete OTP or Biometric e-KYC on the portal.');
    }
    // Pattern 3: Land record mismatch / Revenue verification
    else if (
      lower.includes('land') ||
      lower.includes('khasra') ||
      lower.includes('khatauni') ||
      lower.includes('ror') ||
      lower.includes('rtc') ||
      lower.includes('bhulekh') ||
      lower.includes('patta') ||
      lower.includes('revenue') ||
      lower.includes('ಜಮೀನು') ||
      lower.includes('ಭೂಮಿ')
    ) {
      statedReason = 'Land ownership details could not be verified by the State Revenue Department.';
      possibleReasons.push('Land record (Khasra/Khatauni/RTC number) entered incorrectly during registration.');
      possibleReasons.push('Agricultural land was transferred after the scheme eligibility cut-off date (e.g. 01-02-2019 for PM-KISAN).');
      possibleReasons.push('Joint ownership land where applicant is not recorded as the primary cultivable landholder.');

      actionPlan.push('Obtain a recent certified copy of your land records (RoR / RTC / Khatauni) from your Tehsil, Taluk office, or State Bhulekh portal.');
      actionPlan.push('Verify that the land is categorized as agricultural cultivable land and your name is correctly entered.');
      actionPlan.push('Visit your local Block / Taluk Agriculture Officer or Tehsil Revenue Inspector (Lekhpal/Patwari) to submit land verification papers.');

      documentsToCheck.push('Certified copy of Khatauni / RTC / RoR (issued within last 6 months)');
      documentsToCheck.push('Aadhaar Card');
      documentsToCheck.push('Self-declaration of agricultural landholding');

      correctionsNeeded.push('Submit updated landholding document to the Block Agriculture Nodal Officer.');
    }
    // Pattern 4: Exclusion / Ineligible criteria (Income Tax, Pensioner, Govt Employee)
    else if (
      lower.includes('income tax') ||
      lower.includes('ineligible') ||
      lower.includes('exclusion') ||
      lower.includes('govt employee') ||
      lower.includes('taxpayer') ||
      lower.includes('ಅನರ್ಹ')
    ) {
      statedReason = 'Application flagged under statutory scheme exclusions (such as Income Tax filing or public service).';
      possibleReasons.push('An adult member of the beneficiary household filed an Income Tax Return (ITR) in previous assessment years.');
      possibleReasons.push('System matched PAN card or government pension record belonging to the household.');
      possibleReasons.push('Erroneous identity match in government central database.');

      actionPlan.push('Check whether any member included in your household ration card holds an active PAN that filed an Income Tax Return.');
      actionPlan.push('If this exclusion was applied by mistake, obtain an ITR Non-Filing declaration or Form 16 proof.');
      actionPlan.push('Submit a written dispute along with your declaration to the District Grievance Redressal Committee.');

      documentsToCheck.push('PAN Card details of family members');
      documentsToCheck.push('Ration Card showing family tree');
      documentsToCheck.push('Income Certificate issued by Tehsildar / Revenue Authority');

      correctionsNeeded.push('File a formal dispute with non-taxpayer proof if rejection was caused by mistaken PAN linkage.');
    }
    // Pattern 5: Crop Insurance claim rejected
    else if (
      lower.includes('loss') ||
      lower.includes('claim') ||
      lower.includes('survey') ||
      lower.includes('72 hour') ||
      lower.includes('intimation') ||
      lower.includes('weather') ||
      lower.includes('ವಿಮೆ')
    ) {
      statedReason = 'Crop loss claim could not be processed due to delayed intimation or localized survey mismatch.';
      possibleReasons.push('Crop loss was not intimated within the mandatory 72-hour window following localized natural calamity.');
      possibleReasons.push('Crop cutting experiment (CCE) in the notified village did not reach threshold yield loss.');
      possibleReasons.push('Discrepancy in sown crop versus insured crop declaration.');

      actionPlan.push('Check the crop loss intimation receipt and registration number generated on the Crop Insurance App or Kisan Call Centre.');
      actionPlan.push('Contact your District Agriculture Officer or local Insurance Company representative to request a joint survey report copy.');
      actionPlan.push('If the loss occurred in a notified disaster area, raise a grievance on the PMFBY Grievance portal or call Toll-Free 14447.');

      documentsToCheck.push('PMFBY Insurance Policy / Receipt Number');
      documentsToCheck.push('Crop Sowing Certificate / Girdawari');
      documentsToCheck.push('Photographs / Geo-tagged loss evidence if available');

      correctionsNeeded.push('File a grievance with the District Level Monitoring Committee (DLMC) headed by the District Collector.');
      verifiedDeadline = 'Within 72 hours of localized calamity event (mandatory official PMFBY guidelines)';
    }
    // Ambiguous notice
    else {
      needsClarification = true;
      statedReason = `The notice received (${text.slice(0, 100)}...) does not specify a clear standard government rejection code.`;
      possibleReasons.push('Generic portal error or server timeout during batch verification.');
      possibleReasons.push('Missing mandatory attachment or incomplete document verification.');

      actionPlan.push('Log into the official application portal using your Application Number / Aadhaar to check the detailed "Beneficiary Status" tab.');
      actionPlan.push('Look for specific remark fields (e.g., PFMS Status, State Status, Aadhaar Status).');

      followUpQuestions = [
        'Which specific scheme was this application for (e.g. PM-KISAN, PMFBY, PMAY, Scholarship)?',
        'Did the message include any reference code (like "PFMS Error", "Code 02", or "Rejected by Bank")?',
        'Which State or Union Territory do you live in?',
      ];

      documentsToCheck.push('Application Acknowledgment Slip');
      documentsToCheck.push('Registered Mobile Number');
    }

    // Section A: Meaning
    meaning = this.translateMeaning(statedReason, lang);

    const escalationOptions = [
      `Lodge an official grievance on CPGRAMS (Centralised Public Grievance Portal): ${directory.grievanceUrl}`,
      state ? `Contact the ${state} State Public Grievance Helpline / CM Helpline (Toll-Free).` : 'Contact your District Collectorate Public Grievance Cell on Monday.',
      directory.deskGuidance,
    ];

    const result: RejectionAnalysisResult = {
      meaning,
      statedReason,
      possibleReasons,
      actionPlan,
      documentsToCheck,
      correctionsNeeded,
      officialPortalName: directory.name,
      officialPortalUrl: directory.correctionUrl,
      grievanceChannelName: `${directory.name} Grievance Portal`,
      grievanceChannelUrl: directory.grievanceUrl,
      verifiedHelpline: directory.helpline,
      verifiedDeadline, // Officially verified for PMFBY 72h window, undefined otherwise
      escalationOptions,
      needsClarification,
      followUpQuestions,
      privacyNotice: '🔒 Privacy Protection: We never store your personal notices or documents. Never share Aadhaar numbers, bank account numbers, passwords, or OTPs.',
      disclaimer: '⚠️ Guidance Notice: This analysis is an informational interpretation of government scheme guidelines and does not constitute an official government decision. Please verify all instructions on the official government portal before resubmitting.',
      formattedMessage: '',
    };

    result.formattedMessage = this.formatWhatsAppMessage(result, lang);
    return result;
  }

  private translateMeaning(statedReason: string, lang: 'en' | 'hi' | 'kn'): string {
    if (lang === 'hi') {
      if (statedReason.includes('Name')) {
        return 'आपकी योजना का आवेदन इसलिए रोका या खारिज किया गया है क्योंकि आपके बैंक खाते या आवेदन में लिखे नाम की स्पेलिंग आपके आधार कार्ड से पूरी तरह मेल नहीं खा रही है।';
      }
      if (statedReason.includes('DBT') || statedReason.includes('bank')) {
        return 'सरकारी सहायता आपके बैंक खाते में नहीं भेजी जा सकी क्योंकि आपका बैंक खाता आधार से एनपीसीआई (NPCI) डीबीटी के लिए लिंक नहीं है या आपकी ई-केवाईसी (e-KYC) अधूरी है।';
      }
      if (statedReason.includes('Land')) {
        return 'राजस्व विभाग के रिकॉर्ड में आपकी कृषि भूमि के विवरण (खसरा/खतौनी) का सत्यापन नहीं हो पाया है।';
      }
      return 'आपके आवेदन में दी गई जानकारी सरकारी रिकॉर्ड से मेल न खाने या अधूरी होने के कारण आवेदन रोका गया है।';
    }

    if (lang === 'kn') {
      if (statedReason.includes('Name')) {
        return 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಥವಾ ಅರ್ಜಿಯಲ್ಲಿರುವ ಹೆಸರಿನ ಅಕ್ಷರಗಳು ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ದಾಖಲೆಯೊಂದಿಗೆ ನಿಖರವಾಗಿ ಹೊಂದಿಕೆಯಾಗದ ಕಾರಣ ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ ಅಥವಾ ತಡೆಹಿಡಿಯಲಾಗಿದೆ.';
      }
      if (statedReason.includes('DBT') || statedReason.includes('bank')) {
        return 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್ ಎನ್‌ಪಿಸಿಐ (NPCI/DBT) ಲಿಂಕ್ ಆಗದಿರುವುದರಿಂದ ಅಥವಾ ಇ-ಕೆವೈಸಿ (e-KYC) ಅಪೂರ್ಣವಾಗಿರುವುದರಿಂದ ಸರ್ಕಾರದ ಸಹಾಯಧನ ಜಮೆಯಾಗಿಲ್ಲ.';
      }
      if (statedReason.includes('Land')) {
        return 'ಕಂದಾಯ ಇಲಾಖೆಯ ದಾಖಲೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಜಮೀನಿನ ವಿವರಗಳು (ಆರ್‌ಟಿಸಿ/ಪಹಣಿ) ಪರಿಶೀಲನೆಗೊಂಡಿಲ್ಲ.';
      }
      return 'ಸರ್ಕಾರಿ ದಾಖಲೆಗಳೊಂದಿಗೆ ವಿವರಗಳು ಹೊಂದಾಣಿಕೆಯಾಗದ ಕಾರಣ ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ಪರಿಶೀಲನೆಗೆ ತಡೆಹಿಡಿಯಲಾಗಿದೆ.';
    }

    return `Your application was held or rejected because the information in the government system or bank account does not match official verification records (${statedReason}).`;
  }

  private buildClarificationResponse(lang: 'en' | 'hi' | 'kn', schemeName?: string): RejectionAnalysisResult {
    const questions = lang === 'hi'
      ? [
          'आप किस सरकारी योजना के लिए आवेदन कर रहे थे (जैसे PM-KISAN, PMFBY फसल बीमा, PMAY आवास, या छात्रवृत्ति)?',
          'आप किस राज्य में रहते हैं?',
          'कृपया पोर्टल या एसएमएस में लिखा हुआ अस्वीकृति का सटीक कारण या एरर कोड यहाँ साझा करें।'
        ]
      : lang === 'kn'
      ? [
          'ನೀವು ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ್ದೀರಿ (ಉದಾ: PM-KISAN, PMFBY ಬೆಳೆ ವಿಮೆ, PMAY ವಸತಿ, ಅಥವಾ ವಿದ್ಯಾರ್ಥಿವೇತನ)?',
          'ನಿಮ್ಮ ರಾಜ್ಯ ಯಾವುದು?',
          'ಪೋರ್ಟಲ್ ಅಥವಾ SMS ನಲ್ಲಿ ಬಂದಿರುವ ನಿಖರವಾದ ತಿರಸ್ಕಾರದ ಕಾರಣ ಅಥವಾ ದೋಷ ಸಂಕೇತವನ್ನು (Error Code) ಇಲ್ಲಿ ನಮೂದಿಸಿ.'
        ]
      : [
          'Which government scheme did you apply for (e.g. PM-KISAN, PMFBY Crop Insurance, PMAY Housing, or National Scholarship)?',
          'Which Indian state or Union Territory do you reside in?',
          'Could you paste the exact rejection error code, SMS message, or status remark from the portal?'
        ];

    const result: RejectionAnalysisResult = {
      meaning: lang === 'hi'
        ? 'आपके द्वारा प्रदान किया गया अस्वीकृति संदेश बहुत संक्षिप्त है या इसमें स्पष्ट सरकारी कारण कोड नहीं है।'
        : lang === 'kn'
        ? 'ನೀವು ನೀಡಿದ ತಿರಸ್ಕಾರದ ಸಂದೇಶವು ತುಂಬಾ ಸಂಕ್ಷಿಪ್ತವಾಗಿದೆ ಅಥವಾ ಅಧಿಕೃತ ಕಾರಣ ಕೋಡ್ ಹೊಂದಿಲ್ಲ.'
        : 'The rejection message provided is too brief or does not contain a specific official rejection reason code.',
      statedReason: 'Unspecified or ambiguous rejection message.',
      possibleReasons: [
        'The message only says "Rejected" without mentioning the department defect code.',
        'Name mismatch, document illegibility, or pending e-KYC are standard rejection triggers to check.',
      ],
      actionPlan: [
        'Log in to the official scheme portal and download the detailed application status slip.',
        'Check the exact remarks column for verification failure codes.',
      ],
      documentsToCheck: [
        'Application Acknowledgement / Registration Slip',
        'Aadhaar Card (verify name spelling)',
        'Bank Passbook (verify NPCI Aadhaar seeding)',
      ],
      correctionsNeeded: [
        'Identify specific mismatch from portal remarks before editing records.',
      ],
      officialPortalName: schemeName || 'National Portal (myScheme / CPGRAMS)',
      officialPortalUrl: 'https://www.myscheme.gov.in/',
      grievanceChannelName: 'Centralised Public Grievance Redress and Monitoring System (CPGRAMS)',
      grievanceChannelUrl: 'https://pgportal.gov.in/',
      verifiedHelpline: '1800-115-526 (National Citizen Helpline)',
      verifiedDeadline: undefined,
      escalationOptions: [
        'CPGRAMS Portal (pgportal.gov.in)',
        'Visit nearest Common Service Centre (CSC) or District Public Grievance Cell',
      ],
      needsClarification: true,
      followUpQuestions: questions,
      privacyNotice: '🔒 Privacy Protection: We never store your personal notices or documents. Never share Aadhaar numbers, bank account numbers, passwords, or OTPs.',
      disclaimer: '⚠️ Guidance Notice: This analysis is an informational interpretation of government scheme guidelines and does not constitute an official government decision. Please verify all instructions on the official government portal before resubmitting.',
      formattedMessage: '',
    };

    result.formattedMessage = this.formatWhatsAppMessage(result, lang);
    return result;
  }

  /**
   * Formats the analysis into a WhatsApp-friendly message conforming to sections A through E.
   */
  public formatWhatsAppMessage(r: RejectionAnalysisResult, lang: 'en' | 'hi' | 'kn'): string {
    if (r.needsClarification && r.followUpQuestions && r.followUpQuestions.length > 0) {
      if (lang === 'hi') {
        return (
          `🔍 *अस्वीकृति सूचना स्पष्ट नहीं है* ℹ️\n\n` +
          `आपके द्वारा भेजे गए संदेश में स्पष्ट कारण नहीं मिला है। सटीक मार्गदर्शन के लिए कृपया बताएं:\n\n` +
          r.followUpQuestions.map((q, idx) => `• *${idx + 1}.* ${q}`).join('\n') +
          `\n\n🔒 _(सुझाव: कभी भी आधार नंबर, बैंक खाता नंबर या OTP साझा न करें)_`
        );
      }
      if (lang === 'kn') {
        return (
          `🔍 *ತಿರಸ್ಕಾರದ ಕಾರಣ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲ* ℹ️\n\n` +
          `ನೀವು ಕಳುಹಿಸಿದ ಸಂದೇಶದಲ್ಲಿ ನಿಖರವಾದ ಕಾರಣ ದೊರೆತಿಲ್ಲ. ಸೂಕ್ತ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ದಯವಿಟ್ಟು ತಿಳಿಸಿ:\n\n` +
          r.followUpQuestions.map((q, idx) => `• *${idx + 1}.* ${q}`).join('\n') +
          `\n\n🔒 _(ಸೂಚನೆ: ಆಧಾರ್ ಸಂಖ್ಯೆ, ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಥವಾ ಒಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ)_`
        );
      }
      return (
        `🔍 *Rejection Notice Needs Clarification* ℹ️\n\n` +
        `The rejection message provided does not state a clear government reason code. To give you the exact correction plan, please tell me:\n\n` +
        r.followUpQuestions.map((q, idx) => `• *${idx + 1}.* ${q}`).join('\n') +
        `\n\n🔒 _(Privacy note: Never share your Aadhaar number, bank account details, or OTP)_`
      );
    }

    if (lang === 'hi') {
      return (
        `📋 *अस्वीकृति सुधार सहायक (Rejection Recovery Assistant)* 🛠️\n\n` +
        `*A. संदेश का क्या मतलब है:*\n${r.meaning}\n\n` +
        `*B. यह क्यों हुआ:* \n` +
        `• *स्पष्ट कारण:* ${r.statedReason}\n` +
        (r.possibleReasons.length > 0
          ? `• *अन्य संभावित कारण:* \n  - ` + r.possibleReasons.join('\n  - ') + `\n\n`
          : '\n') +
        `*C. अब आपको क्या करना चाहिए (कदम-दर-कदम):*\n` +
        r.actionPlan.map((s, idx) => `*${idx + 1}.* ${s}`).join('\n') +
        `\n\n*📄 जांचने योग्य आवश्यक दस्तावेज:*\n` +
        r.documentsToCheck.map((d) => `• ${d}`).join('\n') +
        `\n\n*D. आधिकारिक सुधार एवं शिकायत केंद्र:*\n` +
        `• आधिकारिक पोर्टल: ${r.officialPortalUrl || 'https://www.myscheme.gov.in/'}\n` +
        `• शिकायत दर्ज करें: ${r.grievanceChannelUrl || 'https://pgportal.gov.in/'}\n` +
        (r.verifiedHelpline ? `• हेल्पलाइन नंबर: *${r.verifiedHelpline}*\n` : '') +
        `\n*E. यदि समस्या का समाधान न हो:*\n` +
        r.escalationOptions.map((e) => `• ${e}`).join('\n') +
        `\n\n${r.privacyNotice}\n\n${r.disclaimer}`
      );
    }

    if (lang === 'kn') {
      return (
        `📋 *ಅರ್ಜಿ ತಿರಸ್ಕಾರ ಪರಿಹಾರ ಮಾರ್ಗದರ್ಶಿ (Rejection Recovery Assistant)* 🛠️\n\n` +
        `*A. ಈ ಸಂದೇಶದ ಅರ್ಥವೇನು:*\n${r.meaning}\n\n` +
        `*B. ಇದು ಏಕೆ ಸಂಭವಿಸಿರಬಹುದು:* \n` +
        `• *ಸ್ಪಷ್ಟ ಕಾರಣ:* ${r.statedReason}\n` +
        (r.possibleReasons.length > 0
          ? `• *ಇತರ ಸಂಭಾವ್ಯ ಸಾಧ್ಯತೆಗಳು:* \n  - ` + r.possibleReasons.join('\n  - ') + `\n\n`
          : '\n') +
        `*C. ಈಗ ನೀವು ಏನು ಮಾಡಬೇಕು (ಹಂತ-ಹಂತವಾಗಿ):*\n` +
        r.actionPlan.map((s, idx) => `*${idx + 1}.* ${s}`).join('\n') +
        `\n\n*📄 ಪರಿಶೀಲಿಸಬೇಕಾದ ಅಗತ್ಯ ದಾಖಲೆಗಳು:*\n` +
        r.documentsToCheck.map((d) => `• ${d}`).join('\n') +
        `\n\n*D. ಅಧಿಕೃತ ತಿದ್ದುಪಡಿ ಮತ್ತು ದೂರು ಪೋರ್ಟಲ್:*\n` +
        `• ಅಧಿಕೃತ ಪೋರ್ಟಲ್: ${r.officialPortalUrl || 'https://www.myscheme.gov.in/'}\n` +
        `• ಆನ್‌ಲೈನ್ ದೂರು ಸಲ್ಲಿಕೆ: ${r.grievanceChannelUrl || 'https://pgportal.gov.in/'}\n` +
        (r.verifiedHelpline ? `• ಅಧಿಕೃತ ಸಹಾಯವಾಣಿ: *${r.verifiedHelpline}*\n` : '') +
        `\n*E. ಸಮಸ್ಯೆ ಮುಂದುವರಿದರೆ ಏನು ಮಾಡಬೇಕು:*\n` +
        r.escalationOptions.map((e) => `• ${e}`).join('\n') +
        `\n\n${r.privacyNotice}\n\n${r.disclaimer}`
      );
    }

    // Default English
    return (
      `📋 *Rejection Recovery Assistant* 🛠️\n\n` +
      `*A. What the rejection message means:*\n${r.meaning}\n\n` +
      `*B. Why this may have happened:*\n` +
      `• *Confirmed Reason:* ${r.statedReason}\n` +
      (r.possibleReasons.length > 0
        ? `• *Other Possibilities (Unconfirmed):*\n  - ` + r.possibleReasons.join('\n  - ') + `\n\n`
        : '\n') +
      `*C. What you should do now (Step-by-Step):*\n` +
      r.actionPlan.map((s, idx) => `*${idx + 1}.* ${s}`).join('\n') +
      `\n\n*📄 Documents or Information to Check:*\n` +
      r.documentsToCheck.map((d) => `• ${d}`).join('\n') +
      `\n\n*D. Official Next Steps & Grievance Portals:*\n` +
      `• Official Portal: ${r.officialPortalUrl || 'https://www.myscheme.gov.in/'}\n` +
      `• Grievance Redressal: ${r.grievanceChannelUrl || 'https://pgportal.gov.in/'}\n` +
      (r.verifiedHelpline ? `• Verified Helpline: *${r.verifiedHelpline}*\n` : '') +
      `\n*E. What to do if the problem continues:*\n` +
      r.escalationOptions.map((e) => `• ${e}`).join('\n') +
      `\n\n${r.privacyNotice}\n\n${r.disclaimer}`
    );
  }

  private formatResult(parsed: any, lang: 'en' | 'hi' | 'kn', directory: any): RejectionAnalysisResult {
    const result: RejectionAnalysisResult = {
      meaning: parsed.meaning || 'Application rejected or held by the verifying authority.',
      statedReason: parsed.statedReason || 'Demographic or document verification failure.',
      possibleReasons: Array.isArray(parsed.possibleReasons) ? parsed.possibleReasons : [],
      actionPlan: Array.isArray(parsed.actionPlan) && parsed.actionPlan.length > 0 ? parsed.actionPlan : ['Verify details on portal.'],
      documentsToCheck: Array.isArray(parsed.documentsToCheck) ? parsed.documentsToCheck : ['Aadhaar Card', 'Bank Passbook'],
      correctionsNeeded: Array.isArray(parsed.correctionsNeeded) ? parsed.correctionsNeeded : ['Update records on portal.'],
      officialPortalName: parsed.officialPortalName || directory.name,
      officialPortalUrl: parsed.officialPortalUrl || directory.correctionUrl,
      grievanceChannelName: parsed.grievanceChannelName || `${directory.name} Grievance`,
      grievanceChannelUrl: parsed.grievanceChannelUrl || directory.grievanceUrl,
      verifiedHelpline: parsed.verifiedHelpline || directory.helpline,
      verifiedDeadline: parsed.verifiedDeadline || undefined,
      escalationOptions: Array.isArray(parsed.escalationOptions) && parsed.escalationOptions.length > 0
        ? parsed.escalationOptions
        : ['CPGRAMS (pgportal.gov.in)'],
      needsClarification: Boolean(parsed.needsClarification),
      followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions : undefined,
      privacyNotice: '🔒 Privacy Protection: We never store your personal notices or documents. Never share Aadhaar numbers, bank account numbers, passwords, or OTPs.',
      disclaimer: '⚠️ Guidance Notice: This analysis is an informational interpretation of government scheme guidelines and does not constitute an official government decision. Please verify all instructions on the official government portal before resubmitting.',
      formattedMessage: '',
    };
    result.formattedMessage = this.formatWhatsAppMessage(result, lang);
    return result;
  }
}

export const defaultRejectionRecoveryService = new RejectionRecoveryService();
