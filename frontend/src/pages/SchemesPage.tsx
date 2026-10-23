import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Layers, 
  Check, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { SchemeCard } from '../components/common/SchemeCard';
import { fetchSchemes, fetchCategories } from '../services/api';
import { Scheme, SchemeCategory } from '../types';

const BENEFIT_TYPES = ["Cash", "Scholarship", "Subsidy", "Housing", "Insurance", "Loan"];
const APPLICATION_MODES = ["Online", "Offline", "Both"];

export const SchemesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<SchemeCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All India');
  const [schemeType, setSchemeType] = useState(searchParams.get('type') || 'all');
  const [benefitType, setBenefitType] = useState('all');
  const [appMode, setAppMode] = useState('all');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const loadSchemes = async () => {
      setLoading(true);
      try {
        const res = await fetchSchemes({
          q: searchTerm,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          state: selectedState === 'All India' ? undefined : selectedState,
          scheme_type: schemeType === 'all' ? undefined : schemeType,
          benefit_type: benefitType === 'all' ? undefined : benefitType,
          application_mode: appMode === 'all' ? undefined : appMode,
          status: onlyOpen ? 'Open' : undefined,
          sort: sortBy
        });
        setSchemes(res.schemes || []);
        setTotalCount(res.total || 0);
      } catch (err) {
        console.error('Error fetching schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSchemes();
  }, [searchTerm, selectedCategory, selectedState, schemeType, benefitType, appMode, onlyOpen, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedState('All India');
    setSchemeType('all');
    setBenefitType('all');
    setAppMode('all');
    setOnlyOpen(false);
    setSortBy('relevance');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              All Central & State Government Schemes
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {totalCount} verified schemes available across India
            </p>
          </div>

          {/* Search bar inside header */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by scheme name, ministry, or benefits..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-setu-blue focus:ring-1 focus:ring-setu-blue transition-all"
            />
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center space-x-1.5 text-xs font-bold text-setu-blue bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Schemes'}</span>
          </button>
          <span className="text-xs text-slate-500">{schemes.length} schemes found</span>
        </div>
      </div>

      {/* Main Grid: Left Filter Panel + Right Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Filter Panel */}
        <aside
          className={`md:col-span-4 lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <Filter className="w-4 h-4 text-setu-blue" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Central / State Scheme Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Scheme Authority
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              {['all', 'Central', 'State'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSchemeType(type)}
                  className={`py-1 rounded text-center transition-all ${
                    schemeType.toLowerCase() === type.toLowerCase()
                      ? 'bg-white text-setu-blue shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Category
            </label>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 text-xs">
              <label
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  selectedCategory === 'all' ? 'bg-blue-50 text-setu-blue font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-setu-blue" />}
              </label>

              {categories.map((cat) => (
                <label
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    selectedCategory === cat.id ? 'bg-blue-50 text-setu-blue font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="line-clamp-1">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">({cat.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              State / UT
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white"
            >
              <option value="All India">All India / Central</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>

          {/* Benefit Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Benefit Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setBenefitType('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border ${
                  benefitType === 'all' ? 'bg-setu-blue text-white border-setu-blue' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                All
              </button>
              {BENEFIT_TYPES.map((b) => (
                <button
                  key={b}
                  onClick={() => setBenefitType(b)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium border ${
                    benefitType === b ? 'bg-setu-blue text-white border-setu-blue' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Open Applications Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Currently Open Only</span>
            <input
              type="checkbox"
              checked={onlyOpen}
              onChange={(e) => setOnlyOpen(e.target.checked)}
              className="w-4 h-4 rounded text-setu-green focus:ring-setu-green"
            />
          </div>
        </aside>

        {/* Right Schemes Grid */}
        <main className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Sorting & Count Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Showing {schemes.length} of {totalCount} schemes
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-700 focus:bg-white"
              >
                <option value="relevance">Relevance / Popularity</option>
                <option value="newest">Newest First</option>
                <option value="benefit_amount">Highest Benefit</option>
              </select>
            </div>
          </div>

          {/* Skeleton Loaders */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-lg border border-slate-200 p-5 space-y-3 animate-pulse">
                  <div className="flex space-x-2">
                    <div className="w-20 h-4 bg-slate-200 rounded" />
                    <div className="w-16 h-4 bg-slate-200 rounded" />
                  </div>
                  <div className="w-3/4 h-5 bg-slate-200 rounded" />
                  <div className="w-1/2 h-3 bg-slate-200 rounded" />
                  <div className="w-full h-12 bg-slate-100 rounded" />
                  <div className="flex justify-between pt-2">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                    <div className="w-16 h-4 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Schemes Listing */}
          {!loading && schemes.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {schemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && schemes.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No schemes found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No schemes matched your exact filters. Try resetting filters or searching with different keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-setu-blue text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs hover:bg-setu-blue-dark transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
