import { Language, ConversationStep } from '../types/conversation';
import { OccupationType, SchemeCategory } from '../types/scheme';

export interface TranslationStrings {
  welcome: string;
  selectLanguage: string;
  consentPrompt: string;
  consentDeclined: string;
  consentRevoked: string;
  askState: string;
  invalidState: string;
  askAge: string;
  invalidAge: string;
  askOccupation: string;
  invalidOccupation: string;
  askCategory: string;
  invalidCategory: string;
  fetchingSchemes: string;
  noSchemesFound: string;
  resultsHeader: (count: number) => string;
  schemeItem: {
    purpose: string;
    benefits: string;
    eligibility: string;
    documents: string;
    application: string;
    officialLink: string;
    lastVerified: string;
  };
  disclaimer: string;
  helpMessage: string;
  backAcknowledgment: (stepName: string) => string;
  cannotGoBack: string;
  restartPrompt: string;
  serviceError: string;
  occupationOptions: Record<OccupationType, string>;
  categoryOptions: Record<SchemeCategory, string>;
}

export const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

export const OCCUPATION_MAP: Record<number, OccupationType> = {
  1: 'Farmer',
  2: 'Student',
  3: 'Worker',
  4: 'Business Owner',
  5: 'Other',
};

export const CATEGORY_MAP: Record<number, SchemeCategory> = {
  1: 'Agriculture',
  2: 'Education',
  3: 'Employment',
  4: 'Housing',
  5: 'Healthcare',
  6: 'Pension',
  7: "Women's Welfare",
  8: 'Other',
};

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    welcome:
      `Welcome to *Scheme Saathi*! 🇮🇳\n\n` +
      `I can help you discover government schemes that may be relevant to you, understand eligibility requirements, and learn how to apply.\n\n` +
      `Please choose your preferred language / कृपया अपनी भाषा चुनें / ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:\n` +
      `1. Hindi (हिंदी)\n` +
      `2. English\n` +
      `3. Kannada (ಕನ್ನಡ)`,

    selectLanguage:
      `Please reply with *1* for Hindi, *2* for English, or *3* for Kannada (ಕನ್ನಡ).`,

    consentPrompt:
      `*Privacy & Consent Notice* 🔒\n\n` +
      `To find relevant schemes, I need a few basic details such as your state, age, and occupation. Your answers may be sent to our scheme-matching service and saved as an enquiry if you agree.\n\n` +
      `We *never* ask for Aadhaar numbers, bank details, OTPs, or document uploads.\n\n` +
      `Do you consent?\n` +
      `1. Yes\n` +
      `2. No\n\n` +
      `_(You can reply *STOP* at any point to revoke consent and erase session data)_`,

    consentDeclined:
      `Understood. You have chosen not to share personal information. 🛡️\n\n` +
      `You can still ask general questions or use commands:\n` +
      `• Type *START* to begin again anytime.\n` +
      `• Type *HELP* for available commands.\n` +
      `• Visit the national portal at https://www.myscheme.gov.in for direct browsing.`,

    consentRevoked:
      `Your consent has been revoked and all session data has been cleared. 🛑\n\n` +
      `No further personal details are stored. If an enquiry was previously submitted to our backend, you may contact support to request its deletion.\n\n` +
      `Type *START* or *HI* anytime if you wish to begin a new session.`,

    askState:
      `*Question 1 of 4:* 📍\n` +
      `Which Indian state or Union Territory do you live in?\n\n` +
      `_(e.g., Uttar Pradesh, Maharashtra, Bihar, Delhi, Rajasthan, etc.)_`,

    invalidState:
      `⚠️ We couldn't recognize that state or Union Territory. Please check the spelling and reply with a valid Indian state/UT (e.g. Maharashtra, Bihar, Delhi, Karnataka, Uttar Pradesh).\n\n` +
      `_(Tip: Reply *BACK* to return to the previous step or *RESTART* to start over)_`,

    askAge:
      `*Question 2 of 4:* 🎂\n` +
      `What is your age in years?\n\n` +
      `_(Please enter a number between 1 and 120, e.g., 24)_`,

    invalidAge:
      `⚠️ Please enter a valid age as a whole number between 1 and 120 (e.g. 28).\n\n` +
      `_(Tip: Reply *BACK* to return to the previous step)_`,

    askOccupation:
      `*Question 3 of 4:* 💼\n` +
      `What best describes your occupation?\n\n` +
      `1. Farmer (किसान)\n` +
      `2. Student (विद्यार्थी)\n` +
      `3. Worker / Labourer (मज़दूर / श्रमिक)\n` +
      `4. Business Owner / Self-Employed (व्यापारी / स्वरोजगार)\n` +
      `5. Other (अन्य)\n\n` +
      `_(Reply with the option number 1 to 5)_`,

    invalidOccupation:
      `⚠️ Please reply with a number between 1 and 5 matching your occupation:\n` +
      `1. Farmer | 2. Student | 3. Worker | 4. Business Owner | 5. Other`,

    askCategory:
      `*Question 4 of 4:* 🎯\n` +
      `Which category of government assistance are you most interested in?\n\n` +
      `1. Agriculture (कृषि)\n` +
      `2. Education (शिक्षा)\n` +
      `3. Employment & Skill (रोजगार)\n` +
      `4. Housing (आवास)\n` +
      `5. Healthcare (स्वास्थ्य)\n` +
      `6. Pension & Social Security (पेंशन)\n` +
      `7. Women's Welfare (महिला कल्याण)\n` +
      `8. Other / General (अन्य)\n\n` +
      `_(Reply with the option number 1 to 8)_`,

    invalidCategory:
      `⚠️ Please reply with a number between 1 and 8 to choose a category:\n` +
      `1. Agriculture | 2. Education | 3. Employment | 4. Housing | 5. Healthcare | 6. Pension | 7. Women's Welfare | 8. Other`,

    fetchingSchemes: `🔍 Searching for relevant government schemes based on your profile...`,

    noSchemesFound:
      `🔍 *No direct matches found in our current catalogue*\n\n` +
      `We searched our catalogue for your criteria, but did not find an exact match at this time.\n\n` +
      `*Important:* This does *not* mean you are ineligible for government assistance! Our catalogue is continuously expanding.\n\n` +
      `👉 You can:\n` +
      `• Visit the official National Portal: https://www.myscheme.gov.in\n` +
      `• Type *RESTART* to search with different criteria.\n` +
      `• Type *BACK* to modify your last answer.`,

    resultsHeader: (count: number) =>
      `🎉 *We found ${count} relevant government ${count === 1 ? 'scheme' : 'schemes'} for you!*\n\n` +
      `Here are the verified details:`,

    schemeItem: {
      purpose: '📝 *Purpose:*',
      benefits: '💰 *Key Benefits:*',
      eligibility: '👥 *Eligibility Summary:*',
      documents: '📄 *Required Documents:*',
      application: '🚀 *How to Apply:*',
      officialLink: '🔗 *Official Portal:*',
      lastVerified: '🗓️ *Verified:*',
    },

    disclaimer:
      `⚠️ *Notice:* Matches are guidance suggestions based on available data. Scheme Saathi does not determine official government eligibility. Please verify official rules and guidelines on the government portal before submitting applications.\n\n` +
      `Commands: Type *RESTART* to search again | *HELP* for command list.`,

    helpMessage:
      `ℹ️ *Scheme Saathi Commands:*\n\n` +
      `• *BACK* - Go back to the previous question\n` +
      `• *RESTART* - Start the conversation from the beginning\n` +
      `• *STOP* - Revoke consent and erase current session data\n` +
      `• *HELP* - Show this instructions menu`,

    backAcknowledgment: (stepName: string) =>
      `↩️ Going back to *${stepName}*.`,

    cannotGoBack: `ℹ️ You are at the first step. There is no earlier question to go back to. Type *RESTART* to start over.`,

    restartPrompt: `🔄 Starting a fresh conversation...`,

    serviceError:
      `⚠️ Our scheme discovery service is temporarily experiencing a delay. Please try again in a few moments.\n\n` +
      `Type *RESTART* to begin again.`,

    occupationOptions: {
      Farmer: 'Farmer',
      Student: 'Student',
      Worker: 'Worker',
      'Business Owner': 'Business Owner',
      Other: 'Other',
    },

    categoryOptions: {
      Agriculture: 'Agriculture',
      Education: 'Education',
      Employment: 'Employment',
      Housing: 'Housing',
      Healthcare: 'Healthcare',
      Pension: 'Pension',
      "Women's Welfare": "Women's Welfare",
      Other: 'Other',
    },
  },

  hi: {
    welcome:
      `*स्कीम साथी* (Scheme Saathi) में आपका स्वागत है! 🇮🇳\n\n` +
      `मैं आपको आपके लिए उपयुक्त सरकारी योजनाएं खोजने, पात्रता समझने और आवेदन प्रक्रिया जानने में मदद कर सकता हूँ।\n\n` +
      `कृपया अपनी पसंदीदा भाषा चुनें / Please choose your language / ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:\n` +
      `1. हिंदी (Hindi)\n` +
      `2. English\n` +
      `3. ಕನ್ನಡ (Kannada)`,

    selectLanguage:
      `कृपया हिंदी के लिए *1*, अंग्रेजी के लिए *2*, या कन्नड़ के लिए *3* भेजें।`,

    consentPrompt:
      `*गोपनीयता और सहमति सूचना* 🔒\n\n` +
      `उपयुक्त सरकारी योजनाएं खोजने के लिए, मुझे आपके राज्य, आयु और व्यवसाय जैसी कुछ बुनियादी जानकारियों की आवश्यकता होगी। यदि आप सहमत हैं, तो आपके उत्तर हमारी योजना-मिलान सेवा को भेजे जा सकते हैं और एक पूछताछ के रूप में सहेजे जा सकते हैं।\n\n` +
      `हम कभी भी आधार नंबर, बैंक विवरण, ओटीपी, पासवर्ड या दस्तावेज़ अपलोड नहीं मांगते हैं।\n\n` +
      `क्या आप सहमति देते हैं?\n` +
      `1. हाँ (Yes)\n` +
      `2. नहीं (No)\n\n` +
      `_(सहमति वापस लेने और डेटा मिटाने के लिए आप कभी भी *STOP* भेज सकते हैं)_`,

    consentDeclined:
      `समझा गया। आपने व्यक्तिगत जानकारी साझा न करने का विकल्प चुना है। 🛡️\n\n` +
      `आप अभी भी सामान्य जानकारी पूछ सकते हैं:\n` +
      `• कभी भी दोबारा शुरू करने के लिए *START* लिखें।\n` +
      `• आदेशों की सूची के लिए *HELP* लिखें।\n` +
      `• सीधे योजनाओं के लिए आधिकारिक पोर्टल पर जाएं: https://www.myscheme.gov.in`,

    consentRevoked:
      `आपकी सहमति रद्द कर दी गई है और आपका सत्र डेटा मिटा दिया गया है। 🛑\n\n` +
      `आपकी कोई भी व्यक्तिगत जानकारी सहेजी नहीं गई है। यदि पहले कोई पूछताछ सबमिट हुई थी, तो आप उसे हटाने के लिए सहायता टीम से संपर्क कर सकते हैं।\n\n` +
      `नया सत्र शुरू करने के लिए कभी भी *START* या *नमस्ते* लिखें।`,

    askState:
      `*प्रश्न 1 / 4:* 📍\n` +
      `आप किस भारतीय राज्य या केंद्र शासित प्रदेश में रहते हैं?\n\n` +
      `_(उदाहरण: उत्तर प्रदेश, बिहार, मध्य प्रदेश, राजस्थान, महाराष्ट्र, दिल्ली आदि)_`,

    invalidState:
      `⚠️ हम इस राज्य/केंद्र शासित प्रदेश को पहचान नहीं सके। कृपया सही भारतीय राज्य का नाम लिखकर भेजें (जैसे उत्तर प्रदेश, बिहार, मध्य प्रदेश, दिल्ली, राजस्थान आदि)।\n\n` +
      `_(सुझाव: पिछले प्रश्न पर लौटने के लिए *BACK* या शुरू से शुरू करने के लिए *RESTART* लिखें)_`,

    askAge:
      `*प्रश्न 2 / 4:* 🎂\n` +
      `आपकी आयु (उम्र) कितने वर्ष है?\n\n` +
      `_(कृपया 1 से 120 के बीच एक संख्या लिखें, जैसे: 28)_`,

    invalidAge:
      `⚠️ कृपया अपनी आयु 1 से 120 के बीच की संख्या में लिखें (जैसे: 25)।\n\n` +
      `_(सुझाव: पिछले प्रश्न पर लौटने के लिए *BACK* लिखें)_`,

    askOccupation:
      `*प्रश्न 3 / 4:* 💼\n` +
      `आपका मुख्य व्यवसाय क्या है?\n\n` +
      `1. किसान (Farmer)\n` +
      `2. विद्यार्थी / छात्र (Student)\n` +
      `3. मज़दूर / श्रमिक (Worker)\n` +
      `4. व्यापारी / स्वरोजगार (Business Owner)\n` +
      `5. अन्य (Other)\n\n` +
      `_(1 से 5 में से एक विकल्प संख्या लिखकर भेजें)_`,

    invalidOccupation:
      `⚠️ कृपया 1 से 5 में से कोई एक संख्या चुनें:\n` +
      `1. किसान | 2. विद्यार्थी | 3. श्रमिक | 4. व्यापारी | 5. अन्य`,

    askCategory:
      `*प्रश्न 4 / 4:* 🎯\n` +
      `आप किस श्रेणी की सरकारी सहायता में रुचि रखते हैं?\n\n` +
      `1. कृषि (Agriculture)\n` +
      `2. शिक्षा (Education)\n` +
      `3. रोजगार व कौशल (Employment)\n` +
      `4. आवास (Housing)\n` +
      `5. स्वास्थ्य व चिकित्सा (Healthcare)\n` +
      `6. पेंशन व सामाजिक सुरक्षा (Pension)\n` +
      `7. महिला कल्याण (Women's Welfare)\n` +
      `8. अन्य (Other)\n\n` +
      `_(1 से 8 में से एक विकल्प संख्या लिखकर भेजें)_`,

    invalidCategory:
      `⚠️ कृपया 1 से 8 में से कोई एक संख्या लिखकर भेजें:\n` +
      `1. कृषि | 2. शिक्षा | 3. रोजगार | 4. आवास | 5. स्वास्थ्य | 6. पेंशन | 7. महिला कल्याण | 8. अन्य`,

    fetchingSchemes: `🔍 आपकी जानकारी के आधार पर उपयुक्त सरकारी योजनाओं की खोज की जा रही है...`,

    noSchemesFound:
      `🔍 *हमारी वर्तमान सूची में कोई सीधा मिलान नहीं मिला*\n\n` +
      `हमने आपकी जानकारी के अनुसार खोज की, परंतु इस समय कोई सीधी योजना नहीं मिली।\n\n` +
      `*महत्वपूर्ण:* इसका अर्थ यह *कदापि नहीं* है कि आप सरकारी सहायता के पात्र नहीं हैं! हमारी सूची लगातार अपडेट की जा रही है।\n\n` +
      `👉 आप:\n` +
      `• आधिकारिक राष्ट्रीय पोर्टल देख सकते हैं: https://www.myscheme.gov.in\n` +
      `• अन्य विकल्पों के साथ खोजने के लिए *RESTART* लिखें।\n` +
      `• पिछला उत्तर बदलने के लिए *BACK* लिखें।`,

    resultsHeader: (count: number) =>
      `🎉 *हमें आपके लिए ${count} उपयुक्त सरकारी ${count === 1 ? 'योजना' : 'योजनाएं'} मिली हैं!*\n\n` +
      `सत्यापित विवरण नीचे दिए गए हैं:`,

    schemeItem: {
      purpose: '📝 *उद्देश्य:*',
      benefits: '💰 *मुख्य लाभ:*',
      eligibility: '👥 *पात्रता संक्षेप:*',
      documents: '📄 *आवश्यक दस्तावेज़:*',
      application: '🚀 *आवेदन कैसे करें:*',
      officialLink: '🔗 *आधिकारिक पोर्टल:*',
      lastVerified: '🗓️ *सत्यापित:*',
    },

    disclaimer:
      `⚠️ *सूचना:* ये परिणाम उपलब्ध जानकारी पर आधारित मार्गदर्शन सुझाव हैं। स्कीम साथी आधिकारिक पात्रता निर्धारित नहीं करता है। कृपया आवेदन करने से पूर्व आधिकारिक पोर्टल पर सभी नियमों की पुष्टि अवश्य करें।\n\n` +
      `कमांड: दोबारा खोजने के लिए *RESTART* लिखें | सहायता के लिए *HELP* लिखें।`,

    helpMessage:
      `ℹ️ *स्कीम साथी सहायता निर्देश:*\n\n` +
      `• *BACK* - पिछले प्रश्न पर वापस जाएं\n` +
      `• *RESTART* - शुरू से बातचीत प्रारंभ करें\n` +
      `• *STOP* - सहमति रद्द करें और डेटा मिटाएं\n` +
      `• *HELP* - यह निर्देश संदेश देखें`,

    backAcknowledgment: (stepName: string) =>
      `↩️ वापस *${stepName}* पर जा रहे हैं।`,

    cannotGoBack: `ℹ️ आप पहले प्रश्न पर हैं। इससे पहले कोई प्रश्न नहीं है। शुरू से शुरू करने के लिए *RESTART* लिखें।`,

    restartPrompt: `🔄 नई बातचीत शुरू की जा रही है...`,

    serviceError:
      `⚠️ हमारी योजना सेवा में अस्थायी रुकावट आ रही है। कृपया कुछ क्षणों बाद पुनः प्रयास करें।\n\n` +
      `दोबारा शुरू करने के लिए *RESTART* लिखें।`,

    occupationOptions: {
      Farmer: 'किसान',
      Student: 'विद्यार्थी',
      Worker: 'श्रमिक/मज़दूर',
      'Business Owner': 'व्यापारी/स्वरोजगार',
      Other: 'अन्य',
    },

    categoryOptions: {
      Agriculture: 'कृषि',
      Education: 'शिक्षा',
      Employment: 'रोजगार',
      Housing: 'आवास',
      Healthcare: 'स्वास्थ्य',
      Pension: 'पेंशन',
      "Women's Welfare": 'महिला कल्याण',
      Other: 'अन्य',
    },
  },

  kn: {
    welcome:
      `*ಸ್ಕೀಮ್ ಸಾಥಿ* (Scheme Saathi) ಗೆ ಸುಸ್ವಾಗತ! 🇮🇳\n\n` +
      `ನಿಮಗೆ ಸರಿಹೊಂದುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಲು, ಅರ್ಹತಾ ನಿಯಮಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಹಂತಗಳನ್ನು ತಿಳಿಯಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.\n\n` +
      `ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Please choose your preferred language / कृपया अपनी भाषा चुनें:\n` +
      `1. Hindi (हिंदी)\n` +
      `2. English\n` +
      `3. Kannada (ಕನ್ನಡ)`,

    selectLanguage:
      `ದಯವಿಟ್ಟು ಹಿಂದಿಗಾಗಿ *1*, ಇಂಗ್ಲಿಷ್‌ಗಾಗಿ *2*, ಅಥವಾ ಕನ್ನಡಕ್ಕಾಗಿ *3* ಎಂದು ಉತ್ತರಿಸಿ.`,

    consentPrompt:
      `*ಗೌಪ್ಯತೆ ಮತ್ತು ಸಮ್ಮತಿ ಸೂಚನೆ* 🔒\n\n` +
      `ನಿಮಗೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು, ನಿಮ್ಮ ರಾಜ್ಯ, ವಯಸ್ಸು ಮತ್ತು ವೃತ್ತಿಯಂತಹ ಕೆಲವು ಮೂಲಭೂತ ವಿವರಗಳು ನಮಗೆ ಬೇಕಾಗುತ್ತವೆ. ನೀವು ಒಪ್ಪಿದರೆ, ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ನಮ್ಮ ಯೋಜನೆ ಹೊಂದಾಣಿಕೆ ಸೇವೆಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.\n\n` +
      `ನಾವು ಎಂದಿಗೂ ಆಧಾರ್ ಸಂಖ್ಯೆ, ಬ್ಯಾಂಕ್ ವಿವರಗಳು, ಒಟಿಪಿ ಅಥವಾ ದಾಖಲೆಗಳ ಅಪ್‌ಲೋಡ್ ಕೇಳುವುದಿಲ್ಲ.\n\n` +
      `ನೀವು ಸಮ್ಮತಿಸುತ್ತೀರಾ?\n` +
      `1. ಹೌದು (Yes)\n` +
      `2. ಇಲ್ಲ (No)\n\n` +
      `_(ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಲು ಮತ್ತು ಸೆಷನ್ ಡೇಟಾವನ್ನು ಅಳಿಸಲು ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ *STOP* ಎಂದು ಕಳುಹಿಸಬಹುದು)_`,

    consentDeclined:
      `ಅರ್ಥವಾಯಿತು. ನೀವು ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳದಿರಲು ನಿರ್ಧರಿಸಿದ್ದೀರಿ. 🛡️\n\n` +
      `ನೀವು ಇನ್ನೂ ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು ಅಥವಾ ಆಜ್ಞೆಗಳನ್ನು ಬಳಸಬಹುದು:\n` +
      `• ಹೊಸದಾಗಿ ಪ್ರಾರಂಭಿಸಲು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ *START* ಎಂದು ಟೈಪ್ ಮಾಡಿ.\n` +
      `• ಆಜ್ಞೆಗಳ ಪಟ್ಟಿಗಾಗಿ *HELP* ಎಂದು ಟೈಪ್ ಮಾಡಿ.\n` +
      `• ನೇರ ಮಾಹಿತಿಗಾಗಿ ಅಧಿಕೃತ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್: https://www.myscheme.gov.in ಗೆ ಭೇಟಿ ನೀಡಿ.`,

    consentRevoked:
      `ನಿಮ್ಮ ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಲಾಗಿದೆ ಮತ್ತು ಸೆಷನ್ ಡೇಟಾವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಲಾಗಿದೆ. 🛑\n\n` +
      `ಯಾವುದೇ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗಿಲ್ಲ.\n\n` +
      `ಹೊಸ ಸೆಷನ್ ಪ್ರಾರಂಭಿಸಲು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ *START* ಅಥವಾ *ನಮಸ್ಕಾರ* ಎಂದು ಟೈಪ್ ಮಾಡಿ.`,

    askState:
      `*ಪ್ರಶ್ನೆ 1 / 4:* 📍\n` +
      `ನೀವು ಯಾವ ಭಾರತೀಯ ರಾಜ್ಯ ಅಥವಾ ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ?\n\n` +
      `_(ಉದಾಹರಣೆಗೆ: ಕರ್ನಾಟಕ, ಮಹಾರಾಷ್ಟ್ರ, ತಮಿಳುನಾಡು, ಆಂಧ್ರಪ್ರದೇಶ, ದೆಹಲಿ, ಇತ್ಯಾದಿ)_`,

    invalidState:
      `⚠️ ಈ ರಾಜ್ಯ ಅಥವಾ ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶವನ್ನು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಭಾರತೀಯ ರಾಜ್ಯದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಉದಾ: ಕರ್ನಾಟಕ, ಮಹಾರಾಷ್ಟ್ರ, ತಮಿಳುನಾಡು, ದೆಹಲಿ, ಇತ್ಯಾದಿ).\n\n` +
      `_(ಸಲಹೆ: ಹಿಂದಿನ ಪ್ರಶ್ನೆಗೆ ಮರಳಲು *BACK* ಅಥವಾ ಪುನರಾರಂಭಿಸಲು *RESTART* ಎಂದು ಟೈಪ್ ಮಾಡಿ)_`,

    askAge:
      `*ಪ್ರಶ್ನೆ 2 / 4:* 🎂\n` +
      `ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು ವರ್ಷಗಳು?\n\n` +
      `_(ದಯವಿಟ್ಟು 1 ರಿಂದ 120 ರ ನಡುವಿನ ಪೂರ್ಣಾಂಕ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ, ಉದಾ: 28)_`,

    invalidAge:
      `⚠️ ದಯವಿಟ್ಟು 1 ರಿಂದ 120 ರ ನಡುವಿನ ಸರಿಯಾದ ವಯಸ್ಸನ್ನು ಸಂಖ್ಯೆಯಲ್ಲಿ ನಮೂದಿಸಿ (ಉದಾ: 28).\n\n` +
      `_(ಸಲಹೆ: ಹಿಂದಿನ ಪ್ರಶ್ನೆಗೆ ಮರಳಲು *BACK* ಎಂದು ಉತ್ತರಿಸಿ)_`,

    askOccupation:
      `*ಪ್ರಶ್ನೆ 3 / 4:* 💼\n` +
      `ನಿಮ್ಮ ಮುಖ್ಯ ವೃತ್ತಿ ಯಾವುದು?\n\n` +
      `1. ರೈತ (Farmer)\n` +
      `2. ವಿದ್ಯಾರ್ಥಿ (Student)\n` +
      `3. ಕಾರ್ಮಿಕ / ಕೂಲಿ ಕಾರ್ಮಿಕ (Worker)\n` +
      `4. ವ್ಯಾಪಾರಿ / ಸ್ವಯಂ ಉದ್ಯೋಗಿ (Business Owner)\n` +
      `5. ಇತರೆ (Other)\n\n` +
      `_(1 ರಿಂದ 5 ರ ನಡುವಿನ ಆಯ್ಕೆ ಸಂಖ್ಯೆಯನ್ನು ಕಳುಹಿಸಿ)_`,

    invalidOccupation:
      `⚠️ ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೃತ್ತಿಗೆ ಸರಿಹೊಂದುವಂತೆ 1 ರಿಂದ 5 ರ ನಡುವಿನ ಸಂಖ್ಯೆಯನ್ನು ಆರಿಸಿ ಕಳುಹಿಸಿ:\n` +
      `1. ರೈತ | 2. ವಿದ್ಯಾರ್ಥಿ | 3. ಕಾರ್ಮಿಕ | 4. ವ್ಯಾಪಾರಿ | 5. ಇತರೆ`,

    askCategory:
      `*ಪ್ರಶ್ನೆ 4 / 4:* 🎯\n` +
      `ನೀವು ಯಾವ ವರ್ಗದ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ / ನೆರವಿನಲ್ಲಿ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಿ?\n\n` +
      `1. ಕೃಷಿ (Agriculture)\n` +
      `2. ಶಿಕ್ಷಣ (Education)\n` +
      `3. ಉದ್ಯೋಗ ಮತ್ತು ಕೌಶಲ್ಯ (Employment)\n` +
      `4. ವಸತಿ (Housing)\n` +
      `5. ಆರೋಗ್ಯ ಮತ್ತು ಚಿಕಿತ್ಸೆ (Healthcare)\n` +
      `6. ಪಿಂಚಣಿ ಮತ್ತು ಸಾಮಾಜಿಕ ಭದ್ರತೆ (Pension)\n` +
      `7. ಮಹಿಳಾ ಕಲ್ಯಾಣ (Women's Welfare)\n` +
      `8. ಇತರೆ / ಸಾಮಾನ್ಯ (Other)\n\n` +
      `_(1 ರಿಂದ 8 ರ ನಡುವಿನ ಆಯ್ಕೆ ಸಂಖ್ಯೆಯನ್ನು ಕಳುಹಿಸಿ)_`,

    invalidCategory:
      `⚠️ ದಯವಿಟ್ಟು 1 ರಿಂದ 8 ರ ನಡುವಿನ ಸಂಖ್ಯೆಯನ್ನು ಆರಿಸಿ ಕಳುಹಿಸಿ:\n` +
      `1. ಕೃಷಿ | 2. ಶಿಕ್ಷಣ | 3. ಉದ್ಯೋಗ | 4. ವಸತಿ | 5. ಆರೋಗ್ಯ | 6. ಪಿಂಚಣಿ | 7. ಮಹಿಳಾ ಕಲ್ಯಾಣ | 8. ಇತರೆ`,

    fetchingSchemes: `🔍 ನಿಮ್ಮ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಸೂಕ್ತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...`,

    noSchemesFound:
      `🔍 *ನಮ್ಮ ಪ್ರಸ್ತುತ ಪಟ್ಟಿಯಲ್ಲಿ ನೇರ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ*\n\n` +
      `ನಾವು ನಿಮ್ಮ ವಿವರಗಳ ಪ್ರಕಾರ ಹುಡುಕಿದೆವು, ಆದರೆ ಪ್ರಸ್ತುತ ಯಾವುದೇ ನೇರ ಯೋಜನೆ ಸಿಗಲಿಲ್ಲ.\n\n` +
      `*ಪ್ರಮುಖ ಸೂಚನೆ:* ಇದರರ್ಥ ನೀವು ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳಿಗೆ ಅರ್ಹರಲ್ಲ ಎಂದರ್ಥವಲ್ಲ! ನಮ್ಮ ಯೋಜನಾ ಪಟ್ಟಿಯನ್ನು ನಿರಂತರವಾಗಿ ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ.\n\n` +
      `👉 ನೀವು:\n` +
      `• ಅಧಿಕೃತ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್ ಭೇಟಿ ನೀಡಿ: https://www.myscheme.gov.in\n` +
      `• ಹೊಸ ಮಾನದಂಡಗಳೊಂದಿಗೆ ಹುಡುಕಲು *RESTART* ಎಂದು ಟೈಪ್ ಮಾಡಿ.\n` +
      `• ಕೊನೆಯ ಉತ್ತರ ಬದಲಾಯಿಸಲು *BACK* ಎಂದು ಉತ್ತರಿಸಿ.`,

    resultsHeader: (count: number) =>
      `🎉 *ನಿಮಗಾಗಿ ${count} ಸೂಕ್ತ ಸರ್ಕಾರಿ ${count === 1 ? 'ಯೋಜನೆ' : 'ಯೋಜನೆಗಳು'} ಕಂಡುಬಂದಿವೆ!*\n\n` +
      `ಪರಿಶೀಲಿಸಿದ ಅಧಿಕೃತ ವಿವರಗಳು ಕೆಳಗಿವೆ:`,

    schemeItem: {
      purpose: '📝 *ಉದ್ದೇಶ:*',
      benefits: '💰 *ಪ್ರಮುಖ ಸೌಲಭ್ಯಗಳು/ಲಾಭಗಳು:*',
      eligibility: '👥 *ಅರ್ಹತಾ ಸಾರಾಂಶ:*',
      documents: '📄 *ಅಗತ್ಯ ದಾಖಲೆಗಳು:*',
      application: '🚀 *ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ:*',
      officialLink: '🔗 *ಅಧಿಕೃತ ಪೋರ್ಟಲ್:*',
      lastVerified: '🗓️ *ಪರಿಶೀಲಿಸಲಾಗಿದೆ:*',
    },

    disclaimer:
      `⚠️ *ಸೂಚನೆ:* ಈ ಫಲಿತಾಂಶಗಳು ಲಭ್ಯವಿರುವ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲಿನ ಮಾರ್ಗದರ್ಶನ ಸಲಹೆಗಳಾಗಿವೆ. ಸ್ಕೀಮ್ ಸಾಥಿ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಅರ್ಹತೆಯನ್ನು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.\n\n` +
      `ಆಜ್ಞೆಗಳು: ಮತ್ತೆ ಹುಡುಕಲು *RESTART* ಎಂದು ಟೈಪ್ ಮಾಡಿ | ಆಜ್ಞೆಗಳ ಪಟ್ಟಿಗಾಗಿ *HELP* ಎಂದು ಟೈಪ್ ಮಾಡಿ.`,

    helpMessage:
      `ℹ️ *ಸ್ಕೀಮ್ ಸಾಥಿ ಆಜ್ಞೆಗಳ ಮಾರ್ಗದರ್ಶಿ:*\n\n` +
      `• *BACK* - ಹಿಂದಿನ ಪ್ರಶ್ನೆಗೆ ಹಿಂತಿರುಗಿ\n` +
      `• *RESTART* - ಪ್ರಾರಂಭದಿಂದ ಮತ್ತೆ ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ\n` +
      `• *STOP* - ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಿರಿ ಮತ್ತು ಸೆಷನ್ ಡೇಟಾ ಅಳಿಸಿ\n` +
      `• *HELP* - ಈ ಸಹಾಯ ಸಂದೇಶವನ್ನು ತೋರಿಸಿ`,

    backAcknowledgment: (stepName: string) =>
      `↩️ ಹಿಂದಿನ ಹಂತ *${stepName}* ಗೆ ಹಿಂತಿರುಗುತ್ತಿದ್ದೇವೆ.`,

    cannotGoBack: `ℹ️ ನೀವು ಮೊದಲ ಹಂತದಲ್ಲಿದ್ದೀರಿ. ಹಿಂತಿರುಗಲು ಹಿಂದಿನ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ. ಆರಂಭದಿಂದ ಪ್ರಾರಂಭಿಸಲು *RESTART* ಎಂದು ಟೈಪ್ ಮಾಡಿ.`,

    restartPrompt: `🔄 ಹೊಸ ಸಂಭಾಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ...`,

    serviceError:
      `⚠️ ನಮ್ಮ ಯೋಜನಾ ಸೇವೆಯಲ್ಲಿ ತಾತ್ಕಾಲಿಕ ಅಡಚಣೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.\n\n` +
      `ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಲು *RESTART* ಎಂದು ಟೈಪ್ ಮಾಡಿ.`,

    occupationOptions: {
      Farmer: 'ರೈತ',
      Student: 'ವಿದ್ಯಾರ್ಥಿ',
      Worker: 'ಕಾರ್ಮಿಕ / ಕೂಲಿ ಕಾರ್ಮಿಕ',
      'Business Owner': 'ವ್ಯಾಪಾರಿ / ಸ್ವಯಂ ಉದ್ಯೋಗಿ',
      Other: 'ಇತರೆ',
    },

    categoryOptions: {
      Agriculture: 'ಕೃಷಿ',
      Education: 'ಶಿಕ್ಷಣ',
      Employment: 'ಉದ್ಯೋಗ',
      Housing: 'ವಸತಿ',
      Healthcare: 'ಆರೋಗ್ಯ',
      Pension: 'ಪಿಂಚಣಿ',
      "Women's Welfare": 'ಮಹಿಳಾ ಕಲ್ಯಾಣ',
      Other: 'ಇತರೆ',
    },
  },
};

/**
 * Normalizes input string for state matching
 */
export function matchIndianState(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Check direct regional script aliases (Kannada & Devanagari)
  const regionalAliases: Record<string, string> = {
    // Kannada
    'ಕರ್ನಾಟಕ': 'Karnataka',
    'ಕರ್ನಾಟಕದ': 'Karnataka',
    'ಕೇರಳ': 'Kerala',
    'ತಮಿಳುನಾಡು': 'Tamil Nadu',
    'ಆಂಧ್ರ ಪ್ರದೇಶ': 'Andhra Pradesh',
    'ಆಂಧ್ರಪ್ರದೇಶ': 'Andhra Pradesh',
    'ತೆಲಂಗಾಣ': 'Telangana',
    'ಮಹಾರಾಷ್ಟ್ರ': 'Maharashtra',
    'ಗೋವಾ': 'Goa',
    'ದೆಹಲಿ': 'Delhi',
    'ಉತ್ತರ ಪ್ರದೇಶ': 'Uttar Pradesh',
    'ಉತ್ತರಪ್ರದೇಶ': 'Uttar Pradesh',
    'ಮಧ್ಯ ಪ್ರದೇಶ': 'Madhya Pradesh',
    'ಮಧ್ಯಪ್ರದೇಶ': 'Madhya Pradesh',
    'ರಾಜಸ್ಥಾನ': 'Rajasthan',
    'ಗುಜರಾತ್': 'Gujarat',
    'ಪಂಜಾಬ್': 'Punjab',
    'ಹರಿಯಾಣ': 'Haryana',
    'ಬಿಹಾರ': 'Bihar',
    'ಪಶ್ಚಿಮ ಬಂಗಾಳ': 'West Bengal',
    'ಒಡಿಶಾ': 'Odisha',
    'ಅಸ್ಸಾಂ': 'Assam',
    // Hindi / Devanagari
    'कर्नाटक': 'Karnataka',
    'उत्तर प्रदेश': 'Uttar Pradesh',
    'उत्तरप्रदेश': 'Uttar Pradesh',
    'मध्य प्रदेश': 'Madhya Pradesh',
    'मध्यप्रदेश': 'Madhya Pradesh',
    'महाराष्ट्र': 'Maharashtra',
    'बिहार': 'Bihar',
    'राजस्थान': 'Rajasthan',
    'दिल्ली': 'Delhi',
    'गुजरात': 'Gujarat',
    'पंजाब': 'Punjab',
    'हरियाणा': 'Haryana',
    'पश्चिम बंगाल': 'West Bengal',
    'केरल': 'Kerala',
    'तमिलनाडु': 'Tamil Nadu',
    'आंध्र प्रदेश': 'Andhra Pradesh',
    'तेलंगाना': 'Telangana',
    'ओडिशा': 'Odisha',
    'झारखंड': 'Jharkhand',
    'छत्तीसगढ़': 'Chhattisgarh',
    'उत्तराखंड': 'Uttarakhand',
    'हिमाचल प्रदेश': 'Himachal Pradesh',
    'असम': 'Assam',
    'गोवा': 'Goa',
  };

  const lowerRaw = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(regionalAliases)) {
    if (lowerRaw.includes(key.toLowerCase())) {
      return val;
    }
  }

  // 2. English / transliterated matching
  const cleaned = lowerRaw.replace(/[^a-z\s]/g, '');
  if (!cleaned) return null;

  // Exact or contains match in list
  for (const state of INDIAN_STATES_AND_UTS) {
    const sLower = state.toLowerCase();
    if (cleaned === sLower || sLower.includes(cleaned) || cleaned.includes(sLower)) {
      return state;
    }
  }

  // Common Hindi / transliterated aliases
  const aliases: Record<string, string> = {
    up: 'Uttar Pradesh',
    'uttar pradesh': 'Uttar Pradesh',
    uttarpradesh: 'Uttar Pradesh',
    mp: 'Madhya Pradesh',
    'madhya pradesh': 'Madhya Pradesh',
    madhyapradesh: 'Madhya Pradesh',
    mh: 'Maharashtra',
    maharashtra: 'Maharashtra',
    dl: 'Delhi',
    delhi: 'Delhi',
    ncr: 'Delhi',
    newdelhi: 'Delhi',
    'new delhi': 'Delhi',
    wb: 'West Bengal',
    'west bengal': 'West Bengal',
    bengal: 'West Bengal',
    tn: 'Tamil Nadu',
    'tamil nadu': 'Tamil Nadu',
    tamilnadu: 'Tamil Nadu',
    ka: 'Karnataka',
    karnataka: 'Karnataka',
    rj: 'Rajasthan',
    rajasthan: 'Rajasthan',
    br: 'Bihar',
    bihar: 'Bihar',
    gj: 'Gujarat',
    gujarat: 'Gujarat',
    pb: 'Punjab',
    punjab: 'Punjab',
    hr: 'Haryana',
    haryana: 'Haryana',
    kl: 'Kerala',
    kerala: 'Kerala',
    ap: 'Andhra Pradesh',
    'andhra pradesh': 'Andhra Pradesh',
    ts: 'Telangana',
    telangana: 'Telangana',
    od: 'Odisha',
    odisha: 'Odisha',
    orissa: 'Odisha',
    jh: 'Jharkhand',
    jharkhand: 'Jharkhand',
    cg: 'Chhattisgarh',
    chhattisgarh: 'Chhattisgarh',
    chattisgarh: 'Chhattisgarh',
    uk: 'Uttarakhand',
    uttarakhand: 'Uttarakhand',
    uttaranchal: 'Uttarakhand',
    hp: 'Himachal Pradesh',
    'himachal pradesh': 'Himachal Pradesh',
    ga: 'Goa',
    goa: 'Goa',
    as: 'Assam',
    assam: 'Assam',
    jk: 'Jammu and Kashmir',
    'jammu and kashmir': 'Jammu and Kashmir',
    'jammu & kashmir': 'Jammu and Kashmir',
    kashmir: 'Jammu and Kashmir',
  };

  if (aliases[cleaned]) {
    return aliases[cleaned];
  }

  return null;
}
