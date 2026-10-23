import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';
import { Eye, Volume2, Globe, ChevronDown, Check } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const { i18n } = useTranslation();
  const [highContrast, setHighContrast] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [screenReaderAnnounced, setScreenReaderAnnounced] = useState(false);

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const changeFontSize = (delta: number) => {
    const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-scale') || '1');
    const newScale = Math.min(1.3, Math.max(0.85, (current || 1) + delta));
    document.documentElement.style.setProperty('--font-scale', `${newScale}rem`);
  };

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLangDropdownOpen(false);
  };

  const announceScreenReader = () => {
    setScreenReaderAnnounced(true);
    setTimeout(() => setScreenReaderAnnounced(false), 4000);
  };

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="bg-[#1A1A1A] text-white text-xs h-9 px-4 flex items-center justify-between z-50 relative border-b border-neutral-800 no-print">
      {/* Skip link */}
      <div className="flex items-center space-x-3">
        <a
          href="#main-content"
          className="text-neutral-300 hover:text-white transition-colors focus:ring-1 focus:ring-setu-saffron focus:px-2 rounded"
        >
          Skip to main content
        </a>
        <span className="text-neutral-600 hidden sm:inline">|</span>
        <button
          onClick={announceScreenReader}
          className="hidden md:flex items-center space-x-1 text-neutral-300 hover:text-white transition-colors"
          title="Screen Reader Access"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Screen Reader</span>
        </button>
        {screenReaderAnnounced && (
          <span className="text-emerald-400 text-[11px] animate-pulse">Screen Reader Mode Active</span>
        )}
      </div>

      {/* Accessibility Controls & Language Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Font resize buttons */}
        <div className="flex items-center space-x-1 bg-neutral-800 rounded px-1.5 py-0.5 border border-neutral-700">
          <span className="text-[11px] text-neutral-400 mr-1">Font:</span>
          <button
            onClick={() => changeFontSize(-0.05)}
            className="px-1.5 py-0.5 hover:bg-neutral-700 rounded text-neutral-200 font-bold"
            title="Decrease font size"
          >
            A-
          </button>
          <button
            onClick={() => document.documentElement.style.setProperty('--font-scale', '1rem')}
            className="px-1.5 py-0.5 hover:bg-neutral-700 rounded text-neutral-200 font-bold"
            title="Reset font size"
          >
            A
          </button>
          <button
            onClick={() => changeFontSize(0.05)}
            className="px-1.5 py-0.5 hover:bg-neutral-700 rounded text-neutral-200 font-bold"
            title="Increase font size"
          >
            A+
          </button>
        </div>

        {/* High Contrast */}
        <button
          onClick={toggleHighContrast}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded border transition-colors ${
            highContrast
              ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
              : 'border-neutral-700 hover:bg-neutral-800 text-neutral-200'
          }`}
          title="Toggle High Contrast Mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">High Contrast</span>
        </button>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center space-x-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-2.5 py-0.5 rounded text-neutral-200 font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-setu-saffron" />
            <span>{currentLang.native}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-neutral-900 border border-neutral-700 rounded-md shadow-2xl py-1 z-50 grid grid-cols-2 gap-0.5 max-h-72 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-setu-blue text-white font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <span>{lang.native}</span>
                  {i18n.language === lang.code && <Check className="w-3 h-3 text-setu-saffron" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
