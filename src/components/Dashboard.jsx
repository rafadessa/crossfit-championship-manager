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
  Download
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
    loadSampleData,
    triggerPwaInstall,
    exportTournamentData,
    importTournamentData
  } = useTournament();

  const currentCategoryObj = categories.find(c => c.id === selectedCategory) || categories[0];
  const standings = calculateOverallStandings(selectedCategory, athletes, wods, scores);

  const hasData = athletes.length > 0 || wods.length > 0;

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importTournamentData(json);
      } catch (err) {
        alert('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* CrossGames GTI Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl wod-card p-6 md:p-10 border border-white/15 bg-gradient-to-r from-[#0B0D12] via-[#121620] to-[#D60036]/20 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D60036]/20 border border-[#D60036]/40 text-[#D60036] text-[11px] font-heading font-black uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D60036] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D60036]"></span>
                </span>
                CROSSGAMES GTI LIVE
              </span>

              <button 
                onClick={triggerPwaInstall}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-100 text-[11px] font-heading font-black uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Instalar App Mobile
              </button>
            </div>
            
            <h1 className="font-heading text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
              CAMPEONATO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D60036] to-slate-200">CROSSGAMES GTI</span>
            </h1>
            
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
              Gestão oficial de leaderboard em tempo real, baterias de duplas, área do juiz responsiva para celular e cronômetro com aviso sonoro para arena.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className="btn-wod btn-wod-primary"
              >
                <Trophy className="w-4 h-4" /> Ver Leaderboard Ao Vivo
              </button>
              
              {isAdminLoggedIn ? (
                <>
                  <button 
                    onClick={() => setActiveTab('judge')}
                    className="btn-wod btn-wod-silver"
                  >
                    <ClipboardCheck className="w-4 h-4 text-black" /> Lançar Notas
                  </button>
                  <button 
                    onClick={() => setActiveTab('wods')}
                    className="btn-wod btn-wod-secondary"
                  >
                    <PlusCircle className="w-4 h-4" /> Cadastrar WOD
                  </button>
                  <button
                    onClick={exportTournamentData}
                    className="btn-wod bg-slate-800 text-slate-200 border border-white/20 hover:bg-slate-700"
                    title="Exportar backup dos dados em arquivo JSON"
                  >
                    <Download className="w-4 h-4 text-amber-400" /> Exportar Backup
                  </button>
                  <label className="btn-wod bg-slate-800 text-slate-200 border border-white/20 hover:bg-slate-700 cursor-pointer">
                    📥 Importar Backup
                    <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                  </label>
                </>
              ) : (
                <button 
                  onClick={() => setActiveTab('login')}
                  className="btn-wod btn-wod-secondary"
                >
                  <Lock className="w-4 h-4 text-red-400" /> Acesso Admin
                </button>
              )}
            </div>
          </div>

          {/* Logo Emblem Display */}
          <div className="shrink-0 w-36 h-36 md:w-48 md:h-48 relative flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl group hover:scale-105 transition-transform">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#D60036]/40 to-white/20 rounded-3xl blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src="/logo.png" 
              alt="CrossGames GTI Logo" 
              className="relative w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(214,0,54,0.4)]" 
            />
          </div>
        </div>

        {/* Decorative Graphic Icon */}
        <div className="absolute -right-8 -bottom-10 opacity-10 text-white pointer-events-none hidden md:block">
          <Flame className="w-96 h-96 stroke-[1]" />
        </div>
      </div>

      {/* Empty State Banner */}
      {!hasData && (
        <div className="wod-card p-6 md:p-10 text-center space-y-4 border-[#D60036]/30 bg-gradient-to-b from-[#D60036]/10 via-[#121620] to-transparent">
          <div className="w-14 h-14 rounded-2xl bg-[#D60036]/20 border border-[#D60036]/40 flex items-center justify-center text-[#D60036] mx-auto shadow-xl">
            <Dumbbell className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-heading text-2xl font-black text-white">Nenhum dado cadastrado</h3>
            <p className="text-xs text-slate-400">
              O campeonato está limpo e pronto. Cadastre seus WODs e duplas ou carregue a demonstração para testar.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {isAdminLoggedIn ? (
              <>
                <button 
                  onClick={() => setActiveTab('wods')}
                  className="btn-wod btn-wod-primary text-xs py-2 px-4"
                >
                  <PlusCircle className="w-4 h-4" /> Criar WOD
                </button>
                <button 
                  onClick={() => setActiveTab('athletes')}
                  className="btn-wod btn-wod-silver text-xs py-2 px-4"
                >
                  <Users className="w-4 h-4 text-black" /> Criar Dupla
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveTab('login')}
                className="btn-wod btn-wod-primary text-xs py-2 px-4"
              >
                <Lock className="w-4 h-4" /> Entrar como Admin
              </button>
            )}

            <button 
              onClick={loadSampleData}
              className="btn-wod btn-wod-secondary text-xs py-2 px-4"
            >
              <Sparkles className="w-4 h-4 text-red-400" /> Carregar Demo Fictício
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="wod-card p-5 flex items-center gap-3.5 hover:border-blue-500/40">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-heading font-extrabold text-slate-400 uppercase tracking-wider">Duplas</p>
            <p className="font-heading text-3xl font-black text-white">{athletes.length}</p>
          </div>
        </div>

        <div className="wod-card p-5 flex items-center gap-3.5 hover:border-slate-300/40">
          <div className="w-12 h-12 rounded-xl bg-slate-200/15 border border-slate-300/30 flex items-center justify-center text-slate-200">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-heading font-extrabold text-slate-400 uppercase tracking-wider">Provas (WODs)</p>
            <p className="font-heading text-3xl font-black text-white">{wods.length}</p>
          </div>
        </div>

        <div className="wod-card p-5 flex items-center gap-3.5 hover:border-[#D60036]/40">
          <div className="w-12 h-12 rounded-xl bg-[#D60036]/15 border border-[#D60036]/30 flex items-center justify-center text-[#D60036]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-heading font-extrabold text-slate-400 uppercase tracking-wider">Baterias</p>
            <p className="font-heading text-3xl font-black text-white">{heats.length}</p>
          </div>
        </div>

        <div className="wod-card p-5 flex items-center gap-3.5 hover:border-emerald-500/40">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-heading font-extrabold text-slate-400 uppercase tracking-wider">Notas Salvas</p>
            <p className="font-heading text-3xl font-black text-white">{scores.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Leaderboard Preview & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaderboard Preview (2 cols) */}
        <div className="lg:col-span-2 wod-card p-5 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-heading text-2xl font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#D60036]" /> Ranking em Tempo Real
              </h2>
              <p className="text-xs text-slate-400">Classificação CrossGames GTI oficial por pontos acumulados</p>
            </div>

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0B0D12] border border-white/20 rounded-xl text-xs py-2 px-3 font-heading font-bold text-slate-100 focus:outline-none focus:border-[#D60036]"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {standings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Trophy className="w-10 h-10 stroke-[1] mx-auto text-slate-600" />
              <p className="text-sm font-heading font-bold text-slate-400">Nenhum resultado nesta categoria</p>
              <p className="text-xs text-slate-500">Cadastre atletas e lance notas para gerar a classificação.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {standings.slice(0, 5).map((item, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                return (
                  <div 
                    key={item.athlete.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all ${
                      isFirst 
                        ? 'podium-gold border border-amber-500/40' 
                        : isSecond 
                        ? 'podium-silver border border-slate-400/40'
                        : isThird
                        ? 'podium-bronze border border-amber-700/40'
                        : 'bg-white/5 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading text-base font-black ${
                        isFirst ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-black' :
                        isSecond ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-black' :
                        isThird ? 'bg-gradient-to-tr from-amber-700 to-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isFirst ? <Crown className="w-5 h-5 fill-current text-black" /> : item.overallRank}
                      </div>

                      <div>
                        <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                          {item.athlete.name}
                          <span className="text-[11px] font-mono text-slate-400">#{item.athlete.bib}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400">{item.athlete.box || 'Independente'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-heading text-2xl font-black text-[#D60036] leading-none">
                        {item.totalPoints} <span className="text-[10px] text-slate-400 font-sans font-semibold">pts</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button 
            onClick={() => setActiveTab('leaderboard')}
            className="w-full py-3 text-xs font-heading font-extrabold tracking-wider uppercase text-slate-300 hover:text-[#D60036] flex items-center justify-center gap-1.5 transition-colors border-t border-white/10 pt-3"
          >
            Ver Tabela de Classificação Completa <ArrowRight className="w-4 h-4 text-[#D60036]" />
          </button>
        </div>

        {/* Sidebar: Active WODs & Heats */}
        <div className="space-y-6">
          
          {/* Active WODs Summary */}
          <div className="wod-card p-5 space-y-3">
            <h3 className="font-heading text-xl font-black text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#D60036]" /> WODs Registrados
            </h3>
            
            {wods.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Nenhum WOD cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {wods.map(wod => (
                  <div key={wod.id} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/15 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{wod.name}</span>
                      <span className="wod-chip bg-white/10 text-slate-200 border border-white/20 text-[9px]">
                        {wod.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{wod.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heats Overview */}
          <div className="wod-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" /> Baterias da Arena
              </h3>
              {isAdminLoggedIn && (
                <button 
                  onClick={() => setActiveTab('heats')}
                  className="text-xs font-heading font-extrabold text-[#D60036] hover:underline"
                >
                  Baterias
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
                      <p className="text-[10px] text-slate-400">Horário: {heat.startTime} • {heat.lanes.length} raias</p>
                    </div>
                    <span className={`wod-chip ${
                      heat.status === 'completed' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                      heat.status === 'running' ? 'bg-[#D60036]/20 text-[#D60036] border border-[#D60036]/40 animate-pulse' : 'bg-white/10 text-slate-200 border border-white/20'
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
