import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_WODS, 
  INITIAL_ATHLETES, 
  INITIAL_SCORES, 
  INITIAL_HEATS 
} from '../utils/sampleData';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  // Load state from localStorage or initialize with sampleData
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('fitscore_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [wods, setWods] = useState(() => {
    const saved = localStorage.getItem('fitscore_wods');
    return saved ? JSON.parse(saved) : INITIAL_WODS;
  });

  const [athletes, setAthletes] = useState(() => {
    const saved = localStorage.getItem('fitscore_athletes');
    return saved ? JSON.parse(saved) : INITIAL_ATHLETES;
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('fitscore_scores');
    return saved ? JSON.parse(saved) : INITIAL_SCORES;
  });

  const [heats, setHeats] = useState(() => {
    const saved = localStorage.getItem('fitscore_heats');
    return saved ? JSON.parse(saved) : INITIAL_HEATS;
  });

  // Current view: 'dashboard' | 'leaderboard' | 'wods' | 'athletes' | 'judge' | 'heats' | 'timer' | 'tv'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('rx_male');
  const [activeHeatForTimer, setActiveHeatForTimer] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('fitscore_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fitscore_wods', JSON.stringify(wods));
  }, [wods]);

  useEffect(() => {
    localStorage.setItem('fitscore_athletes', JSON.stringify(athletes));
  }, [athletes]);

  useEffect(() => {
    localStorage.setItem('fitscore_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('fitscore_heats', JSON.stringify(heats));
  }, [heats]);

  // Actions / Handlers
  const addAthlete = (newAthlete) => {
    const athlete = {
      ...newAthlete,
      id: `ath-${Date.now()}`
    };
    setAthletes(prev => [...prev, athlete]);
  };

  const updateAthlete = (id, updatedData) => {
    setAthletes(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteAthlete = (id) => {
    setAthletes(prev => prev.filter(a => a.id !== id));
    setScores(prev => prev.filter(s => s.athleteId !== id));
  };

  const addWod = (newWod) => {
    const wod = {
      ...newWod,
      id: `wod-${Date.now()}`
    };
    setWods(prev => [...prev, wod]);
  };

  const updateWod = (id, updatedData) => {
    setWods(prev => prev.map(w => w.id === id ? { ...w, ...updatedData } : w));
  };

  const deleteWod = (id) => {
    setWods(prev => prev.filter(w => w.id !== id));
    setScores(prev => prev.filter(s => s.wodId !== id));
    setHeats(prev => prev.filter(h => h.wodId !== id));
  };

  const saveScore = (scoreData) => {
    setScores(prev => {
      const existingIdx = prev.findIndex(
        s => s.wodId === scoreData.wodId && s.athleteId === scoreData.athleteId
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...scoreData, id: updated[existingIdx].id || `sc-${Date.now()}` };
        return updated;
      } else {
        return [...prev, { ...scoreData, id: `sc-${Date.now()}` }];
      }
    });
  };

  const addHeat = (newHeat) => {
    const heat = {
      ...newHeat,
      id: `heat-${Date.now()}`,
      status: 'upcoming'
    };
    setHeats(prev => [...prev, heat]);
  };

  const updateHeatStatus = (heatId, status) => {
    setHeats(prev => prev.map(h => h.id === heatId ? { ...h, status } : h));
  };

  const resetToSampleData = () => {
    setCategories(INITIAL_CATEGORIES);
    setWods(INITIAL_WODS);
    setAthletes(INITIAL_ATHLETES);
    setScores(INITIAL_SCORES);
    setHeats(INITIAL_HEATS);
    localStorage.clear();
  };

  return (
    <TournamentContext.Provider value={{
      categories,
      wods,
      athletes,
      scores,
      heats,
      activeTab,
      setActiveTab,
      selectedCategory,
      setSelectedCategory,
      activeHeatForTimer,
      setActiveHeatForTimer,
      addAthlete,
      updateAthlete,
      deleteAthlete,
      addWod,
      updateWod,
      deleteWod,
      saveScore,
      addHeat,
      updateHeatStatus,
      resetToSampleData
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => useContext(TournamentContext);
