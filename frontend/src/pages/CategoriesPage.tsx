import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  HeartPulse,
  Sprout,
  Users,
  Home,
  Briefcase,
  Accessibility,
  UserCheck,
  Shield,
  TrendingUp,
  Award,
  Sun,
  Laptop,
  Scale,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  nativeName?: string;
  count: number;
  icon: any;
  color: string;
  bgLight: string;
  description: string;
  popularSchemes: { id: string; name: string; benefit: string }[];
  tags: string[];
}

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const CATEGORIES: CategoryItem[] = [
    {
      id: 'agriculture',
      name: 'Agriculture, Rural & Environment',
      count: 245,
      icon: Sprout,
      color: '#00875A',
      bgLight: 'bg-emerald-50 border-emerald-200',
      description: 'Crop insurance, farmer financial income support, solar irrigation pumps, organic farming subsidies and fertilizers.',
      popularSchemes: [
        { id: 'pm-kisan', name: 'PM-KISAN Samman Nidhi', benefit: '₹6,000 / year direct bank transfer' },
        { id: 'pm-kusum', name: 'PM-KUSUM Solar Pump Scheme', benefit: 'Up to 60% subsidy on solar pump' },
        { id: 'pmfby', name: 'Pradhan Mantri Fasal Bima Yojana', benefit: 'Comprehensive crop loss cover' }
      ],
      tags: ['Farmers', 'Kisan Credit', 'Crop Insurance', 'Fertilizer Subsidy', 'Organic Farming']
    },
    {
      id: 'education',
      name: 'Education & Learning',
      count: 312,
      icon: GraduationCap,
      color: '#1E40AF',
      bgLight: 'bg-blue-50 border-blue-200',
      description: 'Pre-matric, post-matric, higher education scholarships, free coaching, overseas fellowships, and education loans.',
      popularSchemes: [
        { id: 'nsp-postmatric', name: 'Post-Matric Scholarship Scheme', benefit: 'Full tuition fee & monthly maintenance' },
        { id: 'vidyasiri', name: 'Vidyasiri Hostel & Food Scheme', benefit: '₹1,500/month food & hostel support' },
        { id: 'pm-shri', name: 'PM-SHRI School Excellence Program', benefit: 'Modern learning & smart classrooms' }
      ],
      tags: ['Scholarships', 'Higher Education', 'SC/ST/OBC', 'Merit-cum-Means', 'Education Loan']
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      count: 185,
      icon: HeartPulse,
      color: '#DC2626',
      bgLight: 'bg-rose-50 border-rose-200',
      description: 'Free secondary and tertiary healthcare coverage, affordable generic medicines, maternity welfare, and immunization.',
      popularSchemes: [
        { id: 'pmjay', name: 'Ayushman Bharat PM-JAY', benefit: '₹5,00,000 cashless health cover / family / yr' },
        { id: 'pmjay-aushadhi', name: 'PM Bhartiya Jan Aushadhi', benefit: 'High quality medicines at 50-90% discount' },
        { id: 'pmmvy', name: 'Pradhan Mantri Matru Vandana', benefit: '₹5,000 cash incentive for pregnant mothers' }
      ],
      tags: ['Health Cover', 'Cashless Hospitalization', 'Maternal Health', 'Generic Medicine']
    },
    {
      id: 'banking',
      name: 'Banking, Financial Services & Insurance',
      count: 140,
      icon: TrendingUp,
      color: '#B45309',
      bgLight: 'bg-amber-50 border-amber-200',
      description: 'Zero-balance bank accounts, low-cost life and accidental insurance, micro-pensions, and subsidized collateral-free loans.',
      popularSchemes: [
        { id: 'pmjdy', name: 'PM Jan-Dhan Yojana', benefit: 'Zero balance account + ₹2L accident insurance' },
        { id: 'pmjjby', name: 'PM Jeevan Jyoti Bima Yojana', benefit: '₹2,00,000 life insurance @ ₹436/year' },
        { id: 'apy', name: 'Atal Pension Yojana (APY)', benefit: 'Guaranteed pension up to ₹5,000 / month' }
      ],
      tags: ['Financial Inclusion', 'Pension', 'Life Insurance', 'DBT Direct Deposit']
    },
    {
      id: 'social',
      name: 'Social Welfare & Empowerment',
      count: 278,
      icon: Shield,
      color: '#7C3AED',
      bgLight: 'bg-purple-50 border-purple-200',
      description: 'Welfare schemes for SC, ST, OBC, Economically Weaker Sections, transgender individuals, and destitutes.',
      popularSchemes: [
        { id: 'nsap-pension', name: 'National Social Assistance (NSAP)', benefit: 'Monthly Old Age & Widow Pension' },
        { id: 'shrestha', name: 'SHRESHTA High School Scheme', benefit: 'Free residential education in top CBSE schools' },
        { id: 'pm-daksh', name: 'PM-DAKSH Skill Development', benefit: 'Free vocational training with stipend' }
      ],
      tags: ['Social Justice', 'SC/ST Welfare', 'Senior Citizens', 'Widow Pension', 'OBC Empowerment']
    },
    {
      id: 'housing',
      name: 'Housing & Shelter',
      count: 95,
      icon: Home,
      color: '#0284C7',
      bgLight: 'bg-sky-50 border-sky-200',
      description: 'Financial assistance for pucca housing in rural and urban areas, interest subsidies, and affordable rental housing.',
      popularSchemes: [
        { id: 'pmay-g', name: 'PMAY - Gramin (Rural Housing)', benefit: '₹1.20 Lakh to ₹1.30 Lakh assistance' },
        { id: 'pmay-u', name: 'PMAY - Urban 2.0', benefit: 'Interest subsidy on housing loans for EWS/LIG' },
        { id: 'arhc', name: 'Affordable Rental Housing Complexes', benefit: 'Low-cost urban rental living for workers' }
      ],
      tags: ['Pucca House', 'Urban Housing', 'Rural Shelter', 'Home Loan Subsidy']
    },
    {
      id: 'women',
      name: 'Women & Child Development',
      count: 165,
      icon: Users,
      color: '#DB2777',
      bgLight: 'bg-pink-50 border-pink-200',
      description: 'Girl child financial security, maternal nourishment, women entrepreneurship, and safety helplines.',
      popularSchemes: [
        { id: 'sukanya', name: 'Sukanya Samriddhi Yojana (SSY)', benefit: 'High interest rate + full tax exemption' },
        { id: 'beti-bachao', name: 'Beti Bachao Beti Padhao', benefit: 'Educational incentives & awareness drives' },
        { id: 'poshan-2', name: 'POSHAN Abhiyaan 2.0', benefit: 'Supplementary nutrition for children & mothers' }
      ],
      tags: ['Girl Child', 'Women SHG', 'Maternal Nutrition', 'Safety & Shelter']
    },
    {
      id: 'employment',
      name: 'Skills, Employment & Entrepreneurship',
      count: 220,
      icon: Briefcase,
      color: '#059669',
      bgLight: 'bg-teal-50 border-teal-200',
      description: 'Government certified skill courses, micro-business mudra loans, youth internships, and startup funding.',
      popularSchemes: [
        { id: 'pm-mudra', name: 'PM MUDRA Yojana', benefit: 'Collateral-free loans up to ₹20 Lakhs' },
        { id: 'pmkvy', name: 'PM Kaushal Vikas Yojana 4.0', benefit: 'Free industry-aligned certification' },
        { id: 'standup-india', name: 'Stand-Up India Scheme', benefit: 'Loans from ₹10L to ₹1Cr for SC/ST & Women' }
      ],
      tags: ['Mudra Loan', 'Vocational Training', 'Startup India', 'Self Employment']
    },
    {
      id: 'disability',
      name: 'Persons with Disabilities (PwD / Divyangjan)',
      count: 88,
      icon: Accessibility,
      color: '#EA580C',
      bgLight: 'bg-orange-50 border-orange-200',
      description: 'Aids and assistive appliances, motorized tricycles, disability pensions, and accessible infrastructure.',
      popularSchemes: [
        { id: 'adip', name: 'ADIP Scheme for Assistive Devices', benefit: 'Free wheelchairs, hearing aids, braille kits' },
        { id: 'divyang-pension', name: 'Divyangjan Disability Pension', benefit: 'Monthly direct financial support' },
        { id: 'sipda', name: 'SIPDA Barrier-Free Access', benefit: 'Government building accessibility support' }
      ],
      tags: ['UDID Card', 'Assistive Devices', 'Disability Pension', 'Equal Opportunity']
    },
    {
      id: 'it-science',
      name: 'Science, IT & Digital Innovation',
      count: 75,
      icon: Laptop,
      color: '#4F46E5',
      bgLight: 'bg-indigo-50 border-indigo-200',
      description: 'Digital literacy, digital public infrastructure, AI research fellowships, and broadband in rural areas.',
      popularSchemes: [
        { id: 'pmgdishan', name: 'PMGDISHA Digital Literacy', benefit: 'Free 20-hour digital skills training' },
        { id: 'inspire', name: 'INSPIRE Science Scholarship', benefit: '₹80,000 / year for pursuing science' },
        { id: 'bharatnet', name: 'BharatNet High-Speed Optical Fiber', benefit: 'Broadband to 2.5 Lakh Gram Panchayats' }
      ],
      tags: ['Digital India', 'Science Fellowships', 'Broadband', 'Tech Innovation']
    },
    {
      id: 'sports',
      name: 'Sports & Youth Affairs',
      count: 48,
      icon: Award,
      color: '#D97706',
      bgLight: 'bg-yellow-50 border-yellow-200',
      description: 'Athletic talent identification, financial stipends for national players, and sports infrastructure.',
      popularSchemes: [
        { id: 'khelo-india', name: 'Khelo India Youth Program', benefit: '₹5 Lakh per year for 8 years to top talent' },
        { id: 'target-olympic', name: 'TOPS (Target Olympic Podium)', benefit: 'World-class coaching & foreign training' },
        { id: 'nyc', name: 'National Youth Corps', benefit: 'Monthly stipend for community youth leaders' }
      ],
      tags: ['Khelo India', 'Athletes', 'Sports Stipend', 'Olympic Coaching']
    },
    {
      id: 'law-justice',
      name: 'Public Safety, Law & Justice',
      count: 42,
      icon: Scale,
      color: '#475569',
      bgLight: 'bg-slate-50 border-slate-200',
      description: 'Free legal aid services, Tele-Law video consultations, crime victim compensation, and cyber safety.',
      popularSchemes: [
        { id: 'tele-law', name: 'Tele-Law Portal (NALSA)', benefit: 'Free lawyer consultation via CSC' },
        { id: 'nalsa-legal', name: 'Free Legal Services (NALSA)', benefit: 'Free advocate representation for EWS/women' },
        { id: 'cyber-safe', name: 'National Cyber Crime Portal', benefit: '24/7 Financial fraud recovery helpline 1930' }
      ],
      tags: ['Free Legal Aid', 'Tele-Law', 'Victim Compensation', 'Cyber Suraksha']
    }
  ];

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#00875A] rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 z-10 relative">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
            <Layers className="w-3.5 h-3.5" />
            <span>Structured Citizen Focus Areas</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('categoriesPage.title', 'Browse Welfare Schemes by Category')}
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {t('categoriesPage.subtitle', 'Explore over 3,000+ social welfare initiatives organized across specialized citizen focus areas.')}
          </p>
        </div>

        {/* Search Input inside Banner */}
        <div className="mt-6 max-w-xl relative z-10">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories (e.g. Agriculture, Scholarships, Housing, Health)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 2. Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-4">
                {/* Category Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: category.color }} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-setu-blue transition-colors">
                        {category.name}
                      </h2>
                      <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
                        {category.count} Verified Schemes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {category.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {category.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Popular Flagship Schemes in this category */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Key Flagship Schemes</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="space-y-1.5">
                    {category.popularSchemes.map((sch) => (
                      <div
                        key={sch.id}
                        onClick={() => navigate(`/schemes?category=${category.id}&q=${encodeURIComponent(sch.name)}`)}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 cursor-pointer transition-colors flex items-center justify-between group/item"
                      >
                        <div className="max-w-[85%]">
                          <p className="text-xs font-bold text-slate-800 group-hover/item:text-emerald-700 line-clamp-1">
                            {sch.name}
                          </p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">
                            {sch.benefit}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-emerald-600 group-hover/item:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="bg-slate-50 p-3.5 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/schemes?category=${category.id}`}
                  className="text-xs font-bold text-setu-blue hover:text-[#00875A] inline-flex items-center space-x-1 transition-colors"
                >
                  <span>Explore all {category.name}</span>
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
          );
        })}
      </div>
    </div>
  );
};
