import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ShieldCheck, Lock, Key, AlertCircle, ArrowRight, Check } from 'lucide-react';

export const AdminLogin = () => {
  const { loginAdmin, setActiveTab } = useTournament();
  const [password, setPassword] = useState('');
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
    <div className="min-h-[70vh] flex items-center justify-center p-4 fade-in">
      <div className="glass-panel p-8 max-w-md w-full space-y-6 border-orange-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Glow accent decoration */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff5500] to-[#ffaa00] text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="font-display text-3xl font-black text-white tracking-wide">ÁREA RESTRITA DO ADMIN</h2>
          <p className="text-xs text-slate-400">
            Insira a senha de organizador para cadastrar provas, atletas, lançar notas e gerenciar baterias.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-group">
            <label className="form-label flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-orange-400" /> Senha do Administrador
            </label>
            <input
              type="password"
              required
              placeholder="Digite sua senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-control text-center font-mono py-3"
            />
          </div>

          <button
            type="submit"
            className="btn btn-orange w-full py-3.5 text-base"
          >
            <Key className="w-4 h-4" /> ENTRAR COMO ADMINISTRADOR
          </button>
        </form>

        <div className="border-t border-white/10 pt-4 text-center space-y-3">
          <p className="text-[11px] text-slate-400 font-mono">
            Senha padrão de acesso: <span className="text-[#ccff00] font-bold">admin123</span>
          </p>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4 text-[#ccff00]" /> Entrar Rapidamente (Acesso Demo)
          </button>
        </div>

      </div>
    </div>
  );
};
