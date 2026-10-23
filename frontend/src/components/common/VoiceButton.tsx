import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md'
}) => {
  const { i18n } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const onTranscriptRef = useRef(onTranscript);

  // Keep callback ref updated without triggering effect re-runs
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language);
      recognition.lang = currentLangConfig?.speechCode || 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMessage(null);
        accumulatedTranscriptRef.current = '';
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += trans + ' ';
          } else {
            interimTranscript += trans;
          }
        }

        const currentFull = (finalTranscript || interimTranscript).trim();
        if (currentFull) {
          accumulatedTranscriptRef.current = currentFull;
          onTranscriptRef.current(currentFull);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition event error:", event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Mic blocked. Allow permission in browser.');
        } else if (event.error === 'no-speech') {
          // No speech detected, ignore or keep listening
        } else {
          setErrorMessage(`Mic error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (accumulatedTranscriptRef.current.trim()) {
          onTranscriptRef.current(accumulatedTranscriptRef.current.trim());
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Speech Recognition initialization error:", err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [i18n.language]);

  const toggleRecording = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or Microsoft Edge.");
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsRecording(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (micErr) {
            console.warn("Mic permission prompt warning:", micErr);
          }
        }

        if (recognitionRef.current) {
          const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language);
          recognitionRef.current.lang = currentLangConfig?.speechCode || 'en-IN';
          accumulatedTranscriptRef.current = '';
          recognitionRef.current.start();
          setIsRecording(true);
          setErrorMessage(null);
        }
      } catch (e: any) {
        console.error("Failed to start voice recognition:", e);
        try {
          recognitionRef.current?.stop();
          setTimeout(() => {
            recognitionRef.current?.start();
            setIsRecording(true);
          }, 200);
        } catch (err) {
          setErrorMessage('Could not activate microphone.');
        }
      }
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleRecording}
        className={`relative flex items-center justify-center rounded-full transition-all focus:outline-hidden ${sizeClasses[size]} ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-md ring-2 ring-red-400'
            : 'bg-emerald-50 hover:bg-emerald-100 text-[#00875A] border border-emerald-300 shadow-2xs'
        } ${className}`}
        title={isRecording ? 'Listening... Click to send speech' : 'Voice Input (Click and speak)'}
        aria-label="Voice input button"
      >
        {isRecording ? (
          <Mic className="w-4 h-4 animate-bounce" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Floating Listening Indicator Badge */}
      {isRecording && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg flex items-center space-x-1 z-50 animate-pulse">
          <Radio className="w-2.5 h-2.5" />
          <span>Listening...</span>
        </span>
      )}

      {errorMessage && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
