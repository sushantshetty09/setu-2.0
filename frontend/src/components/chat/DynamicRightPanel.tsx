import React, { useState } from 'react';
import { Scheme } from '../../types';
import { SchemeCard } from '../common/SchemeCard';
import { 
  FileCheck2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  ExternalLink, 
  Lock,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';

export type RightPanelState = 
  | 'IDLE' 
  | 'SCHEMES_FOUND' 
  | 'DOCUMENT_NEEDED' 
  | 'DIGILOCKER_PERMISSION' 
  | 'ELIGIBILITY_RESULT';

interface DynamicRightPanelProps {
  state: RightPanelState;
  data: any;
  onOpenDigiLocker: () => void;
  onSelectSuggestion?: (query: string) => void;
}

export const DynamicRightPanel: React.FC<DynamicRightPanelProps> = ({
  state,
  data,
  onOpenDigiLocker,
  onSelectSuggestion
}) => {
  const [checkedDocs, setCheckedDocs] = useState<{ [key: string]: boolean }>({});

  const toggleDoc = (doc: string) => {
    setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }));
  };

  return (
    <div className="bg-slate-50 border-l border-slate-200 h-full flex flex-col overflow-y-auto p-4 sm:p-5">
      {/* 1. STATE: IDLE */}
      {state === 'IDLE' && (
        <div className="space-y-5 my-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto text-setu-blue">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">SETU Intelligence Hub</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Ask about welfare schemes, eligibility rules, document checklists, or check your DBT payment status.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Popular citizen inquiries:
            </span>
            {[
              "Find scholarship for my daughter in college",
              "Did I get my Gruha Lakshmi money this month?",
              "What documents are needed for PM Kisan?",
              "Check Ayushman Bharat hospital cover"
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion && onSelectSuggestion(prompt)}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-setu-blue hover:bg-blue-50/50 text-xs font-medium text-slate-700 transition-all flex items-center justify-between group"
              >
                <span className="line-clamp-1">{prompt}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-setu-blue transition-colors flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. STATE: SCHEMES_FOUND */}
      {state === 'SCHEMES_FOUND' && data?.schemes && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Official Government Entitlements
              </span>
              <h4 className="font-extrabold text-sm text-slate-900">
                {data.schemes.length} Active Offers & Schemes Found
              </h4>
            </div>
            <span className="bg-[#00875A] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
              {data.schemes.length} Offers
            </span>
          </div>

          <div className="space-y-3">
            {data.schemes.map((scheme: Scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                showMatchBadge={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. STATE: DOCUMENT_NEEDED */}
      {state === 'DOCUMENT_NEEDED' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-setu-blue" />
              <span>Document Checklist</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Required for {data?.scheme_name || 'Scheme Application'}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            {(data?.documents || [
              "Aadhaar Card (Aadhaar Seeded)",
              "Active Bank Account Passbook",
              "Income / Caste Certificate",
              "Passport Size Photograph"
            ]).map((doc: string, idx: number) => {
              const isChecked = !!checkedDocs[doc];
              return (
                <label
                  key={idx}
                  onClick={() => toggleDoc(doc)}
                  className={`flex items-start space-x-3 p-2.5 rounded-md border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                      : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-setu-green focus:ring-setu-green"
                  />
                  <div className="text-xs">
                    <span className={`font-semibold block ${isChecked ? 'line-through text-slate-500' : ''}`}>
                      {doc}
                    </span>
                    <span className="text-[10px] text-slate-500">Self-attested digital / original copy</span>
                  </div>
                </label>
              );
            })}
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download / Print Checklist</span>
          </button>
        </div>
      )}

      {/* 4. STATE: DIGILOCKER_PERMISSION */}
      {state === 'DIGILOCKER_PERMISSION' && (
        <div className="my-auto">
          <div className="bg-white border-2 border-emerald-600 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Connect DigiLocker</h4>
                <p className="text-[11px] text-slate-500">Official Government Gateway</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p className="font-medium text-slate-800">
                To check your {data?.scheme_name || 'welfare'} payment status, SETU needs:
              </p>
              <div className="space-y-1.5 pl-1">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Aadhaar details & verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Linked DBT bank account info</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Scheme enrollment proof</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200 flex items-center space-x-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>Your data stays private. SETU cannot store it.</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={onOpenDigiLocker}
                className="w-full py-2.5 bg-[#002D62] hover:bg-[#001D40] text-white rounded-lg font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Connect DigiLocker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {}}
                className="w-full py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Not Now - Check Manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. STATE: ELIGIBILITY_RESULT */}
      {state === 'ELIGIBILITY_RESULT' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2.5">
            <h4 className="font-bold text-sm text-slate-900">
              Eligibility Assessment
            </h4>
            <p className="text-[11px] text-slate-500">
              {data?.scheme_name || 'Target Scheme'}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700">Overall Match</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                data?.is_eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {data?.match_score || (data?.is_eligible ? 94 : 50)}% Match
              </span>
            </div>

            <div className="space-y-2">
              {(data?.checks || [
                { criterion: "Age criterion met", met: true, user_value: "Eligible" },
                { criterion: "Income ceiling criteria", met: true, user_value: "Eligible" }
              ]).map((chk: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-2 rounded border text-xs flex items-start space-x-2 ${
                    chk.met ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  {chk.met ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <strong className={chk.met ? 'text-slate-800' : 'text-rose-900'}>
                      {chk.criterion}
                    </strong>
                    {chk.user_value && (
                      <p className="text-[11px] text-slate-500">Provided: {chk.user_value}</p>
                    )}
                    {!chk.met && chk.recommendation && (
                      <p className="text-[11px] text-rose-700 mt-0.5">{chk.recommendation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
