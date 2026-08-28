import React, { useState, useEffect, useRef } from 'react';
import { useTournament } from '../context/TournamentContext';
import { timerAudio } from '../utils/audio';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Minus, BellRing } from 'lucide-react';
import { formatTime } from '../utils/scoring';

export const ArenaTimer = () => {
  const { activeHeatForTimer, wods, athletes } = useTournament();

  const activeWod = wods.find(w => w.id === activeHeatForTimer?.wodId) || wods[0];
  const defaultCap = activeWod ? activeWod.timeCap : 600; // 10 mins default

  const [timeCapSeconds, setTimeCapSeconds] = useState(defaultCap);
  const [secondsLeft, setSecondsLeft] = useState(defaultCap);
  const [timerState, setTimerState] = useState('STOPPED'); // 'STOPPED' | 'PREP' | 'RUNNING' | 'FINISHED'
  const [prepSeconds, setPrepSeconds] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef(null);

  // Sync when active WOD changes
  useEffect(() => {
    if (activeWod) {
      setTimeCapSeconds(activeWod.timeCap);
      setSecondsLeft(activeWod.timeCap);
      setTimerState('STOPPED');
    }
  }, [activeWod?.id]);

  // Main Timer Loop
  useEffect(() => {
    if (timerState === 'PREP') {
      intervalRef.current = setInterval(() => {
        setPrepSeconds(prev => {
          if (prev <= 1) {
            if (soundEnabled) timerAudio.playGoTone();
            setTimerState('RUNNING');
            return 10;
          } else {
            if (soundEnabled && prev <= 4) timerAudio.playCountdownBeep();
            return prev - 1;
          }
        });
      }, 1000);
    } else if (timerState === 'RUNNING') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            if (soundEnabled) timerAudio.playTimeCapHorn();
            setTimerState('FINISHED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerState, soundEnabled]);

  const handleStartPrep = () => {
    if (soundEnabled) timerAudio.playCountdownBeep();
    setPrepSeconds(10);
    setTimerState('PREP');
  };

  const handlePause = () => {
    setTimerState('STOPPED');
  };

  const handleReset = () => {
    setTimerState('STOPPED');
    setSecondsLeft(timeCapSeconds);
    setPrepSeconds(10);
  };

  const adjustCap = (deltaSeconds) => {
    const newCap = Math.max(10, timeCapSeconds + deltaSeconds);
    setTimeCapSeconds(newCap);
    if (timerState === 'STOPPED') {
      setSecondsLeft(newCap);
    }
  };

  // Format Elapsed vs Remaining
  const elapsedTime = timeCapSeconds - secondsLeft;

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl mx-auto">
      
      {/* Timer Container Card */}
      <div className={`relative overflow-hidden rounded-2xl wod-card p-6 md:p-10 border transition-all duration-300 ${
        timerState === 'PREP' ? 'bg-amber-950/80 border-amber-500 shadow-2xl shadow-amber-500/30' :
        timerState === 'RUNNING' ? 'bg-[#0A0E17] border-[#FF5500] shadow-2xl shadow-[#FF5500]/20' :
        timerState === 'FINISHED' ? 'bg-red-950 border-red-500 animate-pulse' :
        'bg-[#0A0E17]'
      }`}>
        
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="wod-chip bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30 text-[10px]">
              {activeHeatForTimer ? activeHeatForTimer.name : 'MODO TREINO / ARENA'}
            </span>
            <h2 className="font-heading text-2xl font-black text-white tracking-wide mt-1">
              {activeWod ? activeWod.name : 'CRONÔMETRO ARENA'}
            </h2>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-heading font-extrabold transition-all ${
              soundEnabled ? 'bg-[#D4FF00]/15 border-[#D4FF00]/30 text-[#D4FF00]' : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'SOM ATIVADO' : 'MUTADO'}
          </button>
        </div>

        {/* Massive Display Area */}
        <div className="py-10 flex flex-col items-center justify-center text-center">
          
          {/* PREP COUNTDOWN DISPLAY */}
          {timerState === 'PREP' ? (
            <div className="space-y-2 animate-fade-in">
              <p className="text-amber-400 font-heading text-2xl font-black tracking-widest animate-bounce uppercase">
                PREPARE-SE!
              </p>
              <div className="font-heading text-9xl font-black text-amber-300 drop-shadow-[0_0_50px_rgba(245,158,11,0.8)]">
                {prepSeconds}
              </div>
            </div>
          ) : timerState === 'FINISHED' ? (
            <div className="space-y-2 animate-fade-in">
              <p className="text-red-400 font-heading text-2xl font-black tracking-widest uppercase">
                TIME CAP EXCEDIDO!
              </p>
              <div className="font-mono text-8xl md:text-9xl font-black text-red-500 tracking-tighter">
                00:00
              </div>
            </div>
          ) : (
            /* REGULAR TIMER DISPLAY */
            <div className="space-y-3">
              <div className="font-mono text-7xl sm:text-8xl md:text-[130px] font-black text-[#D60036] tracking-tighter leading-none drop-shadow-[0_0_40px_rgba(214,0,54,0.5)]">
                {formatTime(secondsLeft)}
              </div>

              <div className="flex items-center justify-center gap-6 font-mono text-xs text-slate-400">
                <span>Decorrido: <strong className="text-white">{formatTime(elapsedTime)}</strong></span>
                <span>Cap Máximo: <strong className="text-white">{formatTime(timeCapSeconds)}</strong></span>
              </div>
            </div>
          )}

        </div>

        {/* Timer Control Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-5">
          
          {/* Adjust Cap Time Buttons */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => adjustCap(-60)}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1"
              title="-1 Minuto"
            >
              <Minus className="w-3.5 h-3.5" /> 1m
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-2 font-bold">CAP</span>
            <button
              onClick={() => adjustCap(60)}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1"
              title="+1 Minuto"
            >
              <Plus className="w-3.5 h-3.5" /> 1m
            </button>
          </div>

          {/* Primary Action Buttons */}
          {timerState === 'STOPPED' || timerState === 'FINISHED' ? (
            <button
              onClick={handleStartPrep}
              className="btn-wod btn-wod-citrus btn-lg text-sm"
            >
              <Play className="w-5 h-5 fill-current text-black" /> INICIAR (3, 2, 1... GO!)
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="btn-wod btn-wod-primary btn-lg text-sm"
            >
              <Pause className="w-5 h-5 fill-current" /> PAUSAR CRONÔMETRO
            </button>
          )}

          <button
            onClick={handleReset}
            className="btn-wod btn-wod-secondary btn-lg text-sm"
          >
            <RotateCcw className="w-4 h-4" /> REINICIAR
          </button>

        </div>

      </div>

      {/* Active Heat Lanes Quick Card */}
      {activeHeatForTimer && (
        <div className="wod-card p-5 space-y-3">
          <h3 className="font-heading text-lg font-black text-white flex items-center gap-2">
            <BellRing className="w-4 h-4 text-[#FF5500]" /> Raias da Bateria ({activeHeatForTimer.name})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {activeHeatForTimer.lanes.map(lane => {
              const athlete = athletes.find(a => a.id === lane.athleteId);
              return (
                <div key={lane.lane} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-black text-[#D4FF00]">RAIA {lane.lane}</span>
                  <p className="font-heading font-black text-white text-sm truncate">{athlete ? athlete.name : 'Livre'}</p>
                  {athlete && (
                    <p className="text-[10px] text-slate-400">#{athlete.bib} • {athlete.box}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
