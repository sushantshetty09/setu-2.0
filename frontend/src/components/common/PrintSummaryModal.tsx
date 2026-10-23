import React from 'react';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Scheme } from '../../types';

interface PrintSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizenName: string;
  phone: string;
  state: string;
  schemes: Scheme[];
  referenceId?: string;
}

export const PrintSummaryModal: React.FC<PrintSummaryModalProps> = ({
  isOpen,
  onClose,
  citizenName,
  phone,
  state,
  schemes,
  referenceId = "SETU-SUMM-2025-994"
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Action Bar (no print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-setu-saffron" />
            <h3 className="font-bold text-sm">Citizen Welfare Schemes Summary</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-setu-saffron hover:bg-setu-saffron-dark text-white text-xs font-bold px-3 py-1.5 rounded flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Section */}
        <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible space-y-6 text-slate-800">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 border border-slate-400 rounded-md flex items-center justify-center font-serif text-setu-blue font-bold text-xl">
                सेतु
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-slate-900">SETU | सेतु</h2>
                <p className="text-xs text-slate-600">Government of India Schemes Discovery Advisory</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p><strong>Ref ID:</strong> {referenceId}</p>
              <p><strong>Date:</strong> {currentDate}</p>
            </div>
          </div>

          {/* Citizen Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Citizen Name</span>
              <strong className="text-slate-900 text-sm">{citizenName || 'Sunita Devi'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Contact Phone</span>
              <strong className="text-slate-900 text-sm">+91 {phone || '98XXXXXXXX'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">State / Region</span>
              <strong className="text-slate-900 text-sm">{state || 'Karnataka'}</strong>
            </div>
          </div>

          {/* Eligible Schemes Breakdown */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-3 border-b border-slate-200 pb-1">
              Recommended Schemes & Benefit Entitlement ({schemes.length})
            </h4>
            <div className="space-y-4">
              {schemes.map((s, idx) => (
                <div key={s.id || idx} className="border border-slate-200 rounded p-3 text-xs space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{s.name}</h5>
                      <p className="text-[11px] text-slate-500">{s.ministry} ({s.code})</p>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {s.benefit_amount}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">{s.summary}</p>
                  
                  {s.documents_required && s.documents_required.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <strong className="text-slate-700 text-[11px] block mb-1">Required Documents:</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {s.documents_required.map((doc, dIdx) => (
                          <span key={dIdx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Portal: {s.apply_url}</span>
                    <span>Status: Open</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Generated via SETU Citizen Service Portal | National Informatics Centre (NIC)</span>
            </div>
            <p>Page 1 of 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};
