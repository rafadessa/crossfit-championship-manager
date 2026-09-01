import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { calculateOverallStandings, calculateWodRankings } from '../utils/scoring';
import { Trophy, Search, Dumbbell, Award, Printer, Crown, Sparkles, SlidersHorizontal } from 'lucide-react';

export const Leaderboard = () => {
  const { categories, wods, athletes, scores, selectedCategory, setSelectedCategory } = useTournament();
  
  const [selectedWodId, setSelectedWodId] = useState('OVERALL');
  const [searchTerm, setSearchTerm] = useState('');

  const categoryWods = wods.filter(w => w.category === selectedCategory || w.category === 'ALL');
  const currentCategoryObj = categories.find(c => c.id === selectedCategory);

  const overallStandings = calculateOverallStandings(selectedCategory, athletes, wods, scores);

  const filteredOverall = overallStandings.filter(item => 
    item.athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.athlete.bib.includes(searchTerm) ||
    item.athlete.box.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeWod = wods.find(w => w.id === selectedWodId);
  const wodRankings = activeWod ? calculateWodRankings(activeWod, athletes, scores) : [];
  const filteredWodRankings = wodRankings.filter(item =>
    item.athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.athlete.bib.includes(searchTerm) ||
    item.athlete.box.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Controls - WodEngage Style */}
      <div className="wod-card p-5 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#D60036] to-slate-200 text-white flex items-center justify-center font-black shadow-lg">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-black text-white tracking-wide">LEADERBOARD AO VIVO</h1>
              <p className="text-slate-400 text-xs">
                Ranking oficial de pontuação acumulada por categoria
              </p>
            </div>
          </div>

          {/* Category Filter Pills (Sliding Chips on Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-extrabold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#D60036] to-[#990024] text-white shadow-md font-black'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* WOD Selector Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-white/10 pt-4">
          
          {/* View Selection (Overall vs Specific WOD) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedWodId('OVERALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                selectedWodId === 'OVERALL'
                  ? 'bg-slate-800 text-white border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4 text-red-400" /> CLASSIFICAÇÃO GERAL
            </button>

            {categoryWods.map(wod => (
              <button
                key={wod.id}
                onClick={() => setSelectedWodId(wod.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-heading font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
                  selectedWodId === wod.id
                    ? 'bg-slate-800 text-white border border-white/20 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-[#D60036]" /> {wod.name}
              </button>
            ))}
          </div>

          {/* Search Bar & Print */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar dupla, bib ou box..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0B0D12] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#D60036]"
              />
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Imprimir Tabela"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE CARDS VIEW (Visible on small screens) */}
      <div className="block md:hidden space-y-3">
        {selectedWodId === 'OVERALL' ? (
          filteredOverall.length === 0 ? (
            <div className="wod-card p-8 text-center text-slate-500 text-xs">
              Nenhuma dupla nesta categoria.
            </div>
          ) : (
            filteredOverall.map((item) => {
              const isFirst = item.overallRank === 1;
              const isSecond = item.overallRank === 2;
              const isThird = item.overallRank === 3;

              return (
                <div 
                  key={item.athlete.id}
                  className={`wod-card p-4 space-y-3 ${
                    isFirst ? 'podium-gold border-amber-500/40' :
                    isSecond ? 'podium-silver border-slate-400/40' :
                    isThird ? 'podium-bronze border-amber-700/40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading text-sm font-black ${
                        isFirst ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-black' :
                        isSecond ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-black' :
                        isThird ? 'bg-gradient-to-tr from-amber-700 to-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isFirst ? <Crown className="w-4 h-4 fill-current text-black" /> : item.overallRank}
                      </div>

                      <div>
                        <h4 className="font-heading font-black text-white text-sm">
                          {item.athlete.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          #{item.athlete.bib} • {item.athlete.box || 'Independente'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-heading text-2xl font-black text-[#D4FF00]">
                        {item.totalPoints} <span className="text-[10px] text-slate-400">pts</span>
                      </p>
                    </div>
                  </div>

                  {/* WOD Chips breakdown */}
                  {categoryWods.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10">
                      {categoryWods.map(wod => {
                        const wData = item.wodBreakdown[wod.id];
                        return (
                          <div key={wod.id} className="bg-white/5 p-2 rounded-lg text-left">
                            <p className="text-[10px] text-slate-400 font-bold truncate">{wod.name}</p>
                            <p className="text-xs font-bold text-white font-mono">
                              {wData && wData.scoreDisplay !== 'N/A' ? wData.scoreDisplay : '--'}
                            </p>
                            <p className="text-[9px] text-[#D4FF00] font-mono">
                              {wData && wData.scoreDisplay !== 'N/A' ? `${wData.rank}º (${wData.points} pts)` : 'Sem nota'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : (
          filteredWodRankings.length === 0 ? (
            <div className="wod-card p-8 text-center text-slate-500 text-xs">
              Nenhum resultado registrado para esta prova.
            </div>
          ) : (
            filteredWodRankings.map((item) => (
              <div key={item.athlete.id} className="wod-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-heading text-sm font-black text-white">
                    {item.rank}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-white text-sm">{item.athlete.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">#{item.athlete.bib} • {item.athlete.box || 'Independente'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-white/10">
                    {item.scoreDisplay}
                  </span>
                  <p className="text-xs font-heading font-black text-[#D4FF00] mt-1">+{item.points} pts</p>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Visible on medium+ screens) */}
      <div className="hidden md:block wod-card overflow-hidden">
        {selectedWodId === 'OVERALL' ? (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="w-16 text-center">POS</th>
                  <th className="w-16 text-center">BIB</th>
                  <th>DUPLA / EQUIPE</th>
                  <th>BOX / AFILIADA</th>
                  {categoryWods.map(wod => (
                    <th key={wod.id} className="text-center min-w-[120px]">
                      <div className="text-xs font-heading font-extrabold text-slate-200">{wod.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono font-normal">({wod.type})</div>
                    </th>
                  ))}
                  <th className="text-right pr-6 min-w-[120px]">PONTOS TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredOverall.length === 0 ? (
                  <tr>
                    <td colSpan={5 + categoryWods.length} className="text-center py-12 text-slate-500">
                      Nenhuma dupla cadastrada nesta categoria.
                    </td>
                  </tr>
                ) : (
                  filteredOverall.map((item) => {
                    const isFirst = item.overallRank === 1;
                    const isSecond = item.overallRank === 2;
                    const isThird = item.overallRank === 3;

                    return (
                      <tr 
                        key={item.athlete.id}
                        className={`transition-colors ${
                          isFirst ? 'podium-gold' :
                          isSecond ? 'podium-silver' :
                          isThird ? 'podium-bronze' : ''
                        }`}
                      >
                        <td className="text-center font-bold">
                          <div className="flex items-center justify-center">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading text-sm font-black ${
                              isFirst ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-black' :
                              isSecond ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-black' :
                              isThird ? 'bg-gradient-to-tr from-amber-700 to-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {isFirst ? <Crown className="w-4 h-4 fill-current text-black" /> : item.overallRank}
                            </span>
                          </div>
                        </td>

                        <td className="text-center font-mono text-xs font-bold text-[#D4FF00]">
                          #{item.athlete.bib}
                        </td>

                        <td>
                          <div className="font-heading font-extrabold text-white text-sm flex items-center gap-2">
                            {item.athlete.name}
                            {isFirst && <span className="text-amber-400 text-xs">🥇</span>}
                            {isSecond && <span className="text-slate-300 text-xs">🥈</span>}
                            {isThird && <span className="text-amber-600 text-xs">🥉</span>}
                          </div>
                        </td>

                        <td className="text-slate-400 text-xs">{item.athlete.box || 'Independente'}</td>

                        {categoryWods.map(wod => {
                          const wData = item.wodBreakdown[wod.id];
                          return (
                            <td key={wod.id} className="text-center">
                              {wData && wData.scoreDisplay !== 'N/A' ? (
                                <div>
                                  <div className="text-xs font-bold text-white">{wData.scoreDisplay}</div>
                                  <div className="text-[9px] text-[#D4FF00] font-mono">
                                    {wData.rank}º ({wData.points} pts)
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-600 font-mono">--</span>
                              )}
                            </td>
                          );
                        })}

                        <td className="text-right pr-6">
                          <span className="font-heading text-2xl font-black text-[#D4FF00]">
                            {item.totalPoints}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 ml-1">pts</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="custom-table-container">
            <div className="p-4 bg-[#0B0D12] border-b border-white/10 space-y-1">
              <h3 className="font-heading text-xl font-black text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#D60036]" /> {activeWod?.name}
              </h3>
              <p className="text-xs text-slate-400">{activeWod?.description}</p>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th className="w-16 text-center">POS</th>
                  <th className="w-16 text-center">BIB</th>
                  <th>DUPLA</th>
                  <th>BOX</th>
                  <th className="text-center">RESULTADO PROVA</th>
                  <th className="text-center">TIE-BREAK</th>
                  <th className="text-right pr-6">PONTOS CONQUISTADOS</th>
                </tr>
              </thead>
              <tbody>
                {filteredWodRankings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      Nenhum resultado registrado para esta prova.
                    </td>
                  </tr>
                ) : (
                  filteredWodRankings.map((item) => (
                    <tr key={item.athlete.id}>
                      <td className="text-center font-bold">
                        <span className="font-heading text-lg text-white">{item.rank}</span>
                      </td>
                      <td className="text-center font-mono text-xs font-bold text-[#D4FF00]">
                        #{item.athlete.bib}
                      </td>
                      <td className="font-heading font-extrabold text-white text-sm">{item.athlete.name}</td>
                      <td className="text-slate-400 text-xs">{item.athlete.box || 'Independente'}</td>
                      <td className="text-center">
                        <span className="font-mono text-xs font-bold text-white bg-slate-900 px-3 py-1 rounded border border-white/10">
                          {item.scoreDisplay}
                        </span>
                      </td>
                      <td className="text-center text-xs font-mono text-slate-400">
                        {item.tiebreakDisplay}
                      </td>
                      <td className="text-right pr-6">
                        <span className="font-heading text-xl font-black text-[#D4FF00]">
                          +{item.points} pts
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
