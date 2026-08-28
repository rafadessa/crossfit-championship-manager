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
  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('fitscore_admin_auth') === 'true';
  });

  // Categories start with standard CrossFit categories
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('fitscore_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // WODs, Athletes, Scores, Heats start EMPTY by default as requested by the user
  const [wods, setWods] = useState(() => {
    const saved = localStorage.getItem('fitscore_wods');
    return saved ? JSON.parse(saved) : [];
  });

  const [athletes, setAthletes] = useState(() => {
    const saved = localStorage.getItem('fitscore_athletes');
    return saved ? JSON.parse(saved) : [];
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('fitscore_scores');
    return saved ? JSON.parse(saved) : [];
  });

  const [heats, setHeats] = useState(() => {
    const saved = localStorage.getItem('fitscore_heats');
    return saved ? JSON.parse(saved) : [];
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('rx_male');
  const [activeHeatForTimer, setActiveHeatForTimer] = useState(null);

  // PWA Installation Hook State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIosInstallModal, setShowIosInstallModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerPwaInstall = async () => {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos) {
      setShowIosInstallModal(true);
      return;
    }

    if (!deferredPrompt) {
      alert('Para instalar o app no Android/PC, abra este site no Chrome/Edge e selecione "Instalar App" ou "Adicionar à Tela Inicial" no menu do navegador.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  // Sync state to LocalStorage

  useEffect(() => {
    localStorage.setItem('fitscore_admin_auth', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

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

  // Admin Auth Handlers
  const loginAdmin = (password) => {
    if (password === 'admin123' || password === 'admin') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  // CRUD Handlers
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

  // Clear all tournament data (Zerar Dados)
  const clearAllData = () => {
    setWods([]);
    setAthletes([]);
    setScores([]);
    setHeats([]);
    localStorage.removeItem('fitscore_wods');
    localStorage.removeItem('fitscore_athletes');
    localStorage.removeItem('fitscore_scores');
    localStorage.removeItem('fitscore_heats');
  };

  // Load sample demo data
  const loadSampleData = () => {
    setCategories(INITIAL_CATEGORIES);
    setWods(INITIAL_WODS);
    setAthletes(INITIAL_ATHLETES);
    setScores(INITIAL_SCORES);
    setHeats(INITIAL_HEATS);
  };

  return (
    <TournamentContext.Provider value={{
      isAdminLoggedIn,
      loginAdmin,
      logoutAdmin,
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
      clearAllData,
      loadSampleData,
      isInstallable,
      triggerPwaInstall,
      showIosInstallModal,
      setShowIosInstallModal
    }}>
      {children}
    </TournamentContext.Provider>

  );
};

export const useTournament = () => useContext(TournamentContext);
