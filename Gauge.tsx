
import React from 'react';

interface GaugeProps {
  value: number;
}

const Gauge: React.FC<GaugeProps> = ({ value }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * (circumference / 2); // Only semi-circle

  return (
    <div className="relative flex items-center justify-center w-48 h-28">
      <svg className="w-full h-full transform -rotate-180" viewBox="0 0 160 80">
        {/* Background Arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="12"
          strokeDasharray={`${circumference / 2} ${circumference}`}
          className="transition-all duration-500"
        />
        {/* Progress Arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#001F3F" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-0 text-center">
        <span className="text-4xl font-bold text-navy leading-none">{Math.round(value)}</span>
        <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">Score Geral</span>
      </div>
    </div>
  );
};

export default Gauge;
