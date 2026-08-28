import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Dumbbell, Plus, Trash2, Clock } from 'lucide-react';
import { formatTime } from '../utils/scoring';

export const WodManager = () => {
  const { wods, categories, addWod, deleteWod } = useTournament();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'for_time', // for_time, amrap, emom, max_weight
    timeCapMins: '10',
    category: 'rx_male',
    repsPerRound: '',
    description: '',
    standards: '',
    tiebreakRule: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addWod({
      name: formData.name,
      type: formData.type,
      timeCap: (parseInt(formData.timeCapMins) || 10) * 60,
      category: formData.category,
      repsPerRound: parseInt(formData.repsPerRound) || 0,
      description: formData.description,
      standards: formData.standards,
      tiebreakRule: formData.tiebreakRule
    });

    setFormData({
      name: '',
      type: 'for_time',
      timeCapMins: '10',
      category: 'rx_male',
      repsPerRound: '',
      description: '',
      standards: '',
      tiebreakRule: ''
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header */}
      <div className="wod-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-[#D60036]" />
            <h1 className="font-heading text-2xl font-black text-white tracking-wide">GESTOR DE WODs (PROVAS)</h1>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Cadastre os exercícios, tempo limite (Cap), modelo de pontuação e critérios de desempate.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-wod btn-wod-primary text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Criar WOD
        </button>
      </div>

      {/* WOD Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {wods.map(wod => {
          const categoryObj = categories.find(c => c.id === wod.category);
          return (
            <div key={wod.id} className="wod-card p-5 flex flex-col justify-between space-y-4 hover:border-[#D60036]/40 transition-colors">
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <span className="wod-chip bg-[#D60036]/20 text-[#D60036] border border-[#D60036]/40 text-[9px]">
                    {wod.type === 'for_time' ? '⏱️ For Time' :
                     wod.type === 'amrap' ? '🔄 AMRAP' :
                     wod.type === 'max_weight' ? '🏋️ Max Weight' : '⏰ EMOM'}
                  </span>

                  <span className="wod-chip bg-slate-800 text-slate-400 border border-slate-700 text-[9px]">
                    {categoryObj ? categoryObj.name : 'Todas Categorias'}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-black text-white leading-tight">
                  {wod.name}
                </h3>

                <div className="flex items-center gap-1.5 text-slate-300 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Cap: {formatTime(wod.timeCap)} min
                </div>

                {/* Description Box */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {wod.description}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[10px] text-slate-400 font-mono">
                  {wod.tiebreakRule ? `Tiebreak: ${wod.tiebreakRule}` : 'Sem tiebreak registrado'}
                </span>

                <button
                  onClick={() => {
                    if (window.confirm(`Excluir o WOD "${wod.name}"?`)) {
                      deleteWod(wod.id);
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="Excluir WOD"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create WOD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="wod-card p-6 max-w-xl w-full space-y-4 border-[#D60036]/40">
            <h2 className="font-heading text-2xl font-black text-white flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-[#D60036]" /> Criar Novo WOD
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Nome do WOD</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: WOD 1 - FRAN AMRAP"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white text-xs font-bold focus:border-[#D60036]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white text-xs font-bold focus:border-[#D60036]"
                  >
                    <option value="for_time">For Time (Menor tempo)</option>
                    <option value="amrap">AMRAP (Mais reps)</option>
                    <option value="max_weight">Max Weight (Carga RM)</option>
                    <option value="emom">EMOM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Time Cap (Minutos)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    required
                    value={formData.timeCapMins}
                    onChange={e => setFormData({ ...formData, timeCapMins: e.target.value })}
                    className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white text-xs font-mono font-bold focus:border-[#D60036]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Categoria</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white text-xs font-bold focus:border-[#D60036]"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Descrição & Cargas</label>
                <textarea
                  rows="3"
                  placeholder="Ex: 21-15-9 Thrusters (43kg) e Pull-ups..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white text-xs font-mono focus:border-[#D60036]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-wod btn-wod-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-wod btn-wod-primary text-xs"
                >
                  Salvar WOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
