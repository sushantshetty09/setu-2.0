import React from 'react';
import { ShieldCheck, Landmark, Globe, Layers, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-setu-blue font-serif font-bold text-2xl flex items-center justify-center mx-auto border border-blue-200">
          सेतु
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About SETU (सेतु)
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          One Voice. Every Service. Bridging the gap between Indian citizens and public welfare entitlements.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
          Platform Mission
        </h2>
        <p>
          SETU is conceived as a high-accessibility citizen enablement platform that simplifies the discovery and delivery of central and state welfare initiatives. By employing voice interactions in 12 Indian languages, deterministic eligibility evaluation algorithms, and sovereign document verification via DigiLocker, SETU ensures that no deserving beneficiary is left behind due to procedural or linguistic hurdles.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-setu-blue mb-2">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Multilingual Inclusivity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Full support across 12 scheduled Indian languages with browser-native Web Speech voice interactions.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-setu-green mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">DigiLocker Integration</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instant and tamper-proof verification of identity, domicile, and DBT payment status without manual document uploads.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-setu-saffron mb-2">
            <Landmark className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">CSC Grassroots Reach</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dedicated Village Level Entrepreneur (VLE) assist interface for last-mile delivery at Common Service Centres.
          </p>
        </div>
      </div>

      {/* Governance & Standards */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-3 text-xs text-slate-600">
        <h3 className="font-bold text-sm text-slate-900">Standards & Compliance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Guidelines for Indian Government Websites (GIGW)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Web Content Accessibility Guidelines (WCAG 2.0 AA)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Direct Benefit Transfer (DBT) Bharat Architecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>MeriPehchaan (National SSO) Standards</span>
          </div>
        </div>
      </div>
    </div>
  );
};
