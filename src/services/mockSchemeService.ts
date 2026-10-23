import { Scheme, UserProfile, ISchemeService } from '../types/scheme';

export const MOCK_SCHEMES_CATALOGUE: Scheme[] = [
  {
    id: 'pm-kisan-01',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    category: 'Agriculture',
    state: 'Central / All India',
    description:
      'A Central Sector scheme to provide income support to all landholding farmer families across the country.',
    benefits:
      '₹6,000 per year distributed in three equal installments of ₹2,000 directly into bank accounts via Direct Benefit Transfer (DBT).',
    eligibilitySummary:
      'Landholding farmer families with cultivable landholding in their names. Subject to standard institutional/high-income tax exclusions.',
    minAge: 18,
    maxAge: 100,
    targetOccupations: ['Farmer'],
    requiredDocuments: [
      'Aadhaar Card',
      'Proof of land ownership (Khasra / Khatauni / Land Record)',
      'Aadhaar-seeded Bank Account Passbook',
      'Active Mobile Number',
    ],
    applicationSteps: [
      'Visit the official portal at https://pmkisan.gov.in and click on "New Farmer Registration"',
      'Enter Aadhaar number and state, then complete OTP verification',
      'Fill in landholding details and submit your application',
      'Alternatively, visit your nearest Common Service Centre (CSC) or local Agriculture Office',
    ],
    officialUrl: 'https://pmkisan.gov.in',
    lastVerifiedAt: '2025-01-15',
  },
  {
    id: 'pm-jay-02',
    name: 'Ayushman Bharat PM Jan Arogya Yojana (AB-PMJAY)',
    category: 'Healthcare',
    state: 'Central / All India',
    description:
      'The world’s largest health assurance scheme providing secondary and tertiary care hospitalisation coverage.',
    benefits:
      'Cashless and paperless health insurance coverage of up to ₹5,00,000 per family per year at all empanelled public and private hospitals.',
    eligibilitySummary:
      'Households identified through Socio-Economic Caste Census (SECC 2011) deprivation criteria, and senior citizens aged 70+ regardless of income.',
    minAge: 0,
    maxAge: 120,
    targetOccupations: ['Farmer', 'Worker', 'Student', 'Business Owner', 'Other'],
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / Family ID',
      'Active Mobile Number',
    ],
    applicationSteps: [
      'Check family eligibility on https://mera.pmjay.gov.in or call toll-free helpline 14555',
      'Visit any empanelled hospital or Common Service Centre (CSC)',
      'Verify identity with Aadhaar e-KYC to receive your Ayushman Bharat Card',
    ],
    officialUrl: 'https://pmjay.gov.in',
    lastVerifiedAt: '2025-01-20',
  },
  {
    id: 'pm-awas-03',
    name: 'Pradhan Mantri Awas Yojana (PMAY - Gramin & Urban)',
    category: 'Housing',
    state: 'Central / All India',
    description:
      'Flagship housing mission aimed at providing pucca houses with basic amenities to all eligible houseless and kutcha house residents.',
    benefits:
      'Financial assistance of ₹1.20 Lakh (plains) to ₹1.30 Lakh (hilly areas) for rural construction, or interest subsidy up to 6.5% on housing loans for urban residents.',
    eligibilitySummary:
      'Families without a pucca house in their name anywhere in India, categorized under low-income or SECC housing deprivation.',
    minAge: 18,
    maxAge: 100,
    targetOccupations: ['Farmer', 'Worker', 'Business Owner', 'Other'],
    requiredDocuments: [
      'Aadhaar Number',
      'Bank Account Passbook',
      'MGNREGA Job Card (for rural)',
      'Income Certificate (for urban credit-linked subsidy)',
      'Affidavit affirming no pucca house owned',
    ],
    applicationSteps: [
      'Rural: Beneficiaries are identified via Gram Sabha through Awaas+ survey list',
      'Urban: Apply online through https://pmaymis.gov.in or visit the nearest Urban Local Body / municipality office',
      'Field officer conducts physical geo-tagging inspection before installment releases',
    ],
    officialUrl: 'https://pmayg.nic.in',
    lastVerifiedAt: '2025-01-10',
  },
  {
    id: 'pm-vishwakarma-04',
    name: 'PM Vishwakarma Scheme',
    category: 'Employment',
    state: 'Central / All India',
    description:
      'Comprehensive holistic support scheme for traditional artisans and craftspeople working with their hands and traditional tools.',
    benefits:
      'Collateral-free enterprise loans up to ₹3,00,000 at 5% interest rate, modern toolkit grant of ₹15,000, and 5-7 days skill training with ₹500 daily stipend.',
    eligibilitySummary:
      'Artisans engaged in 18 notified traditional trades (carpenters, blacksmiths, potters, cobblers, tailors, etc.), minimum age 18 years.',
    minAge: 18,
    maxAge: 75,
    targetOccupations: ['Worker', 'Business Owner', 'Other'],
    requiredDocuments: [
      'Aadhaar Card',
      'Bank Account Details',
      'Ration Card',
      'Self-declaration of traditional artisan trade',
    ],
    applicationSteps: [
      'Visit a Common Service Centre (CSC) with Aadhaar and biometric credentials',
      'Register trade details on https://pmvishwakarma.gov.in',
      'Three-tier verification is performed: Gram Panchayat/ULB, District Implementation Committee, and Screening Committee',
    ],
    officialUrl: 'https://pmvishwakarma.gov.in',
    lastVerifiedAt: '2025-02-01',
  },
  {
    id: 'post-matric-05',
    name: 'Post-Matric Scholarship for Higher Education',
    category: 'Education',
    state: 'Central / All India',
    description:
      'Financial support to students studying at post-matriculation or post-secondary stages to complete their education.',
    benefits:
      'Full compulsory non-refundable fees reimbursement plus monthly maintenance allowance ranging from ₹2,500 to ₹13,500 per annum depending on study level.',
    eligibilitySummary:
      'Indian students enrolled in recognized higher secondary, graduation, or post-graduation colleges whose annual family income is below ₹2.5 Lakh.',
    minAge: 15,
    maxAge: 35,
    targetOccupations: ['Student'],
    requiredDocuments: [
      'Aadhaar Card',
      'Previous Examination Marksheets',
      'Income Certificate issued by authorized revenue authority',
      'Category / Caste Certificate (if applicable)',
      'College Admission Fee Receipt and Bonafide Certificate',
      'Aadhaar-linked Bank Passbook',
    ],
    applicationSteps: [
      'Create an account on the National Scholarship Portal (NSP) at https://scholarships.gov.in',
      'Complete One-Time Registration (OTR) with face or OTP authentication',
      'Select Post-Matric Scholarship Scheme and upload necessary documents',
      'Submit the printed application to your college verification nodal officer',
    ],
    officialUrl: 'https://scholarships.gov.in',
    lastVerifiedAt: '2025-01-12',
  },
  {
    id: 'atal-pension-06',
    name: 'Atal Pension Yojana (APY)',
    category: 'Pension',
    state: 'Central / All India',
    description:
      'Government-backed guaranteed pension scheme aimed primarily at workers in the unorganised sector.',
    benefits:
      'Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 from age 60 until lifetime, followed by pension to spouse and return of pension corpus to nominee.',
    eligibilitySummary:
      'Indian citizens aged between 18 and 40 years holding a savings bank or post office account, who are not income tax payers.',
    minAge: 18,
    maxAge: 40,
    targetOccupations: ['Worker', 'Farmer', 'Business Owner', 'Other'],
    requiredDocuments: [
      'Savings Bank Account or Post Office Savings Account',
      'Aadhaar Card',
      'Active Mobile Number',
      'Nominee Details',
    ],
    applicationSteps: [
      'Approach the bank branch or post office where your savings account is held',
      'Fill out the APY Registration Form and choose your desired pension amount (₹1,000 - ₹5,000)',
      'Authorize auto-debit of monthly/quarterly contribution from your account',
      'Alternatively, register online via Internet Banking in supported banks',
    ],
    officialUrl: 'https://www.npscra.nsdl.co.in/scheme-details.php',
    lastVerifiedAt: '2025-01-18',
  },
  {
    id: 'pmmvy-07',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    category: "Women's Welfare",
    state: 'Central / All India',
    description:
      'Direct cash incentive scheme providing partial compensation for wage loss during pregnancy and childbirth.',
    benefits:
      'Cash incentive of ₹5,000 in two installments for first living child, and ₹6,000 in a single installment for second child if it is a girl child.',
    eligibilitySummary:
      'Pregnant women and lactating mothers who are socially and economically disadvantaged (e.g. ration card holders, MGNREGA workers, annual income < ₹8 Lakh), excluding formal government employees.',
    minAge: 19,
    maxAge: 45,
    targetOccupations: ['Worker', 'Farmer', 'Business Owner', 'Other'],
    requiredDocuments: [
      'Mother and Child Protection (MCP) Card with ANC details',
      'Aadhaar Card of mother and spouse',
      'Beneficiary Bank Account Passbook (Aadhaar seeded)',
      'Child Birth Registration Certificate (for 2nd installment)',
    ],
    applicationSteps: [
      'Register at your local Anganwadi Centre (AWC) or government healthcare institution within 270 days of LMP',
      'Fill Form 1-A / 1-B / 1-C along with copies of MCP card and Aadhaar',
      'Can also register directly on the citizen login at https://pmmvy.wcd.gov.in',
    ],
    officialUrl: 'https://pmmvy.wcd.gov.in',
    lastVerifiedAt: '2025-01-25',
  },
  {
    id: 'pm-mudra-08',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    category: 'Employment',
    state: 'Central / All India',
    description:
      'Refinance scheme facilitating institutional loans to micro and small non-corporate, non-farm enterprises.',
    benefits:
      'Collateral-free business loans under three categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5,00,000), and Tarun (₹5,00,000 to ₹10,00,000) at competitive interest rates.',
    eligibilitySummary:
      'Any Indian citizen with a viable business plan for manufacturing, trading, services, or allied agriculture micro-enterprises.',
    minAge: 18,
    maxAge: 70,
    targetOccupations: ['Business Owner', 'Worker', 'Other'],
    requiredDocuments: [
      'Proof of Identity (Aadhaar / Voter ID / Passport)',
      'Proof of Residence',
      'Business Registration / Trade License / Udyam Certificate',
      'Projected Balance Sheet / Business Plan',
      'Bank Account Statement for last 6 months',
    ],
    applicationSteps: [
      'Prepare a business project report and choose an appropriate MUDRA loan category (Shishu, Kishore, or Tarun)',
      'Apply online via the Udyamimitra portal at https://www.udyamimitra.in or visit any commercial bank or MFI branch',
      'Submit identity and business verification documents for loan sanction',
    ],
    officialUrl: 'https://www.mudra.org.in',
    lastVerifiedAt: '2025-01-22',
  },
  {
    id: 'kisan-credit-card-09',
    name: 'Kisan Credit Card (KCC) Scheme',
    category: 'Agriculture',
    state: 'Central / All India',
    description:
      'Provides adequate and timely credit support to farmers for cultivation expenses, post-harvest needs, and farm maintenance.',
    benefits:
      'Credit limit based on landholding and cropping pattern with interest subvention: effective interest rate as low as 4% per annum for prompt repayment up to ₹3,00,000.',
    eligibilitySummary:
      'All farmers (individuals or joint cultivators, tenant farmers, sharecroppers, and self-help groups) owning or cultivating land.',
    minAge: 18,
    maxAge: 75,
    targetOccupations: ['Farmer'],
    requiredDocuments: [
      'Completed KCC Application Form',
      'Proof of identity (Aadhaar / Voter ID)',
      'Land revenue records / crop cultivation records',
      'Passport size photograph',
    ],
    applicationSteps: [
      'Download one-page KCC application form from https://pmkisan.gov.in or bank website',
      'Fill in land and crop details and attach land document copies',
      'Submit to the nearest commercial bank, regional rural bank (RRB), or cooperative bank',
    ],
    officialUrl: 'https://myscheme.gov.in/schemes/kcc',
    lastVerifiedAt: '2025-01-30',
  },
  {
    id: 'mp-kisan-kalyan-10',
    name: 'Mukhyamantri Kisan Kalyan Yojana (Madhya Pradesh)',
    category: 'Agriculture',
    state: 'Madhya Pradesh',
    description:
      'State government supplementary scheme to augment PM-KISAN support for farmers in Madhya Pradesh.',
    benefits:
      'Additional direct cash assistance of ₹4,000 per year paid in two equal installments of ₹2,000 into the bank account, totaling ₹10,000 combined with PM-KISAN.',
    eligibilitySummary:
      'Resident farmers of Madhya Pradesh who are active beneficiaries of PM-KISAN and cultivate land in MP.',
    minAge: 18,
    maxAge: 100,
    targetOccupations: ['Farmer'],
    requiredDocuments: [
      'PM-KISAN Registration ID',
      'Samagra Member ID',
      'Aadhaar Number',
      'Land Revenue Records (Bhoo-Abhilekh)',
    ],
    applicationSteps: [
      'Contact your area Patwari / Revenue Inspector with PM-KISAN ID and Samagra ID',
      'Alternatively, apply through SAARA portal at https://saara.mp.gov.in',
      'Applications are verified through village revenue records',
    ],
    officialUrl: 'https://saara.mp.gov.in',
    lastVerifiedAt: '2025-01-14',
  },
  {
    id: 'mh-mjpjay-11',
    name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY Maharashtra)',
    category: 'Healthcare',
    state: 'Maharashtra',
    description:
      'State health insurance scheme providing quality medical care to families in Maharashtra for catastrophic illnesses.',
    benefits:
      'Free cashless medical and surgical treatment up to ₹5,00,000 per family per year across 1,356 procedures in empanelled network hospitals.',
    eligibilitySummary:
      'Residents of Maharashtra holding Yellow, Orange, or White Ration Cards, or registered construction workers, farmers in drought-affected districts.',
    minAge: 0,
    maxAge: 120,
    targetOccupations: ['Farmer', 'Worker', 'Student', 'Business Owner', 'Other'],
    requiredDocuments: [
      'Ration Card (Yellow / Orange / White)',
      'Aadhaar Card or Voter ID Card',
      'Doctor recommendation or diagnosis slip',
    ],
    applicationSteps: [
      'Visit any empanelled public or private hospital in Maharashtra',
      'Approach the Arogyamitra desk located near the hospital registration counter',
      'Present your Ration card and Aadhaar for instant eligibility check and pre-authorization',
    ],
    officialUrl: 'https://www.jeevandayee.gov.in',
    lastVerifiedAt: '2025-01-16',
  },
  {
    id: 'up-shramik-scholarship-12',
    name: 'Sant Ravidas Shiksha Sahayata Yojana (Uttar Pradesh)',
    category: 'Education',
    state: 'Uttar Pradesh',
    description:
      'Education assistance scheme for children of registered construction workers in Uttar Pradesh.',
    benefits:
      'Financial scholarship from ₹100 per month (class 1-5) up to ₹5,000 per month for engineering/medical courses, plus cycle assistance for high school girls.',
    eligibilitySummary:
      'Children of construction workers registered with the UP Building and Other Construction Workers Welfare Board (BOCW), maximum age 25.',
    minAge: 6,
    maxAge: 25,
    targetOccupations: ['Student', 'Worker'],
    requiredDocuments: [
      'BOCW Shramik Registration Card of Parent',
      'Student Aadhaar Card',
      'Previous Class Marksheet',
      'School Admission Certificate / Fee Receipt',
      'Bank Account Passbook',
    ],
    applicationSteps: [
      'Visit the UP BOCW portal at https://upbocw.in',
      'Login with parent registration number and select Sant Ravidas Shiksha Sahayata Yojana',
      'Upload child educational details and submit to Labour Enforcement Officer',
    ],
    officialUrl: 'https://upbocw.in',
    lastVerifiedAt: '2025-01-19',
  },
];

export class MockSchemeService implements ISchemeService {
  private schemes: Scheme[];

  constructor(schemes: Scheme[] = MOCK_SCHEMES_CATALOGUE) {
    this.schemes = schemes;
  }

  /**
   * Matches schemes based on UserProfile:
   * 1. Category: Exact match or "Other" matches general schemes
   * 2. State: Exact match or "Central / All India"
   * 3. Age: Between minAge and maxAge (if defined)
   * 4. Occupation: Matches targetOccupations (or if targetOccupations includes 'All' or is undefined)
   *
   * Ranks schemes:
   * - State-specific matches prioritized higher
   * - Direct category match prioritized
   *
   * Returns up to 3 results.
   */
  async getRelevantSchemes(profile: UserProfile): Promise<Scheme[]> {
    // Simulate brief network delay for realism (10ms)
    await new Promise((resolve) => setTimeout(resolve, 10));

    const matches = this.schemes.filter((scheme) => {
      // 1. Category check
      const matchesCategory =
        profile.category === 'Other' ||
        scheme.category === profile.category ||
        scheme.category === 'Other';

      if (!matchesCategory) return false;

      // 2. State check: scheme must be Central/All India OR match user's state
      const isCentral =
        scheme.state.toLowerCase().includes('central') ||
        scheme.state.toLowerCase().includes('all india');
      const matchesState =
        isCentral ||
        scheme.state.toLowerCase().includes(profile.state.toLowerCase()) ||
        profile.state.toLowerCase().includes(scheme.state.toLowerCase());

      if (!matchesState) return false;

      // 3. Age check (if scheme defines minAge/maxAge)
      if (scheme.minAge !== undefined && profile.age < scheme.minAge) {
        return false;
      }
      if (scheme.maxAge !== undefined && profile.age > scheme.maxAge) {
        return false;
      }

      // 4. Occupation check
      if (scheme.targetOccupations && scheme.targetOccupations.length > 0) {
        const matchesOccupation =
          scheme.targetOccupations.includes('All') ||
          scheme.targetOccupations.includes(profile.occupation) ||
          profile.occupation === 'Other';

        if (!matchesOccupation) return false;
      }

      return true;
    });

    // Score and rank matches
    const scored = matches.map((scheme) => {
      let score = 0;
      // Category match boost
      if (scheme.category === profile.category) score += 3;
      // State-specific boost over central schemes
      const isCentral =
        scheme.state.toLowerCase().includes('central') ||
        scheme.state.toLowerCase().includes('all india');
      if (!isCentral) score += 4;
      // Occupation match boost
      if (
        scheme.targetOccupations &&
        scheme.targetOccupations.includes(profile.occupation)
      ) {
        score += 2;
      }
      return { scheme, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Return maximum 3 results as per specification
    return scored.slice(0, 3).map((item) => item.scheme);
  }
}
