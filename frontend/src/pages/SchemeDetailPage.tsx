import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ChevronRight, 
  ExternalLink, 
  Heart, 
  Share2, 
  CheckCircle2, 
  XCircle,
  FileCheck2, 
  Download, 
  Printer, 
  Info, 
  Calendar, 
  IndianRupee, 
  Landmark, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { fetchSchemeById } from '../services/api';
import { Scheme } from '../types';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [saved, setSaved] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState<{ [key: number]: boolean }>({ 0: true });

  // Mini Eligibility questionnaire state
  const [miniQ, setMiniQ] = useState({
    isResident: true,
    incomeOk: true,
    ageOk: true,
  });
  const [miniResult, setMiniResult] = useState<boolean | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchSchemeById(id)
      .then((data) => {
        setScheme(data);
        const savedList = JSON.parse(localStorage.getItem('setu_saved_schemes') || '[]');
        setSaved(savedList.includes(data.id));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSave = () => {
    if (!scheme) return;
    const savedList = JSON.parse(localStorage.getItem('setu_saved_schemes') || '[]');
    let updated;
    if (saved) {
      updated = savedList.filter((sId: string) => sId !== scheme.id);
    } else {
      updated = [...savedList, scheme.id];
    }
    localStorage.setItem('setu_saved_schemes', JSON.stringify(updated));
    setSaved(!saved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scheme?.name,
        text: scheme?.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Scheme link copied to clipboard!");
    }
  };

  const handleRunMiniCheck = () => {
    const isEligible = miniQ.isResident && miniQ.incomeOk && miniQ.ageOk;
    setMiniResult(isEligible);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse" />
        <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Scheme not found</h2>
        <p className="text-xs text-slate-500">The requested scheme identifier does not exist or has been archived.</p>
        <Link to="/schemes" className="inline-block bg-setu-blue text-white text-xs font-bold px-4 py-2 rounded-lg">
          Return to Scheme Directory
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'documents', label: 'Documents Required' },
    { id: 'how-to-apply', label: 'How to Apply' },
    { id: 'faqs', label: 'FAQs' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-setu-blue">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/schemes" className="hover:text-setu-blue">Schemes</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="capitalize text-slate-700 font-semibold">{scheme.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{scheme.name}</span>
      </nav>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 text-setu-blue border border-blue-200">
            {scheme.scheme_type === 'Central' ? 'Central Sector Scheme' : `${scheme.state} State Scheme`}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
            {scheme.category}
          </span>
          <span className="text-xs font-mono font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            {scheme.code}
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {scheme.name}
          </h1>
          {scheme.name_native && (
            <p className="text-sm font-medium text-slate-500 font-serif">
              {scheme.name_native}
            </p>
          )}
          <p className="text-xs font-medium text-slate-600 flex items-center space-x-1.5 pt-1">
            <Landmark className="w-3.5 h-3.5 text-setu-saffron" />
            <span>{scheme.ministry}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>Last Updated: <strong className="text-slate-700">{scheme.last_updated || 'September 2025'}</strong></div>
          <div className="text-[11px] text-emerald-700 flex items-center space-x-1 font-medium bg-emerald-50 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Government Verified Data</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tabbed Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex items-center space-x-1 overflow-x-auto text-xs font-bold">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-setu-blue text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs text-xs sm:text-sm text-slate-700 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Scheme Description</h3>
                  <p className="leading-relaxed text-slate-600">{scheme.description}</p>
                </div>

                {scheme.highlights && scheme.highlights.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-setu-saffron" />
                      <span>Key Highlights</span>
                    </h4>
                    <ul className="space-y-2">
                      {scheme.highlights.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-setu-green mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ELIGIBILITY */}
            {activeTab === 'eligibility' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Eligibility Criteria Checklist</h3>
                  <button
                    onClick={() => setEligibilityModalOpen(true)}
                    className="bg-setu-saffron text-white text-xs font-bold px-3 py-1.5 rounded shadow-xs hover:bg-setu-saffron-dark transition-colors"
                  >
                    Interactive Eligibility Check
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Age Criteria</span>
                    <p className="font-semibold text-slate-900">
                      {scheme.min_age !== undefined && scheme.max_age !== undefined
                        ? `${scheme.min_age} - ${scheme.max_age} Years`
                        : 'No age bar'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Income Ceiling</span>
                    <p className="font-semibold text-slate-900">
                      {scheme.income_ceiling
                        ? `Below Rs ${scheme.income_ceiling.toLocaleString()} / year`
                        : 'No specific income restriction'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Gender Requirement</span>
                    <p className="font-semibold text-slate-900 capitalize">
                      {scheme.gender_allowed || 'All Genders'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">State Domicile</span>
                    <p className="font-semibold text-slate-900">
                      {scheme.state === 'All India' ? 'All Indian Citizens' : `${scheme.state} Residents`}
                    </p>
                  </div>
                </div>

                {scheme.additional_eligibility && scheme.additional_eligibility.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Additional Conditions:
                    </h4>
                    <ul className="space-y-1.5">
                      {scheme.additional_eligibility.map((cond, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-setu-green mt-0.5 flex-shrink-0" />
                          <span>{cond}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BENEFITS */}
            {activeTab === 'benefits' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-bold text-slate-900">Financial & In-Kind Entitlements</h3>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-800 font-bold uppercase">Total Benefit Value</span>
                    <h4 className="text-2xl font-extrabold text-emerald-900">{scheme.benefit_amount}</h4>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-white text-emerald-800 rounded-full border border-emerald-300">
                    Mode: {scheme.benefit_type}
                  </span>
                </div>

                {scheme.benefits_breakdown && scheme.benefits_breakdown.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Disbursement Schedule & Structure:
                    </h4>
                    <div className="space-y-2">
                      {scheme.benefits_breakdown.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-2 text-xs">
                          <IndianRupee className="w-4 h-4 text-setu-green mt-0.5 flex-shrink-0" />
                          <span className="font-medium text-slate-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DOCUMENTS REQUIRED */}
            {activeTab === 'documents' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Required Document Checklist</h3>
                  <button
                    onClick={() => window.print()}
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Download Checklist as PDF</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(scheme.documents_required || []).map((doc, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-setu-blue font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <strong className="font-semibold text-slate-900 text-sm block">{doc}</strong>
                        <p className="text-[11px] text-slate-500">Must be valid and matching applicant name</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: HOW TO APPLY */}
            {activeTab === 'how-to-apply' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-bold text-slate-900">Step-by-Step Application Procedure</h3>

                <div className="space-y-3.5">
                  {(scheme.application_steps || [
                    "Visit official portal",
                    "Register with Aadhaar",
                    "Fill application form",
                    "Upload documents",
                    "Submit and note reference number"
                  ]).map((step, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3.5">
                      <div className="w-7 h-7 rounded-full bg-setu-saffron text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        {idx + 1}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 text-sm block mb-0.5">Stage {idx + 1}</span>
                        <p className="text-slate-600 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href={scheme.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-setu-blue hover:bg-setu-blue-dark text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-colors"
                  >
                    <span>Proceed to Official Registration Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* TAB 6: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>

                <div className="space-y-2.5">
                  {(scheme.faqs || [
                    { q: "How is the benefit released?", a: "Directly transferred via DBT into Aadhaar-seeded bank accounts." },
                    { q: "Can I track my application status?", a: "Yes, you can track your status on the official portal or ask SETU AI." }
                  ]).map((faq, idx) => {
                    const isOpen = !!faqExpanded[idx];
                    return (
                      <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setFaqExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                          className="w-full p-3.5 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors"
                        >
                          <span className="flex items-center space-x-2">
                            <HelpCircle className="w-4 h-4 text-setu-blue flex-shrink-0" />
                            <span>{faq.q}</span>
                          </span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        {isOpen && (
                          <div className="p-3.5 bg-white text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sourced Disclaimer */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 leading-relaxed flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-setu-blue flex-shrink-0 mt-0.5" />
            <span>
              This information is sourced from official government portals. For most accurate details, visit the official scheme website ({scheme.apply_url}).
            </span>
          </div>
        </div>

        {/* Right Column: Sticky Quick Info Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Quick Scheme Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <span className="text-slate-500">Benefit Amount:</span>
                <strong className="text-slate-900 text-sm font-extrabold text-setu-green">{scheme.benefit_amount}</strong>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <span className="text-slate-500">Application Mode:</span>
                <span className="font-bold text-slate-800">{scheme.application_mode}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <span className="text-slate-500">Application Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {scheme.status}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <span className="text-slate-500">Application Deadline:</span>
                <span className="font-bold text-slate-800">{scheme.deadline || 'Ongoing'}</span>
              </div>

              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Administering Authority:</span>
                <span className="font-semibold text-slate-800 text-[11px] block bg-slate-50 p-2 rounded border border-slate-200">
                  {scheme.ministry}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEligibilityModalOpen(true)}
                className="w-full py-3 bg-setu-saffron hover:bg-setu-saffron-dark text-white rounded-lg font-extrabold text-xs shadow-md transition-all text-center flex items-center justify-center space-x-2"
              >
                <span>Check My Eligibility</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <a
                href={scheme.apply_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-setu-blue hover:bg-setu-blue-dark text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={toggleSave}
                  className={`py-2 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                    saved
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600' : ''}`} />
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Eligibility Questionnaire Modal */}
      {eligibilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-setu-blue text-white p-4 flex items-center justify-between border-b-2 border-setu-saffron">
              <h3 className="font-bold text-sm">Eligibility Check: {scheme.name}</h3>
              <button
                onClick={() => setEligibilityModalOpen(false)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-medium text-slate-800">
                    Are you a permanent resident of {scheme.state === 'All India' ? 'India' : scheme.state}?
                  </span>
                  <input
                    type="checkbox"
                    checked={miniQ.isResident}
                    onChange={(e) => setMiniQ({ ...miniQ, isResident: e.target.checked })}
                    className="w-4 h-4 rounded text-setu-green"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-medium text-slate-800">
                    Is your annual family income within prescribed limits?
                  </span>
                  <input
                    type="checkbox"
                    checked={miniQ.incomeOk}
                    onChange={(e) => setMiniQ({ ...miniQ, incomeOk: e.target.checked })}
                    className="w-4 h-4 rounded text-setu-green"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-medium text-slate-800">
                    Do you satisfy age and occupation criteria?
                  </span>
                  <input
                    type="checkbox"
                    checked={miniQ.ageOk}
                    onChange={(e) => setMiniQ({ ...miniQ, ageOk: e.target.checked })}
                    className="w-4 h-4 rounded text-setu-green"
                  />
                </label>
              </div>

              <button
                onClick={handleRunMiniCheck}
                className="w-full py-2.5 bg-setu-blue hover:bg-setu-blue-dark text-white rounded-lg font-bold shadow-xs transition-colors"
              >
                Check Result
              </button>

              {miniResult !== null && (
                <div
                  className={`p-3.5 rounded-lg border flex items-center space-x-2.5 ${
                    miniResult
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {miniResult ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  )}
                  <div>
                    <strong className="block text-sm">
                      {miniResult ? 'You are Likely Eligible!' : 'Criteria Not Met'}
                    </strong>
                    <p className="text-[11px]">
                      {miniResult
                        ? 'You satisfy primary requirements. You can proceed with online application.'
                        : 'One or more responses do not match the scheme eligibility rules.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
