import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, MessageSquareCode, Bookmark, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1 flex items-center justify-around no-print">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive ? 'text-setu-blue font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/find"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive ? 'text-setu-blue font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span>Find</span>
      </NavLink>

      {/* Center Chat Highlight */}
      <NavLink
        to="/chat"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center -mt-4 bg-setu-saffron text-white rounded-full w-12 h-12 shadow-lg min-h-[48px] min-w-[48px] transition-transform active:scale-95 ${
            isActive ? 'ring-4 ring-setu-saffron/30' : ''
          }`
        }
      >
        <MessageSquareCode className="w-6 h-6" />
      </NavLink>

      <NavLink
        to="/schemes"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive ? 'text-setu-blue font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Bookmark className="w-5 h-5 mb-0.5" />
        <span>Schemes</span>
      </NavLink>

      <NavLink
        to="/csc"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive ? 'text-setu-blue font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>CSC/Portal</span>
      </NavLink>
    </div>
  );
};
