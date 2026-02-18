
import React from 'react';
import { PatientRecord } from './types';

interface InputPanelProps {
  currentRecord: PatientRecord;
  setCurrentRecord: React.Dispatch<React.SetStateAction<PatientRecord>>;
}

const InputPanel: React.FC<InputPanelProps> = ({ currentRecord, setCurrentRecord }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCurrentRecord(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PatientRecord] as any),
          [child]: parseFloat(value) || 0
        }
      }));
    } else {
      setCurrentRecord(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentRecord(prev => ({ ...prev, ultrasoundImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-navy">
        <i className="fas fa-id-card text-gold"></i> Entrada de Dados
      </h3>
      
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome Completo</label>
            <input 
              type="text" name="name" value={currentRecord.name} onChange={handleChange}
              className="w-full border-slate-200 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-navy/5 outline-none"
              placeholder="Ex: João Silva"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Idade</label>
            <input 
              type="number" name="age" value={currentRecord.age} onChange={handleChange}
              className="w-full border-slate-200 border rounded-lg px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sexo</label>
            <select 
              name="gender" value={currentRecord.gender} onChange={handleChange}
              className="w-full border-slate-200 border rounded-lg px-3 py-2 outline-none"
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Data</label>
            <input 
              type="date" name="date" value={currentRecord.date} onChange={handleChange}
              className="w-full border-slate-200 border rounded-lg px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rótulo</label>
            <input 
              type="text" name="label" value={currentRecord.label} onChange={handleChange}
              className="w-full border-slate-200 border rounded-lg px-3 py-2 outline-none"
              placeholder="Ex: Pós-ciclo GLP1"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
          <h4 className="text-sm font-bold text-navy flex items-center gap-2">
            <i className="fas fa-microscope text-gold"></i> Medições (mm)
          </h4>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-2 border-b border-slate-200">MÚSCULO</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Dir</span>
                  <input type="number" name="measurements.muscleRight" value={currentRecord.measurements.muscleRight} onChange={handleChange} className="w-16 border rounded px-1 text-center py-1 text-sm outline-none" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Esq</span>
                  <input type="number" name="measurements.muscleLeft" value={currentRecord.measurements.muscleLeft} onChange={handleChange} className="w-16 border rounded px-1 text-center py-1 text-sm outline-none" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-2 border-b border-slate-200">GORDURA SUBCUT.</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Dir</span>
                  <input type="number" name="measurements.fatRight" value={currentRecord.measurements.fatRight} onChange={handleChange} className="w-16 border rounded px-1 text-center py-1 text-sm outline-none" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Esq</span>
                  <input type="number" name="measurements.fatLeft" value={currentRecord.measurements.fatLeft} onChange={handleChange} className="w-16 border rounded px-1 text-center py-1 text-sm outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Contexto Clínico</label>
          <textarea 
            name="context" value={currentRecord.context} onChange={handleChange}
            className="w-full border-slate-200 border rounded-lg px-3 py-2 outline-none h-20 resize-none text-sm"
            placeholder="Observações importantes..."
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Imagem Ultrassom (Opcional)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-lg hover:border-gold transition-colors cursor-pointer relative">
            <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            <div className="space-y-1 text-center">
              <i className="fas fa-image text-slate-300 text-3xl mb-2"></i>
              <p className="text-xs text-slate-500">Clique para enviar imagem</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
