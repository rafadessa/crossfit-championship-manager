import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ClipboardCheck, CheckCircle2, Dumbbell, Clock, Plus, Minus, Flame } from 'lucide-react';
import { formatTime } from '../utils/scoring';

export const ScoreEntry = () => {
  const { wods, athletes, scores, saveScore } = useTournament();

  const [selectedWodId, setSelectedWodId] = useState(wods[0]?.id || '');
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  
  // Score Input Fields State
  const [isCap, setIsCap] = useState(false);
  const [mins, setMins] = useState('');
  const [secs, setSecs] = useState('');
  const [reps, setReps] = useState('');
  const [rounds, setRounds] = useState('');
  const [weight, setWeight] = useState('');
  const [tiebreakMins, setTiebreakMins] = useState('');
  const [tiebreakSecs, setTiebreakSecs] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const activeWod = wods.find(w => w.id === selectedWodId) || wods[0];
  const wodAthletes = athletes.filter(a => a.category === activeWod?.category || activeWod?.category === 'ALL');

  // Load existing score when athlete changes
  const handleAthleteChange = (athleteId) => {
    setSelectedAthleteId(athleteId);
    setSuccessMessage('');
    const existing = scores.find(s => s.wodId === selectedWodId && s.athleteId === athleteId);

    if (existing) {
      setIsCap(existing.isCap || false);
      if (existing.timeInSeconds) {
        setMins(Math.floor(existing.timeInSeconds / 60).toString());
        setSecs(Math.floor(existing.timeInSeconds % 60).toString());
      } else {
        setMins(''); setSecs('');
      }
      setReps(existing.reps !== undefined ? String(existing.reps) : '');
      setRounds(existing.rounds !== undefined ? String(existing.rounds) : '');
      setWeight(existing.weight !== undefined ? String(existing.weight) : '');
      if (existing.tiebreakTime) {
        setTiebreakMins(Math.floor(existing.tiebreakTime / 60).toString());
        setTiebreakSecs(Math.floor(existing.tiebreakTime % 60).toString());
      } else {
        setTiebreakMins(''); setTiebreakSecs('');
      }
    } else {
      setIsCap(false);
      setMins(''); setSecs(''); setReps(''); setRounds(''); setWeight(''); setTiebreakMins(''); setTiebreakSecs('');
    }
  };

  const adjustReps = (delta) => {
    const current = parseInt(reps) || 0;
    const val = Math.max(0, current + delta);
    setReps(val.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeWod || !selectedAthleteId) return;

    const totalSeconds = (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0);
    const tbSeconds = (parseInt(tiebreakMins) || 0) * 60 + (parseInt(tiebreakSecs) || 0);

    const scoreData = {
      wodId: activeWod.id,
      athleteId: selectedAthleteId,
      isCap,
      timeInSeconds: totalSeconds > 0 ? totalSeconds : null,
      timeStr: formatTime(totalSeconds),
      reps: parseInt(reps) || 0,
      rounds: parseInt(rounds) || 0,
      weight: parseFloat(weight) || 0,
      tiebreakTime: tbSeconds > 0 ? tbSeconds : null
    };

    saveScore(scoreData);

    const athleteObj = athletes.find(a => a.id === selectedAthleteId);
    setSuccessMessage(`Nota salva com sucesso para ${athleteObj?.name}!`);

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="wod-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#D60036]/15 border border-[#D60036]/30 flex items-center justify-center text-[#D60036]">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-black text-white tracking-wide">ÁREA DO JUIZ (ARENA MOBILE)</h1>
            <p className="text-slate-400 text-xs">
              Interface tátil para lançamento de notas e resultados no celular
            </p>
          </div>
        </div>
      </div>

      {/* Main Score Form */}
      <div className="wod-card p-5 md:p-6 space-y-5 border-[#D60036]/30">
        
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Step 1: Select WOD & Athlete */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-black text-[#D60036] uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" /> 1. Selecionar WOD
              </label>
              <select
                value={selectedWodId}
                onChange={(e) => {
                  setSelectedWodId(e.target.value);
                  setSelectedAthleteId('');
                }}
                className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-[#D60036]"
              >
                {wods.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" /> 2. Selecionar Atleta
              </label>
              <select
                value={selectedAthleteId}
                onChange={(e) => handleAthleteChange(e.target.value)}
                className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-red-500"
              >
                <option value="">-- Escolha um Atleta --</option>
                {wodAthletes.map(a => (
                  <option key={a.id} value={a.id}>
                    #{a.bib} - {a.name} ({a.box})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* WOD Standard Reminder */}
          {activeWod && (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="wod-chip bg-[#D60036]/20 text-[#D60036] border border-[#D60036]/30 text-[9px]">
                {activeWod.type.replace('_', ' ')}
              </span>
              <p className="text-xs font-bold text-white">{activeWod.description}</p>
            </div>
          )}

          {/* Step 2: Dynamic Input Form based on WOD Type */}
          {selectedAthleteId ? (
            <div className="p-4 md:p-5 rounded-xl bg-white/5 border border-white/10 space-y-5">
              <h3 className="font-heading text-lg font-black text-white border-b border-white/10 pb-2">
                3. Lançamento da Nota
              </h3>

              {/* FOR TIME WOD */}
              {activeWod?.type === 'for_time' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isCap}
                        onChange={(e) => setIsCap(e.target.checked)}
                        className="w-5 h-5 accent-[#D60036] rounded cursor-pointer"
                      />
                      <span className="font-bold text-xs text-slate-200">Estourou Time Cap (CAP)</span>
                    </label>
                  </div>

                  {!isCap ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Tempo de Conclusão</label>
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          placeholder="Min"
                          min="0"
                          value={mins}
                          onChange={(e) => setMins(e.target.value)}
                          className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-center font-mono text-lg font-black text-white focus:border-[#D60036]"
                        />
                        <span className="font-black text-slate-400">:</span>
                        <input
                          type="number"
                          placeholder="Seg"
                          min="0"
                          max="59"
                          value={secs}
                          onChange={(e) => setSecs(e.target.value)}
                          className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-center font-mono text-lg font-black text-white focus:border-[#D60036]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-w-xs">
                      <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Reps no CAP</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Ex: 85"
                          value={reps}
                          onChange={(e) => setReps(e.target.value)}
                          className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-center font-mono text-xl font-black text-[#D60036]"
                        />
                        <button type="button" onClick={() => adjustReps(1)} className="p-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20">
                          +1
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AMRAP WOD */}
              {activeWod?.type === 'amrap' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Total de Repetições (Reps)</label>
                    <div className="flex items-center gap-2 max-w-xs">
                      <input
                        type="number"
                        placeholder="Ex: 145"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-center font-mono text-2xl font-black text-[#D60036]"
                      />
                      <button type="button" onClick={() => adjustReps(-1)} className="p-3.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20">
                        <Minus className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => adjustReps(1)} className="p-3.5 rounded-xl bg-[#D60036] text-white font-bold hover:brightness-110">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-xs">
                    <label className="text-xs font-heading font-extrabold text-slate-400 uppercase">Rounds (Opcional)</label>
                    <input
                      type="number"
                      placeholder="Ex: 3"
                      value={rounds}
                      onChange={(e) => setRounds(e.target.value)}
                      className="w-full p-2.5 bg-[#0A0E17] border border-white/15 rounded-xl text-center font-mono text-base font-bold text-white"
                    />
                  </div>
                </div>
              )}

              {/* MAX WEIGHT WOD */}
              {activeWod?.type === 'max_weight' && (
                <div className="space-y-1.5 max-w-xs">
                  <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Carga Máxima (Kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ex: 135.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 bg-[#0A0E17] border border-white/15 rounded-xl text-center font-mono text-2xl font-black text-[#D4FF00]"
                  />
                </div>
              )}

              {/* Tiebreak Input */}
              <div className="space-y-1.5 border-t border-white/10 pt-4">
                <label className="text-xs font-heading font-extrabold text-slate-400 uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Tempo de Desempate (Tie-break)
                </label>
                <div className="flex items-center gap-2 max-w-xs">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={tiebreakMins}
                    onChange={(e) => setTiebreakMins(e.target.value)}
                    className="w-full p-2.5 bg-[#0A0E17] border border-white/15 rounded-xl text-center font-mono text-sm text-white"
                  />
                  <span className="font-bold text-slate-400">:</span>
                  <input
                    type="number"
                    placeholder="Seg"
                    min="0"
                    max="59"
                    value={tiebreakSecs}
                    onChange={(e) => setTiebreakSecs(e.target.value)}
                    className="w-full p-2.5 bg-[#0A0E17] border border-white/15 rounded-xl text-center font-mono text-sm text-white"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="btn-wod btn-wod-primary w-full py-3 text-sm font-black"
              >
                SALVAR E CONFIRMAR NOTA
              </button>

            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-white/20 rounded-xl text-slate-500 text-xs">
              Selecione um atleta acima para abrir o teclado de notas.
            </div>
          )}

        </form>
      </div>

    </div>
  );
};
