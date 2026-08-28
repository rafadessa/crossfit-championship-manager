import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ShieldCheck, Lock, Key, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

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
    <div className="min-h-[75vh] flex items-center justify-center p-4 fade-in relative">
      
      {/* Background Glow Orbs */}
      <div className="bg-orb-orange top-1/4 left-1/3"></div>
      <div className="bg-orb-lime bottom-1/4 right-1/3"></div>

      <div className="glass-panel p-8 md:p-10 max-w-md w-full space-y-6 border-orange-500/35 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        
        {/* Glow Accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/30 border border-white/20">
            <ShieldCheck className="w-10 h-10" />
          </div>
          
          <div>
            <h2 className="font-heading text-3xl font-black text-white tracking-wide">ÁREA DO ORGANIZADOR</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Autentique-se para gerenciar provas (WODs), cadastrar atletas, lançar notas e organizar baterias.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="form-group">
            <label className="form-label flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-orange-400" /> Senha do Administrador
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Digite a senha do admin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-control text-center font-mono py-3.5 pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-orange w-full py-4 text-base"
          >
            <Key className="w-5 h-5" /> ENTRAR COMO ADMINISTRADOR
          </button>
        </form>

        <div className="border-t border-white/10 pt-5 text-center space-y-3">
          <p className="text-xs text-slate-400 font-mono">
            Senha padrão de acesso: <span className="text-[#d4ff00] font-bold">admin123</span>
          </p>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading font-extrabold text-slate-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-[#d4ff00]" /> Entrar Rapidamente (Acesso Demo)
          </button>
        </div>

      </div>
    </div>
  );
};
