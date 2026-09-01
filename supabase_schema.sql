-- SQL Schema para o CrossFit Championship Manager (CrossGames GTI / FitScore)
-- Execute estas instruções no "SQL Editor" do seu painel Supabase (https://supabase.com)

-- 1. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Provas (WODs)
CREATE TABLE IF NOT EXISTS public.wods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  time_cap INT DEFAULT 600,
  category TEXT NOT NULL,
  reps_per_round INT DEFAULT 0,
  description TEXT,
  standards TEXT,
  tiebreak_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Duplas / Atletas
CREATE TABLE IF NOT EXISTS public.athletes (
  id TEXT PRIMARY KEY,
  bib TEXT NOT NULL,
  name TEXT NOT NULL,
  box TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Pontuações (Scores)
CREATE TABLE IF NOT EXISTS public.scores (
  id TEXT PRIMARY KEY,
  wod_id TEXT NOT NULL,
  athlete_id TEXT NOT NULL,
  is_cap BOOLEAN DEFAULT FALSE,
  time_in_seconds INT,
  time_str TEXT,
  reps INT DEFAULT 0,
  rounds INT DEFAULT 0,
  weight NUMERIC DEFAULT 0,
  tiebreak_time INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Baterias (Heats)
CREATE TABLE IF NOT EXISTS public.heats (
  id TEXT PRIMARY KEY,
  wod_id TEXT NOT NULL,
  name TEXT NOT NULL,
  start_time TEXT,
  status TEXT DEFAULT 'upcoming',
  lanes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Políticas de Acesso Público (RLS) para leitura e escrita
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público categorias" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público wods" ON public.wods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público duplas" ON public.athletes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público notas" ON public.scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público baterias" ON public.heats FOR ALL USING (true) WITH CHECK (true);

-- Habilitar Publicação em Tempo Real (Realtime Sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories, public.wods, public.athletes, public.scores, public.heats;
