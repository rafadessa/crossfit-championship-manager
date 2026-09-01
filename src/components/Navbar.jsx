import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { 
  Trophy, 
  Dumbbell, 
  Users, 
  ClipboardCheck, 
  Layers, 
  LayoutDashboard,
  Lock,
  Trash2,
  Sparkles,
  X,
  Share,
  Download,
  Database,
  Smartphone
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
    setShowIosInstallModal,
    isSupabaseConfigured,
    isInstallable
  } = useTournament();

  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, public: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'LIVE', public: true },
    { id: 'wods', label: 'WODs', icon: Dumbbell, public: false },
    { id: 'athletes', label: 'Duplas', icon: Users, public: false },
    { id: 'judge', label: 'Área do Juiz', icon: ClipboardCheck, public: false },
    { id: 'heats', label: 'Baterias', icon: Layers, public: false }
  ];

  // Bottom nav for mobile: show install button if installable, otherwise 4 nav items
  const bottomNavItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, public: true },
    { id: 'leaderboard', label: 'Líderes', icon: Trophy, badge: 'LIVE', public: true },
    { id: 'athletes', label: 'Duplas', icon: Users, public: false },
    { id: 'heats', label: 'Baterias', icon: Layers, public: false }
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
      {/* Top Header */}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">

            {/* Supabase DB Status Badge - desktop only */}
            <div 
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-heading font-black tracking-wide ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
              title={isSupabaseConfigured ? 'Banco de dados Supabase Conectado' : 'Operando em Modo Local (LocalStorage)'}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Modo Local'}</span>
            </div>

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

            {/* Admin Data Actions - desktop only */}
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

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0D12]/95 border-t border-white/10 backdrop-blur-2xl shadow-2xl"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-stretch">
          {/* Nav items */}
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 transition-all relative ${
                  isActive ? 'text-[#D60036]' : 'text-slate-400 active:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#D60036] rounded-full shadow-[0_0_10px_#D60036]"></span>
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] scale-110 text-[#D60036]' : 'stroke-2'}`} />
                <span className="text-[10px] font-heading font-extrabold mt-1 tracking-tight leading-none">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute top-1.5 right-[calc(50%-16px)] text-[7px] px-1 py-px bg-red-500 text-white rounded-full font-black animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Install App button - always visible on mobile */}
          <button
            onClick={triggerPwaInstall}
            className="flex-1 flex flex-col items-center justify-center py-2.5 px-1 text-slate-400 active:text-white transition-all"
            title="Instalar App"
          >
            <Smartphone className="w-5 h-5 stroke-2" />
            <span className="text-[10px] font-heading font-extrabold mt-1 tracking-tight leading-none">
              Instalar
            </span>
          </button>
        </div>
      </div>

      {/* iOS PWA Installation Guidance Modal */}
      {showIosInstallModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/15 rounded-2xl rounded-b-none sm:rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setShowIosInstallModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#D60036]/20 border border-[#D60036]/40 flex items-center justify-center text-[#D60036] mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="font-heading text-lg font-black text-white mb-1">
              Instalar CrossGames GTI
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Adicione o app à sua tela inicial para acesso rápido sem precisar abrir o navegador.
            </p>

            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <Share className="w-5 h-5 text-[#007AFF] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">1. Toque em Compartilhar</p>
                  <p className="text-[11px] text-slate-400">Na barra inferior do Safari</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <Download className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">2. "Adicionar à Tela de Início"</p>
                  <p className="text-[11px] text-slate-400">Role a lista de opções para baixo</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosInstallModal(false)}
              className="w-full h-12 rounded-xl bg-[#D60036] text-white font-heading font-black text-sm hover:brightness-110 transition-all"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
