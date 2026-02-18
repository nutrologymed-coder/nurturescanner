
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PatientRecord, HistoryData, ComparisonResults } from './types';
import InputPanel from './InputPanel';
import ReportPanel from './ReportPanel';
import Header from './Header';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const INITIAL_RECORD: PatientRecord = {
  id: Date.now().toString(),
  name: '',
  age: 30,
  gender: 'M',
  date: new Date().toISOString().split('T')[0],
  label: 'Consulta de Rotina',
  context: '',
  measurements: {
    muscleRight: 0,
    muscleLeft: 0,
    fatRight: 0,
    fatLeft: 0
  }
};

const App: React.FC = () => {
  const [currentRecord, setCurrentRecord] = useState<PatientRecord>(INITIAL_RECORD);
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [comparison, setComparison] = useState<ComparisonResults>({ muscleDelta: null, fatDelta: null });
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const calculateComparison = useCallback((current: PatientRecord, hist: HistoryData | null) => {
    if (!hist || hist.records.length === 0) {
      setComparison({ muscleDelta: null, fatDelta: null });
      return;
    }

    const sorted = [...hist.records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const prev = sorted.find(r => new Date(r.date) < new Date(current.date));

    if (prev) {
      const currentMuscleAvg = (current.measurements.muscleRight + current.measurements.muscleLeft) / 2;
      const prevMuscleAvg = (prev.measurements.muscleRight + prev.measurements.muscleLeft) / 2;
      const currentFatAvg = (current.measurements.fatRight + current.measurements.fatLeft) / 2;
      const prevFatAvg = (prev.measurements.fatRight + prev.measurements.fatLeft) / 2;

      setComparison({
        muscleDelta: currentMuscleAvg - prevMuscleAvg,
        fatDelta: currentFatAvg - prevFatAvg,
        prevRecord: prev
      });
    } else {
      setComparison({ muscleDelta: null, fatDelta: null });
    }
  }, []);

  useEffect(() => {
    calculateComparison(currentRecord, history);
  }, [currentRecord, history, calculateComparison]);

  const handleLoadExample = async () => {
    try {
      const response = await fetch('./data.example.json');
      const data: HistoryData = await response.json();
      setHistory(data);
      if (data.records.length > 0) {
        const sorted = [...data.records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCurrentRecord(sorted[0]);
      }
    } catch (error) {
      console.error("Failed to load example data", error);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify({ records: [currentRecord, ...(history?.records || [])] }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nurture_data_${currentRecord.name || 'paciente'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(reportRef.current!, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 794 
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Laudo_Nurture_${currentRecord.name}.pdf`);
      } catch (err) {
        console.error("PDF Export failed", err);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-800">
      <Header 
        onLoadExample={handleLoadExample} 
        onDownloadJSON={handleDownloadJSON} 
        onExportPDF={handleExportPDF} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-1/3 no-print">
            <InputPanel 
              currentRecord={currentRecord} 
              setCurrentRecord={setCurrentRecord} 
            />
          </div>

          <div className={`w-full lg:w-2/3 ${isExporting ? 'pdf-mode' : ''}`}>
            <div ref={reportRef} className="bg-white shadow-xl border border-slate-100 rounded-xl overflow-hidden">
              <ReportPanel 
                currentRecord={currentRecord} 
                comparison={comparison}
                history={history}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-10 bg-slate-50 border-t border-slate-200 no-print footer">
        <div className="container mx-auto px-4 text-center">
          <p className="text-navy font-bold text-sm">Dr. Jefferson Kleber Pereira do Nascimento</p>
          <p className="text-[12px] text-slate-500 mt-1">CRM/CE 15853 • Intensivista RQE 18731 • SBCM • RQE 15104</p>
          <p className="text-[12px] text-slate-500 italic">Juazeiro do Norte – CE | Salgueiro – PE</p>
          <p className="text-[12px] text-slate-400 mt-3">
            Fone/WhatsApp: (88) 98182-7825 | Instagram: @drklebernurture | Site: www.drklebernascimento.com
          </p>
          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-300 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Nurture Metabolic Scanner™ - Tecnologia Clínica Premium
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
