import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { calculateOverallStandings } from '../utils/scoring';
import { X, Flame } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-[#0A0E17] text-white p-6 md:p-10 flex flex-col justify-between overflow-y-auto no-scrollbar animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#FF5500]/40 pb-5">
        
        {/* Event Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF5500] to-[#D4FF00] text-black flex items-center justify-center font-black text-2xl shadow-xl">
            <Flame className="w-8 h-8 fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-3xl font-black tracking-wider text-white">FITSCORE PRO</span>
              <span className="bg-[#FF5500] text-white text-xs font-black px-2 py-0.5 rounded tracking-widest animate-pulse font-heading">
                WODENGAGE TV
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Arena Championship Live Stream</p>
          </div>
        </div>

        {/* Category Indicator Pill */}
        <div className="text-center">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">CATEGORIA EM EXIBIÇÃO</span>
          <span className="font-heading text-3xl font-black text-[#D4FF00] tracking-wide">
            {activeCategory?.name}
          </span>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors flex items-center gap-2 text-xs font-heading font-black"
        >
          <X className="w-5 h-5" /> SAIR DO TELÃO
        </button>

      </div>

      {/* Main Leaderboard Table for TV */}
      <div className="my-6 flex-1 wod-card p-6 border-[#FF5500]/30 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-mono text-sm uppercase">
              <th className="py-4 px-4 w-20 text-center">POS</th>
              <th className="py-4 px-4 w-24 text-center">BIB</th>
              <th className="py-4 px-4 text-xl font-bold text-white">ATLETA / EQUIPE</th>
              <th className="py-4 px-4 text-slate-400">BOX / AFILIADA</th>
              <th className="py-4 px-4 text-right pr-6 font-bold text-[#D4FF00]">PONTUAÇÃO TOTAL</th>
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
                    isFirst ? 'podium-gold' :
                    isSecond ? 'podium-silver' :
                    isThird ? 'podium-bronze' : ''
                  }`}
                >
                  {/* Pos */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading text-2xl font-black ${
                        isFirst ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/40' :
                        isSecond ? 'bg-slate-300 text-black' :
                        isThird ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.overallRank}
                      </span>
                    </div>
                  </td>

                  {/* Bib */}
                  <td className="py-4 px-4 text-center font-mono text-lg font-bold text-[#D4FF00]">
                    #{item.athlete.bib}
                  </td>

                  {/* Name */}
                  <td className="py-4 px-4">
                    <div className="font-heading text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                      {item.athlete.name}
                      {isFirst && <span className="text-2xl">🥇</span>}
                      {isSecond && <span className="text-2xl">🥈</span>}
                      {isThird && <span className="text-2xl">🥉</span>}
                    </div>
                  </td>

                  {/* Box */}
                  <td className="py-4 px-4 text-slate-300 text-lg">
                    {item.athlete.box || 'Independente'}
                  </td>

                  {/* Total Points */}
                  <td className="py-4 px-4 text-right pr-6">
                    <span className="font-heading text-4xl font-black text-[#D4FF00]">
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
        <span className="text-[#FF5500] font-bold animate-pulse">● TRANSMISSÃO AO VIVO DA ARENA</span>
      </div>

    </div>
  );
};
