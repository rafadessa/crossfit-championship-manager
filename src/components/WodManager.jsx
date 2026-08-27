import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Dumbbell, Plus, Trash2, Edit2, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
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
    <div className="space-y-6 fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-orange-400" />
            <h1 className="font-display text-3xl font-black text-white tracking-wide">CADASTRAR E GERENCIAR PROVAS (WODs)</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Defina o formato de pontuação, tempo limite (Cap), repetições por rodada e critérios de desempate.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Criar Novo WOD
        </button>
      </div>

      {/* WOD Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wods.map(wod => {
          const categoryObj = categories.find(c => c.id === wod.category);
          return (
            <div key={wod.id} className="glass-panel p-6 flex flex-col justify-between space-y-4 hover:border-orange-500/40 transition-colors">
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <span className="badge badge-orange font-mono">
                    {wod.type === 'for_time' ? '⏱️ For Time' :
                     wod.type === 'amrap' ? '🔄 AMRAP' :
                     wod.type === 'max_weight' ? '🏋️ Carga Máxima' : '⏰ EMOM'}
                  </span>

                  <span className="badge badge-gray text-[10px]">
                    {categoryObj ? categoryObj.name : 'Todas Categorias'}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white leading-tight">
                  {wod.name}
                </h3>

                <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Cap: {formatTime(wod.timeCap)} min
                </div>

                {/* Description Box */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {wod.description}
                </div>

                {/* Standards */}
                {wod.standards && (
                  <div className="text-xs text-slate-400">
                    <span className="font-bold text-slate-300 block mb-1">Padrões de Movimento:</span>
                    <p className="line-clamp-2 text-slate-400 italic">{wod.standards}</p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[11px] text-slate-500 font-mono">
                  {wod.tiebreakRule ? `Tiebreak: ${wod.tiebreakRule}` : 'Sem tiebreak estipulado'}
                </span>

                <button
                  onClick={() => {
                    if (window.confirm(`Excluir o WOD "${wod.name}"? As notas associadas também serão apagadas.`)) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
          <div className="glass-panel p-6 max-w-xl w-full space-y-4 border-orange-500/30">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-orange-400" /> Criar Novo WOD
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Nome da Prova</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: WOD 1 - AMRAP 12 MIN"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-control"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Tipo de Prova</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="select-control"
                  >
                    <option value="for_time">For Time (Menor tempo)</option>
                    <option value="amrap">AMRAP (Maior repetições)</option>
                    <option value="max_weight">Max Weight (Carga 1RM)</option>
                    <option value="emom">EMOM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Time Cap (Minutos)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    required
                    value={formData.timeCapMins}
                    onChange={e => setFormData({ ...formData, timeCapMins: e.target.value })}
                    className="input-control font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Categoria Alvo</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="select-control"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {formData.type === 'amrap' && (
                  <div className="form-group">
                    <label className="form-label">Reps por Rodada (Rounds)</label>
                    <input
                      type="number"
                      placeholder="Ex: 50"
                      value={formData.repsPerRound}
                      onChange={e => setFormData({ ...formData, repsPerRound: e.target.value })}
                      className="input-control font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Descrição dos Movimentos & Cargas</label>
                <textarea
                  rows="3"
                  placeholder="Ex: 15 Thrusters (60kg), 15 Pull-ups, 20 Cal Row..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="textarea-control"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Regra de Desempate (Tiebreak)</label>
                <input
                  type="text"
                  placeholder="Ex: Tempo ao finalizar a 1ª rodada de Thrusters"
                  value={formData.tiebreakRule}
                  onChange={e => setFormData({ ...formData, tiebreakRule: e.target.value })}
                  className="input-control"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-orange"
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
