import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLoginPage = ({ onSuccess }) => {
  const { loginAdmin } = useTournament();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const success = loginAdmin(password);
    if (success) {
      onSuccess?.();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D12] p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D60036]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#0E1118] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          
          {/* Logo & Title */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center mx-auto shadow-xl">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-black text-white tracking-wide">ÁREA DO ORGANIZADOR</h1>
              <p className="text-xs text-slate-400 mt-1">Interno Gravataí GAMES 05</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-extrabold text-slate-300 uppercase tracking-wider block">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-11 bg-[#0B0D12] border border-white/20 rounded-xl text-white font-mono text-lg text-center focus:border-[#D60036] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#D60036] text-white font-heading font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-[#D60036]/30 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              ENTRAR
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
