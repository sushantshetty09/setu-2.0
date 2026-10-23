import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { VoiceButton } from '../common/VoiceButton';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  suggestions?: string[];
  onSelectSuggestion: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  suggestions = [],
  onSelectSuggestion
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript && transcript.trim()) {
      setInput(transcript.trim());
    }
  };

  const defaultSuggestions = [
    "Find scholarship for college",
    "Show scholarship offers & amounts",
    "Did I get my Gruha Lakshmi money?",
    "What documents do I need for PM Kisan?",
    "Check Ayushman Bharat cover"
  ];

  const activePills = suggestions.length > 0 ? suggestions : defaultSuggestions;

  return (
    <div className="bg-white border-t border-slate-200 p-3 sm:p-4 space-y-2.5 flex-shrink-0">
      {/* Contextual Quick Reply Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <Sparkles className="w-3.5 h-3.5 text-[#FF7700] flex-shrink-0" />
        {activePills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(pill)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#00875A] hover:text-white text-slate-700 font-medium whitespace-nowrap transition-all border border-slate-200 shadow-2xs"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
        {/* Voice Microphone Input */}
        <VoiceButton
          onTranscript={handleVoiceTranscript}
          size="md"
        />

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask SETU in your language (e.g. Find scholarship offers for college)..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#00875A] focus:ring-1 focus:ring-[#00875A] transition-all"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="w-10 h-10 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white flex items-center justify-center shadow-sm disabled:opacity-40 transition-all flex-shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
