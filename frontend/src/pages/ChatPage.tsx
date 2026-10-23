import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  RotateCcw, 
  Layers, 
  ChevronDown, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronUp,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { ChatMessages } from '../components/chat/ChatMessages';
import { ChatInput } from '../components/chat/ChatInput';
import { DynamicRightPanel, RightPanelState } from '../components/chat/DynamicRightPanel';
import { DigiLockerModal } from '../components/common/DigiLockerModal';
import { SUPPORTED_LANGUAGES } from '../i18n/config';
import { ChatMessage, DigiLockerUser } from '../types';

export const ChatPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [rightPanelState, setRightPanelState] = useState<RightPanelState>('IDLE');
  const [rightPanelData, setRightPanelData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [digiLockerModalOpen, setDigiLockerModalOpen] = useState(false);
  const [digiLockerUser, setDigiLockerUser] = useState<DigiLockerUser | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  // Speak helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || !text.trim()) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`[\]()]/g, ' ').replace(/\n+/g, '. ');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = currentLang.speechCode || 'en-IN';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.startsWith(i18n.language));
      if (matchingVoice) utterance.voice = matchingVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('TTS error:', e);
    }
  };

  // Initialize welcome message
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: t('chat.welcomeTitle', 'Namaste! I am SETU, your official government services guide.') + '\n\n' + t('chat.welcomeBody', 'I can help you find schemes you are eligible for, understand required documents, and check payment status.'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "Find schemes for me",
        "I need a scholarship for college",
        "Did I get my Gruha Lakshmi money this month?",
        "Check my PM Kisan payment",
        "What documents do I need for PM Kisan?"
      ]
    };
    setMessages([welcomeMsg]);
    setSuggestions(welcomeMsg.suggestions || []);

    // Auto-fire query if passed via URL
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, [i18n.language]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Cancel ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantMsgId = `ast-${Date.now()}`;
    let assistantContent = '';

    // Create placeholder assistant message
    setMessages(prev => [
      ...prev,
      {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const requestPayload = JSON.stringify({
        message: text,
        language: i18n.language,
        conversation_history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        user_profile: {
          state: "Karnataka",
          gender: "female",
          digilocker_verified: !!digiLockerUser
        }
      });

      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
      let response: Response;
      try {
        response = await fetch(`${apiBase}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestPayload
        });
      } catch (networkErr) {
        // Fallback to direct backend port only during local development if reverse proxy is offline
        if (!import.meta.env.VITE_API_BASE_URL && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          response = await fetch('http://127.0.0.1:8000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestPayload
          });
        } else {
          throw networkErr;
        }
      }

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;

            try {
              const parsed = JSON.parse(dataStr);

              if (parsed.type === 'text') {
                assistantContent += parsed.content;
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, content: assistantContent } : m)
                );
              } else if (parsed.type === 'tool_call') {
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, tool_call: parsed } : m)
                );
              } else if (parsed.type === 'tool_result') {
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, tool_result: parsed.data } : m)
                );
              } else if (parsed.type === 'action') {
                if (parsed.action === 'show_schemes') {
                  setRightPanelState('SCHEMES_FOUND');
                  setRightPanelData(parsed.data);
                } else if (parsed.action === 'show_digilocker_prompt') {
                  setRightPanelState('DIGILOCKER_PERMISSION');
                  setRightPanelData(parsed.data);
                } else if (parsed.action === 'show_document_checklist') {
                  setRightPanelState('DOCUMENT_NEEDED');
                  setRightPanelData(parsed.data);
                } else if (parsed.action === 'show_eligibility_breakdown') {
                  setRightPanelState('ELIGIBILITY_RESULT');
                  setRightPanelData(parsed.data);
                }
              } else if (parsed.type === 'suggestions') {
                setSuggestions(parsed.pills || []);
              }
            } catch (err) {
              console.error("Stream parse error:", err);
            }
          }
        }
      }

      // If auto-voice is enabled, speak out response in the chosen language
      if (autoVoice && assistantContent) {
        speakText(assistantContent);
      }

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: "We are experiencing a temporary network issue. Please retry your inquiry." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setRightPanelState('IDLE');
    setRightPanelData(null);
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: t('chat.welcomeTitle', 'Namaste! I am SETU, your official government services guide.') + '\n\n' + t('chat.welcomeBody', 'How can I assist you today?'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "Find schemes for me",
        "I need a scholarship for college",
        "Did I get my Gruha Lakshmi money this month?",
        "Check my PM Kisan payment"
      ]
    };
    setMessages([welcomeMsg]);
    setSuggestions(welcomeMsg.suggestions || []);
  };

  const handleDigiLockerSuccess = (user: DigiLockerUser) => {
    setDigiLockerUser(user);
    handleSendMessage("I have connected my DigiLocker. Please check my payment status now.");
  };

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('setu_lang', code);
    setLangDropdownOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 h-[calc(100vh-130px)] flex flex-col">
      {/* Chat Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-[#1A3A6B] text-white px-4 py-3 flex items-center justify-between border-b-2 border-setu-saffron flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-serif font-bold text-setu-saffron text-sm border border-white/20">
              {currentLang.code === 'en' ? 'सेतु' : currentLang.native.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm sm:text-base">{t('chat.title', 'SETU AI Assistant')}</h2>
                <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('chat.status', 'Online')}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Multilingual Voice & Conversational Entitlement Guide
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Auto-Voice Reply Toggle */}
            <button
              onClick={() => {
                if (autoVoice && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setAutoVoice(!autoVoice);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                autoVoice
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
              title={autoVoice ? "Voice Reply is ON (Click to mute)" : "Voice Reply is OFF (Click to enable audio reply)"}
            >
              {autoVoice ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{autoVoice ? 'Voice Reply ON' : 'Voice Reply OFF'}</span>
            </button>

            {/* Mobile Context Panel Toggle */}
            <button
              onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
              className="lg:hidden flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded text-xs font-medium transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-setu-saffron" />
                <span>{currentLang.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-md shadow-2xl py-1 z-50 max-h-60 overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-1.5 text-xs block transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-200 hover:bg-setu-blue hover:text-white'
                      }`}
                    >
                      {lang.native} ({lang.name})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors"
              title="Start a new chat session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Chat Body: Left Messages + Right Dynamic Panel */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Chat Flow */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
            <ChatMessages messages={messages} isStreaming={isStreaming} />

            <ChatInput
              onSendMessage={handleSendMessage}
              onSelectSuggestion={(text) => handleSendMessage(text)}
              disabled={isStreaming}
              suggestions={suggestions}
            />
          </div>

          {/* Right Dynamic Context Panel (Desktop) */}
          <div className="hidden lg:block w-[380px] xl:w-[420px] border-l border-slate-200 bg-white overflow-y-auto">
            <DynamicRightPanel
              state={rightPanelState}
              data={rightPanelData}
              onOpenDigiLocker={() => setDigiLockerModalOpen(true)}
              onSelectSuggestion={(q) => handleSendMessage(q)}
            />
          </div>

          {/* Mobile Right Context Drawer */}
          {mobilePanelOpen && (
            <div className="lg:hidden absolute inset-0 z-30 bg-white flex flex-col animate-in slide-in-from-bottom duration-200">
              <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-xs text-slate-700">Scheme Information & Tools</span>
                <button
                  onClick={() => setMobilePanelOpen(false)}
                  className="text-xs text-slate-500 font-bold px-2 py-1 bg-white border border-slate-200 rounded"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <DynamicRightPanel
                  state={rightPanelState}
                  data={rightPanelData}
                  onOpenDigiLocker={() => {
                    setMobilePanelOpen(false);
                    setDigiLockerModalOpen(true);
                  }}
                  onSelectSuggestion={(q) => {
                    setMobilePanelOpen(false);
                    handleSendMessage(q);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DigiLocker Simulation Modal */}
      <DigiLockerModal
        isOpen={digiLockerModalOpen}
        onClose={() => setDigiLockerModalOpen(false)}
        onSuccess={handleDigiLockerSuccess}
      />
    </div>
  );
};
