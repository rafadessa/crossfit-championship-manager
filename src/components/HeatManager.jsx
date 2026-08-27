import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Layers, Plus, Timer, Dumbbell, PlayCircle, CheckCircle, Clock } from 'lucide-react';

export const HeatManager = () => {
  const { heats, wods, athletes, addHeat, updateHeatStatus, setActiveHeatForTimer, setActiveTab } = useTournament();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    wodId: wods[0]?.id || '',
    name: '',
    startTime: '11:00',
    lane1: '',
    lane2: '',
    lane3: '',
    lane4: ''
  });

  const handleStartTimerForHeat = (heat) => {
    setActiveHeatForTimer(heat);
    setActiveTab('timer');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.wodId) return;

    const lanes = [];
    if (formData.lane1) lanes.push({ lane: 1, athleteId: formData.lane1 });
    if (formData.lane2) lanes.push({ lane: 2, athleteId: formData.lane2 });
    if (formData.lane3) lanes.push({ lane: 3, athleteId: formData.lane3 });
    if (formData.lane4) lanes.push({ lane: 4, athleteId: formData.lane4 });

    addHeat({
      wodId: formData.wodId,
      name: formData.name,
      startTime: formData.startTime,
      lanes
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-7 h-7 text-cyan-400" />
            <h1 className="font-display text-3xl font-black text-white tracking-wide">ORGANIZADOR DE BATERIAS (HEATS)</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Monte o chaveamento das baterias por raia e envie diretamente para o Cronômetro Oficial de Arena.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Criar Nova Bateria
        </button>
      </div>

      {/* Heats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {heats.map(heat => {
          const wodObj = wods.find(w => w.id === heat.wodId);
          return (
            <div key={heat.id} className="glass-panel p-6 space-y-4 hover:border-cyan-500/40 transition-colors">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white leading-none">{heat.name}</h3>
                  <p className="text-xs text-[#ccff00] font-mono mt-1">{wodObj?.name}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className={`badge ${
                    heat.status === 'completed' ? 'badge-gray' :
                    heat.status === 'running' ? 'badge-orange animate-pulse' : 'badge-lime'
                  }`}>
                    {heat.status === 'completed' ? 'FINALIZADA' : heat.status === 'running' ? 'EM ANDAMENTO' : 'AGUARDANDO'}
                  </span>
                  <p className="text-xs text-slate-400 font-mono flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {heat.startTime}
                  </p>
                </div>
              </div>

              {/* Lanes Table */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atletas por Raia:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {heat.lanes.map(laneItem => {
                    const athlete = athletes.find(a => a.id === laneItem.athleteId);
                    return (
                      <div key={laneItem.lane} className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                          R{laneItem.lane}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{athlete ? athlete.name : 'Vazia'}</p>
                          {athlete && <p className="text-[10px] text-slate-400">#{athlete.bib} • {athlete.box}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  onClick={() => handleStartTimerForHeat(heat)}
                  className="btn btn-primary btn-sm"
                >
                  <PlayCircle className="w-4 h-4" /> Iniciar no Cronômetro
                </button>

                <div className="flex items-center gap-2">
                  {heat.status !== 'completed' && (
                    <button
                      onClick={() => updateHeatStatus(heat.id, 'completed')}
                      className="btn btn-secondary btn-sm"
                      title="Marcar como Concluída"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Concluir
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Criar Bateria */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
          <div className="glass-panel p-6 max-w-lg w-full space-y-4 border-cyan-500/30">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-400" /> Criar Nova Bateria
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="form-group">
                <label className="form-label">Nome / Identificador da Bateria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bateria 1 - RX Masculino"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-control"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Provisão (WOD)</label>
                  <select
                    value={formData.wodId}
                    onChange={e => setFormData({ ...formData, wodId: e.target.value })}
                    className="select-control"
                  >
                    {wods.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Horário de Inicio</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="input-control font-mono"
                  />
                </div>
              </div>

              {/* Lane Selections */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <label className="form-label">Atribuir Atletas por Raia</label>
                
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">R{num}:</span>
                      <select
                        value={formData[`lane${num}`]}
                        onChange={e => setFormData({ ...formData, [`lane${num}`]: e.target.value })}
                        className="select-control text-xs py-1.5"
                      >
                        <option value="">(Raia Vazia)</option>
                        {athletes.map(a => (
                          <option key={a.id} value={a.id}>#{a.bib} {a.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
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
                  className="btn btn-primary"
                >
                  Salvar Bateria
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
