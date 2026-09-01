import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { CategoryManagerModal } from './CategoryManagerModal';
import { Dumbbell, Plus, Trash2, Clock, Tag } from 'lucide-react';
import { formatTime } from '../utils/scoring';

export const WodManager = () => {
  const { wods, categories, addWod, deleteWod, isAdminLoggedIn } = useTournament();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'for_time', // for_time, amrap, emom, max_weight
    timeCapMins: '10',
    category: categories[0]?.id || 'rx_male',
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
      category: categories[0]?.id || 'rx_male',
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

        <div className="flex flex-wrap items-center gap-2">
          {isAdminLoggedIn && (
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="btn-wod btn-wod-secondary text-xs"
            >
              <Tag className="w-4 h-4 text-[#D60036]" /> Categorias
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-wod btn-wod-primary text-xs"
          >
            <Plus className="w-4 h-4" /> Criar WOD
          </button>
        </div>
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

      {/* Responsive Create WOD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md p-4 flex min-h-full items-center justify-center animate-fade-in">
          <div className="wod-card p-6 max-w-2xl w-full space-y-5 border-2 border-[#D60036]/50 bg-[#0E1118] shadow-2xl relative rounded-2xl my-auto">
            
            {/* Mobile Drag Indicator Bar */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto md:hidden -mt-1 mb-2"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#D60036]/20 border border-[#D60036]/40 flex items-center justify-center text-[#D60036]">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading text-xl md:text-2xl font-black text-white">Criar Novo WOD</h2>
                  <p className="text-xs text-slate-400">Preencha as especificações da prova</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Step 1: Nome do WOD */}
              <div className="space-y-1.5">
                <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">
                  1. Nome do WOD / Prova
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: WOD 1 - AIR & ICE (ou 21-15-9)"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 bg-[#0B0D12] border border-white/20 rounded-xl text-white text-sm font-bold focus:border-[#D60036] focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Step 2: Visual Radio Cards for WOD Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">
                  2. Formato da Prova (Tipo)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'for_time', label: 'For Time', desc: 'Menor Tempo', icon: '⏱️' },
                    { id: 'amrap', label: 'AMRAP', desc: 'Mais Reps', icon: '🔄' },
                    { id: 'max_weight', label: 'Max Weight', desc: 'Carga Máxima', icon: '🏋️' },
                    { id: 'emom', label: 'EMOM', desc: 'Por Minuto', icon: '⏰' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t.id })}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all h-20 ${
                        formData.type === t.id
                          ? 'bg-[#D60036]/20 border-[#D60036] text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base">{t.icon}</span>
                      <div>
                        <p className="font-heading text-xs font-black leading-none">{t.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Time Cap & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">
                    3. Time Cap (Minutos)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, timeCapMins: String(Math.max(1, (parseInt(prev.timeCapMins) || 10) - 1)) }))}
                      className="h-12 w-12 rounded-xl bg-white/10 text-white font-bold text-lg flex items-center justify-center shrink-0 hover:bg-white/20"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      required
                      value={formData.timeCapMins}
                      onChange={e => setFormData({ ...formData, timeCapMins: e.target.value })}
                      className="flex-1 h-12 bg-[#0B0D12] border border-white/20 rounded-xl text-center font-mono text-lg font-black text-white focus:border-[#D60036] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, timeCapMins: String((parseInt(prev.timeCapMins) || 10) + 1) }))}
                      className="h-12 w-12 rounded-xl bg-[#D60036] text-white font-bold text-lg flex items-center justify-center shrink-0 hover:brightness-110"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">
                    4. Categoria Atribuída
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-12 px-3 bg-[#0B0D12] border border-white/20 rounded-xl text-white text-xs font-bold focus:border-[#D60036] focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 4: Descrição & Cargas */}
              <div className="space-y-1.5">
                <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">
                  5. Descrição do WOD & Cargas
                </label>
                <textarea
                  rows="4"
                  placeholder="Ex: 12 Min AMRAP:\n- 15 Thrusters (60kg)\n- 15 Chest-to-Bar\n- 20 Cal Row"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#0B0D12] border border-white/20 rounded-xl text-white text-xs font-mono focus:border-[#D60036] focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              {/* Step 5: Tie-break Rule */}
              <div className="space-y-1.5">
                <label className="text-xs font-heading font-black text-slate-300 uppercase tracking-wider block">
                  6. Regra de Desempate (Tie-break)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tempo ao concluir a rodada 1"
                  value={formData.tiebreakRule}
                  onChange={e => setFormData({ ...formData, tiebreakRule: e.target.value })}
                  className="w-full h-12 px-4 bg-[#0B0D12] border border-white/20 rounded-xl text-white text-xs font-mono focus:border-[#D60036] focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 px-6 rounded-xl bg-white/5 border border-white/15 text-slate-300 hover:text-white text-xs font-heading font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-12 px-8 rounded-xl bg-[#D60036] text-white text-sm font-heading font-black hover:brightness-110 shadow-lg shadow-[#D60036]/30 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Salvar WOD
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
      />

    </div>
  );
};
