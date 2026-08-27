export const INITIAL_CATEGORIES = [
  { id: 'rx_male', name: 'RX Masculino' },
  { id: 'rx_female', name: 'RX Feminino' },
  { id: 'scaled_male', name: 'Scaled Masculino' },
  { id: 'scaled_female', name: 'Scaled Feminino' },
  { id: 'master_35', name: 'Master 35+' },
  { id: 'trio_rx', name: 'Trio Misto RX' }
];

export const INITIAL_WODS = [
  {
    id: 'wod-1',
    name: 'WOD 1: AIR & ICE',
    type: 'amrap',
    timeCap: 720, // 12 minutes in seconds
    category: 'rx_male',
    repsPerRound: 50,
    description: '12 Min AMRAP:\n- 15 Thrusters (60kg)\n- 15 Chest-to-Bar Pull-ups\n- 20 Cal Row',
    standards: 'Thrusters com quadril abaixo da linha do joelho e extensão total acima da cabeça. C2B peito tocando a barra.',
    tiebreakRule: 'Tempo ao finalizar a primeira rodada'
  },
  {
    id: 'wod-2',
    name: 'WOD 2: HEAVY METAL LADDER',
    type: 'max_weight',
    timeCap: 360, // 6 minutes
    category: 'rx_male',
    description: '6 Min Window:\n1RM Clean & Jerk (Complex: 1 Hang Power Clean + 1 Shoulder to Overhead)',
    standards: 'Barra deve pausar no ombro antes do Jerk. Extensão completa com cotovelos e joelhos travados.',
    tiebreakRule: 'Tempo da tentativa de peso anterior bem-sucedida'
  },
  {
    id: 'wod-3',
    name: 'WOD 3: THE FINAL SPRINT',
    type: 'for_time',
    timeCap: 600, // 10 minutes
    category: 'rx_male',
    description: 'For Time (Cap 10 Min):\n- 50 Double Unders\n- 30 Toes-to-Bar\n- 20 Bar Muscle-ups\n- 10 Devil Presses (2x22.5kg)',
    standards: 'Toes to bar com ambos os pés tocando simultaneamente a barra. Muscle ups com extensão nos braços no topo.',
    tiebreakRule: 'Tempo após finalizar os 20 Bar Muscle-ups'
  }
];

export const INITIAL_ATHLETES = [
  { id: 'ath-1', bib: '101', name: 'Lucas "Thor" Silva', box: 'CrossFit IronBox', category: 'rx_male' },
  { id: 'ath-2', bib: '102', name: 'Gabriel "Beast" Santos', box: 'CrossFit Vulcano', category: 'rx_male' },
  { id: 'ath-3', bib: '103', name: 'Matheus Oliveira', box: 'Alpha Fitness Club', category: 'rx_male' },
  { id: 'ath-4', bib: '104', name: 'Rodrigo "Titan" Lima', box: 'CrossFit HighPeak', category: 'rx_male' },
  { id: 'ath-5', bib: '105', name: 'Felipe Costa', box: 'CrossFit IronBox', category: 'rx_male' },
  { id: 'ath-6', bib: '106', name: 'Bruno "Spartan" Pereira', box: 'Shield CrossFit', category: 'rx_male' },
  
  // Female RX
  { id: 'ath-7', bib: '201', name: 'Camila Rodriguez', box: 'CrossFit HighPeak', category: 'rx_female' },
  { id: 'ath-8', bib: '202', name: 'Mariana "Valkyrie" Souza', box: 'CrossFit IronBox', category: 'rx_female' },
  
  // Scaled Male
  { id: 'ath-9', bib: '301', name: 'Thiago Mendes', box: 'CrossFit Vulcano', category: 'scaled_male' },
  { id: 'ath-10', bib: '302', name: 'Daniel Ferreira', box: 'Shield CrossFit', category: 'scaled_male' }
];

export const INITIAL_SCORES = [
  // WOD 1 Scores
  { id: 'sc-1', wodId: 'wod-1', athleteId: 'ath-1', reps: 145, rounds: 2, tiebreakTime: 195 },
  { id: 'sc-2', wodId: 'wod-1', athleteId: 'ath-2', reps: 160, rounds: 3, tiebreakTime: 180 },
  { id: 'sc-3', wodId: 'wod-1', athleteId: 'ath-3', reps: 132, rounds: 2, tiebreakTime: 210 },
  { id: 'sc-4', wodId: 'wod-1', athleteId: 'ath-4', reps: 150, rounds: 3, tiebreakTime: 188 },
  { id: 'sc-5', wodId: 'wod-1', athleteId: 'ath-5', reps: 120, rounds: 2, tiebreakTime: 230 },
  { id: 'sc-6', wodId: 'wod-1', athleteId: 'ath-6', reps: 110, rounds: 2, tiebreakTime: 240 },

  // WOD 2 Scores (Max Weight)
  { id: 'sc-7', wodId: 'wod-2', athleteId: 'ath-1', weight: 135, tiebreakTime: 210 },
  { id: 'sc-8', wodId: 'wod-2', athleteId: 'ath-2', weight: 142.5, tiebreakTime: 190 },
  { id: 'sc-9', wodId: 'wod-2', athleteId: 'ath-3', weight: 125, tiebreakTime: 240 },
  { id: 'sc-10', wodId: 'wod-2', athleteId: 'ath-4', weight: 137.5, tiebreakTime: 200 },
  { id: 'sc-11', wodId: 'wod-2', athleteId: 'ath-5', weight: 120, tiebreakTime: 250 },
  { id: 'sc-12', wodId: 'wod-2', athleteId: 'ath-6', weight: 115, tiebreakTime: 270 },

  // WOD 3 Scores (For Time)
  { id: 'sc-13', wodId: 'wod-3', athleteId: 'ath-1', timeInSeconds: 435, isCap: false, tiebreakTime: 310 },
  { id: 'sc-14', wodId: 'wod-3', athleteId: 'ath-2', timeInSeconds: 412, isCap: false, tiebreakTime: 290 },
  { id: 'sc-15', wodId: 'wod-3', athleteId: 'ath-3', isCap: true, reps: 85, tiebreakTime: 420 },
  { id: 'sc-16', wodId: 'wod-3', athleteId: 'ath-4', timeInSeconds: 448, isCap: false, tiebreakTime: 325 }
];

export const INITIAL_HEATS = [
  {
    id: 'heat-1',
    wodId: 'wod-1',
    name: 'Bateria 1 - RX Masc (Raias 1 a 3)',
    startTime: '10:00',
    status: 'completed', // 'upcoming', 'running', 'completed'
    lanes: [
      { lane: 1, athleteId: 'ath-5' },
      { lane: 2, athleteId: 'ath-3' },
      { lane: 3, athleteId: 'ath-6' }
    ]
  },
  {
    id: 'heat-2',
    wodId: 'wod-1',
    name: 'Bateria 2 - RX Masc (Bateria Principal)',
    startTime: '10:20',
    status: 'upcoming',
    lanes: [
      { lane: 1, athleteId: 'ath-1' },
      { lane: 2, athleteId: 'ath-2' },
      { lane: 3, athleteId: 'ath-4' }
    ]
  }
];
