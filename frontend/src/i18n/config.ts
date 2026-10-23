import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export interface SupportedLanguage {
  code: string;
  name: string;
  native: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', native: 'English', speechCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', speechCode: 'mr-IN' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', speechCode: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'ur', name: 'Urdu', native: 'اردو', speechCode: 'ur-IN' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', speechCode: 'or-IN' },
];

export const resources: Record<string, any> = {
  en: {
    translation: {
      nav: {
        home: "Home",
        categories: "Categories",
        states: "States/UTs",
        ministries: "Central Ministries",
        findScheme: "Find Schemes for You",
        allSchemes: "All Schemes",
        cscPortal: "CSC Portal",
        about: "About SETU",
        login: "Citizen Sign In",
        chatWithAI: "SETU AI Assistant",
        searchPlaceholder: "Enter a scheme name (e.g. PM Kisan, Vidyasiri, Scholarships...)",
        govtOfIndia: "Government of India"
      },
      hero: {
        title: "Discover Government Schemes Made For You",
        subtitle: "3,000+ central and state government welfare schemes. Find your eligible entitlements in minutes with AI.",
        searchPlaceholder: "Search schemes by name, eligibility, or benefit...",
        listening: "Listening...",
        speakNow: "Speak or type your requirement",
        findBtn: "Find Eligible Schemes",
        dontKnowTitle: "Don't know where to start?",
        dontKnowSub: "Answer 5 simple questions. SETU scans 3000+ schemes for your profile."
      },
      stats: {
        schemesCount: "3,000+ Schemes",
        statesCount: "36 States & UTs",
        categoriesCount: "20+ Categories",
        citizensHelped: "50L+ Citizens Helped"
      },
      cards: {
        viewDetails: "View Details",
        saveScheme: "Save",
        checkEligibility: "Check Eligibility",
        applyNow: "Apply on Official Portal",
        downloadPdf: "Download Checklist PDF",
        matchBadge: "Eligible Match",
        centralGovt: "Central Government",
        stateGovt: "State Government",
        exploreAll: "Explore All"
      },
      wizard: {
        title: "Eligibility Wizard",
        subtitle: "Personalized Welfare Scheme Discovery in 4 Steps",
        step1: "Basic Profile",
        step2: "Household & Income",
        step3: "Needs & Services",
        step4: "Eligible Schemes",
        ageLabel: "How old are you?",
        genderLabel: "What is your gender?",
        stateLabel: "Which state do you live in?",
        disabilityLabel: "Are you differently abled (PwD)?",
        incomeLabel: "What is your approximate annual household income?",
        casteLabel: "Social Category",
        bplLabel: "Do you hold a BPL Ration Card?",
        needsLabel: "What services or support do you need?",
        resultsFound: "Found matching schemes for your profile",
        next: "Next Step",
        prev: "Previous",
        showResults: "Find My Eligible Schemes"
      },
      chat: {
        title: "SETU AI Multilingual Assistant",
        status: "Online & Ready to Assist",
        welcomeTitle: "Namaste! I am SETU, your citizen welfare AI advisor.",
        welcomeBody: "I can assist you to:\n- Find welfare schemes you are eligible for\n- Explain document requirements step-by-step\n- Check DBT subsidy status and application links\n- Guide you in 12+ Indian languages",
        inputPlaceholder: "Ask in any Indian language (e.g. Find schemes for girl child education)...",
        send: "Send",
        voicePrompt: "Click microphone to speak"
      },
      categoriesPage: {
        title: "Browse Welfare Schemes by Category",
        subtitle: "Explore over 3,000+ social welfare initiatives organized across specialized citizen focus areas.",
        schemesAvailable: "Schemes Available",
        viewSchemes: "View Schemes"
      },
      statesPage: {
        title: "State & Union Territory Schemes Directory",
        subtitle: "Discover localized state welfare programs, direct benefit transfer schemes, and state department portals across 36 States & UTs.",
        searchState: "Search state or union territory...",
        viewStateSchemes: "Explore State Schemes"
      },
      ministriesPage: {
        title: "Central Government Ministries & Departments",
        subtitle: "Comprehensive directory of schemes, missions, and welfare portals spearheaded by Central Government Ministries.",
        searchMinistry: "Search ministry or department...",
        viewMinistrySchemes: "View Ministry Schemes"
      },
      footer: {
        copyright: "2026 SETU | Government of India",
        ownership: "Contents owned and maintained by participating Central & State Ministries",
        nic: "Designed with National Informatics Centre (NIC) guidelines | Data harmonized with MyScheme",
        gigw: "GIGW Compliant | WCAG 2.0 AA Accessible"
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: "होम",
        categories: "श्रेणियां",
        states: "राज्य/केंद्र शासित",
        ministries: "केंद्रीय मंत्रालय",
        findScheme: "पात्र योजनाएं खोजें",
        allSchemes: "सभी योजनाएं",
        cscPortal: "सीएससी पोर्टल",
        about: "सेतु परिचय",
        login: "नागरिक लॉगिन",
        chatWithAI: "सेतु एआई सहायक",
        searchPlaceholder: "योजना का नाम खोजें (उदा. पीएम किसान, छात्रवृत्ति, आवास...)",
        govtOfIndia: "भारत सरकार"
      },
      hero: {
        title: "अपने लिए सही सरकारी योजनाएं खोजें",
        subtitle: "3,000+ केंद्र और राज्य सरकार की कल्याणकारी योजनाएं। एआई के साथ मिनटों में अपनी पात्रता जानें।",
        searchPlaceholder: "योजना नाम, पात्रता या लाभ के आधार पर खोजें...",
        listening: "सुन रहे हैं...",
        speakNow: "अपनी आवश्यकता बोलें या टाइप करें",
        findBtn: "पात्र योजनाएं खोजें",
        dontKnowTitle: "शुरुआत कहां से करें?",
        dontKnowSub: "5 आसान सवालों के जवाब दें। सेतु आपकी प्रोफ़ाइल के लिए योजनाएं ढूंढेगा।"
      },
      stats: {
        schemesCount: "3,000+ योजनाएं",
        statesCount: "36 राज्य और केंद्र शासित",
        categoriesCount: "20+ श्रेणियां",
        citizensHelped: "50 लाख+ नागरिक लाभान्वित"
      },
      cards: {
        viewDetails: "विवरण देखें",
        saveScheme: "सहेजें",
        checkEligibility: "पात्रता जांचें",
        applyNow: "आधिकारिक पोर्टल पर आवेदन करें",
        downloadPdf: "दस्तावेज चेकलिस्ट डाउनलोड करें",
        matchBadge: "अनुरूप योजना",
        centralGovt: "केंद्र सरकार",
        stateGovt: "राज्य सरकार",
        exploreAll: "सभी देखें"
      },
      wizard: {
        title: "पात्रता विजार्ड",
        subtitle: "4 चरणों में व्यक्तिगत योजना खोज",
        step1: "बुनियादी विवरण",
        step2: "परिवार और आय",
        step3: "आवश्यकताएं",
        step4: "योग्य योजनाएं",
        ageLabel: "आपकी आयु कितनी है?",
        genderLabel: "आपका लिंग क्या है?",
        stateLabel: "आप किस राज्य में रहते हैं?",
        disabilityLabel: "क्या आप दिव्यांगजन हैं?",
        incomeLabel: "आपकी अनुमानित वार्षिक पारिवारिक आय क्या है?",
        casteLabel: "सामाजिक श्रेणी",
        bplLabel: "क्या आपके पास बीपीएल राशन कार्ड है?",
        needsLabel: "आपको किस प्रकार की सहायता चाहिए?",
        resultsFound: "आपकी प्रोफ़ाइल के अनुसार योजनाएं मिलीं",
        next: "अगला चरण",
        prev: "पिछला",
        showResults: "मेरी योजनाएं दिखाएं"
      },
      chat: {
        title: "सेतु एआई बहुभाषी सहायक",
        status: "सक्रिय और सहायता के लिए तैयार",
        welcomeTitle: "नमस्ते! मैं सेतु हूँ, आपका सरकारी सेवा सलाहकार।",
        welcomeBody: "मैं आपकी सहायता कर सकता हूँ:\n- पात्र सरकारी योजनाओं को खोजने में\n- आवश्यक दस्तावेजों को समझने में\n- डीबीटी सब्सिडी स्थिति और आवेदन लिंक में\n- 12+ भारतीय भाषाओं में बातचीत करने में",
        inputPlaceholder: "अपनी भाषा में पूछें (उदा. बालिका शिक्षा के लिए छात्रवृत्ति)...",
        send: "भेजें",
        voicePrompt: "बोलने के लिए माइक दबाएं"
      },
      categoriesPage: {
        title: "श्रेणी अनुसार सरकारी योजनाएं",
        subtitle: "विभिन्न क्षेत्रों में नागरिकों के कल्याण के लिए 3,000+ से अधिक योजनाओं का अन्वेषण करें।",
        schemesAvailable: "उपलब्ध योजनाएं",
        viewSchemes: "योजनाएं देखें"
      },
      statesPage: {
        title: "राज्य और केंद्र शासित प्रदेश योजना निर्देशिका",
        subtitle: "36 राज्यों और केंद्र शासित प्रदेशों में स्थानीय राज्य योजनाएं, डीबीटी और विभागीय पोर्टल खोजें।",
        searchState: "राज्य या केंद्र शासित प्रदेश खोजें...",
        viewStateSchemes: "राज्य योजनाएं देखें"
      },
      ministriesPage: {
        title: "केंद्रीय मंत्रालय और विभाग",
        subtitle: "केंद्र सरकार के सभी मंत्रालयों द्वारा संचालित प्रमुख राष्ट्रीय मिशन और योजनाएं।",
        searchMinistry: "मंत्रालय खोजें...",
        viewMinistrySchemes: "मंत्रालय की योजनाएं देखें"
      },
      footer: {
        copyright: "2026 सेतु | भारत सरकार",
        ownership: "सामग्री का स्वामित्व संबंधित केंद्रीय एवं राज्य मंत्रालयों के पास है",
        nic: "राष्ट्रीय सूचना विज्ञान केंद्र (एनआईसी) के दिशानिर्देशों के अनुसार निर्मित",
        gigw: "जीआईजीडब्ल्यू अनुपालित | WCAG 2.0 AA"
      }
    }
  },
  kn: {
    translation: {
      nav: {
        home: "ಮುಖಪುಟ",
        categories: "ವಿಭಾಗಗಳು",
        states: "ರಾಜ್ಯಗಳು/ಕೇಂದ್ರಾಡಳಿತ",
        ministries: "ಕೇಂದ್ರ ಸಚಿವಾಲಯಗಳು",
        findScheme: "ಅರ್ಹ ಯೋಜನೆ ಹುಡುಕಿ",
        allSchemes: "ಎಲ್ಲಾ ಯೋಜನೆಗಳು",
        cscPortal: "ಸಿಎಸ್‌ಸಿ ಪೋರ್ಟಲ್",
        about: "ಸೇತು ಪರಿಚಯ",
        login: "ನಾಗರಿಕ ಲಾಗಿನ್",
        chatWithAI: "ಸೇತು ಎಐ ಸಹಾಯಕ",
        searchPlaceholder: "ಯೋಜನೆಯ ಹೆಸರು ಹುಡುಕಿ (ಉದಾ. ಪಿಎಂ ಕಿಸಾನ್, ವಿದ್ಯಾಸಿರಿ, ಸ್ಕಾಲರ್‌ಶಿಪ್...)",
        govtOfIndia: "ಭಾರತ ಸರ್ಕಾರ"
      },
      hero: {
        title: "ನಿಮಗಾಗಿ ರೂಪಿಸಲಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
        subtitle: "3,000+ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಯೋಜನೆಗಳು. ಎಐ ಸಹಾಯದಿಂದ ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ತಿಳಿಯಿರಿ.",
        searchPlaceholder: "ಯೋಜನೆಗಳು, ಅರ್ಹತೆ ಅಥವಾ ಸೌಲಭ್ಯಗಳ ಮೂಲಕ ಹುಡುಕಿ...",
        listening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
        speakNow: "ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಬರೆಯಿರಿ",
        findBtn: "ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
        dontKnowTitle: "ಎಲ್ಲಿಂದ ಪ್ರಾರಂಭಿಸಬೇಕೆಂದು ತಿಳಿಯುತ್ತಿಲ್ಲವೇ?",
        dontKnowSub: "5 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ. ಸೇತು ನಿಮಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ."
      },
      stats: {
        schemesCount: "3,000+ ಯೋಜನೆಗಳು",
        statesCount: "36 ರಾಜ್ಯ ಮತ್ತು ಕೇಂದ್ರಾಡಳಿತಗಳು",
        categoriesCount: "20+ ವಿಭಾಗಗಳು",
        citizensHelped: "50 ಲಕ್ಷ+ ನಾಗರಿಕರಿಗೆ ನೆರವು"
      },
      cards: {
        viewDetails: "ವಿವರ ನೋಡಿ",
        saveScheme: "ಉಳಿಸಿ",
        checkEligibility: "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
        applyNow: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
        downloadPdf: "ದಾಖಲೆಗಳ ಪಟ್ಟಿ ಡೌನ್‌ಲೋಡ್",
        matchBadge: "ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆ",
        centralGovt: "ಕೇಂದ್ರ ಸರ್ಕಾರ",
        stateGovt: "ರಾಜ್ಯ ಸರ್ಕಾರ",
        exploreAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ"
      },
      wizard: {
        title: "ಅರ್ಹತಾ ಮಾರ್ಗದರ್ಶಿ",
        subtitle: "4 ಹಂತಗಳಲ್ಲಿ ನಿಮಗಾಗಿ ಸೂಕ್ತವಾದ ಯೋಜನೆಗಳ ಪತ್ತೆ",
        step1: "ವೈಯಕ್ತಿಕ ವಿವರ",
        step2: "ಕುಟುಂಬ ಮತ್ತು ಆದಾಯ",
        step3: "ಅಗತ್ಯವಿರುವ ಸೇವೆಗಳು",
        step4: "ಅರ್ಹ ಯೋಜನೆಗಳು",
        ageLabel: "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?",
        genderLabel: "ನಿಮ್ಮ ಲಿಂಗ?",
        stateLabel: "ನೀವು ಯಾವ ರಾಜ್ಯದಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ?",
        disabilityLabel: "ನೀವು ವಿಶೇಷ ಚೇತನರೇ?",
        incomeLabel: "ನಿಮ್ಮ ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ಎಷ್ಟು?",
        casteLabel: "ಸಾಮಾಜಿಕ ವರ್ಗ",
        bplLabel: "ನಿಮ್ಮ ಬಳಿ ಬಿಪಿಎಲ್ ಪಡಿತರ ಚೀಟಿ ಇದೆಯೇ?",
        needsLabel: "ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಸಹಾಯ ಬೇಕು?",
        resultsFound: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಸೂಕ್ತವಾದ ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ",
        next: "ಮುಂದಿನ ಹಂತ",
        prev: "ಹಿಂದಿನ ಹಂತ",
        showResults: "ನನ್ನ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಿ"
      },
      chat: {
        title: "ಸೇತು ಎಐ ಬಹುಭಾಷಾ ಸಹಾಯಕ",
        status: "ಸಕ್ರಿಯವಾಗಿದೆ ಮತ್ತು ಸಿದ್ಧವಾಗಿದೆ",
        welcomeTitle: "ನಮಸ್ಕಾರ! ನಾನು ಸೇತು, ನಿಮ್ಮ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಮಾರ್ಗದರ್ಶಿ.",
        welcomeBody: "ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n- ನಿಮಗೆ ಸೂಕ್ತವಾದ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು\n- ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ತಿಳಿಯಲು\n- ಡಿಬಿಟಿ ಪಾವತಿ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಲು\n- 12+ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಮಾರ್ಗದರ್ಶನ",
        inputPlaceholder: "ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ...",
        send: "ಕಳುಹಿಸಿ",
        voicePrompt: "ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ"
      },
      categoriesPage: {
        title: "ವಿಭಾಗವಾರು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
        subtitle: "ವಿವಿಧ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ನಾಗರಿಕ ಕಲ್ಯಾಣಕ್ಕಾಗಿ ರೂಪಿಸಲಾದ 3,000+ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
        schemesAvailable: "ಲಭ್ಯವಿರುವ ಯೋಜನೆಗಳು",
        viewSchemes: "ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ"
      },
      statesPage: {
        title: "ರಾಜ್ಯ ಮತ್ತು ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶಗಳ ಯೋಜನೆಗಳು",
        subtitle: "36 ರಾಜ್ಯಗಳು ಮತ್ತು ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶಗಳ ಸ್ಥಳೀಯ ಯೋಜನೆಗಳು ಮತ್ತು ಪೋರ್ಟಲ್‌ಗಳು.",
        searchState: "ರಾಜ್ಯವನ್ನು ಹುಡುಕಿ...",
        viewStateSchemes: "ರಾಜ್ಯ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ"
      },
      ministriesPage: {
        title: "ಕೇಂದ್ರ ಸಚಿವಾಲಯಗಳು ಮತ್ತು ಇಲಾಖೆಗಳು",
        subtitle: "ಕೇಂದ್ರ ಸರ್ಕಾರದ ವಿವಿಧ ಸಚಿವಾಲಯಗಳ ಪ್ರಮುಖ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು ಮತ್ತು ಸೇವೆಗಳು.",
        searchMinistry: "ಸಚಿವಾಲಯ ಹುಡುಕಿ...",
        viewMinistrySchemes: "ಸಚಿವಾಲಯದ ಯೋಜನೆಗಳು"
      },
      footer: {
        copyright: "2026 ಸೇತು | ಭಾರತ ಸರ್ಕಾರ",
        ownership: "ವಿಷಯಗಳು ಸಂಬಂಧಿಸಿದ ಸಚಿವಾಲಯಗಳ ಒಡೆತನದಲ್ಲಿದೆ",
        nic: "ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿ ಕೇಂದ್ರ (ಎನ್‌ಐಸಿ) ಮಾರ್ಗಸೂಚಿಗಳ ಅನ್ವಯ ನಿರ್ಮಿತ",
        gigw: "ಜಿಐಜಿಡಬ್ಲ್ಯೂ ಅನುಸರಣೆ | WCAG 2.0 AA"
      }
    }
  },
  ta: {
    translation: {
      nav: {
        home: "முகப்பு",
        categories: "பிரிவுகள்",
        states: "மாநிலங்கள்/யூனியன்",
        ministries: "மத்திய அமைச்சகங்கள்",
        findScheme: "திட்டங்களை கண்டறியவும்",
        allSchemes: "அனைத்து திட்டங்கள்",
        cscPortal: "சி.எஸ்.சி போர்ட்டல்",
        about: "சேது பற்றி",
        login: "குடிமக்கள் உள்நுழைவு",
        chatWithAI: "சேது AI உதவியாளர்",
        searchPlaceholder: "திட்டத்தின் பெயரைத் தேடுங்கள்...",
        govtOfIndia: "இந்திய அரசு"
      },
      hero: {
        title: "உங்களுக்கான அரசு நலத்திட்டங்களை கண்டறியுங்கள்",
        subtitle: "3,000+ மத்திய மற்றும் மாநில அரசு திட்டங்கள். AI மூலம் நிமிடங்களில் தகுதியை அறியுங்கள்.",
        searchPlaceholder: "திட்டங்கள் அல்லது சேவைகளைத் தேடுங்கள்...",
        listening: "கேட்கிறது...",
        speakNow: "பேசவும் அல்லது தட்டச்சு செய்யவும்",
        findBtn: "தகுதியான திட்டங்களை காண்க",
        dontKnowTitle: "எங்கு தொடங்குவது என்று தெரியவில்லையா?",
        dontKnowSub: "5 எளிய கேள்விகளுக்கு பதிலளிக்கவும். சேது உங்களுக்கான திட்டங்களை கண்டறியும்."
      },
      stats: {
        schemesCount: "3,000+ திட்டங்கள்",
        statesCount: "36 மாநிலங்கள் & யூனியன்",
        categoriesCount: "20+ பிரிவுகள்",
        citizensHelped: "50 லட்சம்+ பயனாளிகள்"
      },
      cards: {
        viewDetails: "விவரங்களை காண்க",
        saveScheme: "சேமி",
        checkEligibility: "தகுதி சரிபார்க்கவும்",
        applyNow: "அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்கவும்",
        downloadPdf: "ஆவண பட்டியல் பதிவிறக்கு",
        matchBadge: "பொருத்தமான திட்டம்",
        centralGovt: "மத்திய அரசு",
        stateGovt: "மாநில அரசு",
        exploreAll: "அனைத்தும் காண்க"
      },
      wizard: {
        title: "தகுதி வழிகாட்டி",
        subtitle: "4 எளிய படிகளில் திட்டங்களை கண்டறியுங்கள்",
        step1: "சுய விவரம்",
        step2: "குடும்பம் மற்றும் வருமானம்",
        step3: "தேவைகள்",
        step4: "தகுதியான திட்டங்கள்",
        ageLabel: "உங்கள் வயது என்ன?",
        genderLabel: "உங்கள் பாலினம்?",
        stateLabel: "நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?",
        disabilityLabel: "மாற்றுத்திறனாளியா?",
        incomeLabel: "ஆண்டு குடும்ப வருமானம் எவ்வளவு?",
        casteLabel: "சமூக பிரிவு",
        bplLabel: "BPL குடும்ப அட்டை உள்ளதா?",
        needsLabel: "உங்களுக்கு என்ன உதவி தேவை?",
        resultsFound: "உங்கள் சுயவிவரத்திற்கு திட்டங்கள் கிடைத்துள்ளன",
        next: "அடுத்த படி",
        prev: "முந்தைய",
        showResults: "திட்டங்களை காட்டு"
      },
      chat: {
        title: "சேது AI பன்மொழி உதவியாளர்",
        status: "ஆன்லைனில் தயாராக உள்ளது",
        welcomeTitle: "வணக்கம்! நான் சேது, உங்கள் அரசு நலத்திட்ட வழிகாட்டி.",
        welcomeBody: "நான் உங்களுக்கு உதவ முடியும்:\n- தகுதியான திட்டங்களை கண்டறிய\n- ஆவண தேவைகளை அறிய\n- நேரடி பணப்பரிமாற்ற நிலையை அறிய\n- தமிழில் விளக்கம் பெற",
        inputPlaceholder: "தமிழில் கேளுங்கள்...",
        send: "அனுப்பு",
        voicePrompt: "பேச மைக் அழுத்தவும்"
      },
      categoriesPage: {
        title: "பிரிவு வாரியாக அரசு திட்டங்கள்",
        subtitle: "கல்வி, விவசாயம், சுகாதாரம் உள்ளிட்ட அனைத்து பிரிவுகளிலும் 3000+ திட்டங்களை பாருங்கள்.",
        schemesAvailable: "கிடைக்கும் திட்டங்கள்",
        viewSchemes: "திட்டங்களை காண்க"
      },
      statesPage: {
        title: "மாநில & யூனியன் பிரதேச திட்டங்கள்",
        subtitle: "36 மாநிலங்களின் சிறப்பு நலத்திட்டங்கள் மற்றும் அதிகாரப்பூர்வ இணையதளங்கள்.",
        searchState: "மாநிலத்தை தேடுங்கள்...",
        viewStateSchemes: "மாநில திட்டங்களை பாருங்கள்"
      },
      ministriesPage: {
        title: "மத்திய அமைச்சகங்கள் மற்றும் துறைகள்",
        subtitle: "இந்திய மத்திய அரசு அமைச்சகங்களின் முதன்மை திட்டங்கள்.",
        searchMinistry: "அமைச்சகத்தை தேடுங்கள்...",
        viewMinistrySchemes: "திட்டங்களை பாருங்கள்"
      },
      footer: {
        copyright: "2026 சேது | இந்திய அரசு",
        ownership: "உள்ளடக்கங்கள் மத்திய மற்றும் மாநில அமைச்சகங்களுக்கு உரியவை",
        nic: "NIC வழிகாட்டுதல்களின்படி உருவாக்கப்பட்டது",
        gigw: "GIGW இணக்கமானது | WCAG 2.0 AA"
      }
    }
  },
  te: {
    translation: {
      nav: {
        home: "హోమ్",
        categories: "వర్గాలు",
        states: "రాష్ట్రాలు/యూటీలు",
        ministries: "కేంద్ర మంత్రిత్వ శాఖలు",
        findScheme: "పథకాలను కనుగొనండి",
        allSchemes: "అన్ని పథకాలు",
        cscPortal: "CSC పోర్టల్",
        about: "సేతు గురించి",
        login: "పౌర లాగిన్",
        chatWithAI: "సేతు AI సహాయకుడు",
        searchPlaceholder: "పథకం పేరును శోధించండి...",
        govtOfIndia: "భారత ప్రభుత్వం"
      },
      hero: {
        title: "మీ కోసం రూపొందించిన ప్రభుత్వ పథకాలను కనుగొనండి",
        subtitle: "3,000+ కేంద్ర మరియు రాష్ట్ర సంక్షేమ పథకాలు. AI తో నిమిషాల్లో మీ అర్హతను తెలుసుకోండి.",
        searchPlaceholder: "పథకాలు, అర్హత లేదా ప్రయోజనాల ద్వారా శోధించండి...",
        listening: "వింటోంది...",
        speakNow: "మాట్లాడండి లేదా టైప్ చేయండి",
        findBtn: "అర్హతగల పథకాలను కనుగొనండి",
        dontKnowTitle: "ఎక్కడ ప్రారంభించాలో తెలియడం లేదా?",
        dontKnowSub: "5 సాధారణ ప్రశ్నలకు సమాధానం ఇవ్వండి. సేతు మీ కోసం పథకాలను కనుగొంటుంది."
      },
      stats: {
        schemesCount: "3,000+ పథకాలు",
        statesCount: "36 రాష్ట్రాలు & యూటీలు",
        categoriesCount: "20+ వర్గాలు",
        citizensHelped: "50 లక్షల+ మంది పౌరులకు సాయం"
      },
      cards: {
        viewDetails: "వివరాలు చూడండి",
        saveScheme: "సేవ్ చేయండి",
        checkEligibility: "అర్హత తనిఖీ",
        applyNow: "అధికారిక పోర్టల్‌లో దరఖాస్తు చేయండి",
        downloadPdf: "డాక్యుమెంట్ జాబితా డౌన్‌లోడ్",
        matchBadge: "సరిపోలే పథకం",
        centralGovt: "కేంద్ర ప్రభుత్వం",
        stateGovt: "రాష్ట్ర ప్రభుత్వం",
        exploreAll: "అన్నీ చూడండి"
      },
      wizard: {
        title: "అర్హత మార్గదర్శి",
        subtitle: "4 దశల్లో సరైన సంక్షేమ పథకాలను కనుగొనండి",
        step1: "వ్యక్తిగత వివరాలు",
        step2: "కుటుంబం & ఆదాయం",
        step3: "అవసరాలు",
        step4: "అర్హతగల పథకాలు",
        ageLabel: "మీ వయస్సు ఎంత?",
        genderLabel: "మీ లింగం?",
        stateLabel: "మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారు?",
        disabilityLabel: "దివ్యాంగులా?",
        incomeLabel: "వార్షిక కుటుంబ ఆదాయం ఎంత?",
        casteLabel: "సామాజిక వర్గం",
        bplLabel: "BPL రేషన్ కార్డు ఉందా?",
        needsLabel: "మీకు ఎలాంటి సాయం కావాలి?",
        resultsFound: "మీ ప్రొఫైల్‌కు సరిపోలే పథకాలు లభించాయి",
        next: "తదుపరి దశ",
        prev: "మునుపటిది",
        showResults: "పథకాలను చూపించు"
      },
      chat: {
        title: "సేతు AI బహుభాషా సహాయకుడు",
        status: "ఆన్‌లైన్ లో సిద్ధంగా ఉంది",
        welcomeTitle: "నమస్కారం! నేను సేతు, మీ ప్రభుత్వ సేవల సలహాదారు.",
        welcomeBody: "నేను మీకు సహాయం చేయగలను:\n- అర్హతగల పథకాలను కనుగొనడంలో\n- అవసరమైన పత్రాలను తెలుసుకోవడంలో\n- DBT స్థితిని తనిఖీ చేయడంలో\n- తెలుగులో సమాచారం పొందడంలో",
        inputPlaceholder: "తెలుగులో అడగండి...",
        send: "పంపండి",
        voicePrompt: "మాట్లాడటానికి మైక్ నొక్కండి"
      },
      categoriesPage: {
        title: "వర్గాల వారీగా ప్రభుత్వ పథకాలు",
        subtitle: "రైతులు, విద్యార్థులు, మహిళలు మరియు ఇతర వర్గాల కోసం 3,000+ పథకాలు.",
        schemesAvailable: "అందుబాటులో ఉన్న పథకాలు",
        viewSchemes: "పథకాలను చూడండి"
      },
      statesPage: {
        title: "రాష్ట్రాలు & కేంద్రపాలిత ప్రాంతాల పథకాలు",
        subtitle: "36 రాష్ట్రాలు మరియు యూటీల సంక్షేమ పథకాలు మరియు పోర్టల్స్.",
        searchState: "రాష్ట్రాన్ని శోధించండి...",
        viewStateSchemes: "రాష్ట్ర పథకాలు చూడండి"
      },
      ministriesPage: {
        title: "కేంద్ర మంత్రిత్వ శాఖలు & విభాగాలు",
        subtitle: "భారత ప్రభుత్వ మంత్రిత్వ శాఖల ద్వారా నిర్వహించబడుతున్న జాతీయ పథకాలు.",
        searchMinistry: "మంత్రిత్వ శాఖను శోధించండి...",
        viewMinistrySchemes: "పథకాలను చూడండి"
      },
      footer: {
        copyright: "2026 సేతు | భారత ప్రభుత్వం",
        ownership: "కేంద్ర మరియు రాష్ట్ర మంత్రిత్వ శాఖల ఆధ్వర్యంలో",
        nic: "NIC మార్గదర్శకాల ప్రకారం రూపొందించబడింది",
        gigw: "GIGW కంప్లైంట్ | WCAG 2.0 AA"
      }
    }
  },
  mr: {
    translation: {
      nav: {
        home: "मुख्यपृष्ठ",
        categories: "श्रेण्या",
        states: "राज्ये/केंद्रशासित",
        ministries: "केंद्रीय मंत्रालये",
        findScheme: "पात्र योजना शोधा",
        allSchemes: "सर्व योजना",
        cscPortal: "सीएससी पोर्टल",
        about: "सेतू बद्दल",
        login: "नागरिक लॉगिन",
        chatWithAI: "सेतू एआय सहाय्यक",
        searchPlaceholder: "योजनेचे नाव शोधा...",
        govtOfIndia: "भारत सरकार"
      },
      hero: {
        title: "तुमच्यासाठी सरकारी कल्याणकारी योजना शोधा",
        subtitle: "३,०००+ केंद्र आणि राज्य सरकारच्या योजना. एआयच्या मदतीने काही मिनिटांत पात्रता तपासा.",
        searchPlaceholder: "योजना, पात्रता किंवा लाभांनुसार शोधा...",
        listening: "ऐकत आहे...",
        speakNow: "बोला किंवा टाईप करा",
        findBtn: "पात्र योजना शोधा",
        dontKnowTitle: "कुठून सुरुवात करावी हे माहित नाही?",
        dontKnowSub: "५ सोप्या प्रश्नांची उत्तरे द्या. सेतू तुमच्यासाठी योग्य योजना शोधेल."
      },
      stats: {
        schemesCount: "३,०००+ योजना",
        statesCount: "३६ राज्ये आणि केंद्रशासित",
        categoriesCount: "२०+ श्रेण्या",
        citizensHelped: "५० लाख+ नागरिकांना लाभ"
      },
      cards: {
        viewDetails: "तपशील पहा",
        saveScheme: "जतन करा",
        checkEligibility: "पात्रता तपासा",
        applyNow: "अधिकृत पोर्टलवर अर्ज करा",
        downloadPdf: "कागदपत्रांची यादी डाउनलोड करा",
        matchBadge: "अनुकूल योजना",
        centralGovt: "केंद्र सरकार",
        stateGovt: "राज्य सरकार",
        exploreAll: "सर्व पहा"
      },
      wizard: {
        title: "पात्रता मार्गदर्शक",
        subtitle: "४ सोप्या टप्प्यांत वैयक्तिक योजना शोध",
        step1: "मूलभूत माहिती",
        step2: "कुटुंब आणि उत्पन्न",
        step3: "गरजा",
        step4: "पात्र योजना",
        ageLabel: "तुमचे वय किती आहे?",
        genderLabel: "तुमचे लिंग?",
        stateLabel: "तुम्ही कोणत्या राज्यात राहता?",
        disabilityLabel: "दिव्यांग आहात का?",
        incomeLabel: "वार्षिक कौटुंबिक उत्पन्न किती आहे?",
        casteLabel: "सामाजिक प्रवर्ग",
        bplLabel: "BPL रेशन कार्ड आहे का?",
        needsLabel: "तुम्हाला कोणत्या प्रकारची मदत हवी आहे?",
        resultsFound: "तुमच्या प्रोफाईलसाठी योजना सापडल्या",
        next: "पुढील पायरी",
        prev: "मागील",
        showResults: "योजना दाखवा"
      },
      chat: {
        title: "सेतू एआय बहुभाषिक सहाय्यक",
        status: "सक्रिय आणि तयार",
        welcomeTitle: "नमस्कार! मी सेतू आहे, तुमचा सरकारी सेवा मार्गदर्शक.",
        welcomeBody: "मी तुम्हाला मदत करू शकतो:\n- पात्र योजना शोधण्यात\n- आवश्यक कागदपत्रे समजून घेण्यात\n- डीबीटी स्थिती तपासण्यात\n- मराठीत मार्गदर्शन मिळवण्यात",
        inputPlaceholder: "मराठीत विचारा...",
        send: "पाठवा",
        voicePrompt: "बोलण्यासाठी माइक दाबा"
      },
      categoriesPage: {
        title: "श्रेणीनुसार सरकारी योजना",
        subtitle: "शिक्षण, शेती, आरोग्य आणि सामाजिक कल्याणासाठी ३०००+ योजनांची माहिती.",
        schemesAvailable: "उपलब्ध योजना",
        viewSchemes: "योजना पहा"
      },
      statesPage: {
        title: "राज्य आणि केंद्रशासित प्रदेश योजना",
        subtitle: "३६ राज्यांमधील स्थानिक कल्याणकारी योजना आणि अधिकृत पोर्टल.",
        searchState: "राज्य शोधा...",
        viewStateSchemes: "राज्य योजना पहा"
      },
      ministriesPage: {
        title: "केंद्रीय मंत्रालये आणि विभाग",
        subtitle: "केंद्र सरकारच्या विविध मंत्रालयांच्या प्रमुख योजना आणि धोरणे.",
        searchMinistry: "मंत्रालय शोधा...",
        viewMinistrySchemes: "मंत्रालयाच्या योजना पहा"
      },
      footer: {
        copyright: "२०२६ सेतू | भारत सरकार",
        ownership: "सामग्रीचे स्वामित्व संबंधित मंत्रालयांकडे आहे",
        nic: "एनआयसी मार्गदर्शक तत्त्वांवर आधारित",
        gigw: "GIGW अनुपालित | WCAG 2.0 AA"
      }
    }
  },
  bn: {
    translation: {
      nav: {
        home: "হোম",
        categories: "বিভাগসমূহ",
        states: "রাজ্য/কেন্দ্রশাসিত",
        ministries: "কেন্দ্রীয় মন্ত্রক",
        findScheme: "যোগ্য প্রকল্প খুঁজুন",
        allSchemes: "সকল প্রকল্প",
        cscPortal: "সিএসসি পোর্টাল",
        about: "সেতু পরিচিতি",
        login: "নাগরিক লগইন",
        chatWithAI: "সেতু এআই সহকারী",
        searchPlaceholder: "প্রকল্পের নাম খুঁজুন...",
        govtOfIndia: "ভারত সরকার"
      },
      hero: {
        title: "আপনার জন্য উপযুক্ত সরকারি প্রকল্প খুঁজুন",
        subtitle: "৩,০০০+ কেন্দ্র ও রাজ্য সরকারি প্রকল্প। এআই দিয়ে সহজেই যোগ্যতা যাচাই করুন।",
        searchPlaceholder: "প্রকল্প, যোগ্যতা বা সুবিধার নাম দিয়ে খুঁজুন...",
        listening: "শুনছি...",
        speakNow: "বলুন অথবা লিখুন",
        findBtn: "যোগ্য প্রকল্প খুঁজুন",
        dontKnowTitle: "কোথা থেকে শুরু করবেন বুঝতে পারছেন না?",
        dontKnowSub: "৫টি সহজ প্রশ্নের উত্তর দিন। সেতু আপনার জন্য প্রকল্প খুঁজে বের করবে।"
      },
      stats: {
        schemesCount: "৩,০০০+ প্রকল্প",
        statesCount: "৩৬টি রাজ্য ও কেন্দ্রশাসিত",
        categoriesCount: "২০+ বিভাগ",
        citizensHelped: "৫০ লক্ষ+ উপকৃত নাগরিক"
      },
      cards: {
        viewDetails: "বিস্তারিত দেখুন",
        saveScheme: "সংরক্ষণ",
        checkEligibility: "যোগ্যতা যাচাই",
        applyNow: "অফিসিয়াল পোর্টালে আবেদন করুন",
        downloadPdf: "ডকুমেন্ট তালিকা ডাউনলোড",
        matchBadge: "উপযুক্ত প্রকল্প",
        centralGovt: "কেন্দ্রীয় সরকার",
        stateGovt: "রাজ্য সরকার",
        exploreAll: "সব দেখুন"
      },
      wizard: {
        title: "যোগ্যতা সহায়িকা",
        subtitle: "৪টি ধাপে আপনার জন্য উপযুক্ত প্রকল্প খুঁজুন",
        step1: "প্রাথমিক তথ্য",
        step2: "পরিবার ও আয়",
        step3: "প্রয়োজনীয়তা",
        step4: "যোগ্য প্রকল্পসমূহ",
        ageLabel: "আপনার বয়স কত?",
        genderLabel: "আপনার লিঙ্গ?",
        stateLabel: "আপনি কোন রাজ্যে থাকেন?",
        disabilityLabel: "আপনি কি বিশেষভাবে সক্ষম?",
        incomeLabel: "বার্ষিক পারিবারিক আয় কত?",
        casteLabel: "সামাজিক বিভাগ",
        bplLabel: "BPL রেশন কার্ড আছে কি?",
        needsLabel: "আপনার কী ধরনের সহায়তা প্রয়োজন?",
        resultsFound: "আপনার জন্য উপযুক্ত প্রকল্প পাওয়া গেছে",
        next: "পরবর্তী ধাপ",
        prev: "পূর্ববর্তী",
        showResults: "প্রকল্পগুলি দেখুন"
      },
      chat: {
        title: "সেতু এআই বহুভাষিক সহকারী",
        status: "অনলাইনে প্রস্তুত",
        welcomeTitle: "নমস্কার! আমি সেতু, আপনার সরকারি সেবা সহায়ক।",
        welcomeBody: "আমি আপনাকে সাহায্য করতে পারি:\n- আপনার জন্য উপযুক্ত প্রকল্প খুঁজতে\n- প্রয়োজনীয় নথিপত্র জানতে\n- ডিবিটি স্ট্যাটাস যাচাই করতে\n- বাংলায় নির্দেশনা পেতে",
        inputPlaceholder: "বাংলায় জিজ্ঞাসা করুন...",
        send: "পাঠান",
        voicePrompt: "কথা বলতে মাইক চাপুন"
      },
      categoriesPage: {
        title: "বিভাগ অনুযায়ী সরকারি প্রকল্প",
        subtitle: "শিক্ষা, কৃষি, স্বাস্থ্য ও সমাজকল্যাণের ৩০০০+ প্রকল্প এক নজরে।",
        schemesAvailable: "উপলব্ধ প্রকল্প",
        viewSchemes: "প্রকল্প দেখুন"
      },
      statesPage: {
        title: "রাজ্য ও কেন্দ্রশাসিত অঞ্চলসমূহের প্রকল্প",
        subtitle: "৩৬টি রাজ্যের সরকারি কল্যাণমূলক প্রকল্প এবং পোর্টাল তালিকা।",
        searchState: "রাজ্য খুঁজুন...",
        viewStateSchemes: "রাজ্যের প্রকল্প দেখুন"
      },
      ministriesPage: {
        title: "কেন্দ্রীয় মন্ত্রক ও বিভাগসমূহ",
        subtitle: "ভারত সরকারের বিভিন্ন মন্ত্রকের জাতীয় প্রকল্প ও সেবা।",
        searchMinistry: "মন্ত্রক খুঁজুন...",
        viewMinistrySchemes: "মন্ত্রকের প্রকল্প দেখুন"
      },
      footer: {
        copyright: "২০২৬ সেতু | ভারত সরকার",
        ownership: "বিষয়বস্তুর মালিকানা সংশ্লিষ্ট মন্ত্রকের অধীন",
        nic: "এনআইসি নির্দেশিকা অনুযায়ী তৈরি",
        gigw: "GIGW সম্মত | WCAG 2.0 AA"
      }
    }
  },
  gu: {
    translation: {
      nav: {
        home: "મુખ્યપૃષ્ઠ",
        categories: "શ્રેણીઓ",
        states: "રાજ્યો/કેન્દ્રશાસિત",
        ministries: "કેન્દ્રીય મંત્રાલયો",
        findScheme: "યોજના શોધો",
        allSchemes: "બધી યોજનાઓ",
        cscPortal: "સીએસસી પોર્ટલ",
        about: "સેતુ પરિચય",
        login: "નાગરિક લૉગિન",
        chatWithAI: "સેતુ એઆઈ સહાયક",
        searchPlaceholder: "યોજનાનું નામ શોધો...",
        govtOfIndia: "ભારત સરકાર"
      },
      hero: {
        title: "તમારા માટે યોગ્ય સરકારી યોજનાઓ શોધો",
        subtitle: "૩,૦૦૦+ કેન્દ્ર અને રાજ્ય સરકારની કલ્યાણકારી યોજનાઓ. AI ની મદદથી પાત્રતા તપાસો.",
        searchPlaceholder: "યોજનાનું નામ અથવા લાભ શોધો...",
        listening: "સાંભળી રહ્યા છીએ...",
        speakNow: "બોલો અથવા લખો",
        findBtn: "પાત્ર યોજનાઓ શોધો",
        dontKnowTitle: "ક્યાંથી શરૂઆત કરવી?",
        dontKnowSub: "૫ સરળ પ્રશ્નોના જવાબ આપો. સેતુ તમારા માટે યોગ્ય યોજનાઓ શોધશે."
      },
      stats: {
        schemesCount: "૩,૦૦૦+ યોજનાઓ",
        statesCount: "૩૬ રાજ્યો અને કેન્દ્રશાસિત",
        categoriesCount: "૨૦+ શ્રેણીઓ",
        citizensHelped: "૫૦ લાખ+ નાગરિકોને સહાય"
      },
      cards: {
        viewDetails: "વિગતો જુઓ",
        saveScheme: "સાચવો",
        checkEligibility: "પાત્રતા ચકાસો",
        applyNow: "સત્તાવાર પોર્ટલ પર અરજી કરો",
        downloadPdf: "દસ્તાવેજ યાદી ડાઉનલોડ",
        matchBadge: "અનુરૂપ યોજના",
        centralGovt: "કેન્દ્ર સરકાર",
        stateGovt: "રાજ્ય સરકાર",
        exploreAll: "બધા જુઓ"
      },
      wizard: {
        title: "પાત્રતા માર્ગદર્શિકા",
        subtitle: "૪ સરળ પગલાંમાં યોજનાઓની શોધ",
        step1: "મૂળભૂત માહિતી",
        step2: "પરિવાર અને આવક",
        step3: "જરૂરિયાતો",
        step4: "પાત્ર યોજનાઓ",
        ageLabel: "તમારી ઉંમર કેટલી છે?",
        genderLabel: "તમારું લિંગ?",
        stateLabel: "તમે કયા રાજ્યમાં રહો છો?",
        disabilityLabel: "શું તમે દિવ્યાંગ છો?",
        incomeLabel: "વાર્ષિક કૌટુંબિક આવક કેટલી છે?",
        casteLabel: "સામાજિક શ્રેણી",
        bplLabel: "BPL રેશનકાર્ડ છે?",
        needsLabel: "તમને કયા પ્રકારની સહાય જોઈએ છે?",
        resultsFound: "તમારી પ્રોફાઇલ માટે યોગ્ય યોજનાઓ મળી",
        next: "આગળનું પગલું",
        prev: "પાછળ",
        showResults: "યોજનાઓ બતાવો"
      },
      chat: {
        title: "સેતુ એઆઈ બહુભાષી સહાયક",
        status: "ઑનલાઇન અને તૈયાર",
        welcomeTitle: "નમસ્તે! હું સેતુ છું, તમારો સરકારી યોજના માર્ગદર્શક.",
        welcomeBody: "હું તમને મદદ કરી શકું છું:\n- પાત્ર યોજનાઓ શોધવામાં\n- જરૂરી દસ્તાવેજો જાણવામાં\n- ડીબીટી સ્ટેટસ તપાસવામાં\n- ગુજરાતીમાં માર્ગદર્શન મેળવવામાં",
        inputPlaceholder: "ગુજરાતીમાં પૂછો...",
        send: "મોકલો",
        voicePrompt: "બોલવા માટે માઈક દબાવો"
      },
      categoriesPage: {
        title: "શ્રેણી અનુસાર સરકારી યોજનાઓ",
        subtitle: "શિક્ષણ, કૃષિ, આરોગ્ય અને સામાજિક કલ્યાણની યોજનાઓ.",
        schemesAvailable: "ઉપલબ્ધ યોજનાઓ",
        viewSchemes: "યોજનાઓ જુઓ"
      },
      statesPage: {
        title: "રાજ્ય અને કેન્દ્રશાસિત પ્રદેશ યોજનાઓ",
        subtitle: "૩૬ રાજ્યોની કલ્યાણકારી યોજનાઓ અને સત્તાવાર પોર્ટલ.",
        searchState: "રાજ્ય શોધો...",
        viewStateSchemes: "રાજ્ય યોજનાઓ જુઓ"
      },
      ministriesPage: {
        title: "કેન્દ્રીય મંત્રાલયો અને વિભાગો",
        subtitle: "ભારત સરકારના મંત્રાલયોની મુખ્ય રાષ્ટ્રીય યોજનાઓ.",
        searchMinistry: "મંત્રાલય શોધો...",
        viewMinistrySchemes: "યોજનાઓ જુઓ"
      },
      footer: {
        copyright: "૨૦૨૬ સેતુ | ભારત સરકાર",
        ownership: "સામગ્રીની માલિકી સંબંધિત મંત્રાલયો પાસે છે",
        nic: "NIC માર્ગદર્શિકા મુજબ નિર્મિત",
        gigw: "GIGW સુસંગત | WCAG 2.0 AA"
      }
    }
  },
  ml: {
    translation: {
      nav: {
        home: "ഹോം",
        categories: "വിഭാഗങ്ങൾ",
        states: "സംസ്ഥാനങ്ങൾ/കേന്ദ്രഭരണ",
        ministries: "കേന്ദ്ര മന്ത്രാലയങ്ങൾ",
        findScheme: "പദ്ധതികൾ കണ്ടെത്തുക",
        allSchemes: "എല്ലാ പദ്ധതികളും",
        cscPortal: "സിഎസ്‌സി പോർട്ടൽ",
        about: "സേതുവിനെക്കുറിച്ച്",
        login: "പൗര ലോഗിൻ",
        chatWithAI: "സേതു എഐ അസിസ്റ്റന്റ്",
        searchPlaceholder: "പദ്ധതിയുടെ പേര് തിരയുക...",
        govtOfIndia: "ഭാരത സർക്കാർ"
      },
      hero: {
        title: "നിങ്ങൾക്കായുള്ള സർക്കാർ ക്ഷേമപദ്ധതികൾ കണ്ടെത്തുക",
        subtitle: "3,000+ കേന്ദ്ര-സംസ്ഥാന പദ്ധതികൾ. എഐ സഹായത്തോടെ മിനിറ്റുകൾക്കകം യോഗ്യത അറിയൂ.",
        searchPlaceholder: "പദ്ധതികൾ അല്ലെങ്കിൽ ആനുകൂല്യങ്ങൾ തിരയുക...",
        listening: "കേൾക്കുന്നു...",
        speakNow: "സംസാരിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക",
        findBtn: "യോഗ്യമായ പദ്ധതികൾ കണ്ടെത്തുക",
        dontKnowTitle: "എവിടെ തുടങ്ങണമെന്ന് അറിയില്ലേ?",
        dontKnowSub: "5 ലളിതമായ ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക. സേതു നിങ്ങൾക്കുള്ള പദ്ധതികൾ കണ്ടെത്തും."
      },
      stats: {
        schemesCount: "3,000+ പദ്ധതികൾ",
        statesCount: "36 സംസ്ഥാനങ്ങളും കേന്ദ്രഭരണ പ്രദേശങ്ങളും",
        categoriesCount: "20+ വിഭാഗങ്ങൾ",
        citizensHelped: "50 ലക്ഷം+ ഗുണഭോക്താക്കൾ"
      },
      cards: {
        viewDetails: "വിശദാംശങ്ങൾ കാണുക",
        saveScheme: "സൂക്ഷിക്കുക",
        checkEligibility: "യോഗ്യത പരിശോധിക്കുക",
        applyNow: "ഔദ്യോഗിക പോർട്ടലിൽ അപേക്ഷിക്കുക",
        downloadPdf: "രേഖകളുടെ പട്ടിക ഡൗൺലോഡ് ചെയ്യുക",
        matchBadge: "യോജിച്ച പദ്ധതി",
        centralGovt: "കേന്ദ്ര സർക്കാർ",
        stateGovt: "സംസ്ഥാന സർക്കാർ",
        exploreAll: "എല്ലാം കാണുക"
      },
      wizard: {
        title: "യോഗ്യതാ സഹായി",
        subtitle: "4 ഘട്ടങ്ങളിലൂടെ അനുയോജ്യമായ പദ്ധതികൾ കണ്ടെത്തുക",
        step1: "വ്യക്തിഗത വിവരങ്ങൾ",
        step2: "കുടുംബവും വരുമാനവും",
        step3: "ആവശ്യങ്ങൾ",
        step4: "യോഗ്യമായ പദ്ധതികൾ",
        ageLabel: "നിങ്ങളുടെ പ്രായം എത്രയാണ്?",
        genderLabel: "ലിംഗം?",
        stateLabel: "നിങ്ങൾ ഏത് സംസ്ഥാനത്താണ് താമസിക്കുന്നത്?",
        disabilityLabel: "ഭിന്നശേഷിക്കാരനാണോ?",
        incomeLabel: "വാർഷിക കുടുംബ വരുമാനം എത്രയാണ്?",
        casteLabel: "സാമൂഹിക വിഭാഗം",
        bplLabel: "BPL റേഷൻ കാർഡ് ഉണ്ടോ?",
        needsLabel: "നിങ്ങൾക്ക് എന്ത് സഹായമാണ് വേണ്ടത്?",
        resultsFound: "നിങ്ങളുടെ പ്രൊഫൈലിന് അനുയോജ്യമായ പദ്ധതികൾ ലഭ്യമാണ്",
        next: "അടുത്ത ഘട്ടം",
        prev: "മുമ്പത്തെ",
        showResults: "പദ്ധതികൾ കാണിക്കുക"
      },
      chat: {
        title: "സേതു എഐ ബഹുഭാഷാ സഹായി",
        status: "സജീവമാണ്",
        welcomeTitle: "നമസ്കാരം! ഞാൻ സേതു, നിങ്ങളുടെ സർക്കാർ സേവന വഴികാട്ടി.",
        welcomeBody: "എനിക്ക് നിങ്ങളെ സഹായിക്കാനാകും:\n- യോഗ്യമായ പദ്ധതികൾ കണ്ടെത്താൻ\n- ആവശ്യമായ രേഖകൾ മനസ്സിലാക്കാൻ\n- ഡിബിടി സ്റ്റാറ്റസ് പരിശോധിക്കാൻ\n- മലയാളത്തിൽ വിവരങ്ങൾ അറിയാൻ",
        inputPlaceholder: "മലയാളത്തിൽ ചോദിക്കുക...",
        send: "അയക്കുക",
        voicePrompt: "സംസാരിക്കാൻ മൈക്ക് അമർത്തുക"
      },
      categoriesPage: {
        title: "വിഭാഗം തിരിച്ചുള്ള സർക്കാർ പദ്ധതികൾ",
        subtitle: "വിദ്യാഭ്യാസം, കൃഷി, ആരോഗ്യം തുടങ്ങിയ വിവിധ മേഖലകളിലെ 3000+ പദ്ധതികൾ.",
        schemesAvailable: "ലഭ്യമായ പദ്ധതികൾ",
        viewSchemes: "പദ്ധതികൾ കാണുക"
      },
      statesPage: {
        title: "സംസ്ഥാന-കേന്ദ്രഭരണ പ്രദേശ പദ്ധതികൾ",
        subtitle: "36 സംസ്ഥാനങ്ങളിലെ ക്ഷേമപദ്ധതികളും പോർട്ടലുകളും.",
        searchState: "സംസ്ഥാനം തിരയുക...",
        viewStateSchemes: "സംസ്ഥാന പദ്ധതികൾ കാണുക"
      },
      ministriesPage: {
        title: "കേന്ദ്ര മന്ത്രാലയങ്ങളും വകുപ്പുകളും",
        subtitle: "കേന്ദ്ര സർക്കാരിന്റെ പ്രധാന ദേശീയ പദ്ധതികൾ.",
        searchMinistry: "മന്ത്രാലയം തിരയുക...",
        viewMinistrySchemes: "പദ്ധതികൾ കാണുക"
      },
      footer: {
        copyright: "2026 സേതു | ഭാരത സർക്കാർ",
        ownership: "ഉള്ളടക്കം ബന്ധപ്പെട്ട മന്ത്രാലയങ്ങളുടെ ഉടമസ്ഥതയിലുള്ളതാണ്",
        nic: "എൻഐസി മാർഗ്ഗനിർദ്ദേശങ്ങൾ പ്രകാരം നിർമ്മിച്ചത്",
        gigw: "GIGW അനുസൃതമായത് | WCAG 2.0 AA"
      }
    }
  },
  pa: {
    translation: {
      nav: {
        home: "ਮੁੱਖ ਪੰਨਾ",
        categories: "ਸ਼੍ਰੇਣੀਆਂ",
        states: "ਰਾਜ/ਕੇਂਦਰ ਸ਼ਾਸਿਤ",
        ministries: "ਕੇਂਦਰੀ ਮੰਤਰਾਲੇ",
        findScheme: "ਯੋਗ ਸਕੀਮਾਂ ਲੱਭੋ",
        allSchemes: "ਸਾਰੀਆਂ ਸਕੀਮਾਂ",
        cscPortal: "ਸੀਐਸਸੀ ਪੋਰਟਲ",
        about: "ਸੇਤੂ ਬਾਰੇ",
        login: "ਨਾਗਰਿਕ ਲੌਗਇਨ",
        chatWithAI: "ਸੇਤੂ ਏਆਈ ਸਹਾਇਕ",
        searchPlaceholder: "ਸਕੀਮ ਦਾ ਨਾਮ ਖੋਜੋ...",
        govtOfIndia: "ਭਾਰਤ ਸਰਕਾਰ"
      },
      hero: {
        title: "ਆਪਣੇ ਲਈ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਲੱਭੋ",
        subtitle: "3,000+ ਕੇਂਦਰ ਅਤੇ ਰਾਜ ਸਰਕਾਰ ਦੀਆਂ ਕਲਿਆਣਕਾਰੀ ਸਕੀਮਾਂ। ਏਆਈ ਨਾਲ ਮਿੰਟਾਂ ਵਿੱਚ ਯੋਗਤਾ ਜਾਣੋ।",
        searchPlaceholder: "ਸਕੀਮ ਦਾ ਨਾਮ ਜਾਂ ਲਾਭ ਖੋਜੋ...",
        listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
        speakNow: "ਬੋਲੋ ਜਾਂ ਲਿਖੋ",
        findBtn: "ਯੋਗ ਸਕੀਮਾਂ ਲੱਭੋ",
        dontKnowTitle: "ਸ਼ੁਰੂਆਤ ਕਿੱਥੋਂ ਕਰਨੀ ਹੈ?",
        dontKnowSub: "5 ਸਧਾਰਨ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ। ਸੇਤੂ ਤੁਹਾਡੇ ਲਈ ਸਕੀਮਾਂ ਲੱਭੇਗਾ।"
      },
      stats: {
        schemesCount: "3,000+ ਸਕੀਮਾਂ",
        statesCount: "36 ਰਾਜ ਅਤੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ",
        categoriesCount: "20+ ਸ਼੍ਰੇਣੀਆਂ",
        citizensHelped: "50 ਲੱਖ+ ਨਾਗਰਿਕਾਂ ਨੂੰ ਲਾਭ"
      },
      cards: {
        viewDetails: "ਵੇਰਵੇ ਦੇਖੋ",
        saveScheme: "ਸੰਭਾਲੋ",
        checkEligibility: "ਯੋਗਤਾ ਜਾਂਚੋ",
        applyNow: "ਅਧਿਕਾਰਤ ਪੋਰਟਲ 'ਤੇ ਅਪਲਾਈ ਕਰੋ",
        downloadPdf: "ਦਸਤਾਵੇਜ਼ ਸੂਚੀ ਡਾਊਨਲੋਡ ਕਰੋ",
        matchBadge: "ਢੁਕਵੀਂ ਸਕੀਮ",
        centralGovt: "ਕੇਂਦਰ ਸਰਕਾਰ",
        stateGovt: "ਰਾਜ ਸਰਕਾਰ",
        exploreAll: "ਸਾਰੇ ਦੇਖੋ"
      },
      wizard: {
        title: "ਯੋਗਤਾ ਸਹਾਇਕ",
        subtitle: "4 ਪੜਾਵਾਂ ਵਿੱਚ ਨਿੱਜੀ ਸਕੀਮਾਂ ਦੀ ਖੋਜ",
        step1: "ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ",
        step2: "ਪਰਿਵਾਰ ਅਤੇ ਆਮਦਨ",
        step3: "ਲੋੜਾਂ",
        step4: "ਯੋਗ ਸਕੀਮਾਂ",
        ageLabel: "ਤੁਹਾਡੀ ਉਮਰ ਕਿੰਨੀ ਹੈ?",
        genderLabel: "ਤੁਹਾਡਾ ਲਿੰਗ?",
        stateLabel: "ਤੁਸੀਂ ਕਿਸ ਰਾਜ ਵਿੱਚ ਰਹਿੰਦੇ ਹੋ?",
        disabilityLabel: "ਕੀ ਤੁਸੀਂ ਦਿਵਿਆਂਗ ਹੋ?",
        incomeLabel: "ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ ਕਿੰਨੀ ਹੈ?",
        casteLabel: "ਸਮਾਜਿਕ ਸ਼੍ਰੇਣੀ",
        bplLabel: "ਕੀ BPL ਰਾਸ਼ਨ ਕਾਰਡ ਹੈ?",
        needsLabel: "ਤੁਹਾਨੂੰ ਕਿਸ ਕਿਸਮ ਦੀ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ?",
        resultsFound: "ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਲਈ ਸਕੀਮਾਂ ਮਿਲੀਆਂ",
        next: "ਅਗਲਾ ਕਦਮ",
        prev: "ਪਿਛਲਾ",
        showResults: "ਸਕੀਮਾਂ ਦਿਖਾਓ"
      },
      chat: {
        title: "ਸੇਤੂ ਏਆਈ ਬਹੁਭਾਸ਼ਾਈ ਸਹਾਇਕ",
        status: "ਆਨਲਾਈਨ ਅਤੇ ਤਿਆਰ",
        welcomeTitle: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸੇਤੂ ਹਾਂ, ਤੁਹਾਡਾ ਸਰਕਾਰੀ ਯੋਜਨਾ ਗਾਈਡ।",
        welcomeBody: "ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:\n- ਯੋਗ ਸਕੀਮਾਂ ਲੱਭਣ ਵਿੱਚ\n- ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ ਜਾਣਨ ਵਿੱਚ\n- ਡੀਬੀਟੀ ਸਥਿਤੀ ਜਾਂਚਣ ਵਿੱਚ\n- ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ ਲੈਣ ਵਿੱਚ",
        inputPlaceholder: "ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛੋ...",
        send: "ਭੇਜੋ",
        voicePrompt: "ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ"
      },
      categoriesPage: {
        title: "ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        subtitle: "ਸਿੱਖਿਆ, ਖੇਤੀਬਾੜੀ, ਸਿਹਤ ਅਤੇ ਸਮਾਜਿਕ ਭਲਾਈ ਦੀਆਂ ਸਕੀਮਾਂ।",
        schemesAvailable: "ਉਪਲਬਧ ਸਕੀਮਾਂ",
        viewSchemes: "ਸਕੀਮਾਂ ਦੇਖੋ"
      },
      statesPage: {
        title: "ਰਾਜ ਅਤੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਸਕੀਮਾਂ",
        subtitle: "36 ਰਾਜਾਂ ਦੀਆਂ ਕਲਿਆਣਕਾਰੀ ਯੋਜਨਾਵਾਂ ਅਤੇ ਪੋਰਟਲ।",
        searchState: "ਰਾਜ ਖੋਜੋ...",
        viewStateSchemes: "ਰਾਜ ਸਕੀਮਾਂ ਦੇਖੋ"
      },
      ministriesPage: {
        title: "ਕੇਂਦਰੀ ਮੰਤਰਾਲੇ ਅਤੇ ਵਿਭਾਗ",
        subtitle: "ਭਾਰਤ ਸਰਕਾਰ ਦੇ ਮੰਤਰਾਲਿਆਂ ਦੀਆਂ ਪ੍ਰਮੁੱਖ ਰਾਸ਼ਟਰੀ ਯੋਜਨਾਵਾਂ।",
        searchMinistry: "ਮੰਤਰਾਲਾ ਖੋਜੋ...",
        viewMinistrySchemes: "ਸਕੀਮਾਂ ਦੇਖੋ"
      },
      footer: {
        copyright: "2026 ਸੇਤੂ | ਭਾਰਤ ਸਰਕਾਰ",
        ownership: "ਸਮੱਗਰੀ ਸੰਬੰਧਿਤ ਮੰਤਰਾਲਿਆਂ ਦੀ ਮਲਕੀਅਤ ਹੈ",
        nic: "NIC ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ ਅਨੁਸਾਰ ਤਿਆਰ ਕੀਤਾ ਗਿਆ",
        gigw: "GIGW ਅਨੁਕੂਲ | WCAG 2.0 AA"
      }
    }
  },
  ur: {
    translation: {
      nav: {
        home: "ہوم",
        categories: "زمرہ جات",
        states: "ریاستیں/یوٹی",
        ministries: "مرکزی وزارتیں",
        findScheme: "اہل اسکیمیں تلاش کریں",
        allSchemes: "تمام اسکیمیں",
        cscPortal: "سی ایس سی پورٹل",
        about: "سیتو تعارف",
        login: "شہری لاگ ان",
        chatWithAI: "سیتو اے آئی معاون",
        searchPlaceholder: "اسکیم کا نام تلاش کریں...",
        govtOfIndia: "حکومت ہند"
      },
      hero: {
        title: "اپنے لیے موزوں سرکاری اسکیمیں تلاش کریں",
        subtitle: "3,000+ مرکزی اور ریاستی فلاحی اسکیمیں۔ AI کے ذریعے چند منٹوں میں اہلیت جانیں۔",
        searchPlaceholder: "اسکیم یا فائدے کا نام تلاش کریں...",
        listening: "سن رہے ہیں...",
        speakNow: "بولیں یا لکھیں",
        findBtn: "اہل اسکیمیں تلاش کریں",
        dontKnowTitle: "کہاں سے شروع کریں؟",
        dontKnowSub: "5 آسان سوالات کے جواب دیں۔ سیتو آپ کے لیے اسکیمیں تلاش کرے گا۔"
      },
      stats: {
        schemesCount: "3,000+ اسکیمیں",
        statesCount: "36 ریاستیں اور یوٹی",
        categoriesCount: "20+ زمرے",
        citizensHelped: "50 لاکھ+ مستفیدین"
      },
      cards: {
        viewDetails: "تفصیلات دیکھیں",
        saveScheme: "محفوظ کریں",
        checkEligibility: "اہلیت جانچیں",
        applyNow: "سرکاری پورٹل پر درخواست دیں",
        downloadPdf: "دستاویزات کی فہرست ڈاؤن لوڈ کریں",
        matchBadge: "موزوں اسکیم",
        centralGovt: "مرکزی حکومت",
        stateGovt: "ریاستی حکومت",
        exploreAll: "سب دیکھیں"
      },
      wizard: {
        title: "اہلیت گائیڈ",
        subtitle: "4 مراحل میں ذاتی اسکیموں کی تلاش",
        step1: "بنیادی معلومات",
        step2: "خاندان اور آمدنی",
        step3: "ضروریات",
        step4: "اہل اسکیمیں",
        ageLabel: "آپ کی عمر کتنی ہے؟",
        genderLabel: "آپ کی جنس؟",
        stateLabel: "آپ کس ریاست میں رہتے ہیں؟",
        disabilityLabel: "کیا آپ معذور ہیں؟",
        incomeLabel: "سالانہ خاندانی آمدنی کتنی ہے؟",
        casteLabel: "سماجی زمرہ",
        bplLabel: "کیا BPL راشن کارڈ ہے؟",
        needsLabel: "آپ کو کس قسم کی مدد درکار ہے؟",
        resultsFound: "آپ کی پروفائل کے مطابق اسکیمیں مل گئیں",
        next: "اگلا مرحلہ",
        prev: "پچھلا",
        showResults: "اسکیمیں دکھائیں"
      },
      chat: {
        title: "سیتو اے آئی کثیر لسانی معاون",
        status: "آن لائن اور تیار",
        welcomeTitle: "آداب! میں سیتو ہوں، آپ کا سرکاری فلاحی مشیر۔",
        welcomeBody: "میں آپ کی مدد کر سکتا ہوں:\n- اہل اسکیمیں تلاش کرنے میں\n- ضروری دستاویزات سمجھنے میں\n- ڈی بی ٹی اسٹیٹس جانچنے میں\n- اردو میں رہنمائی حاصل کرنے میں",
        inputPlaceholder: "اردو میں پوچھیں...",
        send: "ارسال کریں",
        voicePrompt: "بولنے کے لیے مائیک دبائیں"
      },
      categoriesPage: {
        title: "زمرہ وار سرکاری اسکیمیں",
        subtitle: "تعلیم، زراعت، صحت اور سماجی بہبود کی 3000+ اسکیمیں۔",
        schemesAvailable: "دستیاب اسکیمیں",
        viewSchemes: "اسکیمیں دیکھیں"
      },
      statesPage: {
        title: "ریاستی اور یوٹی اسکیمیں",
        subtitle: "36 ریاستوں کی فلاحی اسکیمیں اور سرکاری پورٹلز۔",
        searchState: "ریاست تلاش کریں...",
        viewStateSchemes: "ریاستی اسکیمیں دیکھیں"
      },
      ministriesPage: {
        title: "مرکزی وزارتیں اور شعبہ جات",
        subtitle: "حکومت ہند کی تمام وزارتوں کے قومی فلاحی منصوبے۔",
        searchMinistry: "وزارت تلاش کریں...",
        viewMinistrySchemes: "اسکیمیں دیکھیں"
      },
      footer: {
        copyright: "2026 سیتو | حکومت ہند",
        ownership: "مواد کے جملہ حقوق متعلقہ وزارتوں کے پاس ہیں",
        nic: "این آئی سی کے رہنما اصولوں کے مطابق تیار کردہ",
        gigw: "GIGW کے مطابق | WCAG 2.0 AA"
      }
    }
  },
  or: {
    translation: {
      nav: {
        home: "ମୁଖ୍ୟପୃଷ୍ଠା",
        categories: "ବିଭାଗ",
        states: "ରାଜ୍ୟ/କେନ୍ଦ୍ରଶାସିତ",
        ministries: "କେନ୍ଦ୍ରୀୟ ମନ୍ତ୍ରଣାଳୟ",
        findScheme: "ଯୋଗ୍ୟ ଯୋଜନା ଖୋଜନ୍ତୁ",
        allSchemes: "ସମସ୍ତ ଯୋଜନା",
        cscPortal: "ସିଏସସି ପୋର୍ଟାଲ",
        about: "ସେତୁ ପରିଚୟ",
        login: "ନାଗରିକ ଲଗଇନ୍",
        chatWithAI: "ସେତୁ ଏଆଇ ସହାୟକ",
        searchPlaceholder: "ଯୋଜନାର ନାମ ଖୋଜନ୍ତୁ...",
        govtOfIndia: "ଭାରତ ସରକାର"
      },
      hero: {
        title: "ଆପଣଙ୍କ ପାଇଁ ଉପଯୁକ୍ତ ସରକାରୀ ଯୋଜନା ଖୋଜନ୍ତୁ",
        subtitle: "୩,୦୦୦+ କେନ୍ଦ୍ର ଓ ରାଜ୍ୟ ସରକାରଙ୍କ କଲ୍ୟାଣକାରୀ ଯୋଜନା। AI ସାହାଯ୍ୟରେ ମିନିଟରେ ଯୋଗ୍ୟତା ଜାଣନ୍ତୁ।",
        searchPlaceholder: "ଯୋଜନା, ଯୋଗ୍ୟତା ବା ସୁବିଧା ନାମରେ ଖୋଜନ୍ତୁ...",
        listening: "ଶୁଣୁଛି...",
        speakNow: "କୁହନ୍ତୁ ବା ଲେଖନ୍ତୁ",
        findBtn: "ଯୋଗ୍ୟ ଯୋଜନା ଖୋଜନ୍ତୁ",
        dontKnowTitle: "କେଉଁଠାରୁ ଆରମ୍ଭ କରିବେ ଜାଣିନାହାନ୍ତି?",
        dontKnowSub: "୫ଟି ସହଜ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ। ସେତୁ ଆପଣଙ୍କ ପାଇଁ ଯୋଜନା ଖୋଜିବ।"
      },
      stats: {
        schemesCount: "୩,୦୦୦+ ଯୋଜନା",
        statesCount: "୩୬ ରାଜ୍ୟ ଓ କେନ୍ଦ୍ରଶାସିତ",
        categoriesCount: "୨୦+ ବିଭାଗ",
        citizensHelped: "୫୦ ଲକ୍ଷ+ ହିତାଧିକାରୀ"
      },
      cards: {
        viewDetails: "ବିବରଣୀ ଦେଖନ୍ତୁ",
        saveScheme: "ସାଇତନ୍ତୁ",
        checkEligibility: "ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ",
        applyNow: "ଅଫିସିଆଲ ପୋର୍ଟାଲରେ ଆବେଦନ କରନ୍ତୁ",
        downloadPdf: "କାଗଜପତ୍ର ତାଲିକା ଡାଉନଲୋଡ କରନ୍ତୁ",
        matchBadge: "ଉପଯୁକ୍ତ ଯୋଜନା",
        centralGovt: "କେନ୍ଦ୍ର ସରକାର",
        stateGovt: "ରାଜ୍ୟ ସରକାର",
        exploreAll: "ସବୁ ଦେଖନ୍ତୁ"
      },
      wizard: {
        title: "ଯୋଗ୍ୟତା ମାର୍ଗଦର୍ଶିକା",
        subtitle: "୪ଟି ସହଜ ପଦକ୍ଷେପରେ ଯୋଜନା ଖୋଜନ୍ତୁ",
        step1: "ମୌଳିକ ବିବରଣୀ",
        step2: "ପରିବାର ଓ ଆୟ",
        step3: "ଆବଶ୍ୟକତା",
        step4: "ଯୋଗ୍ୟ ଯୋଜନାସମୂହ",
        ageLabel: "ଆପଣଙ୍କ ବୟସ କେତେ?",
        genderLabel: "ଲିଙ୍ଗ?",
        stateLabel: "ଆପଣ କେଉଁ ରାଜ୍ୟରେ ବାସ କରନ୍ତି?",
        disabilityLabel: "ଆପଣ ଭିନ୍ନକ୍ଷମ କି?",
        incomeLabel: "ବାର୍ଷିକ ପାରିବାରିକ ଆୟ କେତେ?",
        casteLabel: "ସାମାଜିକ ବର୍ଗ",
        bplLabel: "BPL ରାସନ କାର୍ଡ ଅଛି କି?",
        needsLabel: "ଆପଣଙ୍କୁ କି ପ୍ରକାର ସାହାଯ୍ୟ ଦରକାର?",
        resultsFound: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ ପାଇଁ ଯୋଜନା ମିଳିଲା",
        next: "ପରବର୍ତ୍ତୀ",
        prev: "ପୂର୍ବବର୍ତ୍ତୀ",
        showResults: "ଯୋଜନା ଦେଖାନ୍ତୁ"
      },
      chat: {
        title: "ସେତୁ ଏଆଇ ବହୁଭାଷୀ ସହାୟକ",
        status: "ଅନଲାଇନ୍ ଏବଂ ପ୍ରସ୍ତୁତ",
        welcomeTitle: "ନମସ୍କାର! ମୁଁ ସେତୁ, ଆପଣଙ୍କ ସରକାରୀ ଯୋଜନା ମାର୍ଗଦର୍ଶକ।",
        welcomeBody: "ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିପାରିବି:\n- ଯୋଗ୍ୟ ଯୋଜନା ଖୋଜିବାରେ\n- ଆବଶ୍ୟକ ଦସ୍ତାବିଜ ଜାଣିବାରେ\n- ଡିବିଟି ସ୍ଥିତି ଯାଞ୍ଚ କରିବାରେ\n- ଓଡ଼ିଆରେ ସୂଚନା ପାଇବାରେ",
        inputPlaceholder: "ଓଡ଼ିଆରେ ପଚାରନ୍ତୁ...",
        send: "ପଠାନ୍ତୁ",
        voicePrompt: "କହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ"
      },
      categoriesPage: {
        title: "ବିଭାଗ ଅନୁସାରେ ସରକାରୀ ଯୋଜନା",
        subtitle: "ଶିକ୍ଷା, କୃଷି, ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ସାମାଜିକ କଲ୍ୟାଣର ୩୦୦୦+ ଯୋଜନା।",
        schemesAvailable: "ଉପଲବ୍ଧ ଯୋଜନା",
        viewSchemes: "ଯୋଜନା ଦେଖନ୍ତୁ"
      },
      statesPage: {
        title: "ରାଜ୍ୟ ଏବଂ କେନ୍ଦ୍ରଶାସିତ ଅଞ୍ଚଳ ଯୋଜନା",
        subtitle: "୩୬ ରାଜ୍ୟର ସ୍ଥାନୀୟ କଲ୍ୟାଣକାରୀ ଯୋଜନା ଏବଂ ପୋର୍ଟାଲ।",
        searchState: "ରାଜ୍ୟ ଖୋଜନ୍ତୁ...",
        viewStateSchemes: "ରାଜ୍ୟ ଯୋଜନା ଦେଖନ୍ତୁ"
      },
      ministriesPage: {
        title: "କେନ୍ଦ୍ରୀୟ ମନ୍ତ୍ରଣାଳୟ ଏବଂ ବିଭାଗ",
        subtitle: "ଭାରତ ସରକାରଙ୍କ ମନ୍ତ୍ରଣାଳୟ ଦ୍ୱାରା ପରିଚାଳିତ ପ୍ରମୁଖ ଜାତୀୟ ଯୋଜନା।",
        searchMinistry: "ମନ୍ତ୍ରଣାଳୟ ଖୋଜନ୍ତୁ...",
        viewMinistrySchemes: "ଯୋଜନା ଦେଖନ୍ତୁ"
      },
      footer: {
        copyright: "୨୦୨୬ ସେତୁ | ଭାରତ ସରକାର",
        ownership: "ବିଷୟବସ୍ତୁ ସମ୍ପୃକ୍ତ ମନ୍ତ୍ରଣାଳୟର ଅଧୀନ",
        nic: "NIC ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁଯାୟୀ ନିର୍ମିତ",
        gigw: "GIGW ଅନୁପାଳିତ | WCAG 2.0 AA"
      }
    }
  }
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('setu_lang') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Automatically sync language changes to localStorage
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('setu_lang', lng);
  }
});

export default i18n;
