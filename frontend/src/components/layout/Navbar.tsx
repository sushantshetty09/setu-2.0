import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layers, MapPin, Building2, Compass, Sparkles, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="bg-[#0B2545] text-white sticky top-[61px] z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 overflow-x-auto py-1.5 text-xs sm:text-sm font-medium scrollbar-none">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('nav.home', 'Home')}</span>
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('nav.categories', 'Categories')}</span>
          </NavLink>

          <NavLink
            to="/states"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('nav.states', 'States/UTs')}</span>
          </NavLink>

          <NavLink
            to="/ministries"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('nav.ministries', 'Central Ministries')}</span>
          </NavLink>

          <NavLink
            to="/find"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white/15 text-white font-bold ring-1 ring-amber-400/40'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('nav.findScheme', 'Find Schemes for You')}</span>
          </NavLink>
        </div>

        {/* Right side AI Assistant Button */}
        <div className="py-1.5 flex items-center space-x-2">
          <NavLink
            to="/chat"
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-xs ${
              location.pathname === '/chat'
                ? 'bg-[#00875A] text-white ring-2 ring-emerald-300'
                : 'bg-emerald-700/60 hover:bg-[#00875A] text-white border border-emerald-500/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">{t('nav.chatWithAI', 'SETU AI Assistant')}</span>
            <span className="sm:hidden">AI</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
