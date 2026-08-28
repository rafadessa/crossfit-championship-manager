import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { calculateOverallStandings } from '../utils/scoring';
import { 
  Users, 
  Dumbbell, 
  Trophy, 
  Timer, 
  Zap, 
  ClipboardCheck, 
  ArrowRight,
  Flame,
  PlusCircle,
  Sparkles,
  Lock,
  Crown,
  Medal,
  Award
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    categories, 
    wods, 
    athletes, 
    scores, 
    heats, 
    setActiveTab, 
    setSelectedCategory,
    selectedCategory,
    isAdminLoggedIn,
    loadSampleData
  } = useTournament();

  const currentCategoryObj = categories.find(c => c.id === selectedCategory) || categories[0];
  const standings = calculateOverallStandings(selectedCategory, athletes, wods, scores);

  const hasData = athletes.length > 0 || wods.length > 0;

  return (
    <div className="space-y-8 fade-in relative">
      
      {/* Background Ambient Light Orbs */}
      <div className="bg-orb-lime top-0 left-1/4"></div>
      <div className="bg-orb-orange top-1/3 right-10"></div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-10 border border-white/15 bg-gradient-to-r from-slate-950 via-slate-900/90 to-[#d4ff00]/10 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] text-xs font-heading font-extrabold uppercase tracking-widest backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff00]"></span>
            </span>
            Plataforma Oficial de Gestão
          </div>
          
          <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
            CAMPEONATO DE <span className="text-gradient-lime">CROSSFIT</span> & ARENA
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Painel em tempo real de resultados, rankings oficiais de pontuação, cronômetro de arena com áudio e transmissão instantânea nos telões.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-3">
            <button 
              onClick={() => setActiveTab('leaderboard')}
              className="btn btn-primary"
            >
              <Trophy className="w-5 h-5 text-black" /> Ver Leaderboard Oficial
            </button>
            
            {isAdminLoggedIn ? (
              <>
                <button 
                  onClick={() => setActiveTab('judge')}
                  className="btn btn-orange"
                >
                  <ClipboardCheck className="w-5 h-5" /> Lançar Notas (Juiz)
                </button>
                <button 
                  onClick={() => setActiveTab('wods')}
                  className="btn btn-secondary"
                >
                  <PlusCircle className="w-5 h-5" /> Criar WOD
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="btn btn-orange"
              >
                <Lock className="w-5 h-5" /> Entrar no Modo Admin
              </button>
            )}
          </div>
        </div>

        {/* Decorative Graphic Icon */}
        <div className="absolute -right-6 -bottom-8 opacity-10 text-white pointer-events-none hidden md:block">
          <Dumbbell className="w-96 h-96 stroke-[1]" />
        </div>
      </div>

      {/* Empty State Banner */}
      {!hasData && (
        <div className="glass-panel p-8 md:p-12 text-center space-y-5 border-orange-500/30 bg-gradient-to-b from-orange-500/10 via-slate-900/40 to-transparent backdrop-blur-xl">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto shadow-xl shadow-orange-500/10">
            <Dumbbell className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-heading text-3xl font-black text-white">Nenhum dado cadastrado</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O campeonato está limpo e pronto para receber seus atletas e provas reais. Cadastre pelo menu Admin ou carregue dados de demonstração para testes.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {isAdminLoggedIn ? (
              <>
                <button 
                  onClick={() => setActiveTab('wods')}
                  className="btn btn-orange btn-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Cadastrar Primeiro WOD
                </button>
                <button 
                  onClick={() => setActiveTab('athletes')}
                  className="btn btn-primary btn-sm"
                >
                  <Users className="w-4 h-4" /> Cadastrar Primeiro Atleta
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="btn btn-orange btn-sm"
              >
                <Lock className="w-4 h-4" /> Entrar no Admin para Cadastrar
              </button>
            )}

            <button 
              onClick={loadSampleData}
              className="btn btn-secondary btn-sm"
            >
              <Sparkles className="w-4 h-4 text-[#d4ff00]" /> Carregar Dados de Exemplo (Demo)
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="glass-panel p-6 flex items-center gap-4 hover:border-blue-500/40 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-heading font-extrabold text-slate-400 uppercase tracking-widest">Competidores</p>
            <p className="font-heading text-4xl font-black text-white">{athletes.length}</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4 hover:border-[#d4ff00]/40 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 flex items-center justify-center text-[#d4ff00] shadow-lg shadow-[#d4ff00]/10">
            <Dumbbell className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-heading font-extrabold text-slate-400 uppercase tracking-widest">Provas (WODs)</p>
            <p className="font-heading text-4xl font-black text-white">{wods.length}</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4 hover:border-orange-500/40 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/10">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-heading font-extrabold text-slate-400 uppercase tracking-widest">Baterias</p>
            <p className="font-heading text-4xl font-black text-white">{heats.length}</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4 hover:border-emerald-500/40 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-heading font-extrabold text-slate-400 uppercase tracking-widest">Notas Registradas</p>
            <p className="font-heading text-4xl font-black text-white">{scores.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Leaderboard Preview & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaderboard Preview (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="font-heading text-3xl font-black text-white flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-[#d4ff00]" /> Ranking em Tempo Real
              </h2>
              <p className="text-xs text-slate-400">Classificação geral calculada pela tabela de pontuação oficial</p>
            </div>

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-control text-xs py-2 px-3 bg-slate-950 border-white/20 w-auto font-heading font-bold text-[#d4ff00]"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {standings.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Trophy className="w-12 h-12 stroke-[1] mx-auto text-slate-600" />
              <p className="text-base font-heading font-bold text-slate-400">Nenhum atleta ranqueado nesta categoria</p>
              <p className="text-xs text-slate-500">Cadastre atletas e lance notas para formar o ranking oficial.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {standings.slice(0, 5).map((item, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                return (
                  <div 
                    key={item.athlete.id}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                      isFirst 
                        ? 'gold-podium-row border border-amber-500/40 shadow-lg shadow-amber-500/10' 
                        : isSecond 
                        ? 'silver-podium-row border border-slate-400/40'
                        : isThird
                        ? 'bronze-podium-row border border-amber-700/40'
                        : 'bg-white/5 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading text-xl font-black shadow-md ${
                        isFirst ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-black shadow-amber-400/40' :
                        isSecond ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-black' :
                        isThird ? 'bg-gradient-to-tr from-amber-700 to-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isFirst ? <Crown className="w-6 h-6 fill-current text-black" /> : item.overallRank}
                      </div>

                      <div>
                        <h4 className="font-heading font-bold text-white text-base flex items-center gap-2">
                          {item.athlete.name}
                          <span className="text-xs font-mono font-normal text-slate-400">#{item.athlete.bib}</span>
                        </h4>
                        <p className="text-xs text-slate-400">{item.athlete.box || 'Independente'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-heading text-3xl font-black text-[#d4ff00] leading-none">
                        {item.totalPoints} <span className="text-xs text-slate-400 font-sans font-medium">pts</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button 
            onClick={() => setActiveTab('leaderboard')}
            className="w-full py-3 text-xs font-heading font-extrabold tracking-wider uppercase text-slate-300 hover:text-[#d4ff00] flex items-center justify-center gap-1.5 transition-colors border-t border-white/10 pt-4"
          >
            Abrir Tabela do Leaderboard Completo <ArrowRight className="w-4 h-4 text-[#d4ff00]" />
          </button>
        </div>

        {/* Sidebar: Active WODs & Heats */}
        <div className="space-y-6">
          
          {/* Active WODs Summary */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-heading text-2xl font-black text-white flex items-center gap-2.5">
              <Dumbbell className="w-5 h-5 text-orange-400" /> Provas do Evento
            </h3>
            
            {wods.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Nenhum WOD cadastrado.</p>
            ) : (
              <div className="space-y-2.5">
                {wods.map(wod => (
                  <div key={wod.id} className="p-3.5 bg-white/5 border border-white/5 rounded-xl hover:border-white/15 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{wod.name}</span>
                      <span className="badge badge-lime text-[9px]">{wod.type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{wod.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heats Overview */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl font-black text-white flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-cyan-400" /> Baterias
              </h3>
              {isAdminLoggedIn && (
                <button 
                  onClick={() => setActiveTab('heats')}
                  className="text-xs font-heading font-extrabold text-[#d4ff00] hover:underline"
                >
                  Gerenciar
                </button>
              )}
            </div>

            {heats.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Nenhuma bateria agendada.</p>
            ) : (
              <div className="space-y-2.5">
                {heats.map(heat => (
                  <div key={heat.id} className="p-3.5 bg-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{heat.name}</p>
                      <p className="text-[11px] text-slate-400">Horário: {heat.startTime} • {heat.lanes.length} raias</p>
                    </div>
                    <span className={`badge ${
                      heat.status === 'completed' ? 'badge-gray' :
                      heat.status === 'running' ? 'badge-orange animate-pulse' : 'badge-lime'
                    }`}>
                      {heat.status === 'completed' ? 'Encerrada' : heat.status === 'running' ? 'AO VIVO' : 'Aguardando'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
