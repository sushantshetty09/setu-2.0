import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Search,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';

interface MinistryData {
  name: string;
  hindiName: string;
  schemesCount: number;
  nodalWebsite: string;
  description: string;
  majorSchemes: { name: string; type: string }[];
  category: string;
}

export const MinistriesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const MINISTRIES_DATA: MinistryData[] = [
    {
      name: 'Ministry of Agriculture & Farmers Welfare',
      hindiName: 'कृषि एवं किसान कल्याण मंत्रालय',
      schemesCount: 42,
      nodalWebsite: 'https://agricoop.nic.in',
      description: 'Responsible for formulating and implementing national policies on agriculture, farm income, crop insurance, and horticulture.',
      category: 'Agriculture & Rural',
      majorSchemes: [
        { name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)', type: 'Central Sector Scheme' },
        { name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', type: 'Centrally Sponsored' },
        { name: 'Kisan Credit Card (KCC) Scheme', type: 'Credit Support' },
        { name: 'PM Krishi Sinchayee Yojana (Per Drop More Crop)', type: 'Infrastructure' }
      ]
    },
    {
      name: 'Ministry of Education',
      hindiName: 'शिक्षा मंत्रालय',
      schemesCount: 68,
      nodalWebsite: 'https://www.education.gov.in',
      description: 'Department of Higher Education and School Education & Literacy driving NEP 2020, scholarships, and academic equity.',
      category: 'Education',
      majorSchemes: [
        { name: 'National Scholarship Portal (NSP) Schemes', type: 'Scholarship' },
        { name: 'PM-SHRI Schools Scheme', type: 'Infrastructure' },
        { name: 'Samagra Shiksha Abhiyan', type: 'Centrally Sponsored' },
        { name: 'Central Sector Scheme of Scholarship for College & University', type: 'Higher Education' }
      ]
    },
    {
      name: 'Ministry of Health & Family Welfare',
      hindiName: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय',
      schemesCount: 35,
      nodalWebsite: 'https://mohfw.gov.in',
      description: 'Oversees public health systems, tertiary care institutions, universal health coverage, and disease eradication programs.',
      category: 'Healthcare',
      majorSchemes: [
        { name: 'Ayushman Bharat - PMJAY (Health Insurance)', type: 'Universal Health' },
        { name: 'Ayushman Arogya Mandir (Health & Wellness Centres)', type: 'Primary Care' },
        { name: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)', type: 'Maternal Care' },
        { name: 'National Health Mission (NHM)', type: 'Centrally Sponsored' }
      ]
    },
    {
      name: 'Ministry of Social Justice and Empowerment',
      hindiName: 'सामाजिक न्याय और अधिकारिता मंत्रालय',
      schemesCount: 54,
      nodalWebsite: 'https://socialjustice.gov.in',
      description: 'Empowering Scheduled Castes (SC), Other Backward Classes (OBC), Senior Citizens, and Persons with Disabilities (PwD).',
      category: 'Social Welfare',
      majorSchemes: [
        { name: 'Post-Matric Scholarship for SC Students', type: 'Scholarship' },
        { name: 'SHRESHTA (Residential Education for SC students)', type: 'Education' },
        { name: 'PM-DAKSH (Pradhan Mantri Dakshta Aur Kushalta Sampann Hitgrahi)', type: 'Skill Training' },
        { name: 'National Action Plan for Senior Citizens (NAPSrC)', type: 'Senior Welfare' }
      ]
    },
    {
      name: 'Ministry of Housing and Urban Affairs (MoHUA)',
      hindiName: 'आवासन और शहरी कार्य मंत्रालय',
      schemesCount: 28,
      nodalWebsite: 'https://mohua.gov.in',
      description: 'Formulates policies for urban development, affordable housing, smart cities, and urban livelihood missions.',
      category: 'Housing & Urban',
      majorSchemes: [
        { name: 'Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)', type: 'Affordable Housing' },
        { name: 'PM SVANidhi (Street Vendors Micro-Credit Scheme)', type: 'Micro-Finance' },
        { name: 'Deendayal Antyodaya Yojana - DAY-NULM', type: 'Urban Livelihoods' },
        { name: 'Smart Cities Mission & AMRUT 2.0', type: 'Urban Infrastructure' }
      ]
    },
    {
      name: 'Ministry of Electronics and Information Technology (MeitY)',
      hindiName: 'इलेक्ट्रॉनिकी और सूचना प्रौद्योगिकी मंत्रालय',
      schemesCount: 22,
      nodalWebsite: 'https://www.meity.gov.in',
      description: 'Drives Digital India, e-Governance, semiconductor manufacturing missions, DigiLocker, and cybersecurity.',
      category: 'Digital & IT',
      majorSchemes: [
        { name: 'DigiLocker & Sovereign Identity Framework', type: 'Digital Infrastructure' },
        { name: 'PMGDISHA (Pradhan Mantri Gramin Digital Saksharta Abhiyaan)', type: 'Digital Literacy' },
        { name: 'Modified Electronics Manufacturing Clusters (EMC 2.0)', type: 'Industry Subsidy' },
        { name: 'Semicon India Mission', type: 'Technology Innovation' }
      ]
    },
    {
      name: 'Ministry of Skill Development & Entrepreneurship',
      hindiName: 'कौशल विकास और उद्यमशीलता मंत्रालय',
      schemesCount: 31,
      nodalWebsite: 'https://www.msde.gov.in',
      description: 'Coordinates all skill development efforts across the country, building vocational training frameworks and apprenticeships.',
      category: 'Skill Development',
      majorSchemes: [
        { name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)', type: 'Skill Certification' },
        { name: 'National Apprenticeship Promotion Scheme (NAPS-2)', type: 'Apprenticeship Stipend' },
        { name: 'Craftsmen Training Scheme (ITI Upgradation)', type: 'Vocational Training' },
        { name: 'Jan Shikshan Sansthan (JSS) Scheme', type: 'Rural Non-Formal Skills' }
      ]
    },
    {
      name: 'Ministry of Women and Child Development',
      hindiName: 'महिला एवं बाल विकास मंत्रालय',
      schemesCount: 29,
      nodalWebsite: 'https://wcd.nic.in',
      description: 'Holistic development of women and children, maternal care, child safety, and nutrition assurance.',
      category: 'Women & Child',
      majorSchemes: [
        { name: 'Mission Saksham Anganwadi and Poshan 2.0', type: 'Nutrition' },
        { name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)', type: 'Direct Cash Incentive' },
        { name: 'Beti Bachao Beti Padhao (BBBP)', type: 'Education & Empowerment' },
        { name: 'Mission Vatsalya (Child Protection)', type: 'Child Welfare' }
      ]
    },
    {
      name: 'Ministry of Finance & Dept of Financial Services',
      hindiName: 'वित्त मंत्रालय (वित्तीय सेवाएं विभाग)',
      schemesCount: 40,
      nodalWebsite: 'https://financialservices.gov.in',
      description: 'Implements flagship social security, microfinance, pension schemes, and banking inclusion drives.',
      category: 'Finance & Banking',
      majorSchemes: [
        { name: 'Pradhan Mantri MUDRA Yojana (PMMY)', type: 'Collateral-free Loans' },
        { name: 'PM Jeevan Jyoti Bima Yojana (PMJJBY)', type: 'Life Insurance' },
        { name: 'PM Suraksha Bima Yojana (PMSBY)', type: 'Accident Insurance' },
        { name: 'Stand-Up India Scheme', type: 'SC/ST/Women Entrepreneurship' }
      ]
    },
    {
      name: 'Ministry of Rural Development',
      hindiName: 'ग्रामीण विकास मंत्रालय',
      schemesCount: 38,
      nodalWebsite: 'https://rural.nic.in',
      description: 'Poverty alleviation, employment generation, infrastructure, and housing development in rural India.',
      category: 'Rural Welfare',
      majorSchemes: [
        { name: 'Mahatma Gandhi NREGA (100 Days Guaranteed Wage)', type: 'Wage Employment' },
        { name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)', type: 'Rural Housing' },
        { name: 'Deendayal Antyodaya Yojana - DAY-NRLM (Lakhpati Didi)', type: 'Women SHG' },
        { name: 'Pradhan Mantri Gram Sadak Yojana (PMGSY)', type: 'Rural Roads' }
      ]
    },
    {
      name: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
      hindiName: 'सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय',
      schemesCount: 27,
      nodalWebsite: 'https://msme.gov.in',
      description: 'Promoting growth and development of micro, small and medium enterprises including khadi, village and coir industries.',
      category: 'MSME & Industry',
      majorSchemes: [
        { name: 'Prime Ministers Employment Generation Programme (PMEGP)', type: 'Credit-linked Subsidy' },
        { name: 'PM Vishwakarma Scheme (Traditional Artisans)', type: 'Artisan Toolkit & Loan' },
        { name: 'Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)', type: 'Credit Guarantee' },
        { name: 'RAMP (Raising and Accelerating MSME Performance)', type: 'Enterprise Upgrade' }
      ]
    },
    {
      name: 'Ministry of Labour and Employment',
      hindiName: 'श्रम एवं रोजगार मंत्रालय',
      schemesCount: 33,
      nodalWebsite: 'https://labour.gov.in',
      description: 'Safeguarding workers rights, unorganized worker social security registration, and national career services.',
      category: 'Labour & Welfare',
      majorSchemes: [
        { name: 'e-Shram Portal (Unorganised Workers Registry)', type: 'Social Security ID' },
        { name: 'Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)', type: 'Pension Scheme' },
        { name: 'National Career Service (NCS) Portal', type: 'Job Matching' },
        { name: 'Atal Beemit Vyakti Kalyan Yojana (ESIC)', type: 'Unemployment Relief' }
      ]
    }
  ];

  const filteredMinistries = MINISTRIES_DATA.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.hindiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.majorSchemes.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#1A2E40] to-[#00875A] rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 z-10 relative">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
            <Building2 className="w-3.5 h-3.5" />
            <span>Central Government Line Ministries</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('ministriesPage.title', 'Central Government Ministries & Departments')}
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {t('ministriesPage.subtitle', 'Comprehensive directory of schemes, missions, and welfare portals spearheaded by Central Government Ministries.')}
          </p>
        </div>

        {/* Search Input */}
        <div className="mt-6 max-w-xl relative z-10">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ministry or mission (e.g. Agriculture, Education, MeitY, PM-KISAN, Ayushman)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 2. Ministries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMinistries.map((min) => (
          <div
            key={min.name}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    {min.category}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-setu-blue transition-colors">
                    {min.name}
                  </h2>
                  <p className="text-xs font-serif text-slate-500">{min.hindiName}</p>
                </div>

                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0">
                  {min.schemesCount} Schemes
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {min.description}
              </p>

              {/* Official Website Badge */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 text-[10px] block font-semibold">Official Ministry Portal</span>
                  <span className="font-bold text-slate-700">{min.nodalWebsite.replace('https://', '')}</span>
                </div>
                <a
                  href={min.nodalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-900 p-1.5 rounded-md hover:bg-emerald-100/60 transition-colors"
                  title="Visit official ministry portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Key National Missions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Key National Missions & Schemes:
                </span>
                <div className="space-y-1.5">
                  {min.majorSchemes.map((scheme, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(`/schemes?ministry=${encodeURIComponent(min.name)}&q=${encodeURIComponent(scheme.name.split(' (')[0])}`)}
                      className="text-xs bg-slate-50 hover:bg-emerald-50 p-2 rounded-lg border border-slate-100 hover:border-emerald-200 cursor-pointer transition-colors flex items-center justify-between group/sch"
                    >
                      <div>
                        <span className="font-bold text-slate-800 group-hover/sch:text-emerald-700 block line-clamp-1">
                          {scheme.name}
                        </span>
                        <span className="text-[10px] text-slate-500">{scheme.type}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/sch:text-emerald-600 group-hover/sch:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="bg-slate-50 p-3.5 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/schemes?ministry=${encodeURIComponent(min.name)}`}
                className="text-xs font-bold text-setu-blue hover:text-emerald-700 inline-flex items-center space-x-1 transition-colors"
              >
                <span>View all {min.name} Schemes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/find"
                className="text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                Check Eligibility
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
