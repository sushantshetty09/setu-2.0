import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  ArrowRight, 
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
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  CheckCircle2,
  FileText,
  MousePointerClick,
  Sparkles,
  Building2,
  MapPin,
  Layers,
  HelpCircle,
  QrCode,
  Smartphone,
  Check,
  X
} from 'lucide-react';
import { SchemeCard } from '../components/common/SchemeCard';
import { IndiaMap } from '../components/common/IndiaMap';
import { fetchPopularSchemes, fetchCategories } from '../services/api';
import { Scheme, SchemeCategory } from '../types';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [popularSchemes, setPopularSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<SchemeCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Active tab state: 'categories' | 'states' | 'ministries'
  const [activeTab, setActiveTab] = useState<'categories' | 'states' | 'ministries'>('categories');

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Video modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schemes, cats] = await Promise.all([
          fetchPopularSchemes(),
          fetchCategories()
        ]);
        setPopularSchemes(schemes);
        setCategories(cats);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Auto-advance Carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 6);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 6);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 6) % 6);

  // Map string to Lucide icon
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return GraduationCap;
      case 'HeartPulse': return HeartPulse;
      case 'Sprout': return Sprout;
      case 'Users': return Users;
      case 'Home': return Home;
      case 'Briefcase': return Briefcase;
      case 'Accessibility': return Accessibility;
      case 'UserCheck': return UserCheck;
      case 'Shield': return Shield;
      case 'TrendingUp': return TrendingUp;
      case 'Award': return Award;
      case 'Sun': return Sun;
      default: return Sprout;
    }
  };

  const ministriesList = [
    { name: "Ministry of Agriculture & Farmers Welfare", count: 42, url: "https://agricoop.nic.in" },
    { name: "Ministry of Education", count: 68, url: "https://www.education.gov.in" },
    { name: "Ministry of Health & Family Welfare", count: 35, url: "https://mohfw.gov.in" },
    { name: "Ministry of Social Justice and Empowerment", count: 54, url: "https://socialjustice.gov.in" },
    { name: "Ministry of Housing and Urban Affairs", count: 28, url: "https://mohua.gov.in" },
    { name: "Ministry of Electronics and Information Technology", count: 22, url: "https://www.meity.gov.in" },
    { name: "Ministry of Skill Development & Entrepreneurship", count: 31, url: "https://www.msde.gov.in" },
    { name: "Ministry of Women and Child Development", count: 29, url: "https://wcd.nic.in" },
  ];

  const statesList = [
    { name: "Karnataka", count: 142 },
    { name: "Maharashtra", count: 185 },
    { name: "Tamil Nadu", count: 160 },
    { name: "Uttar Pradesh", count: 210 },
    { name: "Madhya Pradesh", count: 130 },
    { name: "Gujarat", count: 145 },
    { name: "Rajasthan", count: 125 },
    { name: "Kerala", count: 115 },
    { name: "Telangana", count: 98 },
    { name: "Andhra Pradesh", count: 112 },
    { name: "West Bengal", count: 120 },
    { name: "Bihar", count: 105 },
  ];

  const faqItems = [
    {
      q: "What is SETU and how is it different from other government portals?",
      a: "SETU is an AI-powered e-Marketplace for government schemes and services. Using SETU, you do not need to search multiple websites of government departments. It provides a single conversational platform to discover schemes based on your eligibility criteria such as age, gender, caste, residence, and income."
    },
    {
      q: "How will SETU help common citizens?",
      a: "SETU eliminates the hassle of navigating through dozens of disparate department portals. By taking a simple eligibility survey or entering basic profile parameters, it gives you a curated list of central and state schemes you are entitled to, with clear benefits, eligibility rules, required documents, and direct application links."
    },
    {
      q: "How does SETU work?",
      a: "It operates in 3 simple steps: 1) Enter your profile parameters (gender, age, state, caste, etc.), 2) The intelligent engine scans across 3,000+ central & state welfare policies, 3) Select the schemes best suited for you and apply directly on the verified official portal."
    },
    {
      q: "What is the procedure for knowing the right scheme on the SETU platform?",
      a: "Click on 'Find Schemes for You' button on the homepage, select your basic demographic information (State, Residence Area, Category, Gender, and Income), and the system immediately generates your personalized entitlement report."
    },
    {
      q: "What information about a particular scheme can I find on SETU?",
      a: "For every scheme, SETU offers verified information regarding Overview & Objectives, Eligibility Criteria Checklist, Financial/In-Kind Benefits Breakdown, Required Document Checklist, Step-by-Step Application Process, and Direct Links to the Official Government Application Portals."
    }
  ];

  return (
    <div className="bg-[#F8FAFC] text-slate-800 space-y-10 pb-16">
      
      {/* 1. HERO PROMOTIONAL BANNER CAROUSEL (MARQUEE) - Immediately after Navbar */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
        <div 
          className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 min-h-[340px] sm:min-h-[380px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* SLIDE 1: SETU is now on UMANG */}
          {currentSlide === 0 && (
            <div className="bg-gradient-to-r from-[#FFFFFF] via-[#FFF8F0] to-[#E8F5E9] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[340px] sm:min-h-[380px] relative overflow-hidden animate-fade-in">
              {/* Background decorative curve */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

              {/* Left Content */}
              <div className="space-y-4 max-w-xl z-10">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-2xl text-[#00875A]">SETU</span>
                  <span className="text-sm font-semibold text-slate-700">is now on</span>
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-blue-900 font-bold text-xs">
                    <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                    <span>UMANG</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  <span className="text-[#0B2545]">One Platform,</span>{' '}
                  <span className="text-orange-600">Endless Opportunities</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore new features and Government Schemes/Services <strong className="text-slate-800">exclusively on UMANG</strong>.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="https://web.umang.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#E65100] hover:bg-[#D84315] text-white px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all group"
                  >
                    <span>Visit UMANG</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  {/* QR Code Mini Card */}
                  <div className="flex items-center space-x-2 bg-white/90 border border-slate-200 rounded-lg p-1.5 px-3 shadow-xs">
                    <QrCode className="w-7 h-7 text-slate-800" />
                    <span className="text-[11px] font-bold text-slate-700 leading-tight">
                      Scan the<br />QR Code
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Phone Mockup Visual */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="w-64 sm:w-72 bg-slate-900 rounded-[32px] p-2.5 shadow-2xl border-4 border-slate-800">
                  <div className="bg-white rounded-[24px] p-3 text-slate-800 space-y-2.5 text-xs overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1">
                        <span>5G</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="bg-slate-100 rounded-lg p-1.5 flex items-center space-x-1 text-[10px] text-slate-400">
                      <Search className="w-3 h-3" />
                      <span>Search for schemes...</span>
                    </div>
                    <div className="bg-gradient-to-r from-[#0B2545] to-[#1A3A6B] text-white rounded-lg p-2.5 text-[11px] space-y-1">
                      <p className="font-bold text-amber-300">Explore eligible schemes</p>
                      <p className="text-[9px] text-slate-200">Based on your age, region & gender</p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-700">Recommended Schemes</span>
                      <div className="p-2 rounded bg-orange-50 border border-orange-200 text-[10px]">
                        <p className="font-bold text-slate-900">AICTE Short Term Training</p>
                        <p className="text-[9px] text-orange-700">Ministry of Education</p>
                      </div>
                      <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-[10px]">
                        <p className="font-bold text-slate-900">Pradhan Mantri Awas Yojana</p>
                        <p className="text-[9px] text-emerald-700">Ministry of Housing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: PM-YASASVI for OBC | EBC | DNT Students */}
          {currentSlide === 1 && (
            <div className="bg-gradient-to-r from-[#00A8B5] via-[#00B4D8] to-[#90E0EF] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[340px] sm:min-h-[380px] relative overflow-hidden animate-fade-in text-white">
              <div className="absolute right-12 top-6 opacity-30">
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-[#0B2545] rounded-full" />
                  ))}
                </div>
              </div>

              {/* Left Content */}
              <div className="space-y-4 max-w-xl z-10 text-slate-900">
                <div>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#0B2545] tracking-tight">
                    PM-YASASVI
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-[#0B2545] mt-0.5">
                    for <span className="underline decoration-slate-900">OBC | EBC | DNT Students</span>
                  </p>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-900">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span>Prime Minister Young Achievers Scholarship Award Scheme for Vibrant India</span>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">₹</span>
                    </div>
                    <span>Financial support for economically weaker families aimed at quality education</span>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <span>Empowering India's next generation of achievers!</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://scholarships.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#0B2545] hover:bg-[#1A3A6B] text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    <span>Know More</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Student Visual Card */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-xl max-w-sm flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#0B2545] shadow-md">
                    <GraduationCap className="w-10 h-10 text-[#00875A]" />
                  </div>
                  <div className="text-[#0B2545]">
                    <span className="text-xs font-bold uppercase tracking-wider block text-slate-800">Top National Scholarship</span>
                    <h4 className="text-base font-extrabold">Classes 9 to 12 & Top Colleges</h4>
                    <p className="text-xs font-semibold mt-1">Up to ₹1,25,000 / year</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Prime Minister Vidyalaxmi Scheme */}
          {currentSlide === 2 && (
            <div className="bg-gradient-to-r from-[#FFFFFF] via-[#F1F8E9] to-[#E8EAF6] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[340px] sm:min-h-[380px] relative overflow-hidden animate-fade-in">
              <div className="relative z-10">
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-emerald-300 max-w-xs space-y-3">
                  <div className="h-40 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white p-4 text-center">
                    <div>
                      <Users className="w-12 h-12 mx-auto mb-2 text-amber-200" />
                      <p className="font-bold text-sm">Higher Education Support</p>
                    </div>
                  </div>
                  <div className="bg-[#1A237E] text-white p-2.5 rounded-lg text-center">
                    <p className="font-extrabold text-xs sm:text-sm">Loans up to <span className="text-amber-300">₹7.5L</span> with 75% govt. guarantee</p>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="space-y-4 max-w-xl z-10 text-left">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A237E] tracking-tight">
                    Prime Minister Vidyalaxmi Scheme
                  </h2>
                  <p className="text-sm font-semibold text-slate-600 mt-1">
                    Empowering Yuva Shakti with quality education
                  </p>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <p className="font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
                    <span>Collateral-Free, Guarantor-Free loan to Students</span>
                  </p>
                  <p className="font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
                    <span>Direct online portal application and instant interest subsidy tracking</span>
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://www.vidyalakshmi.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#1A237E] hover:bg-[#283593] text-white px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    <span>Click to More</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Digital India Quote */}
          {currentSlide === 3 && (
            <div className="bg-gradient-to-r from-[#F0F4F8] via-[#E2E8F0] to-[#FFFFFF] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[340px] sm:min-h-[380px] relative overflow-hidden animate-fade-in border-b-4 border-orange-500">
              <div className="space-y-4 max-w-xl z-10">
                <div className="flex items-center space-x-3">
                  <div className="text-[10px] font-bold text-slate-600 uppercase border-r border-slate-300 pr-3">
                    Ministry of Electronics & IT<br />Government of India
                  </div>
                  <span className="font-black text-sm text-[#00875A]">Digital India</span>
                </div>

                <div className="relative pt-2">
                  <span className="text-5xl font-serif text-slate-300 absolute -top-4 -left-3">“</span>
                  <p className="text-xl sm:text-3xl font-extrabold text-[#0B2545] leading-snug pl-4">
                    <span className="text-[#E65100]">Digital India</span> means opportunity for all, facility for all and participation of all
                  </p>
                </div>

                <div className="pl-4 pt-2">
                  <p className="font-serif italic font-bold text-base text-slate-800">नरेन्द्र मोदी</p>
                  <p className="text-xs font-semibold text-slate-500">Hon'ble Prime Minister</p>
                </div>

                <div className="pl-4 pt-1">
                  <a
                    href="https://digitalindia.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E65100] hover:underline"
                  >
                    <span>Visit Digital India Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-center">
                <div className="bg-white/80 border border-slate-300 rounded-2xl p-6 shadow-md text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center font-black text-xl border-2 border-orange-400">
                    11+
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Years of Digital India</h4>
                  <p className="text-xs text-slate-500">Power To Empower</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: National Scholarship Portal on UMANG */}
          {currentSlide === 4 && (
            <div className="bg-gradient-to-r from-[#E8F5E9] via-[#C8E6C9] to-[#E0F2F1] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[340px] sm:min-h-[380px] relative overflow-hidden animate-fade-in">
              <div className="space-y-4 max-w-xl z-10 text-left">
                <div className="inline-flex items-center space-x-2 bg-white/80 px-2.5 py-1 rounded text-xs font-bold text-[#00875A]">
                  <span>Ministry of Electronics & IT</span>
                  <span>|</span>
                  <span>UMANG</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1B5E20] leading-tight">
                  National Scholarship Portal is now <span className="bg-red-600 text-white px-2 py-0.5 rounded-md text-xl sm:text-3xl">LIVE</span> on UMANG
                </h2>

                <p className="text-xs sm:text-sm text-slate-700">
                  Students can apply for scholarships easily through the app with One Time Registration (OTR).
                </p>

                <div className="pt-2">
                  <a
                    href="https://scholarships.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#00875A] hover:bg-[#00704A] text-white px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="relative z-10 flex items-center space-x-3">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-emerald-200 space-y-2 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-[#00875A]" />
                    <span className="text-xs font-bold text-slate-800">Apply For Scholarship</span>
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Track application status & payment disbursement</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: Celebrating 11 Years of Digital India */}
          {currentSlide === 5 && (
            <div className="bg-gradient-to-r from-[#FFF3E0] via-[#E1F5FE] to-[#F3E5F5] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[340px] sm:min-h-[380px] relative overflow-hidden animate-fade-in">
              <div className="space-y-4 max-w-xl z-10 text-left">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                  <span>Ministry of Electronics & Information Technology</span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
                    Celebrating <span className="text-orange-600">11 Years</span> of Digital India
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2">
                    Empowering every citizen through Digital Transformation, Innovation and Inclusive Growth.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-bold text-slate-700">
                  <div className="bg-white/80 p-2 rounded border border-slate-200 text-center">Digital Infrastructure</div>
                  <div className="bg-white/80 p-2 rounded border border-slate-200 text-center">Digital Inclusion</div>
                  <div className="bg-white/80 p-2 rounded border border-slate-200 text-center">Digital Economy</div>
                </div>
              </div>

              <div className="relative z-10">
                <a
                  href="https://digitalindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B2545] hover:bg-[#1A3A6B] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-all flex items-center space-x-1.5"
                >
                  <span>Explore 11 Years of Impact</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Carousel Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all z-20"
            title="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all z-20"
            title="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-[#00875A]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. SUB-NAVIGATION TABS (Categories / States/UTs / Central Ministries) - Placed DOWN after carousel */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-center space-x-6 sm:space-x-10 border-b border-slate-200 pb-2 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-2 px-1 transition-all flex items-center space-x-1.5 border-b-2 ${
              activeTab === 'categories'
                ? 'border-[#00875A] text-[#00875A]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('states')}
            className={`pb-2 px-1 transition-all flex items-center space-x-1.5 border-b-2 ${
              activeTab === 'states'
                ? 'border-[#00875A] text-[#00875A]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>States/UTs</span>
          </button>

          <button
            onClick={() => setActiveTab('ministries')}
            className={`pb-2 px-1 transition-all flex items-center space-x-1.5 border-b-2 ${
              activeTab === 'ministries'
                ? 'border-[#00875A] text-[#00875A]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Central Ministries</span>
          </button>
        </div>

        {/* Dynamic Tab Content View */}
        <div className="mt-4">
          {activeTab === 'categories' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.slice(0, 12).map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <div
                    key={cat.id}
                    onClick={() => navigate(`/schemes?category=${cat.id}`)}
                    className="bg-white rounded-xl border border-slate-200 p-3 hover:border-[#00875A] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col items-center text-center justify-between"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 group-hover:text-[#00875A] transition-colors line-clamp-1">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                        {cat.count} Schemes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'states' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {statesList.map((st, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/schemes?state=${encodeURIComponent(st.name)}`)}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-800 block">{st.name}</span>
                    <span className="text-[11px] text-[#00875A] font-semibold">{st.count} Schemes</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ministries' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {ministriesList.map((min, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/schemes?ministry=${encodeURIComponent(min.name)}`)}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-slate-800 line-clamp-2">{min.name}</span>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] text-[#00875A] font-semibold">{min.count} Schemes</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. SECTION: EASY STEPS TO APPLY FOR GOVERNMENT SCHEMES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="text-center space-y-1 mb-8">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            How it works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Easy steps to apply for Government Schemes
          </h2>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between group">
            <div className="w-14 h-14 rounded-xl border-2 border-emerald-500/30 bg-emerald-50 text-[#00875A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Enter Details
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Start by entering your basic details like age, gender, state, and income category.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between group">
            <div className="w-14 h-14 rounded-xl border-2 border-emerald-500/30 bg-emerald-50 text-[#00875A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Search
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Our intelligent search engine will filter and find all relevant central and state schemes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between group">
            <div className="w-14 h-14 rounded-xl border-2 border-emerald-500/30 bg-emerald-50 text-[#00875A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MousePointerClick className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Select & Apply
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Select the best suited schemes and apply directly on the official government portals.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION: ABOUT SETU */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#00875A] tracking-tight">
              About SETU
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>SETU</strong> is a National AI Platform that aims to offer one-stop search and discovery of the Government schemes and welfare services.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              It provides an innovative, multilingual conversational solution to discover scheme information based upon the eligibility of the citizen.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The platform helps the citizen to find the right Government schemes for them. It also guides on how to apply for different Government schemes. Thus no need to visit multiple Government websites.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#00875A] hover:text-[#00704A] border border-[#00875A] hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
              >
                <span>View More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Video / Media Card */}
          <div className="lg:col-span-5">
            <div 
              onClick={() => setVideoModalOpen(true)}
              className="relative rounded-xl overflow-hidden shadow-md border border-slate-200 cursor-pointer group bg-slate-900 aspect-video flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/80 via-slate-900/60 to-transparent z-10" />
              
              {/* Background preview graphic */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/80 p-4 z-10">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Citizen Stories & Tutorial</p>
                  <p className="text-sm font-extrabold mt-1">Discover How Schemes Transform Lives</p>
                </div>
              </div>

              {/* Play Button Icon */}
              <div className="relative z-20 w-14 h-14 rounded-full bg-[#00875A] group-hover:bg-[#00704A] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="text-center space-y-1 mb-8">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout our knowledge base for some of your answers!
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Graphic Illustration with Big Green ? */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-xs min-h-[300px]">
            <div className="relative mb-4">
              <span className="text-8xl font-black text-[#00875A] font-sans">?</span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Have more questions?</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Ask our multilingual AI assistant anytime in 12+ Indian languages for instant assistance.
            </p>
            <Link
              to="/chat"
              className="mt-4 inline-flex items-center space-x-1.5 bg-emerald-50 text-[#00875A] hover:bg-emerald-100 font-bold text-xs px-4 py-2 rounded-lg transition-colors border border-emerald-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00875A]" />
              <span>Ask SETU AI</span>
            </Link>
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-8 space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-[#00875A] transition-colors gap-3"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#00875A] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-2">
              <Link
                to="/schemes"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#00875A] hover:underline"
              >
                <span>View More FAQs & Schemes →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. POPULAR SCHEMES WITH DIRECT GOV.IN LINKS */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Schemes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-impact welfare programs with active enrollment and verified official links
            </p>
          </div>
          <Link
            to="/schemes"
            className="text-xs font-bold text-[#00875A] hover:underline flex items-center space-x-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              showMatchBadge={false}
            />
          ))}
        </div>
      </section>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 relative shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">About SETU National Platform</h4>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="SETU Official Overview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
