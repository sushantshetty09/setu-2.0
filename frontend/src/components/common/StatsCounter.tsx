import React, { useEffect, useState, useRef } from 'react';
import { Layers, MapPin, Grid, Users } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  target: number;
  suffix: string;
  icon: any;
  color: string;
}

const STATS_DATA: StatItem[] = [
  { id: '1', label: 'Central & State Schemes', target: 3000, suffix: '+', icon: Layers, color: '#1A3A6B' },
  { id: '2', label: 'States & Union Territories', target: 36, suffix: '', icon: MapPin, color: '#FF6B00' },
  { id: '3', label: 'Welfare Categories', target: 20, suffix: '+', icon: Grid, color: '#138808' },
  { id: '4', label: 'Citizens Assisted', target: 50, suffix: 'L+', icon: Users, color: '#0284C7' },
];

export const StatsCounter: React.FC = () => {
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          STATS_DATA.forEach((stat) => {
            let start = 0;
            const end = stat.target;
            const duration = 1200; // ms
            const stepTime = 30;
            const totalSteps = duration / stepTime;
            const increment = end / totalSteps;

            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCounts((prev) => ({ ...prev, [stat.id]: end }));
                clearInterval(timer);
              } else {
                setCounts((prev) => ({ ...prev, [stat.id]: Math.floor(start) }));
              }
            }, stepTime);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div ref={containerRef} className="bg-white border-y border-slate-200 py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {STATS_DATA.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="pt-4 md:pt-0 px-2 flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {counts[stat.id] ? counts[stat.id].toLocaleString() : stat.target.toLocaleString()}{stat.suffix}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
