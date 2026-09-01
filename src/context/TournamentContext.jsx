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

  // Supabase Initial Fetch & Realtime Synchronization
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchAllFromSupabase = async () => {
      try {
        const [catRes, wodRes, athRes, scRes, heatRes] = await Promise.all([
          supabase.from('categories').select('*').order('created_at', { ascending: true }),
          supabase.from('wods').select('*').order('created_at', { ascending: true }),
          supabase.from('athletes').select('*').order('created_at', { ascending: true }),
          supabase.from('scores').select('*'),
          supabase.from('heats').select('*').order('created_at', { ascending: true })
        ]);

        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
        if (wodRes.data) {
          setWods(wodRes.data.map(w => ({
            ...w,
            timeCap: w.time_cap,
            repsPerRound: w.reps_per_round,
            tiebreakRule: w.tiebreak_rule
          })));
        }
        if (athRes.data) {
          setAthletes(athRes.data);
        }
        if (scRes.data) {
          setScores(scRes.data.map(s => ({
            ...s,
            wodId: s.wod_id,
            athleteId: s.athlete_id,
            isCap: s.is_cap,
            timeInSeconds: s.time_in_seconds,
            timeStr: s.time_str,
            tiebreakTime: s.tiebreak_time
          })));
        }
        if (heatRes.data) {
          setHeats(heatRes.data.map(h => ({
            ...h,
            wodId: h.wod_id,
            startTime: h.start_time
          })));
        }
      } catch (err) {
        console.warn('Error fetching Supabase data:', err);
      }
    };

    fetchAllFromSupabase();

    // Subscribe to Postgres Realtime Changes across all tables
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAllFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  // CRUD Handlers with Supabase Realtime DB Sync
  const addAthlete = async (newAthlete) => {
    const athlete = {
      ...newAthlete,
      id: `ath-${Date.now()}`
    };
    setAthletes(prev => [...prev, athlete]);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('athletes').upsert({
        id: athlete.id,
        bib: athlete.bib,
        name: athlete.name,
        box: athlete.box || '',
        category: athlete.category
      });
    }
  };

  const updateAthlete = async (id, updatedData) => {
    setAthletes(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('athletes').update({
        bib: updatedData.bib,
        name: updatedData.name,
        box: updatedData.box || '',
        category: updatedData.category
      }).eq('id', id);
    }
  };

  const deleteAthlete = async (id) => {
    setAthletes(prev => prev.filter(a => a.id !== id));
    setScores(prev => prev.filter(s => s.athleteId !== id));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('athletes').delete().eq('id', id);
      await supabase.from('scores').delete().eq('athlete_id', id);
    }
  };

  const addWod = async (newWod) => {
    const wod = {
      ...newWod,
      id: `wod-${Date.now()}`
    };
    setWods(prev => [...prev, wod]);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('wods').upsert({
        id: wod.id,
        name: wod.name,
        type: wod.type,
        time_cap: wod.timeCap || 600,
        category: wod.category,
        reps_per_round: wod.repsPerRound || 0,
        description: wod.description || '',
        standards: wod.standards || '',
        tiebreak_rule: wod.tiebreakRule || ''
      });
    }
  };

  const updateWod = async (id, updatedData) => {
    setWods(prev => prev.map(w => w.id === id ? { ...w, ...updatedData } : w));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('wods').update({
        name: updatedData.name,
        type: updatedData.type,
        time_cap: updatedData.timeCap,
        category: updatedData.category,
        reps_per_round: updatedData.repsPerRound,
        description: updatedData.description,
        standards: updatedData.standards,
        tiebreak_rule: updatedData.tiebreakRule
      }).eq('id', id);
    }
  };

  const deleteWod = async (id) => {
    setWods(prev => prev.filter(w => w.id !== id));
    setScores(prev => prev.filter(s => s.wodId !== id));
    setHeats(prev => prev.filter(h => h.wodId !== id));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('wods').delete().eq('id', id);
      await supabase.from('scores').delete().eq('wod_id', id);
      await supabase.from('heats').delete().eq('wod_id', id);
    }
  };

  const saveScore = async (scoreData) => {
    let targetId = scoreData.id;
    setScores(prev => {
      const existingIdx = prev.findIndex(
        s => s.wodId === scoreData.wodId && s.athleteId === scoreData.athleteId
      );
      if (existingIdx >= 0) {
        targetId = prev[existingIdx].id || `sc-${Date.now()}`;
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...scoreData, id: targetId };
        return updated;
      } else {
        targetId = scoreData.id || `sc-${Date.now()}`;
        return [...prev, { ...scoreData, id: targetId }];
      }
    });

    if (isSupabaseConfigured && supabase) {
      await supabase.from('scores').upsert({
        id: targetId,
        wod_id: scoreData.wodId,
        athlete_id: scoreData.athleteId,
        is_cap: scoreData.isCap || false,
        time_in_seconds: scoreData.timeInSeconds || 0,
        time_str: scoreData.timeStr || '',
        reps: scoreData.reps || 0,
        rounds: scoreData.rounds || 0,
        weight: scoreData.weight || 0,
        tiebreak_time: scoreData.tiebreakTime || null
      });
    }
  };

  const addHeat = async (newHeat) => {
    const heat = {
      ...newHeat,
      id: `heat-${Date.now()}`,
      status: 'upcoming'
    };
    setHeats(prev => [...prev, heat]);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('heats').upsert({
        id: heat.id,
        wod_id: heat.wodId,
        name: heat.name,
        start_time: heat.startTime || '',
        status: heat.status,
        lanes: heat.lanes || []
      });
    }
  };

  const updateHeatStatus = async (heatId, status) => {
    setHeats(prev => prev.map(h => h.id === heatId ? { ...h, status } : h));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('heats').update({ status }).eq('id', heatId);
    }
  };

  // Category CRUD Handlers
  const addCategory = async (name) => {
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
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').upsert({
        id: newCat.id,
        name: newCat.name
      });
    }
  };

  const updateCategory = async (id, newName) => {
    const cleanName = newName.trim();
    if (!cleanName) return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: cleanName } : c));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').update({ name: cleanName }).eq('id', id);
    }
  };

  const deleteCategory = async (id) => {
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
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').delete().eq('id', id);
    }
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
