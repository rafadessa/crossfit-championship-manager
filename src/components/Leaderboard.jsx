import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { calculateOverallStandings, calculateWodRankings } from '../utils/scoring';
import { Trophy, Search, Dumbbell, Award, Printer, Crown, Sparkles } from 'lucide-react';

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
    <div className="space-y-6 fade-in">
      
      {/* Header Controls */}
      <div className="glass-panel p-6 md:p-8 space-y-5 border-white/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d4ff00] to-[#00f5d4] text-black flex items-center justify-center font-black shadow-lg shadow-[#d4ff00]/20">
                <Trophy className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-black text-white tracking-wide">LEADERBOARD OFICIAL</h1>
                <p className="text-slate-400 text-xs mt-0.5">
                  Pontuação acumulada em tempo real calculada pela tabela de posições oficial.
                </p>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-extrabold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#d4ff00] to-[#b3e600] text-black shadow-lg shadow-[#d4ff00]/25 font-black'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* WOD Selector Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10 pt-5">
          
          {/* View Selection (Overall vs Specific WOD) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedWodId('OVERALL')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-extrabold flex items-center gap-2 transition-all ${
                selectedWodId === 'OVERALL'
                  ? 'bg-slate-800 text-white border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4 text-[#d4ff00]" /> CLASSIFICAÇÃO GERAL
            </button>

            {categoryWods.map(wod => (
              <button
                key={wod.id}
                onClick={() => setSelectedWodId(wod.id)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-extrabold flex items-center gap-2 transition-all ${
                  selectedWodId === wod.id
                    ? 'bg-slate-800 text-white border border-white/20 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-orange-400" /> {wod.name}
              </button>
            ))}
          </div>

          {/* Search Bar & Print */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar atleta, bib ou box..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-control pl-10 py-2 text-xs bg-slate-950/80"
              />
            </div>

            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Imprimir Tabela"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Leaderboard Table Content */}
      <div className="glass-panel overflow-hidden border-white/15">
        
        {/* OVERALL VIEW TABLE */}
        {selectedWodId === 'OVERALL' ? (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="w-20 text-center">POS</th>
                  <th className="w-20 text-center">BIB</th>
                  <th>ATLETA / EQUIPE</th>
                  <th>BOX / AFILIADA</th>
                  {categoryWods.map(wod => (
                    <th key={wod.id} className="text-center min-w-[140px]">
                      <div className="text-xs font-heading font-extrabold text-slate-200">{wod.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">({wod.type})</div>
                    </th>
                  ))}
                  <th className="text-right pr-8 min-w-[140px]">PONTOS TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredOverall.length === 0 ? (
                  <tr>
                    <td colSpan={5 + categoryWods.length} className="text-center py-16 text-slate-500">
                      Nenhum atleta cadastrado ou ranqueado nesta categoria.
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
                          isFirst ? 'gold-podium-row' :
                          isSecond ? 'silver-podium-row' :
                          isThird ? 'bronze-podium-row' : ''
                        }`}
                      >
                        {/* Rank Position */}
                        <td className="text-center font-bold">
                          <div className="flex items-center justify-center">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading text-xl font-black ${
                              isFirst ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-black shadow-lg shadow-amber-400/30' :
                              isSecond ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-black' :
                              isThird ? 'bg-gradient-to-tr from-amber-700 to-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {isFirst ? <Crown className="w-5 h-5 fill-current text-black" /> : item.overallRank}
                            </span>
                          </div>
                        </td>

                        {/* Bib Number */}
                        <td className="text-center font-mono text-xs font-bold text-[#d4ff00]">
                          #{item.athlete.bib}
                        </td>

                        {/* Athlete Name */}
                        <td>
                          <div className="font-heading font-extrabold text-white text-base flex items-center gap-2">
                            {item.athlete.name}
                            {isFirst && <span className="text-amber-400 text-sm">🥇</span>}
                            {isSecond && <span className="text-slate-300 text-sm">🥈</span>}
                            {isThird && <span className="text-amber-600 text-sm">🥉</span>}
                          </div>
                        </td>

                        {/* Box */}
                        <td className="text-slate-400 text-xs font-medium">{item.athlete.box || 'Independente'}</td>

                        {/* WOD Breakdowns */}
                        {categoryWods.map(wod => {
                          const wData = item.wodBreakdown[wod.id];
                          return (
                            <td key={wod.id} className="text-center">
                              {wData && wData.scoreDisplay !== 'N/A' ? (
                                <div className="space-y-0.5">
                                  <div className="text-xs font-bold text-white">{wData.scoreDisplay}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    {wData.rank}º ({wData.points} pts)
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-600 font-mono">--</span>
                              )}
                            </td>
                          );
                        })}

                        {/* Total Points */}
                        <td className="text-right pr-8">
                          <span className="font-heading text-3xl font-black text-[#d4ff00]">
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
            <div className="p-5 bg-slate-950 border-b border-white/10 space-y-1">
              <h3 className="font-heading text-2xl font-black text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-orange-400" /> {activeWod?.name}
              </h3>
              <p className="text-xs text-slate-400">{activeWod?.description}</p>
              {activeWod?.standards && (
                <p className="text-xs text-[#d4ff00] font-mono mt-1">Padrões: {activeWod.standards}</p>
              )}
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th className="w-20 text-center">POS</th>
                  <th className="w-20 text-center">BIB</th>
                  <th>ATLETA</th>
                  <th>BOX</th>
                  <th className="text-center">RESULTADO PROVA</th>
                  <th className="text-center">TIE-BREAK</th>
                  <th className="text-right pr-8">PONTOS CONQUISTADOS</th>
                </tr>
              </thead>
              <tbody>
                {filteredWodRankings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-500">
                      Nenhum resultado registrado para esta prova.
                    </td>
                  </tr>
                ) : (
                  filteredWodRankings.map((item) => (
                    <tr key={item.athlete.id}>
                      <td className="text-center font-bold">
                        <span className="font-heading text-xl text-white">{item.rank}</span>
                      </td>
                      <td className="text-center font-mono text-xs font-bold text-[#d4ff00]">
                        #{item.athlete.bib}
                      </td>
                      <td className="font-heading font-extrabold text-white text-base">{item.athlete.name}</td>
                      <td className="text-slate-400 text-xs">{item.athlete.box || 'Independente'}</td>
                      <td className="text-center">
                        <span className="font-mono text-sm font-bold text-white bg-slate-900 px-3.5 py-1.5 rounded-lg border border-white/10">
                          {item.scoreDisplay}
                        </span>
                      </td>
                      <td className="text-center text-xs font-mono text-slate-400">
                        {item.tiebreakDisplay}
                      </td>
                      <td className="text-right pr-8">
                        <span className="font-heading text-2xl font-black text-[#d4ff00]">
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
