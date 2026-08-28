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
  Download,
  Trash2,
  Sparkles,
  X,
  Share,
  PlusSquare,
  Flame
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isAdminLoggedIn, 
    logoutAdmin,
    clearAllData,
    loadSampleData,
    triggerPwaInstall,
    showIosInstallModal,
    setShowIosInstallModal
  } = useTournament();

  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, public: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'LIVE', public: true },
    { id: 'wods', label: 'WODs', icon: Dumbbell, public: false },
    { id: 'athletes', label: 'Atletas', icon: Users, public: false },
    { id: 'judge', label: 'Área do Juiz', icon: ClipboardCheck, public: false },
    { id: 'heats', label: 'Baterias', icon: Layers, public: false },
    { id: 'timer', label: 'Timer Arena', icon: Timer, public: true },
  ];

  const bottomNavItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, public: true },
    { id: 'leaderboard', label: 'Líderes', icon: Trophy, badge: 'LIVE', public: true },
    { id: 'heats', label: 'Baterias', icon: Layers, public: false },
    { id: 'judge', label: 'Juiz', icon: ClipboardCheck, public: false },
    { id: 'timer', label: 'Timer', icon: Timer, public: true },
  ];

  const handleTabClick = (item) => {
    if (!item.public && !isAdminLoggedIn) {
      setActiveTab('login');
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <>
      {/* Top Header - CrossGames GTI Aesthetic */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#0B0D12]/90 border-b border-white/10 px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D60036] to-white/40 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-11 h-11 rounded-xl bg-[#0B0D12] border border-white/15 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/logo.png" alt="CrossGames GTI Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl font-black tracking-wider text-white">CROSSGAMES</span>
                <span className="bg-[#D60036] text-white text-[10px] font-black px-1.5 py-0.5 rounded font-heading tracking-wider uppercase shadow-md">
                  GTI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest hidden sm:block -mt-0.5">
                Arena Championship Hub
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLocked = !item.public && !isAdminLoggedIn;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-heading font-extrabold tracking-wide transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#D60036] to-[#990024] text-white shadow-lg shadow-[#D60036]/30' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  
                  {isLocked && (
                    <Lock className="w-3 h-3 text-red-400 ml-0.5" />
                  )}

                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest ${
                      isActive ? 'bg-white text-[#D60036]' : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: PWA Install, Admin & TV Mode */}
          <div className="flex items-center gap-2">

            {/* Install App Button */}
            <button
              onClick={triggerPwaInstall}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-slate-100 hover:bg-white/20 transition-all text-xs font-heading font-bold"
              title="Instalar App no Smartphone (PWA)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar App</span>
            </button>

            {/* TV Mode Button */}
            <button
              onClick={() => setActiveTab('tv')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D60036] to-red-700 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
              title="Modo Telão para Transmissão na Arena"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Telão</span>
            </button>

            {/* Admin Login/Logout */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-heading font-black text-emerald-400 hidden sm:inline ml-1">ADMIN</span>
                <button
                  onClick={logoutAdmin}
                  className="text-[10px] font-mono text-slate-400 hover:text-white underline ml-1"
                  title="Sair do Modo Admin"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-heading font-bold"
                title="Acesso de Administrador"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Admin Data Actions */}
            {isAdminLoggedIn && (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => {
                    if (window.confirm('Deseja ZERAR todos os dados (WODs, atletas, notas e baterias) para iniciar um campeonato limpo do zero?')) {
                      clearAllData();
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  title="Zerar todos os dados do campeonato"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Deseja carregar dados de demonstração fictícios para testes rápidos?')) {
                      loadSampleData();
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition-colors"
                  title="Carregar Dados de Demonstração"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed for Smartphones / PWA) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0D12]/95 border-t border-white/10 backdrop-blur-2xl px-2 py-2 shadow-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive ? 'text-[#D60036]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] scale-110 text-[#D60036]' : 'stroke-2'}`} />
                <span className="text-[10px] font-heading font-extrabold mt-0.5 tracking-tight">
                  {item.label}
                </span>

                {isActive && (
                  <span className="absolute -top-2 w-8 h-1 bg-[#D60036] rounded-full shadow-[0_0_10px_#D60036]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* iOS PWA Installation Guidance Modal */}
      {showIosInstallModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/15 rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setShowIosInstallModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#D60036]/20 border border-[#D60036]/40 flex items-center justify-center text-[#D60036] mb-4">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="font-heading text-lg font-black text-white mb-2">
              Instalar CrossGames GTI no iOS
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Para instalar este aplicativo no seu iPhone ou iPad como um app nativo:
            </p>

            <ol className="text-xs text-slate-300 space-y-3 font-medium">
              <li className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <Share className="w-5 h-5 text-[#D60036] shrink-0" />
                <span>1. Toque no botão <strong>Compartilhar</strong> na barra do Safari.</span>
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <PlusSquare className="w-5 h-5 text-slate-200 shrink-0" />
                <span>2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIosInstallModal(false)}
              className="w-full mt-6 btn-wod btn-wod-primary"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
