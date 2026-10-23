import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../../types';
import { Bot, User, Wrench, Volume2, VolumeX } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';
import { useTranslation } from 'react-i18next';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isStreaming }) => {
  const { i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  // Smooth scroll to bottom on new message, instant scroll on streaming chunk
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (messages.length !== prevMessagesLength.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      prevMessagesLength.current = messages.length;
    } else if (isStreaming) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner audio
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLangConfig.speechCode || 'en-IN';
    utterance.rate = 0.95;

    // Find native voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.startsWith(i18n.language));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scroll-smooth"
    >
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        const isLastAssistant = !isUser && index === messages.length - 1 && isStreaming;
        const msgId = msg.id || `msg-${index}`;
        const isSpeaking = speakingId === msgId;

        return (
          <div
            key={msgId}
            className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {/* AI Avatar */}
            {!isUser && (
              <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center flex-shrink-0 font-serif font-bold text-xs shadow-xs border border-white/20 mt-1">
                सेतु
              </div>
            )}

            {/* Bubble Content */}
            <div className="max-w-[85%] sm:max-w-[78%] space-y-2">
              {/* Tool Execution Badge (if present) */}
              {msg.tool_call && (
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-2 text-[11px] text-slate-700 flex items-center space-x-2 font-mono shadow-2xs">
                  <Wrench className="w-3.5 h-3.5 text-[#FF7700] flex-shrink-0" />
                  <span>Scanning Database: <strong>{msg.tool_call.tool}</strong></span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs transition-colors relative group ${
                  isUser
                    ? 'bg-[#00875A] text-white rounded-tr-none font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.content ? (
                  <div className="whitespace-pre-line break-words">{msg.content}</div>
                ) : isLastAssistant ? (
                  <div className="flex items-center space-x-1.5 py-1 px-1">
                    <span className="w-2 h-2 rounded-full bg-[#00875A] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#00875A] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#00875A] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : null}

                {/* Speaker Button for Assistant Messages */}
                {!isUser && msg.content && !isStreaming && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSpeak(msgId, msg.content)}
                      className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                        isSpeaking
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'text-slate-500 hover:text-[#00875A] hover:bg-slate-100'
                      }`}
                      title={isSpeaking ? "Stop Speaking" : "Listen in your language"}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen Voice ({currentLangConfig.name})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              {msg.timestamp && (
                <div
                  className={`text-[10px] text-slate-400 px-1 ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
