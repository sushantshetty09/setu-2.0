import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scheme } from '../../types';
import { Heart, IndianRupee, Calendar, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  showMatchBadge?: boolean;
  onCheckEligibility?: (scheme: Scheme) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  agriculture: '#FF6B00',
  women: '#8B5CF6',
  health: '#138808',
  education: '#1A3A6B',
  housing: '#0284C7',
  employment: '#0D9488',
  entrepreneurship: '#DC2626',
  disability: '#D97706',
  senior_citizens: '#4F46E5',
  environment: '#16A34A',
};

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  showMatchBadge = false,
  onCheckEligibility,
}) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => {
    const savedList = JSON.parse(localStorage.getItem('setu_saved_schemes') || '[]');
    return savedList.includes(scheme.id);
  });

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const savedList = JSON.parse(localStorage.getItem('setu_saved_schemes') || '[]');
    let updated;
    if (saved) {
      updated = savedList.filter((id: string) => id !== scheme.id);
    } else {
      updated = [...savedList, scheme.id];
    }
    localStorage.setItem('setu_saved_schemes', JSON.stringify(updated));
    setSaved(!saved);
  };

  const borderColor = CATEGORY_COLORS[scheme.category?.toLowerCase()] || '#00875A';
  const officialUrl = scheme.apply_url || 'https://myscheme.gov.in';

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden"
      style={{ borderLeft: `5px solid ${borderColor}` }}
    >
      <div className="p-4 sm:p-5">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {scheme.category}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                scheme.scheme_type === 'Central'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {scheme.scheme_type === 'Central' ? 'Central Scheme' : (scheme.state || 'State')}
            </span>
          </div>

          {/* Match % badge */}
          {(showMatchBadge || scheme.match_percentage) && (
            <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{scheme.match_percentage || 94}% Match</span>
            </div>
          )}
        </div>

        {/* Scheme Title & Native Name */}
        <Link to={`/schemes/${scheme.id}`} className="group block">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-[#00875A] transition-colors leading-snug">
            {scheme.name}
          </h3>
          {scheme.name_native && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
              {scheme.name_native}
            </p>
          )}
        </Link>

        {/* Ministry Subtext */}
        <p className="text-[12px] text-slate-500 mt-1 line-clamp-1">
          {scheme.ministry}
        </p>

        {/* Summary */}
        <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
          {scheme.summary}
        </p>

        {/* Benefit & Status Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 font-bold text-slate-800">
            <IndianRupee className="w-3.5 h-3.5 text-[#00875A] flex-shrink-0" />
            <span className="text-[#00875A]">{scheme.benefit_amount}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Status: <strong className="text-emerald-700">{scheme.status}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-slate-50/90 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Link
            to={`/schemes/${scheme.id}`}
            className="text-xs font-semibold text-slate-700 hover:text-[#00875A] flex items-center space-x-1 py-1"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={toggleSave}
            className={`p-1.5 rounded-md border transition-colors ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title={saved ? 'Remove from saved' : 'Save scheme'}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Direct Link to Official Government Website */}
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold px-3 py-1.5 rounded-md bg-[#00875A] hover:bg-[#00704A] text-white shadow-xs transition-all flex items-center space-x-1.5"
          title={`Open official portal: ${officialUrl}`}
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3 text-white/90" />
        </a>
      </div>
    </div>
  );
};
