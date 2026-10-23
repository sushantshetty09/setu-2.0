import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { loginWithGoogle } from '../../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'login' | 'success'>('login');
  const [loading, setLoading] = useState(false);
  const [successName, setSuccessName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoLogin = () => {
    const formattedUser = {
      name: "Sushant Shetty",
      email: "citizen@example.gov.in",
      phone: "+91 9876543210",
      isLoggedIn: true
    };
    setSuccessName("Sushant Shetty");
    setStep('success');
    setTimeout(() => {
      onSuccess(formattedUser);
      onClose();
      setStep('login');
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const user = await loginWithGoogle();
      setLoading(false);
      setSuccessName(user.displayName || 'User');
      setStep('success');
      const formattedUser = {
        name: user.displayName || "Google User",
        email: user.email,
        phone: user.phoneNumber || '',
        isLoggedIn: true
      };
      setTimeout(() => {
        onSuccess(formattedUser);
        onClose();
        setStep('login');
      }, 1000);
    } catch (error: any) {
      console.error("Google Login Failed", error);
      setLoading(false);
      if (error?.code === 'auth/unauthorized-domain' || error?.message?.includes('Authorized Domains')) {
        setErrorMessage(
          `Domain '${window.location.hostname}' is not authorized in Firebase Console yet. Add it under Firebase > Authentication > Settings > Authorized Domains, or continue with demo login below.`
        );
      } else {
        setErrorMessage(error?.message || "Google Sign-in was cancelled or failed. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in no-print">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-setu-blue text-white p-5 flex items-center justify-between border-b-2 border-setu-saffron">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-setu-saffron" />
            </div>
            <div>
              <h3 className="font-bold text-base">Citizen Portal Login</h3>
              <p className="text-xs text-slate-300">Secure Sign-In with Google</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'login' && (
            <div className="space-y-5">
              <div className="text-center space-y-1.5">
                <p className="text-sm font-semibold text-slate-700">
                  Sign in to access government schemes and services
                </p>
                <p className="text-[11px] text-slate-500">
                  Use your Google account to securely authenticate.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-2">
                  <p className="font-semibold text-amber-900">Notice:</p>
                  <p>{errorMessage}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-sm transition-all flex items-center justify-center space-x-3 disabled:opacity-50 shadow-sm hover:shadow"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span>{loading ? 'Connecting with Google...' : 'Sign in with Google'}</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[11px] text-slate-400 font-medium">OR TEST WITH</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <span>🚀 Instant Citizen Demo Sign-In</span>
              </button>

              <div className="pt-1 text-center text-[11px] text-slate-500">
                Protected by National Informatics Centre standard security protocols.
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-setu-green">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Authentication Successful</h4>
              <p className="text-xs text-slate-600">Welcome back, {successName}. Redirecting to your dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
