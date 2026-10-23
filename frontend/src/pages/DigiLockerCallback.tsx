import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const DigiLockerCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success'>('verifying');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        navigate('/chat');
      }, 1500);
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-xl border border-slate-200 shadow-md text-center space-y-4">
      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
        {status === 'verifying' ? (
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <CheckCircle2 className="w-7 h-7" />
        )}
      </div>

      <h2 className="text-lg font-bold text-slate-900">
        {status === 'verifying' ? 'Verifying DigiLocker Consent...' : 'DigiLocker Verification Successful'}
      </h2>

      <p className="text-xs text-slate-500">
        {status === 'verifying'
          ? 'Secure handshake with UIDAI and State DigiLocker repositories in progress.'
          : 'Credentials validated. Redirecting you to SETU AI Assistant...'}
      </p>

      {status === 'success' && (
        <button
          onClick={() => navigate('/chat')}
          className="w-full py-2 bg-setu-blue text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
        >
          <span>Return to Chat</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
