import React, { useState } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Leaderboard } from './components/Leaderboard';
import { WodManager } from './components/WodManager';
import { AthletesManager } from './components/AthletesManager';
import { ScoreEntry } from './components/ScoreEntry';
import { AdminLoginPage } from './components/AdminLoginPage';

const MainContent = () => {
  const { activeTab, isAdminLoggedIn } = useTournament();

  // Detect if user is on /admin path (initialized once on mount)
  const [isAdminPath] = useState(() => window.location.pathname === '/admin');

  // Show full-screen admin login when on /admin and not yet logged in
  if (isAdminPath && !isAdminLoggedIn) {
    return (
      <AdminLoginPage
        onSuccess={() => {
          // Change URL to / without page reload - React state still active
          history.pushState(null, '', '/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D12]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-28 md:pb-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'leaderboard' && <Leaderboard />}

        {/* Admin Protected Views */}
        {activeTab === 'wods' && (isAdminLoggedIn ? <WodManager /> : null)}
        {activeTab === 'athletes' && (isAdminLoggedIn ? <AthletesManager /> : null)}
        {activeTab === 'judge' && (isAdminLoggedIn ? <ScoreEntry /> : null)}
      </main>

      <footer className="border-t border-white/10 py-6 mb-20 md:mb-0 text-center text-xs text-slate-500 font-mono">
        Interno Gravataí GAMES 05 &copy; {new Date().getFullYear()} • Arena Championship Manager
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
