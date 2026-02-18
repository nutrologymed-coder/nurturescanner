
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { HistoryData, PatientRecord } from '../types';

interface EvolutionChartProps {
  history: HistoryData | null;
  currentRecord: PatientRecord;
}

const EvolutionChart: React.FC<EvolutionChartProps> = ({ history, currentRecord }) => {
  const allRecords = [currentRecord, ...(history?.records || [])];
  
  // Sort and deduplicate records by date
  const data = allRecords
    .filter((v, i, a) => a.findIndex(t => (t.date === v.date)) === i)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(r => ({
      date: new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      Músculo: (r.measurements.muscleRight + r.measurements.muscleLeft) / 2,
      Gordura: (r.measurements.fatRight + r.measurements.fatLeft) / 2
    }));

  if (data.length < 1) {
    return <div className="h-[150px] flex items-center justify-center text-slate-300 text-xs italic">Aguardando dados históricos...</div>;
  }

  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: '#94a3b8' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            domain={[0, 'auto']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
          />
          <Line 
            type="monotone" 
            dataKey="Músculo" 
            stroke="#001F3F" 
            strokeWidth={2} 
            dot={{ r: 4, fill: '#001F3F' }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="Gordura" 
            stroke="#D4AF37" 
            strokeWidth={2} 
            dot={{ r: 4, fill: '#D4AF37' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvolutionChart;
