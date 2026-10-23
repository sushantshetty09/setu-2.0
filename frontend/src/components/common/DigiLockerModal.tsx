import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, X, ArrowRight, FileCheck } from 'lucide-react';
import { DigiLockerUser } from '../../types';

interface DigiLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: DigiLockerUser) => void;
  schemeName?: string;
}

export const DigiLockerModal: React.FC<DigiLockerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  schemeName = 'Scheme Benefit Verification'
}) => {
  const [step, setStep] = useState<'consent' | 'authorizing' | 'success'>('consent');

  if (!isOpen) return null;

  const handleAuthorize = () => {
    setStep('authorizing');
    setTimeout(() => {
      setStep('success');
      const mockUser: DigiLockerUser = {
        name: "Sunita Devi",
        aadhaar_last4: "4521",
        state: "Karnataka",
        dob: "1988-06-14",
        gender: "Female",
        verified_documents: [
          { type: "Aadhaar Card", status: "Verified", issuer: "UIDAI" },
          { type: "Ration Card (BPL)", status: "Verified", issuer: "Food & Civil Supplies Dept" },
          { type: "Income Certificate", status: "Verified", issuer: "Revenue Dept, Karnataka" },
          { type: "Caste Certificate", status: "Verified", issuer: "Revenue Dept, Karnataka" }
        ]
      };
      setTimeout(() => {
        onSuccess(mockUser);
        onClose();
        setStep('consent');
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in no-print">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* DigiLocker Branded Header */}
        <div className="bg-[#002D62] text-white p-5 flex items-center justify-between border-b-2 border-emerald-500">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-wide">DigiLocker</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-semibold px-1.5 py-0.2 rounded">
                  Official
                </span>
              </div>
              <p className="text-[11px] text-slate-300">National Document & Identity Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'consent' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-slate-700">
                <p className="font-semibold text-setu-blue mb-1">
                  Verification requested for: {schemeName}
                </p>
                <p className="text-slate-600">
                  To check your DBT payment status or verify eligibility, SETU requires read-only access to:
                </p>
              </div>

              {/* Scopes checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2 p-2 bg-slate-50 rounded border border-slate-200">
                  <FileCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Aadhaar Identity Details</strong>
                    <p className="text-slate-500 text-[11px]">Name, Date of Birth, Gender & Photo</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-2 bg-slate-50 rounded border border-slate-200">
                  <FileCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">DBT Bank Account Status</strong>
                    <p className="text-slate-500 text-[11px]">NPCI Aadhaar-seeded account verification</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-2 bg-slate-50 rounded border border-slate-200">
                  <FileCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-800">Scheme Enrollment Proof</strong>
                    <p className="text-slate-500 text-[11px]">Ration card & domicile registry</p>
                  </div>
                </div>
              </div>

              {/* Privacy Guarantee */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-100/70 p-2.5 rounded">
                <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>Your data stays private. SETU does not store your credentials.</span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Not Now - Check Manually
                </button>
                <button
                  type="button"
                  onClick={handleAuthorize}
                  className="px-5 py-2 text-xs font-bold bg-[#002D62] hover:bg-[#001D40] text-white rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
                >
                  <span>Connect DigiLocker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 'authorizing' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Connecting with DigiLocker Gateway...</h4>
              <p className="text-xs text-slate-500">Securing encrypted tokens and fetching document checksums</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Documents Verified Successfully</h4>
              <p className="text-xs text-slate-600">Aadhaar (****4521) linked. Returning to SETU Assistant...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
