import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { calculateOverallStandings, calculateWodRankings } from '../utils/scoring';
import { Trophy, Search, Filter, Dumbbell, Award, Download, Printer } from 'lucide-react';

export const Leaderboard = () => {
  const { categories, wods, athletes, scores, selectedCategory, setSelectedCategory } = useTournament();
  
  const [selectedWodId, setSelectedWodId] = useState('OVERALL'); // 'OVERALL' or wod.id
  const [searchTerm, setSearchTerm] = useState('');

  const categoryWods = wods.filter(w => w.category === selectedCategory || w.category === 'ALL');
  const currentCategoryObj = categories.find(c => c.id === selectedCategory);

  // Calculate overall standings
  const overallStandings = calculateOverallStandings(selectedCategory, athletes, wods, scores);

  // Filter overall standings by search term
  const filteredOverall = overallStandings.filter(item => 
    item.athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.athlete.bib.includes(searchTerm) ||
    item.athlete.box.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Selected specific WOD rankings if not OVERALL
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
    <div className="space-y-6 fade-in">
      
      {/* Header Controls */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-7 h-7 text-[#ccff00]" />
              <h1 className="font-display text-3xl font-black text-white tracking-wide">LEADERBOARD OFICIAL</h1>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Classificação geral do evento calculada com o sistema de pontuação oficial CrossFit.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* WOD Selector Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10 pt-4">
          
          {/* View Selection (Overall vs Specific WOD) */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedWodId('OVERALL')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
                selectedWodId === 'OVERALL'
                  ? 'bg-slate-700 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#ccff00]" /> GERAL (OVERALL)
            </button>

            {categoryWods.map(wod => (
              <button
                key={wod.id}
                onClick={() => setSelectedWodId(wod.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  selectedWodId === wod.id
                    ? 'bg-slate-700 text-white border border-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5 text-orange-400" /> {wod.name}
              </button>
            ))}
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar atleta, bib ou box..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-control pl-9 py-1.5 text-xs bg-slate-900"
              />
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
              title="Imprimir Leaderboard"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Leaderboard Table Content */}
      <div className="glass-panel p-1 overflow-hidden">
        
        {/* OVERALL VIEW TABLE */}
        {selectedWodId === 'OVERALL' ? (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="w-16 text-center">POS</th>
                  <th className="w-16 text-center">BIB</th>
                  <th>ATLETA / EQUIPE</th>
                  <th>BOX / AFILIADA</th>
                  {categoryWods.map(wod => (
                    <th key={wod.id} className="text-center min-w-[130px]">
                      <div className="text-[11px] font-bold text-slate-300">{wod.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono font-normal">({wod.type})</div>
                    </th>
                  ))}
                  <th className="text-right pr-6 min-w-[120px]">PONTOS TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredOverall.length === 0 ? (
                  <tr>
                    <td colSpan={5 + categoryWods.length} className="text-center py-12 text-slate-500">
                      Nenhum resultado encontrado para esta categoria ou busca.
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
                          isFirst ? 'bg-amber-500/10 hover:bg-amber-500/15' :
                          isSecond ? 'bg-slate-300/10 hover:bg-slate-300/15' :
                          isThird ? 'bg-amber-700/10 hover:bg-amber-700/15' : ''
                        }`}
                      >
                        {/* Rank Position */}
                        <td className="text-center font-bold">
                          <div className="flex items-center justify-center">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-display text-lg font-black ${
                              isFirst ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30' :
                              isSecond ? 'bg-slate-300 text-black' :
                              isThird ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {item.overallRank}
                            </span>
                          </div>
                        </td>

                        {/* Bib Number */}
                        <td className="text-center font-mono text-xs font-bold text-[#ccff00]">
                          #{item.athlete.bib}
                        </td>

                        {/* Athlete Name */}
                        <td>
                          <div className="font-bold text-white flex items-center gap-2">
                            {item.athlete.name}
                            {isFirst && <span className="text-amber-400 text-xs">🥇</span>}
                            {isSecond && <span className="text-slate-300 text-xs">🥈</span>}
                            {isThird && <span className="text-amber-600 text-xs">🥉</span>}
                          </div>
                        </td>

                        {/* Box */}
                        <td className="text-slate-400 text-xs">{item.athlete.box}</td>

                        {/* WOD Breakdowns */}
                        {categoryWods.map(wod => {
                          const wData = item.wodBreakdown[wod.id];
                          return (
                            <td key={wod.id} className="text-center">
                              {wData && wData.scoreDisplay !== 'N/A' ? (
                                <div className="space-y-0.5">
                                  <div className="text-xs font-bold text-white">{wData.scoreDisplay}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    {wData.rank}º lugar ({wData.points} pts)
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-600 font-mono">--</span>
                              )}
                            </td>
                          );
                        })}

                        {/* Total Points */}
                        <td className="text-right pr-6">
                          <span className="font-display text-2xl font-black text-[#ccff00]">
                            {item.totalPoints}
                          </span>
                          <span className="text-xs font-mono text-slate-400 ml-1">pts</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* SPECIFIC WOD VIEW TABLE */
          <div className="custom-table-container">
            <div className="p-4 bg-slate-900 border-b border-white/10 space-y-1">
              <h3 className="font-display text-xl font-bold text-white">{activeWod?.name}</h3>
              <p className="text-xs text-slate-400">{activeWod?.description}</p>
              {activeWod?.standards && (
                <p className="text-xs text-[#ccff00] font-mono mt-1">Padrões: {activeWod.standards}</p>
              )}
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th className="w-16 text-center">POS</th>
                  <th className="w-16 text-center">BIB</th>
                  <th>ATLETA</th>
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
                        <span className="font-display text-lg text-white">{item.rank}</span>
                      </td>
                      <td className="text-center font-mono text-xs font-bold text-[#ccff00]">
                        #{item.athlete.bib}
                      </td>
                      <td className="font-bold text-white">{item.athlete.name}</td>
                      <td className="text-slate-400 text-xs">{item.athlete.box}</td>
                      <td className="text-center">
                        <span className="font-mono text-sm font-bold text-white bg-slate-800 px-3 py-1 rounded-md border border-white/10">
                          {item.scoreDisplay}
                        </span>
                      </td>
                      <td className="text-center text-xs font-mono text-slate-400">
                        {item.tiebreakDisplay}
                      </td>
                      <td className="text-right pr-6">
                        <span className="font-display text-xl font-bold text-[#ccff00]">
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
