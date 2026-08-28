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
  Lock,
  ShieldCheck,
  Sparkles,
  Trash2
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isAdminLoggedIn, 
    logoutAdmin,
    clearAllData,
    loadSampleData
  } = useTournament();

  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, public: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'LIVE', public: true },
    { id: 'wods', label: 'Provas (WODs)', icon: Dumbbell, public: false },
    { id: 'athletes', label: 'Atletas', icon: Users, public: false },
    { id: 'judge', label: 'Área do Juiz', icon: ClipboardCheck, public: false },
    { id: 'heats', label: 'Baterias', icon: Layers, public: false },
    { id: 'timer', label: 'Cronômetro Arena', icon: Timer, public: true },
  ];

  const handleTabClick = (item) => {
    if (!item.public && !isAdminLoggedIn) {
      setActiveTab('login');
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#04060a]/80 border-b border-white/10 px-4 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo with Ambient Glow */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4ff00] to-[#00f5d4] rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-11 h-11 rounded-2xl bg-[#04060a] border border-white/10 flex items-center justify-center text-[#d4ff00] shadow-xl group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-black tracking-wider text-white">FITSCORE</span>
              <span className="bg-gradient-to-r from-[#d4ff00] to-[#a6e600] text-black text-[11px] font-black px-2 py-0.5 rounded-md font-heading tracking-widest shadow-md">PRO</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest -mt-0.5">CrossFit Arena Management</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = !item.public && !isAdminLoggedIn;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-heading font-extrabold tracking-wide transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#d4ff00] to-[#b3e600] text-black shadow-lg shadow-[#d4ff00]/25' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                
                {isLocked && (
                  <Lock className="w-3 h-3 text-orange-400 ml-0.5" />
                )}

                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest ${
                    isActive ? 'bg-black text-[#d4ff00]' : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Admin Status & TV Mode */}
        <div className="flex items-center gap-2.5">
          
          {/* Admin Login / Logout Indicator */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-heading font-extrabold text-emerald-400 hidden sm:inline">ADMIN</span>
              <button
                onClick={logoutAdmin}
                className="text-[11px] font-mono text-slate-400 hover:text-white underline ml-1"
                title="Sair do modo Admin"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 transition-all text-xs font-heading font-bold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login Admin</span>
            </button>
          )}

          {/* TV Mode Button */}
          <button
            onClick={() => setActiveTab('tv')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all hover:scale-105"
            title="Modo Telão para Transmissão na Arena"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">Modo Telão</span>
          </button>

          {/* Quick Data Actions */}
          {isAdminLoggedIn && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (window.confirm('Deseja ZERAR todos os dados (WODs, atletas, notas e baterias) para iniciar um campeonato limpo do zero?')) {
                    clearAllData();
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                title="Zerar todos os dados do campeonato (Iniciar do Zero)"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Deseja carregar dados de demonstração fictícios para testes rápidos?')) {
                    loadSampleData();
                  }
                }}
                className="p-2 text-slate-400 hover:text-[#d4ff00] hover:bg-white/10 rounded-xl transition-colors"
                title="Carregar Dados de Demonstração"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
