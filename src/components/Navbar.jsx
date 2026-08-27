import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { 
  Trophy, 
  Dumbbell, 
  Users, 
  ClipboardCheck, 
  Layers, 
  Timer, 
  Tv, 
  LayoutDashboard,
  RotateCcw
} from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, resetToSampleData } = useTournament();

  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'LIVE' },
    { id: 'wods', label: 'Provas (WODs)', icon: Dumbbell },
    { id: 'athletes', label: 'Atletas', icon: Users },
    { id: 'judge', label: 'Área do Juiz', icon: ClipboardCheck },
    { id: 'heats', label: 'Baterias', icon: Layers },
    { id: 'timer', label: 'Cronômetro Arena', icon: Timer },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0a0c10]/80 border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ccff00] to-[#88ff00] flex items-center justify-center text-black font-black shadow-lg shadow-[#ccff00]/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-wider text-white">FITSCORE</span>
              <span className="bg-[#ccff00] text-black text-xs font-black px-1.5 py-0.5 rounded">PRO</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest -mt-1">CrossFit Championship</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                    isActive ? 'bg-black text-[#ccff00]' : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: TV Mode & Reset Data */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tv')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
            title="Modo Telão para Transmissão na Arena"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">Modo Telão TV</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar os dados de teste iniciais do campeonato?')) {
                resetToSampleData();
              }
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Resetar para dados de demonstração"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
