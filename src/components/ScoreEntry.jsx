import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ClipboardCheck, CheckCircle2, Dumbbell, AlertTriangle, Clock } from 'lucide-react';
import { parseTimeToSeconds, formatTime } from '../utils/scoring';

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
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-black text-white tracking-wide">ÁREA DO JUIZ / LANÇAMENTO DE NOTAS</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Interface rápida para validação e inserção de resultados no evento.
            </p>
          </div>
        </div>
      </div>

      {/* Main Score Form */}
      <div className="glass-panel p-6 md:p-8 space-y-6 border-orange-500/30">
        
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Select WOD & Athlete */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="form-group">
              <label className="form-label flex items-center gap-1.5 text-orange-400">
                <Dumbbell className="w-4 h-4" /> 1. Selecionar Prova (WOD)
              </label>
              <select
                value={selectedWodId}
                onChange={(e) => {
                  setSelectedWodId(e.target.value);
                  setSelectedAthleteId('');
                }}
                className="select-control py-3 font-bold bg-slate-900"
              >
                {wods.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-1.5 text-cyan-400">
                2. Selecionar Atleta / Equipe
              </label>
              <select
                value={selectedAthleteId}
                onChange={(e) => handleAthleteChange(e.target.value)}
                className="select-control py-3 font-bold bg-slate-900"
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
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="badge badge-orange font-mono text-[10px] uppercase">Formato: {activeWod.type.replace('_', ' ')}</span>
              <p className="text-sm font-bold text-white mt-1">{activeWod.description}</p>
              {activeWod.tiebreakRule && (
                <p className="text-xs text-[#ccff00] font-mono">Tiebreak: {activeWod.tiebreakRule}</p>
              )}
            </div>
          )}

          {/* Step 2: Dynamic Input Form based on WOD Type */}
          {selectedAthleteId ? (
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
              <h3 className="font-display text-2xl font-bold text-white border-b border-white/10 pb-2">
                3. Registrar Pontuação
              </h3>

              {/* FOR TIME WOD */}
              {activeWod?.type === 'for_time' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCap}
                        onChange={(e) => setIsCap(e.target.checked)}
                        className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                      />
                      <span className="font-bold text-sm text-slate-200">Excedeu Time Cap (CAP)</span>
                    </label>
                  </div>

                  {!isCap ? (
                    <div className="form-group">
                      <label className="form-label">Tempo de Conclusão</label>
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          placeholder="Min"
                          min="0"
                          value={mins}
                          onChange={(e) => setMins(e.target.value)}
                          className="input-control text-center font-mono text-xl font-bold"
                        />
                        <span className="font-bold text-slate-400">:</span>
                        <input
                          type="number"
                          placeholder="Seg"
                          min="0"
                          max="59"
                          value={secs}
                          onChange={(e) => setSecs(e.target.value)}
                          className="input-control text-center font-mono text-xl font-bold"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="form-group max-w-xs">
                      <label className="form-label">Total de Repetições Completadas até o CAP</label>
                      <input
                        type="number"
                        placeholder="Ex: 85"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="input-control text-center font-mono text-xl font-bold"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* AMRAP WOD */}
              {activeWod?.type === 'amrap' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Total de Repetições (Reps)</label>
                    <input
                      type="number"
                      placeholder="Ex: 145"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="input-control text-center font-mono text-xl font-bold"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rounds Completos (Opcional)</label>
                    <input
                      type="number"
                      placeholder="Ex: 2"
                      value={rounds}
                      onChange={(e) => setRounds(e.target.value)}
                      className="input-control text-center font-mono text-xl font-bold"
                    />
                  </div>
                </div>
              )}

              {/* MAX WEIGHT WOD */}
              {activeWod?.type === 'max_weight' && (
                <div className="form-group max-w-xs">
                  <label className="form-label">Carga Máxima Válida (Kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ex: 135.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="input-control text-center font-mono text-xl font-bold text-[#ccff00]"
                  />
                </div>
              )}

              {/* Tiebreak Input */}
              <div className="form-group border-t border-white/10 pt-4">
                <label className="form-label text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Tempo de Desempate (Tie-break)
                </label>
                <div className="flex items-center gap-2 max-w-xs">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={tiebreakMins}
                    onChange={(e) => setTiebreakMins(e.target.value)}
                    className="input-control text-center font-mono"
                  />
                  <span className="font-bold text-slate-400">:</span>
                  <input
                    type="number"
                    placeholder="Seg"
                    min="0"
                    max="59"
                    value={tiebreakSecs}
                    onChange={(e) => setTiebreakSecs(e.target.value)}
                    className="input-control text-center font-mono"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="btn btn-primary w-full py-3.5 text-base"
              >
                CONFIRMAR E SALVAR NOTA
              </button>

            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-white/20 rounded-xl text-slate-500">
              Selecione um atleta acima para abrir o formulário de julgamento.
            </div>
          )}

        </form>
      </div>

    </div>
  );
};
