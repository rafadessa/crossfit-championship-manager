import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ShieldCheck, Lock, Key, AlertCircle, Eye, EyeOff, Sparkles, Flame } from 'lucide-react';

export const AdminLogin = () => {
  const { loginAdmin, setActiveTab } = useTournament();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const success = loginAdmin(password);
    if (success) {
      setActiveTab('dashboard');
    } else {
      setError('Senha de administrador incorreta. Tente "admin123".');
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin123');
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fade-in relative">
      <div className="wod-card p-6 md:p-8 max-w-md w-full space-y-5 border-[#D60036]/40 shadow-2xl relative overflow-hidden">
        
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/15 p-2 flex items-center justify-center mx-auto shadow-xl">
            <img src="/logo.png" alt="CrossGames GTI Logo" className="w-full h-full object-contain" />
          </div>
          
          <div>
            <h2 className="font-heading text-2xl font-black text-white tracking-wide">ÁREA DO ORGANIZADOR</h2>
            <p className="text-xs text-slate-400 mt-1">
              Acesso administrativo CrossGames GTI para gerenciar WODs, atletas, baterias e lançar notas.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-heading font-extrabold text-slate-300 uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D60036]" /> Senha do Administrador
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Digite a senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-center font-mono text-base text-white pr-10 focus:outline-none focus:border-[#D60036]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-wod btn-wod-primary w-full py-3 text-sm font-black"
          >
            <Key className="w-4 h-4" /> ENTRAR NO ADMIN
          </button>
        </form>

        <div className="border-t border-white/10 pt-4 text-center space-y-3">
          <p className="text-xs text-slate-400 font-mono">
            Senha padrão de acesso: <span className="text-[#D60036] font-bold">admin123</span>
          </p>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading font-bold text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-red-400" /> Entrar Rapidamente (Demo 1-Clique)
          </button>
        </div>

      </div>
    </div>
  );
};
