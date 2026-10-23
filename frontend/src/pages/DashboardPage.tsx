import React from 'react';
import { 
  Mic, 
  Search, 
  FileText, 
  Clock, 
  Bell, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight,
  Shield,
  CreditCard,
  Briefcase,
  User,
  HeartPulse,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [user, setUser] = React.useState<any>(() => {
    try {
      const saved = localStorage.getItem('setu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const displayName = user?.name || 'Citizen';

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-16">
      
      {/* HEADER SECTION (Specific to Dashboard) */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
              Hello, {displayName}
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">
              Your Digital Public Infrastructure & Welfare Hub
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 border-2 border-[#00875A] rounded-full flex items-center justify-center text-[#00875A]">
            <User className="w-6 h-6" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* VOICE COPILOT CARD */}
        <section>
          <div className="bg-gradient-to-tr from-[#0B2545] to-[#1A3A6B] rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex-1 space-y-4 z-10 text-center sm:text-left">
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Ask SETU Anything
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-medium">
                <span className="bg-white/10 text-emerald-100 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20 cursor-pointer transition-colors">
                  • Check PM-KISAN Status
                </span>
                <span className="bg-white/10 text-emerald-100 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20 cursor-pointer transition-colors">
                  • Find Scholarships
                </span>
                <span className="bg-white/10 text-emerald-100 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20 cursor-pointer transition-colors">
                  • Download Documents
                </span>
                <span className="bg-white/10 text-emerald-100 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20 cursor-pointer transition-colors">
                  • Track Applications
                </span>
              </div>
            </div>

            {/* AI Voice Orb */}
            <div className="relative z-10 w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-2 bg-emerald-400 rounded-full animate-pulse opacity-40" />
              <button className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-[#00875A] rounded-full shadow-xl flex items-center justify-center border-[3px] border-white/20 hover:scale-105 transition-transform group">
                <Mic className="w-8 h-8 text-white group-hover:animate-bounce" />
              </button>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md hover:border-[#00875A] transition-all cursor-pointer group text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00875A] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">Benefits</span>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md hover:border-[#00875A] transition-all cursor-pointer group text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">Documents</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md hover:border-[#00875A] transition-all cursor-pointer group text-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">Applications</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md hover:border-[#00875A] transition-all cursor-pointer group text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">Govt Services</span>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN LAYOUT: Main Content vs Side Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* MY SERVICES */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">My Services</h3>
                <span className="text-xs font-bold text-[#00875A] cursor-pointer hover:underline">View All</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Active Service */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between h-32 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-50 text-[#00875A] text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-emerald-100">
                    Active
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-slate-700" />
                    </div>
                    <span className="font-bold text-sm text-slate-800">PM-KISAN</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 font-medium">Next installment expected soon.</div>
                </div>

                {/* Active Service */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between h-32 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-50 text-[#00875A] text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-emerald-100">
                    Active
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <HeartPulse className="w-5 h-5 text-slate-700" />
                    </div>
                    <span className="font-bold text-sm text-slate-800">Ayushman Bharat</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 font-medium">Health coverage up to ₹5L active.</div>
                </div>

                {/* Pending Service */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between h-32 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-orange-100">
                    Pending
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-slate-700" />
                    </div>
                    <span className="font-bold text-sm text-slate-800">Scholarships</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 font-medium">Under verification by institute.</div>
                </div>

                {/* Completed Service */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between h-32 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-blue-100">
                    Completed
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-700" />
                    </div>
                    <span className="font-bold text-sm text-slate-800">Certificates</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 font-medium">Income certificate generated.</div>
                </div>
              </div>
            </section>

            {/* AI RECOMMENDATIONS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">You may be eligible for</h3>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  AI Matched
                </span>
              </div>
              <div className="space-y-3">
                {/* Recommendation 1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs hover:border-[#00875A] transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#00875A] flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#00875A] transition-colors">Karnataka Scholarship</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Financial aid for higher education.</p>
                    </div>
                  </div>
                  <button className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#00875A] border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    Apply
                  </button>
                </div>

                {/* Recommendation 2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs hover:border-[#00875A] transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#00875A] transition-colors">Skill Development Scheme</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Free vocational training and certification.</p>
                    </div>
                  </div>
                  <button className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#00875A] border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    Apply
                  </button>
                </div>

                {/* Recommendation 3 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs hover:border-[#00875A] transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#00875A] transition-colors">Farmer Subsidy</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Subsidy on agricultural equipment purchase.</p>
                    </div>
                  </div>
                  <button className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#00875A] border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </section>
            
          </div>

          <div className="space-y-8">
            {/* DOCUMENTS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Documents</h3>
                <span className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-800">Manage</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-slate-800">Aadhaar Card</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-slate-800">PAN Card</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-slate-800">Income Certificate</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-slate-800">Marks Card</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </section>

            {/* NOTIFICATIONS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Notifications</h3>
                <div className="relative">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Payment Credited</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">₹2,000 credited to your account for PM-KISAN.</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Application Approved</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Your Scholarship application has been approved.</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Document Expiring</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Your Income Certificate is expiring in 15 days.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* RECENT ACTIVITY TIMELINE */}
            <section>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-4">Recent Activity</h3>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
                {/* Timeline line */}
                <div className="absolute left-[31px] top-6 bottom-6 w-px bg-slate-200" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex space-x-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 z-10 shadow-sm">
                      <FileText className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Downloaded Aadhaar</h4>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Today, 10:42 AM</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 z-10 shadow-sm">
                      <Search className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Checked PM-KISAN</h4>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Yesterday, 04:15 PM</span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5 z-10 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Applied Scholarship</h4>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Sep 24, 02:30 PM</span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 z-10 shadow-sm">
                      <Shield className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Verified Bank Account</h4>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Sep 20, 11:05 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
};
