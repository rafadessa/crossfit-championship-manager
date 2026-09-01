import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_WODS, 
  INITIAL_ATHLETES, 
  INITIAL_SCORES, 
  INITIAL_HEATS 
} from '../utils/sampleData';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

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

  // BroadcastChannel and window storage listener for real-time multi-tab/window sync
  useEffect(() => {
    let bc;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('fitscore_sync_channel');
        bc.onmessage = (event) => {
          if (event.data && event.data.type === 'SYNC_STATE') {
            const { categories, wods, athletes, scores, heats } = event.data.payload;
            if (categories) setCategories(categories);
            if (wods) setWods(wods);
            if (athletes) setAthletes(athletes);
            if (scores) setScores(scores);
            if (heats) setHeats(heats);
          }
        };
      }
    } catch (err) {
      console.warn('BroadcastChannel not supported:', err);
    }

    const handleStorageEvent = (e) => {
      if (e.key === 'fitscore_categories' && e.newValue) setCategories(JSON.parse(e.newValue));
      if (e.key === 'fitscore_wods' && e.newValue) setWods(JSON.parse(e.newValue));
      if (e.key === 'fitscore_athletes' && e.newValue) setAthletes(JSON.parse(e.newValue));
      if (e.key === 'fitscore_scores' && e.newValue) setScores(JSON.parse(e.newValue));
      if (e.key === 'fitscore_heats' && e.newValue) setHeats(JSON.parse(e.newValue));
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (bc) bc.close();
    };
  }, []);

  const broadcastStateChange = (payload) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('fitscore_sync_channel');
        bc.postMessage({ type: 'SYNC_STATE', payload });
        bc.close();
      }
    } catch (err) {
      console.warn('Broadcast failed:', err);
    }
  };

  // Sync state to LocalStorage & broadcast
  useEffect(() => {
    localStorage.setItem('fitscore_admin_auth', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('fitscore_categories', JSON.stringify(categories));
    broadcastStateChange({ categories });
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fitscore_wods', JSON.stringify(wods));
    broadcastStateChange({ wods });
  }, [wods]);

  useEffect(() => {
    localStorage.setItem('fitscore_athletes', JSON.stringify(athletes));
    broadcastStateChange({ athletes });
  }, [athletes]);

  useEffect(() => {
    localStorage.setItem('fitscore_scores', JSON.stringify(scores));
    broadcastStateChange({ scores });
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('fitscore_heats', JSON.stringify(heats));
    broadcastStateChange({ heats });
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

  // Category CRUD Handlers
  const addCategory = (name) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: cleanName
    };
    setCategories(prev => [...prev, newCat]);
    if (!selectedCategory) {
      setSelectedCategory(newCat.id);
    }
  };

  const updateCategory = (id, newName) => {
    const cleanName = newName.trim();
    if (!cleanName) return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: cleanName } : c));
  };

  const deleteCategory = (id) => {
    if (categories.length <= 1) {
      alert('É necessário ter ao menos 1 categoria cadastrada no campeonato.');
      return;
    }
    setCategories(prev => {
      const remaining = prev.filter(c => c.id !== id);
      if (selectedCategory === id) {
        setSelectedCategory(remaining[0]?.id || '');
      }
      return remaining;
    });
  };

  // Export / Import Tournament JSON
  const exportTournamentData = () => {
    const data = {
      categories,
      wods,
      athletes,
      scores,
      heats,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crossgames-gti-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTournamentData = (jsonObj) => {
    try {
      if (jsonObj.categories) setCategories(jsonObj.categories);
      if (jsonObj.wods) setWods(jsonObj.wods);
      if (jsonObj.athletes) setAthletes(jsonObj.athletes);
      if (jsonObj.scores) setScores(jsonObj.scores);
      if (jsonObj.heats) setHeats(jsonObj.heats);
      alert('Dados do campeonato importados com sucesso!');
    } catch (e) {
      alert('Erro ao importar arquivo JSON de dados.');
    }
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
      addCategory,
      updateCategory,
      deleteCategory,
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
      exportTournamentData,
      importTournamentData,
      isSupabaseConfigured,
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
