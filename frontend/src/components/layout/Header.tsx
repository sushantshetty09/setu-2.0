import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LogOut, CheckCircle, Search, Globe, ChevronDown } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { VoiceButton } from '../common/VoiceButton';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('setu_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('setu_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('setu_user');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/schemes?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript) {
      setSearchQuery(transcript);
      navigate(`/schemes?search=${encodeURIComponent(transcript)}`);
    }
  };

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('setu_lang', langCode);
    setLangDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          
          {/* 1. Left: SETU Branding */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            {/* SETU Logo mark */}
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#0B2545] to-[#00875A] rounded-xl shadow-md">
              <span className="text-white font-black text-lg leading-none tracking-tighter">से</span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-2xl tracking-tight text-[#0B2545]">
                  SETU
                </span>
                <span className="text-slate-300 font-light text-xl">|</span>
                <span className="font-bold text-xl text-[#FF7700] font-serif">
                  {currentLang.code === 'en' ? 'सेतु' : currentLang.native}
                </span>
              </div>
              <div className="text-[10px] font-medium text-slate-500">
                AI-Powered Citizen Welfare Discovery
              </div>
            </div>
          </Link>

          {/* 2. Center: Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="flex items-center border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-[#00875A] focus-within:ring-2 focus-within:ring-[#00875A]/20 transition-all">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder', 'Enter a scheme name (e.g. PM Kisan, Vidyasiri, Scholarships...)')}
                  className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                />
                <div className="flex items-center space-x-1 text-slate-400 pl-2">
                  <VoiceButton onTranscript={handleVoiceTranscript} size="sm" />
                  <button
                    type="submit"
                    className="p-1 hover:text-[#00875A] transition-colors"
                    title="Search schemes"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 3. Right: Language & Sign In */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#00875A]" />
                <span className="hidden sm:inline">{currentLang.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full px-3 py-1.5 text-left text-xs transition-colors flex items-center justify-between ${
                        i18n.language === lang.code
                          ? 'bg-emerald-50 text-[#00875A] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-medium">{lang.native}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Login / Profile Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5">
                <Link to="/dashboard" className="flex items-center space-x-1.5 hover:opacity-80 transition-opacity">
                  <CheckCircle className="w-4 h-4 text-[#00875A]" />
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline">{currentUser.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-600 p-0.5 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center space-x-1.5 bg-[#00875A] hover:bg-[#00704A] text-white px-3.5 py-1.5 rounded-md font-bold text-xs shadow-xs hover:shadow transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav.login', 'Sign In')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="px-4 pb-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder', 'Search schemes (e.g. PM Kisan, Scholarships)...')}
                className="w-full text-xs bg-transparent outline-none text-slate-800"
              />
              <button type="submit" className="p-1 text-slate-500">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </header>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};
