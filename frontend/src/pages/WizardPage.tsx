import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap, 
  HeartPulse, 
  Home, 
  Briefcase, 
  Sprout, 
  TrendingUp, 
  Clock, 
  Heart, 
  Baby, 
  Layers,
  Filter,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { SchemeCard } from '../components/common/SchemeCard';
import { matchWizardSchemes } from '../services/api';
import { Scheme, WizardState } from '../types';

const INDIAN_STATES_LIST = [
  "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", 
  "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli", "Ladakh", "Lakshadweep", "Puducherry"
];

const NEEDS_CARDS = [
  { id: "education", label: "Education & Scholarship", icon: GraduationCap, color: "#1A3A6B" },
  { id: "health", label: "Healthcare & Insurance", icon: HeartPulse, color: "#138808" },
  { id: "housing", label: "Housing & Pucca House", icon: Home, color: "#0284C7" },
  { id: "job", label: "Job & Skill Training", icon: Briefcase, color: "#0D9488" },
  { id: "agriculture", label: "Agriculture & Farming", icon: Sprout, color: "#FF6B00" },
  { id: "business", label: "Business Micro-Loans", icon: TrendingUp, color: "#DC2626" },
  { id: "pension", label: "Old Age Pension", icon: Clock, color: "#4F46E5" },
  { id: "women", label: "Women Empowerment", icon: Heart, color: "#8B5CF6" },
  { id: "maternity", label: "Maternity Support", icon: Baby, color: "#EA580C" },
  { id: "other", label: "Other Social Welfare", icon: Layers, color: "#64748B" }
];

export const WizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<WizardState>({
    age: 35,
    gender: 'female',
    state: 'Karnataka',
    is_differently_abled: false,
    income_annual: 180000,
    caste_category: 'obc',
    is_bpl: true,
    needs: ['women', 'education']
  });

  // Results & filters
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<Scheme | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      setLoading(true);
      try {
        const res = await matchWizardSchemes(formData);
        setMatchedSchemes(res.schemes || []);
        setCurrentStep(4);
      } catch (e) {
        console.error("Match error:", e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleNeed = (needId: string) => {
    const exists = formData.needs.includes(needId);
    if (exists) {
      setFormData(prev => ({ ...prev, needs: prev.needs.filter(n => n !== needId) }));
    } else {
      setFormData(prev => ({ ...prev, needs: [...prev.needs, needId] }));
    }
  };

  // Filter and sort results
  const filteredResults = matchedSchemes.filter(s => {
    if (filterCategory !== 'all' && s.category.toLowerCase() !== filterCategory.toLowerCase()) return false;
    if (filterType !== 'all' && s.scheme_type.toLowerCase() !== filterType.toLowerCase()) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'relevance') return (b.match_percentage || 0) - (a.match_percentage || 0);
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-setu-blue px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-setu-saffron" />
          <span>SETU Eligibility Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find What You Are Entitled To
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Answer a few quick questions to discover exact matching central and state welfare benefits.
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, title: "Basic Profile" },
            { step: 2, title: "Household & Income" },
            { step: 3, title: "Needs & Services" },
            { step: 4, title: "Eligible Schemes" }
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => item.step < currentStep && setCurrentStep(item.step)}
              className={`flex flex-col items-center cursor-pointer transition-all ${
                currentStep >= item.step ? 'text-setu-blue font-bold' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold transition-all ${
                  currentStep === item.step
                    ? 'bg-setu-blue text-white ring-4 ring-blue-100'
                    : currentStep > item.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {currentStep > item.step ? <Check className="w-4 h-4" /> : item.step}
              </div>
              <span className="hidden sm:inline">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: BASIC PROFILE */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fade-in">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Step 1 — Basic Profile
          </h2>

          {/* Age Slider + Number Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              How old are you?
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="100"
                value={formData.age || 35}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="flex-1 accent-setu-blue"
              />
              <div className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-center font-bold text-slate-900 text-sm bg-slate-50">
                {formData.age} yrs
              </div>
            </div>
          </div>

          {/* Gender Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              What is your gender?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'male', label: 'Male' },
                { id: 'female', label: 'Female' },
                { id: 'transgender', label: 'Transgender' },
                { id: 'any', label: 'Prefer not to say' }
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g.id })}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                    formData.gender === g.id
                      ? 'bg-setu-blue text-white border-setu-blue shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* State Searchable Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Which state or UT do you reside in?
            </label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium focus:bg-white focus:border-setu-blue focus:ring-1 focus:ring-setu-blue"
            >
              {INDIAN_STATES_LIST.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Differently Abled Toggle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Are you differently abled (Person with Disability)?
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_differently_abled: true })}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  formData.is_differently_abled
                    ? 'bg-setu-blue text-white border-setu-blue shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_differently_abled: false })}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  !formData.is_differently_abled
                    ? 'bg-setu-blue text-white border-setu-blue shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="bg-setu-saffron hover:bg-setu-saffron-dark text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg flex items-center space-x-2 shadow-sm transition-all"
            >
              <span>Next: Household & Income</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: HOUSEHOLD & INCOME */}
      {currentStep === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fade-in">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Step 2 — Household & Social Category
          </h2>

          {/* Income Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Approximate Annual Household Income
              </label>
              <span className="text-sm font-extrabold text-setu-green bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                Rs {(formData.income_annual || 180000).toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="25000"
              value={formData.income_annual || 180000}
              onChange={(e) => setFormData({ ...formData, income_annual: Number(e.target.value) })}
              className="w-full accent-setu-blue"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Below 1L</span>
              <span>1-3L</span>
              <span>3-6L</span>
              <span>6-10L</span>
              <span>10L+</span>
            </div>
          </div>

          {/* Social Category Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Social Category / Caste
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'general', label: 'General / Unreserved' },
                { id: 'obc', label: 'OBC' },
                { id: 'sc', label: 'SC (Scheduled Caste)' },
                { id: 'st', label: 'ST (Scheduled Tribe)' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, caste_category: c.id })}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                    formData.caste_category === c.id
                      ? 'bg-setu-blue text-white border-setu-blue shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* BPL Card Toggle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Do you hold a BPL (Below Poverty Line) / Antyodaya Ration Card?
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_bpl: true })}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  formData.is_bpl
                    ? 'bg-setu-blue text-white border-setu-blue shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Yes (BPL / Antyodaya Cardholder)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_bpl: false })}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  !formData.is_bpl
                    ? 'bg-setu-blue text-white border-setu-blue shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                No / APL
              </button>
            </div>
          </div>

          {/* Nav Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              className="bg-setu-saffron hover:bg-setu-saffron-dark text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg flex items-center space-x-2 shadow-sm transition-all"
            >
              <span>Next: Needs & Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: WHAT DO YOU NEED? */}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Step 3 — What Support or Benefits Do You Need?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select all categories that apply to you or your family members
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {NEEDS_CARDS.map((card) => {
              const Icon = card.icon;
              const isSelected = formData.needs.includes(card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => toggleNeed(card.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-setu-blue bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-setu-blue text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <span className="font-bold text-xs text-slate-800 leading-tight">
                    {card.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Nav Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-setu-green hover:bg-setu-green-dark text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-lg flex items-center space-x-2 shadow-md transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Analyzing Schemes...' : 'Find My Eligible Schemes'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RESULTS */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          {/* Results Summary Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-setu-green" />
                <span>Found {filteredResults.length} Schemes Matching Your Profile</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Matched for: {formData.age} yrs • {formData.gender.toUpperCase()} • {formData.state} • Income Rs {formData.income_annual?.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-setu-blue hover:underline whitespace-nowrap text-left sm:text-right"
            >
              Edit Profile Details
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-slate-700">Filters:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-700"
              >
                <option value="all">All Categories</option>
                <option value="women">Women Empowerment</option>
                <option value="agriculture">Agriculture</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="housing">Housing</option>
                <option value="entrepreneurship">Entrepreneurship</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-700"
              >
                <option value="all">Central & State</option>
                <option value="central">Central Only</option>
                <option value="state">State Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-700"
              >
                <option value="relevance">Sort: Highest Match %</option>
              </select>
            </div>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                showMatchBadge={true}
                onCheckEligibility={(s) => setSelectedSchemeForModal(s)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Eligibility Checklist Modal */}
      {selectedSchemeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-setu-blue text-white p-4 flex items-center justify-between border-b-2 border-setu-saffron">
              <div>
                <h3 className="font-bold text-sm">Eligibility Assessment Breakdown</h3>
                <p className="text-[11px] text-slate-200">{selectedSchemeForModal.name}</p>
              </div>
              <button
                onClick={() => setSelectedSchemeForModal(null)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <span className="font-bold text-slate-800 text-sm">Calculated Match</span>
                <span className="font-extrabold text-emerald-700 text-base">
                  {selectedSchemeForModal.match_percentage || 94}% Eligible
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-setu-green mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Age Qualification (Provided: {formData.age} years)</strong>
                    <p className="text-slate-500 text-[11px]">Meets required criteria (18 - 65 yrs)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-setu-green mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">State Domicile ({formData.state})</strong>
                    <p className="text-slate-500 text-[11px]">Valid residency verified</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-setu-green mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Income Limit (Rs {formData.income_annual?.toLocaleString()})</strong>
                    <p className="text-slate-500 text-[11px]">Within the prescribed ceiling limit</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 p-2.5 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-setu-green mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Gender Entitlement ({formData.gender.toUpperCase()})</strong>
                    <p className="text-slate-500 text-[11px]">Permitted category</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setSelectedSchemeForModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate(`/schemes/${selectedSchemeForModal.id}`)}
                  className="px-4 py-2 bg-setu-saffron hover:bg-setu-saffron-dark text-white rounded-lg font-bold shadow-xs"
                >
                  View Scheme & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
