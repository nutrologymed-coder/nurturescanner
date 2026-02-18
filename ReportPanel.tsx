
import React from 'react';
import { PatientRecord, ComparisonResults, HistoryData } from './types';
import Gauge from './Gauge';
import RecompositionBar from './RecompositionBar';
import EvolutionChart from './EvolutionChart';

interface ReportPanelProps {
  currentRecord: PatientRecord;
  comparison: ComparisonResults;
  history: HistoryData | null;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ currentRecord, comparison, history }) => {
  const avgMuscle = (currentRecord.measurements.muscleRight + currentRecord.measurements.muscleLeft) / 2;
  const avgFat = (currentRecord.measurements.fatRight + currentRecord.measurements.fatLeft) / 2;
  
  const score = Math.min(100, Math.max(0, 50 + (avgMuscle * 1.2) - (avgFat * 2)));
  const recompositionIndex = Math.min(10, Math.max(0, (avgMuscle / (avgFat + 0.1))));

  const getInterpretiveText = (s: number) => {
    if (s > 80) return "Composição de elite. Alta densidade muscular com mínima camada adiposa.";
    if (s > 60) return "Equilíbrio metabólico positivo. Massa muscular bem preservada.";
    if (s > 40) return "Padrão intermediário. Recomenda-se ajuste em hipertrofia e controle de estoques.";
    return "Baixa eficiência metabólica. Excesso de estoques e sarcopenia relativa detectada.";
  };

  return (
    <div className="bg-white p-10 print:p-8" id="report">
      {/* Header Interne */}
      <div className="flex justify-between items-start border-b-2 border-gold pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-navy uppercase tracking-widest">Composição da Coxa</h2>
          <p className="text-slate-400 text-sm italic">Análise por Ultrassonografia Musculoesquelética</p>
        </div>
        <div className="text-right">
          <p className="text-navy font-bold">{currentRecord.name || '---'}</p>
          <p className="text-xs text-slate-500">{currentRecord.age} anos | {currentRecord.gender === 'M' ? 'Masc' : 'Fem'}</p>
          <p className="text-xs text-slate-500 mt-1">{new Date(currentRecord.date).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <Gauge value={score} />
            <div className="mt-4 text-center">
              <span className="text-xs uppercase tracking-tighter font-bold text-slate-400">Score de Eficiência</span>
              <p className="text-sm text-navy mt-1 max-w-[200px] leading-snug">{getInterpretiveText(score)}</p>
            </div>
          </div>

          <div className="space-y-6">
            <RecompositionBar label="MOTOR (Músculo)" value={avgMuscle} max={60} unit="mm" color="#001F3F" delta={comparison.muscleDelta} />
            <RecompositionBar label="ESTOQUE (Gordura)" value={avgFat} max={30} unit="mm" color="#D4AF37" delta={comparison.fatDelta} invert />
            <RecompositionBar label="ÍNDICE DE RECOMPOSIÇÃO" value={recompositionIndex} max={10} unit="/ 10" color="#34D399" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm relative group">
            <div className="absolute top-2 left-2 bg-navy/80 text-white text-[10px] px-2 py-1 rounded-md z-10">IMAGE ID: {currentRecord.id}</div>
            <img 
              src={currentRecord.ultrasoundImage || 'https://picsum.photos/seed/us/400/250'} 
              alt="Ultrasound" 
              className="w-full h-[200px] object-cover bg-slate-100"
            />
            {!currentRecord.ultrasoundImage && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-medium">
                Placeholder Ultrasound
              </div>
            )}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tags em mm:</span>
              <div className="flex gap-4">
                <span className="text-xs font-bold text-navy">M: {avgMuscle.toFixed(1)}</span>
                <span className="text-xs font-bold text-gold">G: {avgFat.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">Histórico de Evolução</h4>
            <EvolutionChart history={history} currentRecord={currentRecord} />
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 pb-12">
        <div>
          <h4 className="text-sm font-bold text-navy mb-3 uppercase flex items-center gap-2">
            <i className="fas fa-notes-medical text-gold"></i> Contexto Clínico
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed min-h-[60px]">
            {currentRecord.context || "Nenhuma observação clínica registrada para esta consulta."}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-navy mb-3 uppercase">Plano de Ação</h4>
          <ul className="space-y-2">
            {[
              "Ajuste de aporte proteico basal",
              "Estimulação de via mTOR via treinamento",
              "Monitoramento de adipocines subcutâneas"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-4 h-4 border border-gold rounded flex items-center justify-center text-[10px] text-gold">
                  <i className="fas fa-check"></i>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Professional Clinical Footer (Captured in PDF) */}
      <div className="mt-8 pt-6 border-t border-gold/30 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="text-left space-y-0.5">
          <p className="text-navy font-bold text-[13px]">Dr. Jefferson Kleber Pereira do Nascimento</p>
          <p className="text-[11px] text-slate-500 font-medium">CRM/CE 15853 • Intensivista RQE 18731 • SBCM • RQE 15104</p>
          <p className="text-[11px] text-slate-500 font-medium italic">Juazeiro do Norte – CE | Salgueiro – PE</p>
        </div>
        <div className="text-left md:text-right text-[11px] text-slate-500 space-y-0.5">
          <p><span className="text-navy font-semibold">Fone/WhatsApp:</span> (88) 98182-7825</p>
          <p><span className="text-navy font-semibold">Instagram:</span> @drklebernurture</p>
          <p><span className="text-navy font-semibold">Site:</span> www.drklebernascimento.com</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPanel;
