import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

interface StateInfo {
  name: string;
  code: string;
  count: number;
  region: string;
}

const INDIAN_STATES: StateInfo[] = [
  { name: "Karnataka", code: "KA", count: 218, region: "South" },
  { name: "Maharashtra", code: "MH", count: 195, region: "West" },
  { name: "Tamil Nadu", code: "TN", count: 182, region: "South" },
  { name: "Uttar Pradesh", code: "UP", count: 240, region: "North" },
  { name: "Gujarat", code: "GJ", count: 164, region: "West" },
  { name: "Rajasthan", code: "RJ", count: 155, region: "North" },
  { name: "Madhya Pradesh", code: "MP", count: 172, region: "Central" },
  { name: "Andhra Pradesh", code: "AP", count: 168, region: "South" },
  { name: "Telangana", code: "TS", count: 149, region: "South" },
  { name: "Kerala", code: "KL", count: 138, region: "South" },
  { name: "West Bengal", code: "WB", count: 160, region: "East" },
  { name: "Bihar", code: "BR", count: 142, region: "East" },
  { name: "Punjab", code: "PB", count: 110, region: "North" },
  { name: "Haryana", code: "HR", count: 125, region: "North" },
  { name: "Odisha", code: "OD", count: 134, region: "East" },
  { name: "Assam", code: "AS", count: 98, region: "North East" },
  { name: "Delhi", code: "DL", count: 115, region: "North" },
  { name: "Himachal Pradesh", code: "HP", count: 86, region: "North" },
  { name: "Jammu and Kashmir", code: "JK", count: 92, region: "North" },
  { name: "Jharkhand", code: "JH", count: 104, region: "East" },
  { name: "Chhattisgarh", code: "CG", count: 112, region: "Central" },
  { name: "Uttarakhand", code: "UK", count: 88, region: "North" },
  { name: "Goa", code: "GA", count: 64, region: "West" },
  { name: "Tripura", code: "TR", count: 52, region: "North East" },
  { name: "Meghalaya", code: "ML", count: 48, region: "North East" },
  { name: "Manipur", code: "MN", count: 46, region: "North East" },
  { name: "Nagaland", code: "NL", count: 44, region: "North East" },
  { name: "Mizoram", code: "MZ", count: 42, region: "North East" },
  { name: "Sikkim", code: "SK", count: 39, region: "North East" },
  { name: "Arunachal Pradesh", code: "AR", count: 45, region: "North East" },
  { name: "Puducherry", code: "PY", count: 34, region: "UT" },
  { name: "Chandigarh", code: "CH", count: 38, region: "UT" },
  { name: "Ladakh", code: "LA", count: 31, region: "UT" },
  { name: "Andaman & Nicobar", code: "AN", count: 28, region: "UT" },
  { name: "Dadra & Nagar Haveli", code: "DN", count: 26, region: "UT" },
  { name: "Lakshadweep", code: "LD", count: 20, region: "UT" },
];

export const IndiaMap: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState<StateInfo | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const filteredStates = selectedRegion === "All"
    ? INDIAN_STATES
    : INDIAN_STATES.filter(s => s.region === selectedRegion);

  const handleStateClick = (stateName: string) => {
    navigate(`/schemes?state=${encodeURIComponent(stateName)}`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-setu-saffron" />
            <span>Explore Schemes by State & Union Territory</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Discover localized state welfare programs tailored to your state of domicile.
          </p>
        </div>

        {/* Region filter pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {["All", "South", "North", "West", "East", "Central", "North East", "UT"].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedRegion === reg
                  ? 'bg-setu-blue text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Geographic Visual Representation */}
        <div className="lg:col-span-5 relative bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[340px]">
          <svg
            viewBox="0 0 400 450"
            className="w-full max-h-[300px] drop-shadow-sm select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outline representation of India */}
            <path
              d="M170 30 L200 45 L225 35 L245 70 L210 95 L220 120 L270 115 L320 110 L340 130 L365 130 L350 160 L320 165 L290 150 L270 170 L280 200 L260 230 L230 240 L210 280 L200 340 L185 390 L170 340 L150 290 L120 250 L100 210 L90 170 L110 130 L130 110 L150 90 L160 50 Z"
              fill="#E2E8F0"
              stroke="#1A3A6B"
              strokeWidth="2.5"
            />
            
            {/* Interactive regional marker nodes */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredState(INDIAN_STATES[0])}
              onClick={() => handleStateClick("Karnataka")}
            >
              <circle cx="165" cy="315" r="14" fill="#FF6B00" opacity="0.85" />
              <text x="165" y="319" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">KA</text>
            </g>

            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredState(INDIAN_STATES[1])}
              onClick={() => handleStateClick("Maharashtra")}
            >
              <circle cx="155" cy="245" r="14" fill="#1A3A6B" opacity="0.85" />
              <text x="155" y="249" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">MH</text>
            </g>

            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredState(INDIAN_STATES[2])}
              onClick={() => handleStateClick("Tamil Nadu")}
            >
              <circle cx="180" cy="360" r="13" fill="#138808" opacity="0.85" />
              <text x="180" y="364" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">TN</text>
            </g>

            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredState(INDIAN_STATES[3])}
              onClick={() => handleStateClick("Uttar Pradesh")}
            >
              <circle cx="210" cy="145" r="14" fill="#1A3A6B" opacity="0.85" />
              <text x="210" y="149" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">UP</text>
            </g>

            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredState(INDIAN_STATES[4])}
              onClick={() => handleStateClick("Gujarat")}
            >
              <circle cx="115" cy="195" r="13" fill="#FF6B00" opacity="0.85" />
              <text x="115" y="199" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">GJ</text>
            </g>

            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredState(INDIAN_STATES[10])}
              onClick={() => handleStateClick("West Bengal")}
            >
              <circle cx="275" cy="190" r="13" fill="#138808" opacity="0.85" />
              <text x="275" y="194" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">WB</text>
            </g>

            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredState(INDIAN_STATES[15])}
              onClick={() => handleStateClick("Assam")}
            >
              <circle cx="330" cy="140" r="13" fill="#FF6B00" opacity="0.85" />
              <text x="330" y="144" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">AS</text>
            </g>
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredState && (
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 text-white p-3 rounded-lg shadow-xl backdrop-blur-xs border border-slate-700 flex items-center justify-between text-xs animate-fade-in">
              <div>
                <p className="font-bold text-sm text-setu-saffron">{hoveredState.name}</p>
                <p className="text-slate-300">{hoveredState.count} State & Central Schemes</p>
              </div>
              <button
                onClick={() => handleStateClick(hoveredState.name)}
                className="bg-setu-blue hover:bg-setu-blue-light text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* State Pills Grid */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[340px] overflow-y-auto pr-1">
            {filteredStates.map((state) => (
              <button
                key={state.code}
                onMouseEnter={() => setHoveredState(state)}
                onClick={() => handleStateClick(state.name)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:border-setu-saffron hover:bg-orange-50/40 text-left transition-all group"
              >
                <div>
                  <span className="font-semibold text-xs text-slate-800 group-hover:text-setu-blue block">
                    {state.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {state.count} schemes
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-setu-saffron group-hover:text-white transition-colors">
                  {state.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
