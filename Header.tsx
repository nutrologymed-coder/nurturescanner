
import React from 'react';

interface HeaderProps {
  onLoadExample: () => void;
  onDownloadJSON: () => void;
  onExportPDF: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoadExample, onDownloadJSON, onExportPDF }) => {
  return (
    <header className="bg-navy text-white py-6 shadow-md no-print">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-xl shadow-inner">N</div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nurture <span className="text-gold font-light italic">Metabolic Scanner™</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">High Precision Body Composition</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onLoadExample}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-all text-sm flex items-center gap-2"
          >
            <i className="fas fa-database text-gold"></i> Carregar Exemplo
          </button>
          <button 
            onClick={onDownloadJSON}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-all text-sm flex items-center gap-2"
          >
            <i className="fas fa-file-export text-gold"></i> Baixar JSON
          </button>
          <button 
            onClick={onExportPDF}
            className="px-4 py-2 bg-gold hover:bg-gold/90 text-navy font-semibold rounded-md transition-all text-sm flex items-center gap-2 shadow-lg"
          >
            <i className="fas fa-file-pdf"></i> Exportar PDF
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
