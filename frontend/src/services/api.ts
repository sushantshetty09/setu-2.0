import { Scheme, SchemeCategory, StateData, DigiLockerUser } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const fetchSchemes = async (params: Record<string, any> = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, String(val));
    }
  });
  const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch schemes');
  return res.json();
};

export const fetchPopularSchemes = async (): Promise<Scheme[]> => {
  const res = await fetch(`${API_BASE}/schemes/popular`);
  if (!res.ok) throw new Error('Failed to fetch popular schemes');
  return res.json();
};

export const fetchSchemeById = async (id: string): Promise<Scheme> => {
  const res = await fetch(`${API_BASE}/schemes/${id}`);
  if (!res.ok) throw new Error('Scheme not found');
  return res.json();
};

export const fetchCategories = async (): Promise<SchemeCategory[]> => {
  const res = await fetch(`${API_BASE}/schemes/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const fetchStates = async (): Promise<StateData[]> => {
  const res = await fetch(`${API_BASE}/schemes/states`);
  if (!res.ok) throw new Error('Failed to fetch states');
  return res.json();
};

export const matchWizardSchemes = async (data: any) => {
  const res = await fetch(`${API_BASE}/wizard/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to match schemes');
  return res.json();
};

export const fetchDigiLockerPaymentStatus = async (schemeName: string) => {
  const res = await fetch(`${API_BASE}/digilocker/payment-status?scheme_name=${encodeURIComponent(schemeName)}`);
  if (!res.ok) throw new Error('Failed to fetch payment status');
  return res.json();
};

export const cscLogin = async (credentials: { operator_id: string; password: string }) => {
  const res = await fetch(`${API_BASE}/csc/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Invalid CSC credentials');
  }
  return res.json();
};

export const fetchCscDashboard = async () => {
  const res = await fetch(`${API_BASE}/csc/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch CSC dashboard');
  return res.json();
};

export const submitCscAssist = async (citizenData: any) => {
  const res = await fetch(`${API_BASE}/csc/assist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(citizenData),
  });
  if (!res.ok) throw new Error('Failed to submit citizen assist');
  return res.json();
};

export const submitGrievance = async (grievanceData: any) => {
  const res = await fetch(`${API_BASE}/grievance/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(grievanceData),
  });
  if (!res.ok) throw new Error('Failed to submit grievance');
  return res.json();
};
