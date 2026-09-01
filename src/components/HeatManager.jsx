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
    <div className="space-y-5 animate-fade-in">
      
      {/* Header */}
      <div className="wod-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#D60036]" />
            <h1 className="font-heading text-2xl font-black text-white tracking-wide">ORGANIZADOR DE BATERIAS (HEATS)</h1>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Monte o chaveamento por raia e envie a bateria direto para o Cronômetro Oficial de Arena.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-wod btn-wod-primary self-start sm:self-auto text-xs"
        >
          <Plus className="w-4 h-4" /> Nova Bateria
        </button>
      </div>

      {/* Heats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {heats.map(heat => {
          const wodObj = wods.find(w => w.id === heat.wodId);
          return (
            <div key={heat.id} className="wod-card p-5 space-y-4 hover:border-[#D60036]/40 transition-colors">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-heading text-xl font-black text-white leading-none">{heat.name}</h3>
                  <p className="text-xs text-red-400 font-mono mt-1 font-bold">{wodObj?.name}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className={`wod-chip ${
                    heat.status === 'completed' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                    heat.status === 'running' ? 'bg-[#D60036]/20 text-[#D60036] border border-[#D60036]/40 animate-pulse' : 'bg-white/10 text-slate-200 border border-white/20'
                  }`}>
                    {heat.status === 'completed' ? 'FINALIZADA' : heat.status === 'running' ? 'AO VIVO' : 'AGUARDANDO'}
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono flex items-center justify-end gap-1">
                    <Clock className="w-3.5 h-3.5" /> {heat.startTime}
                  </p>
                </div>
              </div>

              {/* Lanes Table */}
              <div className="space-y-2">
                <p className="text-[11px] font-heading font-black text-slate-400 uppercase tracking-wider">Duplas por Raia:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {heat.lanes.map(laneItem => {
                    const athlete = athletes.find(a => a.id === laneItem.athleteId);
                    return (
                      <div key={laneItem.lane} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-slate-800 text-[#D60036] font-mono text-xs font-black flex items-center justify-center shrink-0">
                          R{laneItem.lane}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{athlete ? athlete.name : 'Vazia'}</p>
                          {athlete && <p className="text-[10px] text-slate-400 truncate">#{athlete.bib} • {athlete.box}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <button
                  onClick={() => handleStartTimerForHeat(heat)}
                  className="btn-wod btn-wod-silver text-xs py-2 px-3"
                >
                  <PlayCircle className="w-4 h-4 text-black" /> Abrir no Cronômetro
                </button>

                {heat.status !== 'completed' && (
                  <button
                    onClick={() => updateHeatStatus(heat.id, 'completed')}
                    className="btn-wod btn-wod-secondary text-xs py-2 px-3"
                    title="Marcar como Concluída"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Concluir
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Criar Bateria Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-2 sm:p-4 flex flex-col justify-end md:justify-center md:items-center animate-fade-in">
          <div className="wod-card p-5 md:p-6 max-w-lg w-full space-y-4 border-2 border-[#D60036]/50 bg-[#0E1118] shadow-2xl relative rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Mobile Drag Indicator Bar */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto md:hidden -mt-1 mb-2"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading text-xl font-black text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#D60036]" /> Criar Nova Bateria
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">Nome da Bateria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bateria 1 - Dupla RX"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 bg-[#0B0D12] border border-white/20 rounded-xl text-white text-xs font-bold focus:border-[#D60036] focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">WOD</label>
                  <select
                    value={formData.wodId}
                    onChange={e => setFormData({ ...formData, wodId: e.target.value })}
                    className="w-full h-12 px-3 bg-[#0B0D12] border border-white/20 rounded-xl text-white text-xs font-bold focus:border-[#D60036] focus:outline-none"
                  >
                    {wods.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">Horário</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full h-12 px-3 bg-[#0B0D12] border border-white/20 rounded-xl text-white text-xs font-mono font-bold focus:border-[#D60036] focus:outline-none"
                  />
                </div>
              </div>

              {/* Lane Selections */}
              <div className="space-y-2 border-t border-white/10 pt-3">
                <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">Atribuir Raias (Duplas)</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/10">
                      <span className="text-xs font-mono font-bold text-[#D60036] shrink-0">R{num}:</span>
                      <select
                        value={formData[`lane${num}`]}
                        onChange={e => setFormData({ ...formData, [`lane${num}`]: e.target.value })}
                        className="w-full h-10 px-2 bg-[#0A0E17] border border-white/15 rounded-lg text-white text-xs font-semibold focus:outline-none"
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

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 px-5 rounded-xl bg-white/5 border border-white/15 text-slate-300 hover:text-white text-xs font-heading font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-[#D60036] text-white text-xs font-heading font-black hover:brightness-110 shadow-lg shadow-[#D60036]/30"
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
