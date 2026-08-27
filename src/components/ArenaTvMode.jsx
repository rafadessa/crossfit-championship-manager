import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { calculateOverallStandings } from '../utils/scoring';
import { Trophy, Tv, X, Flame, Dumbbell } from 'lucide-react';

export const ArenaTvMode = () => {
  const { categories, wods, athletes, scores, setActiveTab } = useTournament();

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const activeCategory = categories[currentCategoryIndex] || categories[0];

  // Auto-rotate categories on TV screen every 15 seconds
  useEffect(() => {
    if (categories.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [categories.length]);

  const standings = calculateOverallStandings(activeCategory?.id, athletes, wods, scores);

  return (
    <div className="fixed inset-0 z-50 bg-[#05070a] text-white p-6 md:p-10 flex flex-col justify-between overflow-y-auto no-scrollbar fade-in">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#ccff00]/40 pb-6">
        
        {/* Event Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#ccff00] text-black flex items-center justify-center font-black text-2xl shadow-xl shadow-[#ccff00]/30">
            <Dumbbell className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-4xl font-black tracking-wider text-white">FITSCORE PRO</span>
              <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded tracking-widest animate-pulse">AO VIVO</span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">CrossFit Games Official Leaderboard</p>
          </div>
        </div>

        {/* Category Indicator Pill */}
        <div className="text-center">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">CATEGORIA EM EXIBIÇÃO</span>
          <span className="font-display text-4xl font-black text-[#ccff00] tracking-wide">
            {activeCategory?.name}
          </span>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors flex items-center gap-2 text-xs font-bold"
        >
          <X className="w-5 h-5" /> FECHAR MODAL TELÃO
        </button>

      </div>

      {/* Main Leaderboard Table for TV */}
      <div className="my-8 flex-1 glass-panel p-6 border-[#ccff00]/20 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-mono text-sm uppercase">
              <th className="py-4 px-4 w-20 text-center">POS</th>
              <th className="py-4 px-4 w-24 text-center">BIB</th>
              <th className="py-4 px-4 text-xl font-bold text-white">ATLETA / EQUIPE</th>
              <th className="py-4 px-4 text-slate-400">BOX / AFILIADA</th>
              <th className="py-4 px-4 text-right pr-6 font-bold text-[#ccff00]">PONTUAÇÃO TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.slice(0, 8).map((item) => {
              const isFirst = item.overallRank === 1;
              const isSecond = item.overallRank === 2;
              const isThird = item.overallRank === 3;

              return (
                <tr 
                  key={item.athlete.id}
                  className={`transition-all ${
                    isFirst ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent font-bold' :
                    isSecond ? 'bg-gradient-to-r from-slate-400/20 via-slate-400/10 to-transparent' :
                    isThird ? 'bg-gradient-to-r from-amber-700/20 via-amber-700/10 to-transparent' : ''
                  }`}
                >
                  {/* Pos */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-display text-2xl font-black ${
                        isFirst ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/40' :
                        isSecond ? 'bg-slate-300 text-black' :
                        isThird ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.overallRank}
                      </span>
                    </div>
                  </td>

                  {/* Bib */}
                  <td className="py-4 px-4 text-center font-mono text-lg font-bold text-[#ccff00]">
                    #{item.athlete.bib}
                  </td>

                  {/* Name */}
                  <td className="py-4 px-4">
                    <div className="font-display text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                      {item.athlete.name}
                      {isFirst && <span className="text-2xl">🥇</span>}
                      {isSecond && <span className="text-2xl">🥈</span>}
                      {isThird && <span className="text-2xl">🥉</span>}
                    </div>
                  </td>

                  {/* Box */}
                  <td className="py-4 px-4 text-slate-300 text-lg">
                    {item.athlete.box}
                  </td>

                  {/* Total Points */}
                  <td className="py-4 px-4 text-right pr-6">
                    <span className="font-display text-4xl font-black text-[#ccff00]">
                      {item.totalPoints}
                    </span>
                    <span className="text-sm font-mono text-slate-400 ml-1">pts</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer ticker */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/10 pt-4">
        <span>Transmissão Oficial de Resultados • FitScore Pro</span>
        <span className="text-[#ccff00] animate-pulse">Atualização em tempo real ativada</span>
      </div>

    </div>
  );
};
