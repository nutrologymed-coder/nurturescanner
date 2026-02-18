
import React from 'react';

interface RecompositionBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  delta?: number | null;
  invert?: boolean;
}

const RecompositionBar: React.FC<RecompositionBarProps> = ({ label, value, max, unit, color, delta, invert }) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  // Logic for delta display (Gain of muscle is green, gain of fat is usually red)
  const isPositiveImpact = delta !== null ? (invert ? delta < 0 : delta > 0) : null;
  const deltaColor = isPositiveImpact ? 'text-emerald-500' : 'text-rose-400';
  const deltaIcon = (delta || 0) > 0 ? 'fa-arrow-up' : 'fa-arrow-down';

  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2">
          {delta !== null && delta !== 0 && (
            <span className={`text-[10px] font-bold flex items-center gap-1 ${deltaColor}`}>
              <i className={`fas ${deltaIcon}`}></i>
              {Math.abs(delta).toFixed(1)} {unit}
            </span>
          )}
          <span className="text-sm font-bold text-navy">{value.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">{unit}</span></span>
        </div>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default RecompositionBar;
