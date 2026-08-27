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

const MainContent = () => {
  const { activeTab } = useTournament();

  if (activeTab === 'tv') {
    return <ArenaTvMode />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'wods' && <WodManager />}
        {activeTab === 'athletes' && <AthletesManager />}
        {activeTab === 'judge' && <ScoreEntry />}
        {activeTab === 'heats' && <HeatManager />}
        {activeTab === 'timer' && <ArenaTimer />}
      </main>
      
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 font-mono">
        FitScore Pro &copy; {new Date().getFullYear()} • Sistema de Gestão de Campeonatos de CrossFit
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
