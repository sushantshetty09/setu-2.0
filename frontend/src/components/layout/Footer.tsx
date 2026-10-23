import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C2331] text-slate-300 pt-12 pb-6 border-t-4 border-[#00875A] no-print text-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-700/60">
          
          {/* Col 1: SETU Branding */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-[#0B2545] to-[#00875A] rounded-xl shadow">
                <span className="text-white font-black text-base leading-none">से</span>
              </div>
              <span className="font-extrabold text-2xl text-white">SETU</span>
              <span className="text-slate-400 font-light text-xl">|</span>
              <span className="font-bold text-xl text-[#FF7700] font-serif">सेतु</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Citizen Welfare Discovery Platform.<br />
              Find, understand, and access government welfare schemes in your language.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
              <Sparkles className="w-4 h-4 text-[#00875A]" />
              <span>Powered by Google Gemini AI</span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#00875A]" />
              <span>Multilingual · Accessible · Privacy First</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-1.5 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About SETU
                </Link>
              </li>
              <li>
                <Link to="/find" className="hover:text-emerald-400 transition-colors">
                  Find Schemes for You
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-emerald-400 transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-emerald-400 transition-colors">
                  All Schemes
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-emerald-400 transition-colors">
                  SETU AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Explore */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-1.5 inline-block">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/states" className="hover:text-emerald-400 transition-colors">
                  Schemes by State
                </Link>
              </li>
              <li>
                <Link to="/ministries" className="hover:text-emerald-400 transition-colors">
                  Schemes by Ministry
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-emerald-400 transition-colors">
                  Women &amp; Child Welfare
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-emerald-400 transition-colors">
                  Agriculture &amp; Farmers
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-emerald-400 transition-colors">
                  Education &amp; Scholarships
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Get In Touch */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-1.5 inline-block">
              Get in Touch
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>support@setu.app</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Helpline: 1800-111-555</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p>Bengaluru, Karnataka, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 space-y-3 md:space-y-0">
          <div>
            <p>&copy; 2026 SETU. All Rights Reserved.</p>
            <p className="text-[11px] text-slate-500">Helping citizens discover welfare entitlements across India.</p>
          </div>

          <div className="flex items-center space-x-5 text-xs text-slate-400">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-500">v2.0 · Built with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
