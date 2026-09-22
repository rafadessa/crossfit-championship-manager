import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ClipboardCheck, CheckCircle2, Dumbbell, Clock, Plus, Minus, Flame, Play, Square, RotateCcw, Timer } from 'lucide-react';
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
  const [publishDelay, setPublishDelay] = useState(0);

  const [successMessage, setSuccessMessage] = useState('');

  // Stopwatch Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

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

    let finalTimeStr = formatTime(totalSeconds);
    if (publishDelay > 0) {
      const publishAt = Date.now() + (publishDelay * 60000);
      finalTimeStr = `${finalTimeStr}|||PUBLISH:${publishAt}`;
    }

    const scoreData = {
      wodId: activeWod.id,
      athleteId: selectedAthleteId,
      isCap,
      timeInSeconds: totalSeconds > 0 ? totalSeconds : null,
      timeStr: finalTimeStr,
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

      {/* Built-in Stopwatch Timer */}
      <div className="wod-card p-5 border-emerald-500/30">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300 uppercase font-heading font-black text-xs tracking-widest">
            <Timer className="w-4 h-4 text-emerald-400" />
            Cronômetro Auxiliar
          </div>
          
          <div className="text-5xl md:text-6xl font-mono font-black text-white tracking-wider tabular-nums">
            {formatTime(timerSeconds)}
          </div>

          <div className="flex items-center gap-3 w-full max-w-sm">
            <button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-heading font-black text-sm transition-all ${
                timerRunning 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {timerRunning ? <><Square className="w-4 h-4" fill="currentColor" /> PARAR</> : <><Play className="w-4 h-4" fill="currentColor" /> INICIAR</>}
            </button>
            <button
              type="button"
              onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
              className="p-3 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Zerar Cronômetro"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          {timerSeconds > 0 && !timerRunning && (
            <div className="flex gap-2 w-full max-w-sm mt-2">
              <button
                type="button"
                onClick={() => {
                  setMins(Math.floor(timerSeconds / 60).toString());
                  setSecs(Math.floor(timerSeconds % 60).toString());
                }}
                className="flex-1 text-[10px] py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 font-bold border border-white/10"
              >
                USAR COMO TEMPO WOD
              </button>
              <button
                type="button"
                onClick={() => {
                  setTiebreakMins(Math.floor(timerSeconds / 60).toString());
                  setTiebreakSecs(Math.floor(timerSeconds % 60).toString());
                }}
                className="flex-1 text-[10px] py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 font-bold border border-white/10"
              >
                USAR COMO TIE-BREAK
              </button>
            </div>
          )}
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
                <Flame className="w-3.5 h-3.5 text-red-500" /> 2. Selecionar Dupla
              </label>
              <select
                value={selectedAthleteId}
                onChange={(e) => handleAthleteChange(e.target.value)}
                className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-red-500"
              >
                <option value="">-- Escolha uma Dupla --</option>
                {wodAthletes.map(a => (
                  <option key={a.id} value={a.id}>
                    #{a.bib} - {a.name}
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

              {/* DISTANCE / HEIGHT / WEIGHT */}
              {['distance', 'height', 'weight', 'max_weight'].includes(activeWod?.type) && (
                <div className="space-y-1.5 max-w-xs">
                  <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">
                    {activeWod.type === 'distance' ? 'Distância (m/km)' : activeWod.type === 'height' ? 'Altura (cm/m)' : 'Carga / Peso (Kg)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 135.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 bg-[#0A0E17] border border-white/15 rounded-xl text-center font-mono text-2xl font-black text-[#D4FF00]"
                  />
                </div>
              )}

              {/* REPS / CALORIES / ROUNDS */}
              {['reps', 'calories', 'rounds'].includes(activeWod?.type) && (
                <div className="space-y-1.5 max-w-xs">
                  <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">
                    {activeWod.type === 'reps' ? 'Total de Repetições' : activeWod.type === 'calories' ? 'Total de Calorias' : 'Total de Rounds'}
                  </label>
                  <div className="flex items-center gap-2">
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
              )}

              {/* ROUNDS + REPS (AMRAP) */}
              {['rounds_reps', 'amrap', 'emom'].includes(activeWod?.type) && (
                <div className="space-y-4 max-w-xs">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Rounds Completos</label>
                    <input
                      type="number"
                      placeholder="Ex: 3"
                      value={rounds}
                      onChange={(e) => setRounds(e.target.value)}
                      className="w-full p-3 bg-[#0A0E17] border border-white/15 rounded-xl text-center font-mono text-xl font-bold text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Reps Extras</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Ex: 12"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-center font-mono text-xl font-black text-[#D60036]"
                      />
                      <button type="button" onClick={() => adjustReps(1)} className="p-3 rounded-xl bg-[#D60036] text-white font-bold hover:brightness-110">
                        +1
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* JUST TIME */}
              {activeWod?.type === 'time' && (
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
              )}

              {/* TIME + REPS (For Time c/ Cap) */}
              {['time_reps', 'for_time'].includes(activeWod?.type) && (
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

              {/* Submit Buttons */}
              <div className="pt-2">
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full btn-wod btn-wod-primary py-4 text-base tracking-widest shadow-lg shadow-[#D60036]/20"
                  >
                    SALVAR NOTA AGORA
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setPublishDelay(30); handleSubmit(new Event('submit')); }}
                      className="flex-1 btn-wod bg-slate-800 text-slate-300 border-slate-700 py-3 text-[10px] hover:bg-slate-700"
                    >
                      SALVAR E OCULTAR (30m)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPublishDelay(60); handleSubmit(new Event('submit')); }}
                      className="flex-1 btn-wod bg-slate-800 text-slate-300 border-slate-700 py-3 text-[10px] hover:bg-slate-700"
                    >
                      SALVAR E OCULTAR (1h)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-slate-400 text-sm">Selecione uma dupla para lançar ou editar a nota.</p>
            </div>
          )}

        </form>
      </div>

      {/* History Table */}
      {activeWod && (
        <div className="wod-card p-5 md:p-6 border-white/10">
          <h3 className="font-heading text-lg font-black text-white border-b border-white/10 pb-3 mb-4 flex items-center justify-between">
            <span>Histórico de Notas ({activeWod.name})</span>
            <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">
              {scores.filter(s => s.wodId === activeWod.id).length} lançamentos
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase">Dupla</th>
                  <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase text-center">Score</th>
                  <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase text-center">Tiebreak</th>
                  <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase text-center">Status</th>
                  <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scores.filter(s => s.wodId === activeWod.id).map(score => {
                  const athlete = athletes.find(a => a.id === score.athleteId);
                  
                  // Parse delayed publish time if any
                  let isHidden = false;
                  if (score.timeStr && score.timeStr.includes('|||PUBLISH:')) {
                    const publishAt = parseInt(score.timeStr.split('|||PUBLISH:')[1], 10);
                    if (publishAt > Date.now()) isHidden = true;
                  }

                  return (
                    <tr key={score.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-2">
                        <div className="font-bold text-white text-sm">{athlete?.name || 'Desconhecido'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">#{athlete?.bib}</div>
                      </td>
                      <td className="py-3 px-2 text-center text-slate-300 font-mono text-sm">
                        {score.isCap ? 'CAP' : (score.reps || score.weight || score.rounds || score.timeStr?.split('|||')[0] || '--')}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-400 font-mono text-xs">
                        {score.tiebreakTime || '--'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {isHidden ? (
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                            Oculto
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                            Público
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleAthleteChange(score.athleteId)}
                          className="bg-white/5 hover:bg-white/10 text-white text-xs px-3 py-1.5 rounded transition-colors"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {scores.filter(s => s.wodId === activeWod.id).length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 text-sm">
                      Nenhuma nota lançada para este WOD ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
