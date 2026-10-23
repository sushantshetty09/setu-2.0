import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Search,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Building,
  CheckCircle,
  Compass,
  Globe,
  SlidersHorizontal
} from 'lucide-react';

interface StateData {
  name: string;
  nativeName: string;
  capital: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East' | 'UT';
  schemesCount: number;
  portalName: string;
  portalUrl: string;
  popularSchemes: string[];
}

export const StatesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const STATES_DATA: StateData[] = [
    // South
    {
      name: 'Karnataka',
      nativeName: 'ಕರ್ನಾಟಕ',
      capital: 'Bengaluru',
      region: 'South',
      schemesCount: 142,
      portalName: 'Seva Sindhu & SSP',
      portalUrl: 'https://sevasindhu.karnataka.gov.in',
      popularSchemes: ['Yuva Nidhi (Unemployment)', 'Gruha Lakshmi (₹2,000/mo)', 'Vidyasiri Scholarship', 'Gruha Jyothi (Free Power)']
    },
    {
      name: 'Tamil Nadu',
      nativeName: 'தமிழ்நாடு',
      capital: 'Chennai',
      region: 'South',
      schemesCount: 160,
      portalName: 'TNeGA & e-Sevai',
      portalUrl: 'https://www.tnesevai.tn.gov.in',
      popularSchemes: ['Kalaignar Magalir Urimai Thogai', 'Pudhumai Penn Scheme', 'Chief Minister Comprehensive Health Insurance', 'Moovalur Ramamirtham Ammaiyar']
    },
    {
      name: 'Telangana',
      nativeName: 'తెలంగాణ',
      capital: 'Hyderabad',
      region: 'South',
      schemesCount: 118,
      portalName: 'MeeSeva & Praja Palana',
      portalUrl: 'https://ts.meeseva.telangana.gov.in',
      popularSchemes: ['Rythu Bharosa', 'Mahalakshmi Scheme (Free Bus & ₹2500)', 'Arogyasri Health Scheme', 'Gruha Jyothi (200 units free)']
    },
    {
      name: 'Andhra Pradesh',
      nativeName: 'ఆంధ్రప్రదేశ్',
      capital: 'Amaravati',
      region: 'South',
      schemesCount: 135,
      portalName: 'AP Seva Portal',
      portalUrl: 'https://vsws.ap.gov.in',
      popularSchemes: ['Talliki Vandanam (₹15,000)', 'YSR Rythu Bharosa', 'Aarogyasri Health Card', 'YSR Cheyutha']
    },
    {
      name: 'Kerala',
      nativeName: 'കേരളം',
      capital: 'Thiruvananthapuram',
      region: 'South',
      schemesCount: 115,
      portalName: 'e-District Kerala',
      portalUrl: 'https://edistrict.kerala.gov.in',
      popularSchemes: ['MEDISEP Health Insurance', 'Karunya Benevolent Fund', 'Subhiksha Keralam', 'Vidyakiranam Laptop Scheme']
    },

    // West
    {
      name: 'Maharashtra',
      nativeName: 'महाराष्ट्र',
      capital: 'Mumbai',
      region: 'West',
      schemesCount: 185,
      portalName: 'MahaDBT & Aaple Sarkar',
      portalUrl: 'https://mahadbt.maharashtra.gov.in',
      popularSchemes: ['Mukhyamantri Majhi Ladki Bahin (₹1,500)', 'Mahatma Jyotirao Phule Jan Arogya', 'Dr. Punjabrao Deshmukh Hostel Allowance', 'Shetkari Sanman Yojana']
    },
    {
      name: 'Gujarat',
      nativeName: 'ગુજરાત',
      capital: 'Gandhinagar',
      region: 'West',
      schemesCount: 145,
      portalName: 'Digital Gujarat & iKhedut',
      portalUrl: 'https://www.digitalgujarat.gov.in',
      popularSchemes: ['Mukhyamantri Amrutam (MAA) Yojana', 'MYSY Higher Education Scholarship', 'i-Khedut Portal Farm Subsidies', 'Vahli Dikri Yojana']
    },
    {
      name: 'Rajasthan',
      nativeName: 'राजस्थान',
      capital: 'Jaipur',
      region: 'West',
      schemesCount: 125,
      portalName: 'Jan Soochna & SSO Portal',
      portalUrl: 'https://jansoochna.rajasthan.gov.in',
      popularSchemes: ['Chiranjeevi Swasthya Bima', 'Indira Gandhi Gas Cylinder Subsidy', 'Palanhar Yojana', 'Anuprati Coaching Scheme']
    },
    {
      name: 'Goa',
      nativeName: 'गोंय',
      capital: 'Panaji',
      region: 'West',
      schemesCount: 45,
      portalName: 'Goa Online Portal',
      portalUrl: 'https://goaonline.gov.in',
      popularSchemes: ['Griha Aadhar Scheme', 'Dayanand Social Security Scheme', 'Deen Dayal Swasthya Seva Yojana (DDSSY)']
    },

    // North
    {
      name: 'Uttar Pradesh',
      nativeName: 'उत्तर प्रदेश',
      capital: 'Lucknow',
      region: 'North',
      schemesCount: 210,
      portalName: 'e-District UP & UP Scholarship',
      portalUrl: 'https://edistrict.up.gov.in',
      popularSchemes: ['Mukhyamantri Kanya Sumangala', 'UP Free Tablet/Smartphone Scheme', 'Mukhyamantri Abhyudaya Coaching', 'UP Shadi Anudan Yojana']
    },
    {
      name: 'Punjab',
      nativeName: 'ਪੰਜਾਬ',
      capital: 'Chandigarh',
      region: 'North',
      schemesCount: 92,
      portalName: 'e-Sewa Punjab',
      portalUrl: 'https://esewa.punjab.gov.in',
      popularSchemes: ['Sarbat Sehat Bima Yojana', 'Aashirwad Scheme (Shagun)', 'Free 300 Units Domestic Electricity', 'Ghar Ghar Rozgar']
    },
    {
      name: 'Haryana',
      nativeName: 'हरियाणा',
      capital: 'Chandigarh',
      region: 'North',
      schemesCount: 110,
      portalName: 'Saral Haryana (Antyodaya)',
      portalUrl: 'https://saralharyana.gov.in',
      popularSchemes: ['Parivar Pehchan Patra (PPP)', 'Chirayu Haryana Health Scheme', 'Mukhyamantri Vivah Shagun', 'Super 100 Free JEE/NEET Coaching']
    },
    {
      name: 'Himachal Pradesh',
      nativeName: 'हिमाचल प्रदेश',
      capital: 'Shimla',
      region: 'North',
      schemesCount: 65,
      portalName: 'e-District Himachal',
      portalUrl: 'https://edistrict.hp.gov.in',
      popularSchemes: ['HIMCARE Health Scheme', 'Mukhya Mantri Swavalamban Yojana', 'Indira Gandhi Pyari Behna Sukh Samman']
    },
    {
      name: 'Uttarakhand',
      nativeName: 'उत्तराखंड',
      capital: 'Dehradun',
      region: 'North',
      schemesCount: 70,
      portalName: 'Apuni Sarkar Portal',
      portalUrl: 'https://eservices.uk.gov.in',
      popularSchemes: ['Atal Ayushman Uttarakhand', 'Gaura Devi Kanya Dhan', 'Mukhyamantri Swarojgar Yojana']
    },

    // East
    {
      name: 'West Bengal',
      nativeName: 'পশ্চিমবঙ্গ',
      capital: 'Kolkata',
      region: 'East',
      schemesCount: 130,
      portalName: 'Duare Sarkar Portal',
      portalUrl: 'https://ds.wb.gov.in',
      popularSchemes: ['Lakshmir Bhandar (₹1,000-₹1,200/mo)', 'Kanyashree Prakalpa', 'Swasthya Sathi Card', 'Student Credit Card (Up to ₹10L)']
    },
    {
      name: 'Bihar',
      nativeName: 'बिहार',
      capital: 'Patna',
      region: 'East',
      schemesCount: 115,
      portalName: 'RTPS Bihar & ServicePlus',
      portalUrl: 'https://serviceonline.bihar.gov.in',
      popularSchemes: ['Mukhyamantri Kanya Utthan Yojana', 'Bihar Student Credit Card (MNSSBY)', 'Mukhyamantri Udyami Yojana', 'Saat Nischay Part 2']
    },
    {
      name: 'Odisha',
      nativeName: 'ଓଡ଼ିଆ',
      capital: 'Bhubaneswar',
      region: 'East',
      schemesCount: 98,
      portalName: 'Odisha One Portal',
      portalUrl: 'https://odishaone.gov.in',
      popularSchemes: ['Subhadra Yojana (₹50,000 voucher)', 'BSKY / Gopabandhu Jan Arogya', 'KALIA Farmers Assistance', 'Biju Pucca Ghar Yojana']
    },
    {
      name: 'Jharkhand',
      nativeName: 'झारखंड',
      capital: 'Ranchi',
      region: 'East',
      schemesCount: 75,
      portalName: 'Jharsewa Portal',
      portalUrl: 'https://jharsewa.jharkhand.gov.in',
      popularSchemes: ['Mukhyamantri Maiya Samman Yojana', 'Marang Gomke Overseas Scholarship', 'Guru Ji Student Credit Card', 'Sarvajon Pension']
    },

    // Central
    {
      name: 'Madhya Pradesh',
      nativeName: 'मध्य प्रदेश',
      capital: 'Bhopal',
      region: 'Central',
      schemesCount: 140,
      portalName: 'MP e-District & Samagra',
      portalUrl: 'https://mpedistrict.gov.in',
      popularSchemes: ['Ladli Behna Yojana (₹1,250/mo)', 'Mukhyamantri Medhavi Vidyarthi Yojana', 'Sambal 2.0 Yojana', 'Ladli Laxmi Yojana 2.0']
    },
    {
      name: 'Chhattisgarh',
      nativeName: 'छत्तीसगढ़',
      capital: 'Raipur',
      region: 'Central',
      schemesCount: 82,
      portalName: 'CG e-District Portal',
      portalUrl: 'https://edistrict.cgstate.gov.in',
      popularSchemes: ['Mahtari Vandan Yojana (₹1,000/mo)', 'Rajiv Gandhi Kisan Nyay Yojana', 'Dr. Khubchand Baghel Health Scheme', 'Mukhyamantri Noni Sashaktikaran']
    },

    // North East
    {
      name: 'Assam',
      nativeName: 'অসম',
      capital: 'Dispur',
      region: 'North-East',
      schemesCount: 88,
      portalName: 'Sewa Setu Assam',
      portalUrl: 'https://sewasetu.assam.gov.in',
      popularSchemes: ['Orunodoi 3.0 (₹1,400/month DBT)', 'Mukhyamantri Mahila Udyamita', 'Pragyan Bharati Free Scooty/Admission', 'Ayushman Asom']
    },
    {
      name: 'Tripura',
      nativeName: 'ত্রিপুরা',
      capital: 'Agartala',
      region: 'North-East',
      schemesCount: 45,
      portalName: 'e-District Tripura',
      portalUrl: 'https://edistrict.tripura.gov.in',
      popularSchemes: ['Mukhyamantri Yuba Yogayog Yojana', 'Tripura Gramin Bank Subsidy', 'Bikash Tripura Scheme']
    },
    {
      name: 'Meghalaya',
      nativeName: 'Meghalaya',
      capital: 'Shillong',
      region: 'North-East',
      schemesCount: 38,
      portalName: 'Meghalaya e-District',
      portalUrl: 'https://megedistrict.gov.in',
      popularSchemes: ['FOCUS Scheme for Farmers', 'Meghalaya Health Insurance (MHIS)', 'Chief Ministers Youth Development']
    },
    {
      name: 'Manipur',
      nativeName: 'মণিপুর',
      capital: 'Imphal',
      region: 'North-East',
      schemesCount: 35,
      portalName: 'Manipur e-District',
      portalUrl: 'https://eservicesmanipur.gov.in',
      popularSchemes: ['Chief Ministers Gi Hakshelgi Tengbang (CMHT)', 'Start-Up Manipur', 'School Fagathansi Mission']
    },
    {
      name: 'Nagaland',
      nativeName: 'Nagaland',
      capital: 'Kohima',
      region: 'North-East',
      schemesCount: 32,
      portalName: 'Nagaland Portal',
      portalUrl: 'https://nagaland.gov.in',
      popularSchemes: ['Chief Ministers Health Insurance (CMHIS)', 'Chief Ministers Micro Finance Initiative (CMMFI)']
    },
    {
      name: 'Mizoram',
      nativeName: 'Mizoram',
      capital: 'Aizawl',
      region: 'North-East',
      schemesCount: 30,
      portalName: 'Mizoram Portal',
      portalUrl: 'https://mizoram.gov.in',
      popularSchemes: ['Socio-Economic Development Policy (SEDP)', 'Mizoram State Health Care Scheme']
    },
    {
      name: 'Arunachal Pradesh',
      nativeName: 'Arunachal Pradesh',
      capital: 'Itanagar',
      region: 'North-East',
      schemesCount: 36,
      portalName: 'ServicePlus Arunachal',
      portalUrl: 'https://serviceonline.gov.in',
      popularSchemes: ['Chief Ministers Arogya Arunachal Yojana (CMAAY)', 'Dulari Kanya Scheme', 'Arunachal Krishi Rinn Yojana']
    },
    {
      name: 'Sikkim',
      nativeName: 'Sikkim',
      capital: 'Gangtok',
      region: 'North-East',
      schemesCount: 28,
      portalName: 'Sikkim Portal',
      portalUrl: 'https://sikkim.gov.in',
      popularSchemes: ['Aama Yojana (₹40,000 financial grant)', 'Vatsalya Scheme', 'Sikkim Garib Awas Yojana']
    },

    // Union Territories
    {
      name: 'NCT of Delhi',
      nativeName: 'दिल्ली',
      capital: 'New Delhi',
      region: 'UT',
      schemesCount: 85,
      portalName: 'e-District Delhi',
      portalUrl: 'https://edistrict.delhigovt.nic.in',
      popularSchemes: ['Jai Bhim Mukhyamantri Pratibha Vikas', 'Mukhyamantri Mahila Samman Yojana', 'Delhi Free Electricity & Water Subsidy', 'Higher Education & Skill Guarantee']
    },
    {
      name: 'Jammu & Kashmir',
      nativeName: 'جموں و کشمیر',
      capital: 'Srinagar / Jammu',
      region: 'UT',
      schemesCount: 78,
      portalName: 'e-UNNAT Portal J&K',
      portalUrl: 'https://eunnat.jk.gov.in',
      popularSchemes: ['SEHAT Golden Card (Ayushman J&K)', 'Mumkin Scheme for Youth Transport', 'Ladli Beti Scheme', 'Mission Youth JK']
    },
    {
      name: 'Ladakh',
      nativeName: 'ལ་དྭགས',
      capital: 'Leh',
      region: 'UT',
      schemesCount: 25,
      portalName: 'Ladakh e-Services',
      portalUrl: 'https://ladakh.gov.in',
      popularSchemes: ['YounTab Free Tablet Scheme', 'Rewa Higher Education Financial Aid', 'Ladakh Greenhouse Subsidies']
    },
    {
      name: 'Puducherry',
      nativeName: 'புதுச்சேரி',
      capital: 'Puducherry',
      region: 'UT',
      schemesCount: 34,
      portalName: 'Puducherry Portal',
      portalUrl: 'https://py.gov.in',
      popularSchemes: ['Perunthalaivar Kamarajar Financial Assistance', 'Free Laptop for SC/ST students', 'Widow Pension']
    },
    {
      name: 'Chandigarh',
      nativeName: 'ਚੰਡੀਗੜ੍ਹ',
      capital: 'Chandigarh',
      region: 'UT',
      schemesCount: 30,
      portalName: 'Chandigarh e-Services',
      portalUrl: 'https://chdservices.gov.in',
      popularSchemes: ['Chandigarh Disability Pension', 'Old Age Assistance', 'Merit Scholarships']
    }
  ];

  const regions = ['All', 'North', 'South', 'West', 'East', 'Central', 'North-East', 'UT'];

  const filteredStates = STATES_DATA.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.capital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.popularSchemes.some(ps => ps.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRegion = selectedRegion === 'All' || st.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#1A365D] to-[#2B6CB0] rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 z-10 relative">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-sky-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>28 States & 8 Union Territories</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('statesPage.title', 'State & Union Territory Schemes Directory')}
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {t('statesPage.subtitle', 'Discover localized state welfare programs, direct benefit transfer schemes, and state department portals across 36 States & UTs.')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 max-w-xl relative z-10">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search state, UT, capital or state scheme (e.g. Karnataka, MahaDBT, Ladli Behna)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 2. Region Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1 pl-1 pr-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Region:</span>
        </span>
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedRegion === reg
                ? 'bg-setu-blue text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {reg === 'UT' ? 'Union Territories' : reg === 'All' ? 'All States & UTs' : `${reg} India`}
          </button>
        ))}
      </div>

      {/* 3. States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStates.map((st) => (
          <div
            key={st.name}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-setu-blue transition-colors">
                      {st.name}
                    </h2>
                    {st.nativeName && (
                      <span className="text-xs font-medium text-slate-500 font-serif">
                        ({st.nativeName})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>Capital: {st.capital}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-sky-700 font-semibold">{st.region}</span>
                  </p>
                </div>

                <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  {st.schemesCount}+ Schemes
                </span>
              </div>

              {/* State Portal Link */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 text-[10px] block font-semibold">Official State e-Portal</span>
                  <span className="font-bold text-slate-700">{st.portalName}</span>
                </div>
                <a
                  href={st.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-700 hover:text-sky-900 p-1.5 rounded-md hover:bg-sky-100/60 transition-colors"
                  title="Visit official state portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Flagship State Programs */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Top Flagship State Schemes:
                </span>
                <div className="space-y-1">
                  {st.popularSchemes.map((scheme, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(`/schemes?state=${encodeURIComponent(st.name)}&q=${encodeURIComponent(scheme.split(' (')[0])}`)}
                      className="text-xs text-slate-700 hover:text-sky-800 bg-slate-50/70 hover:bg-sky-50 px-2.5 py-1 rounded-md border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="line-clamp-1 font-medium">{scheme}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="bg-slate-50 p-3.5 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/schemes?state=${encodeURIComponent(st.name)}`}
                className="text-xs font-bold text-setu-blue hover:text-sky-700 inline-flex items-center space-x-1 transition-colors"
              >
                <span>View all {st.name} Schemes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/find"
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
              >
                Eligibility
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
