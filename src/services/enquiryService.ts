import fs from 'fs';
import path from 'path';
import { CitizenEnquiry, EnquiryStats } from '../types/enquiry';

export class EnquiryService {
  private enquiries: CitizenEnquiry[] = [];
  private storageFilePath: string;

  constructor(storagePath?: string) {
    this.storageFilePath =
      storagePath || path.join(process.cwd(), 'data', 'enquiries.json');
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const dir = path.dirname(this.storageFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf-8');
        if (raw.trim()) {
          this.enquiries = JSON.parse(raw);
          return;
        }
      }

      // Pre-seed with sample citizen enquiries for hackathon demo
      this.enquiries = [
        {
          id: 'ENQ-KA-1001',
          senderId: '919876543210',
          phoneNumber: '+91 98765 43210',
          name: 'Basavaraj Gowda',
          gender: 'Male',
          state: 'Karnataka',
          age: 46,
          occupation: 'Farmer',
          annualIncome: 'Below ₹1 Lakh (BPL)',
          category: 'Agriculture',
          language: 'kn',
          matchedSchemesCount: 3,
          matchedSchemeNames: [
            'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
            'Kisan Credit Card (KCC) Scheme',
            'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
          ],
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'ENQ-UP-1002',
          senderId: '919811223344',
          phoneNumber: '+91 98112 23344',
          name: 'Sunita Devi',
          gender: 'Female',
          state: 'Uttar Pradesh',
          age: 38,
          occupation: 'Farmer',
          annualIncome: 'Below ₹1 Lakh (BPL)',
          category: "Women's Welfare",
          language: 'hi',
          matchedSchemesCount: 3,
          matchedSchemeNames: [
            'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
            'Lakhpati Didi Initiative',
            'PM-KISAN',
          ],
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: 'ENQ-BR-1003',
          senderId: '919700112233',
          phoneNumber: '+91 97001 12233',
          name: 'Rahul Sharma',
          gender: 'Male',
          state: 'Bihar',
          age: 22,
          occupation: 'Student',
          annualIncome: '₹1 Lakh - ₹3 Lakh',
          category: 'Education',
          language: 'en',
          matchedSchemesCount: 2,
          matchedSchemeNames: [
            'National Scholarship Portal (NSP) Post-Matric Schemes',
            'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
          ],
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        },
      ];

      this.persist();
    } catch (err) {
      console.warn('[EnquiryService] Storage initialization notice:', err);
    }
  }

  private persist(): void {
    try {
      fs.writeFileSync(
        this.storageFilePath,
        JSON.stringify(this.enquiries, null, 2),
        'utf-8'
      );
    } catch (err) {
      console.warn('[EnquiryService] Could not persist to disk:', err);
    }
  }

  /**
   * Records a new citizen enquiry in the website database.
   * If teammates' backend URL is configured, asynchronously posts to the backend.
   */
  async recordEnquiry(
    enquiryData: Omit<CitizenEnquiry, 'id' | 'createdAt'>
  ): Promise<CitizenEnquiry> {
    const statePrefix = enquiryData.state
      ? enquiryData.state.slice(0, 2).toUpperCase()
      : 'IN';
    const id = `ENQ-${statePrefix}-${Date.now().toString().slice(-6)}`;

    const newEnquiry: CitizenEnquiry = {
      ...enquiryData,
      id,
      createdAt: new Date().toISOString(),
    };

    // Prepend so latest appears first
    this.enquiries.unshift(newEnquiry);
    this.persist();

    // Asynchronously notify teammates' backend API if configured
    this.forwardToBackend(newEnquiry).catch((e) => {
      console.warn('[EnquiryService] Teammate backend sync notice:', e.message || e);
    });

    return newEnquiry;
  }

  private async forwardToBackend(enquiry: CitizenEnquiry): Promise<void> {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) return;

    const endpoint = `${backendUrl.replace(/\/+$/, '')}/api/enquiries`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(enquiry),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Retrieves enquiries with optional filtering.
   */
  getEnquiries(filters?: {
    state?: string;
    occupation?: string;
    gender?: string;
    category?: string;
    language?: string;
    limit?: number;
  }): CitizenEnquiry[] {
    let result = [...this.enquiries];

    if (filters?.state) {
      const s = filters.state.toLowerCase();
      result = result.filter((e) => e.state.toLowerCase().includes(s));
    }
    if (filters?.occupation) {
      const o = filters.occupation.toLowerCase();
      result = result.filter((e) => e.occupation.toLowerCase() === o);
    }
    if (filters?.gender) {
      result = result.filter((e) => e.gender === filters.gender);
    }
    if (filters?.category) {
      const c = filters.category.toLowerCase();
      result = result.filter((e) => e.category.toLowerCase() === c);
    }
    if (filters?.language) {
      result = result.filter((e) => e.language === filters.language);
    }
    if (filters?.limit && filters.limit > 0) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  getEnquiryById(id: string): CitizenEnquiry | null {
    return this.enquiries.find((e) => e.id.toLowerCase() === id.toLowerCase()) || null;
  }

  getStats(): EnquiryStats {
    const stats: EnquiryStats = {
      totalEnquiries: this.enquiries.length,
      byState: {},
      byGender: {},
      byOccupation: {},
      byIncome: {},
      byLanguage: {},
      lastRecordedAt: this.enquiries[0]?.createdAt,
    };

    for (const e of this.enquiries) {
      stats.byState[e.state] = (stats.byState[e.state] || 0) + 1;
      stats.byGender[e.gender] = (stats.byGender[e.gender] || 0) + 1;
      stats.byOccupation[e.occupation] = (stats.byOccupation[e.occupation] || 0) + 1;
      stats.byIncome[e.annualIncome] = (stats.byIncome[e.annualIncome] || 0) + 1;
      stats.byLanguage[e.language] = (stats.byLanguage[e.language] || 0) + 1;
    }

    return stats;
  }
}

export const defaultEnquiryService = new EnquiryService();
