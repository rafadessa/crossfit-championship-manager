import React from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Leaderboard } from './components/Leaderboard';
import { WodManager } from './components/WodManager';
import { AthletesManager } from './components/AthletesManager';
import { ScoreEntry } from './components/ScoreEntry';
import { HeatManager } from './components/HeatManager';
import { ArenaTimer } from './components/ArenaTimer';
import { ArenaTvMode } from './components/ArenaTvMode';
import { AdminLogin } from './components/AdminLogin';

const MainContent = () => {
  const { activeTab, isAdminLoggedIn } = useTournament();

  if (activeTab === 'tv') {
    return <ArenaTvMode />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-carbon">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'login' && <AdminLogin />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        
        {/* Admin Protected Views */}
        {activeTab === 'wods' && (isAdminLoggedIn ? <WodManager /> : <AdminLogin />)}
        {activeTab === 'athletes' && (isAdminLoggedIn ? <AthletesManager /> : <AdminLogin />)}
        {activeTab === 'judge' && (isAdminLoggedIn ? <ScoreEntry /> : <AdminLogin />)}
        {activeTab === 'heats' && (isAdminLoggedIn ? <HeatManager /> : <AdminLogin />)}

        {/* Public Views */}
        {activeTab === 'timer' && <ArenaTimer />}
      </main>
      
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 font-mono">
        FitScore Pro &copy; {new Date().getFullYear()} • Sistema Oficial de Gestão de Campeonatos de CrossFit
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <TournamentProvider>
      <MainContent />
    </TournamentProvider>
  );
}
