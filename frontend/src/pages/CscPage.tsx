import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  UserPlus, 
  Search, 
  FileText, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  LogOut,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { cscLogin, fetchCscDashboard, submitCscAssist } from '../services/api';
import { PrintSummaryModal } from '../components/common/PrintSummaryModal';
import { Scheme } from '../types';

export const CscPage: React.FC = () => {
  const [operator, setOperator] = useState<any>(() => {
    const saved = localStorage.getItem('setu_csc_operator');
    return saved ? JSON.parse(saved) : null;
  });

  // Login form state
  const [operatorId, setOperatorId] = useState('operator@csc.gov.in');
  const [password, setPassword] = useState('demo123');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assist'>('dashboard');

  // Citizen assist mode state
  const [citizenForm, setCitizenForm] = useState({
    citizen_name: 'Basavaraj Patil',
    phone: '9845012345',
    age: 42,
    gender: 'male',
    state: 'Karnataka',
    income_annual: 120000,
    caste_category: 'obc',
    is_bpl: true,
    needs: ['agriculture', 'loan']
  });

  const [assistResult, setAssistResult] = useState<any>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  useEffect(() => {
    if (operator) {
      fetchCscDashboard().then(setDashboardData).catch(console.error);
    }
  }, [operator]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const res = await cscLogin({ operator_id: operatorId, password });
      setOperator(res.operator);
      localStorage.setItem('setu_csc_operator', JSON.stringify(res.operator));
      const dash = await fetchCscDashboard();
      setDashboardData(dash);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setOperator(null);
    localStorage.removeItem('setu_csc_operator');
  };

  const handleAssistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitCscAssist(citizenForm);
      setAssistResult(res);
      // Reload dashboard
      const dash = await fetchCscDashboard();
      setDashboardData(dash);
    } catch (err) {
      console.error("Assist error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* If Not Logged In -> Show Operator Login Card */}
      {!operator ? (
        <div className="max-w-md mx-auto my-8 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-[#1A3A6B] text-white p-6 text-center space-y-2 border-b-4 border-setu-saffron">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto border border-white/20">
              <Building2 className="w-6 h-6 text-setu-saffron" />
            </div>
            <h2 className="font-extrabold text-lg">Common Service Centre (CSC) Portal</h2>
            <p className="text-xs text-slate-300">Village Level Entrepreneur (VLE) Authenticated Access</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Operator ID / Email
              </label>
              <input
                type="text"
                required
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                placeholder="e.g. operator@csc.gov.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400">Demo: operator@csc.gov.in</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400">Demo: demo123</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-setu-blue hover:bg-setu-blue-dark text-white rounded-lg font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as CSC Operator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Operator Dashboard View */
        <div className="space-y-6">
          {/* Operator Banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-setu-blue font-bold">
                CSC
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-900">{operator.name}</h2>
                <p className="text-xs text-slate-500">
                  Center: <strong>{operator.center_code}</strong> • {operator.district}, {operator.state}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'dashboard' ? 'bg-setu-blue text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('assist')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  activeTab === 'assist' ? 'bg-setu-saffron text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Citizen Assist Mode</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Today's Assisted Citizens</span>
                  <p className="text-2xl font-extrabold text-setu-blue">
                    {dashboardData?.stats?.today_assisted || operator.today_assisted_count || 19}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Monthly Citizens</span>
                  <p className="text-2xl font-extrabold text-slate-800">
                    {dashboardData?.stats?.monthly_assisted || 432}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Schemes Sanctioned</span>
                  <p className="text-2xl font-extrabold text-setu-green">
                    {dashboardData?.stats?.schemes_sanctioned || 128}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Grievances Resolved</span>
                  <p className="text-2xl font-extrabold text-setu-saffron">
                    {dashboardData?.stats?.grievances_resolved || 41}
                  </p>
                </div>
              </div>

              {/* Quick Actions Banner */}
              <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm">Quick Operator Actions</h3>
                  <p className="text-xs text-slate-400">Process citizen requests with automated eligibility matching</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('assist')}
                    className="bg-setu-saffron hover:bg-setu-saffron-dark text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>New Citizen Assist</span>
                  </button>
                  <a
                    href="/schemes"
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-slate-700"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Schemes</span>
                  </a>
                </div>
              </div>

              {/* Recent Citizen Inquiries Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  Recent Citizens Assisted at this Centre
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase">
                        <th className="pb-2">Citizen Name</th>
                        <th className="pb-2">Phone</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2">Matched Schemes</th>
                        <th className="pb-2">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(dashboardData?.recent_citizens || []).map((cit: any) => (
                        <tr key={cit.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-semibold text-slate-900">{cit.name}</td>
                          <td className="py-2.5 text-slate-600">+91 {cit.phone}</td>
                          <td className="py-2.5">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {cit.category}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-700">
                            {cit.matched_schemes?.join(', ')}
                          </td>
                          <td className="py-2.5 text-slate-400">{cit.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CITIZEN ASSIST MODE TAB */}
          {activeTab === 'assist' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-setu-saffron" />
                    <span>Citizen Assist Application Intake</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter walk-in citizen details to automatically match eligible welfare schemes and generate a printable summary.
                  </p>
                </div>

                <form onSubmit={handleAssistSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">Citizen Full Name</label>
                      <input
                        type="text"
                        required
                        value={citizenForm.citizen_name}
                        onChange={(e) => setCitizenForm({ ...citizenForm, citizen_name: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">Contact Mobile Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={citizenForm.phone}
                        onChange={(e) => setCitizenForm({ ...citizenForm, phone: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">Age (Years)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={citizenForm.age}
                        onChange={(e) => setCitizenForm({ ...citizenForm, age: Number(e.target.value) })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">Gender</label>
                      <select
                        value={citizenForm.gender}
                        onChange={(e) => setCitizenForm({ ...citizenForm, gender: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="transgender">Transgender</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        value={citizenForm.state}
                        onChange={(e) => setCitizenForm({ ...citizenForm, state: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">Annual Household Income (Rs)</label>
                      <input
                        type="number"
                        value={citizenForm.income_annual}
                        onChange={(e) => setCitizenForm({ ...citizenForm, income_annual: Number(e.target.value) })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">Social Category</label>
                      <select
                        value={citizenForm.caste_category}
                        onChange={(e) => setCitizenForm({ ...citizenForm, caste_category: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                      >
                        <option value="general">General</option>
                        <option value="obc">OBC</option>
                        <option value="sc">SC</option>
                        <option value="st">ST</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-setu-saffron hover:bg-setu-saffron-dark text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-colors flex items-center space-x-2"
                    >
                      <span>{loading ? 'Matching Schemes...' : 'Process Citizen Intake'}</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Intake Results */}
                {assistResult && (
                  <div className="border-t border-slate-200 pt-6 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div>
                        <h4 className="font-bold text-sm text-emerald-900">
                          {assistResult.matched_schemes?.length} Schemes Matched for {assistResult.citizen_name}
                        </h4>
                        <p className="text-[11px] text-emerald-700">Reference: {assistResult.reference_id}</p>
                      </div>

                      <button
                        onClick={() => setPrintModalOpen(true)}
                        className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Citizen Summary</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {assistResult.matched_schemes?.map((s: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-900">{s.name}</span>
                            <span className="text-emerald-700">{s.benefit_amount}</span>
                          </div>
                          <p className="text-slate-500 text-[11px]">Code: {s.code} • Apply: {s.apply_url}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Printable Modal */}
          {assistResult && (
            <PrintSummaryModal
              isOpen={printModalOpen}
              onClose={() => setPrintModalOpen(false)}
              citizenName={assistResult.citizen_name}
              phone={citizenForm.phone}
              state={citizenForm.state}
              schemes={assistResult.matched_schemes || []}
              referenceId={assistResult.reference_id}
            />
          )}
        </div>
      )}
    </div>
  );
};
