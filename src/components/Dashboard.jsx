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
  ShieldCheck
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
    <div className="space-y-8 fade-in">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-8 bg-gradient-to-r from-slate-950 via-slate-900/90 to-[#ccff00]/10 border border-[#ccff00]/20 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Evento de CrossFit Ao Vivo
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-wide leading-none">
            CENTRAL DE GESTÃO DO CAMPEONATO
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Plataforma oficial para cadastro de atletas, provas (WODs), lançamento de notas por juízes e transmissão em tempo real nos telões de arena.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => setActiveTab('leaderboard')}
              className="btn btn-primary"
            >
              <Trophy className="w-4 h-4" /> Ver Leaderboard Oficial
            </button>
            
            {isAdminLoggedIn ? (
              <>
                <button 
                  onClick={() => setActiveTab('judge')}
                  className="btn btn-orange"
                >
                  <ClipboardCheck className="w-4 h-4" /> Lançar Notas (Juiz)
                </button>
                <button 
                  onClick={() => setActiveTab('wods')}
                  className="btn btn-secondary"
                >
                  <PlusCircle className="w-4 h-4" /> Cadastrar WOD
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="btn btn-orange"
              >
                <Lock className="w-4 h-4" /> Entrar como Admin
              </button>
            )}
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 bottom-0 opacity-10 text-white pointer-events-none hidden md:block">
          <Dumbbell className="w-72 h-72 stroke-[1]" />
        </div>
      </div>

      {/* Empty State Banner (If all data is wiped) */}
      {!hasData && (
        <div className="glass-panel p-8 text-center space-y-4 border-orange-500/30 bg-gradient-to-b from-orange-500/5 to-transparent">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto">
            <Dumbbell className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-display text-2xl font-bold text-white">Nenhum dado cadastrado no momento</h3>
            <p className="text-xs text-slate-400">
              O banco de dados foi zerado. Você pode cadastrar novos atletas e WODs pelo menu do Admin ou carregar dados de teste instantaneamente.
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
              <Sparkles className="w-4 h-4 text-[#ccff00]" /> Carregar Dados de Exemplo (Demo)
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Atletas / Times</p>
            <p className="font-display text-3xl font-bold text-white">{athletes.length}</p>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00]">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Provas (WODs)</p>
            <p className="font-display text-3xl font-bold text-white">{wods.length}</p>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Baterias</p>
            <p className="font-display text-3xl font-bold text-white">{heats.length}</p>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Notas Registradas</p>
            <p className="font-display text-3xl font-bold text-white">{scores.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Leaderboard Preview & Heats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaderboard Preview (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#ccff00]" /> Ranking do Evento
              </h2>
              <p className="text-xs text-slate-400">Top 5 atletas por pontuação geral no momento</p>
            </div>

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-control text-xs py-1.5 px-3 bg-slate-900 border-white/20 w-auto"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {standings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <p className="text-sm font-bold">Nenhum atleta ranqueado nesta categoria.</p>
              <p className="text-xs">Cadastre atletas e lance notas para gerar a classificação oficial.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {standings.slice(0, 5).map((item, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                return (
                  <div 
                    key={item.athlete.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all ${
                      isFirst 
                        ? 'bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/40' 
                        : isSecond 
                        ? 'bg-gradient-to-r from-slate-400/20 to-transparent border border-slate-400/40'
                        : isThird
                        ? 'bg-gradient-to-r from-amber-700/20 to-transparent border border-amber-700/40'
                        : 'bg-white/5 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display text-lg font-black ${
                        isFirst ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30' :
                        isSecond ? 'bg-slate-300 text-black' :
                        isThird ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.overallRank}
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          {item.athlete.name}
                          <span className="text-xs font-mono font-normal text-slate-400">#{item.athlete.bib}</span>
                        </h4>
                        <p className="text-xs text-slate-400">{item.athlete.box}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-2xl font-bold text-[#ccff00] leading-none">
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
            className="w-full py-2 text-xs font-bold text-slate-300 hover:text-[#ccff00] flex items-center justify-center gap-1 transition-colors border-t border-white/5 pt-3"
          >
            Abrir Leaderboard Completo do Evento <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sidebar: Active WODs & Upcoming Heats */}
        <div className="space-y-6">
          
          {/* Active WODs Summary */}
          <div className="glass-panel p-5 space-y-3">
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-400" /> Provas Cadastradas
            </h3>
            
            {wods.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Nenhum WOD cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {wods.map(wod => (
                  <div key={wod.id} className="p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{wod.name}</span>
                      <span className="badge badge-lime text-[10px]">{wod.type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{wod.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heats Overview */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-cyan-400" /> Baterias
              </h3>
              {isAdminLoggedIn && (
                <button 
                  onClick={() => setActiveTab('heats')}
                  className="text-xs font-bold text-[#ccff00] hover:underline"
                >
                  Gerenciar
                </button>
              )}
            </div>

            {heats.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Nenhuma bateria agendada.</p>
            ) : (
              <div className="space-y-2">
                {heats.map(heat => (
                  <div key={heat.id} className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
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
