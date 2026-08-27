// Official CrossFit Points Table (Standard 100 Points Scale)
export const POINT_TABLE = [
  100, 95, 90, 87, 84, 81, 78, 75, 72, 69, 
  66, 63, 60, 57, 54, 51, 48, 45, 42, 39,
  36, 33, 30, 27, 24, 21, 18, 15, 12, 9
];

export const getPointsForRank = (rank) => {
  if (rank <= 0) return 0;
  if (rank <= POINT_TABLE.length) return POINT_TABLE[rank - 1];
  return Math.max(1, 10 - (rank - POINT_TABLE.length));
};

// Formats seconds (e.g. 385.4) to "06:25.4" or "06:25"
export const formatTime = (totalSeconds, includeMs = false) => {
  if (totalSeconds === undefined || totalSeconds === null || isNaN(totalSeconds)) return '--:--';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const ms = Math.floor((totalSeconds % 1) * 10);

  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');

  return includeMs ? `${formattedMins}:${formattedSecs}.${ms}` : `${formattedMins}:${formattedSecs}`;
};

// Parses "06:25" or "385" to total seconds number
export const parseTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  if (typeof timeStr === 'number') return timeStr;
  
  const parts = String(timeStr).trim().split(':');
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  }
  return parseFloat(timeStr) || 0;
};

// Calculate ranking for a specific WOD
export const calculateWodRankings = (wod, athletes, scores) => {
  if (!wod) return [];

  // Filter scores for this specific WOD
  const wodScores = scores.filter(s => s.wodId === wod.id);

  // Map athletes in this category with their scores
  const results = athletes
    .filter(a => a.category === wod.category || wod.category === 'ALL')
    .map(athlete => {
      const scoreObj = wodScores.find(s => s.athleteId === athlete.id);
      
      let rawScore = null;
      let scoreDisplay = 'N/A';
      let tiebreakDisplay = '--';
      let capStatus = null; // 'CAP' or 'COMPLETED'

      if (scoreObj) {
        if (wod.type === 'for_time') {
          if (scoreObj.isCap) {
            // CAP: reps completed before cap
            rawScore = scoreObj.reps || 0;
            scoreDisplay = `CAP + ${scoreObj.reps} reps`;
            capStatus = 'CAP';
          } else {
            // Completed in time
            const sec = scoreObj.timeInSeconds || parseTimeToSeconds(scoreObj.timeStr);
            rawScore = sec;
            scoreDisplay = formatTime(sec);
            capStatus = 'FINISH';
          }
          if (scoreObj.tiebreakTime) {
            tiebreakDisplay = formatTime(scoreObj.tiebreakTime);
          }
        } else if (wod.type === 'amrap') {
          const reps = scoreObj.reps || 0;
          const rounds = scoreObj.rounds || 0;
          rawScore = reps;
          scoreDisplay = rounds > 0 ? `${rounds} rounds + ${reps % wod.repsPerRound || 0} reps (${reps} total)` : `${reps} reps`;
          if (scoreObj.tiebreakTime) {
            tiebreakDisplay = formatTime(scoreObj.tiebreakTime);
          }
        } else if (wod.type === 'max_weight') {
          const weight = scoreObj.weight || 0;
          rawScore = weight;
          scoreDisplay = `${weight} kg`;
          if (scoreObj.tiebreakTime) {
            tiebreakDisplay = formatTime(scoreObj.tiebreakTime);
          }
        }
      }

      return {
        athlete,
        wodId: wod.id,
        scoreObj,
        rawScore,
        scoreDisplay,
        tiebreakDisplay,
        capStatus,
        hasScore: !!scoreObj
      };
    });

  // Sort athletes according to WOD type logic
  results.sort((a, b) => {
    if (!a.hasScore && !b.hasScore) return 0;
    if (!a.hasScore) return 1;
    if (!b.hasScore) return -1;

    if (wod.type === 'for_time') {
      // If both completed in time, lowest time wins
      if (a.capStatus === 'FINISH' && b.capStatus === 'FINISH') {
        if (a.rawScore !== b.rawScore) return a.rawScore - b.rawScore;
        // Tiebreak: earlier tiebreak time wins
        return (a.scoreObj?.tiebreakTime || 99999) - (b.scoreObj?.tiebreakTime || 99999);
      }
      // Finished before cap beats CAP
      if (a.capStatus === 'FINISH') return -1;
      if (b.capStatus === 'FINISH') return 1;
      
      // Both CAP: higher reps wins
      if (a.rawScore !== b.rawScore) return b.rawScore - a.rawScore;
      return (a.scoreObj?.tiebreakTime || 99999) - (b.scoreObj?.tiebreakTime || 99999);
    } else {
      // AMRAP or Max Weight: higher raw score wins
      if (a.rawScore !== b.rawScore) return b.rawScore - a.rawScore;
      // Tiebreak time: lower time wins tiebreak
      return (a.scoreObj?.tiebreakTime || 99999) - (b.scoreObj?.tiebreakTime || 99999);
    }
  });

  // Assign ranks and points
  let currentRank = 1;
  return results.map((item, index) => {
    if (!item.hasScore) {
      return { ...item, rank: '-', points: 0 };
    }
    const rank = index + 1;
    const points = getPointsForRank(rank);
    return { ...item, rank, points };
  });
};

// Calculate Overall Standings per Category
export const calculateOverallStandings = (category, athletes, wods, scores) => {
  const categoryAthletes = athletes.filter(a => a.category === category);
  const categoryWods = wods.filter(w => w.category === category || w.category === 'ALL');

  // Precompute rankings for each WOD
  const wodRankingsMap = {};
  categoryWods.forEach(wod => {
    wodRankingsMap[wod.id] = calculateWodRankings(wod, categoryAthletes, scores);
  });

  // Aggregate points per athlete
  const overall = categoryAthletes.map(athlete => {
    let totalPoints = 0;
    const wodBreakdown = {};

    categoryWods.forEach(wod => {
      const rankings = wodRankingsMap[wod.id] || [];
      const athleteRankObj = rankings.find(r => r.athlete.id === athlete.id);
      
      if (athleteRankObj && athleteRankObj.hasScore) {
        totalPoints += athleteRankObj.points;
        wodBreakdown[wod.id] = {
          rank: athleteRankObj.rank,
          points: athleteRankObj.points,
          scoreDisplay: athleteRankObj.scoreDisplay
        };
      } else {
        wodBreakdown[wod.id] = {
          rank: '-',
          points: 0,
          scoreDisplay: 'N/A'
        };
      }
    });

    return {
      athlete,
      totalPoints,
      wodBreakdown
    };
  });

  // Sort overall standings by total points descending
  overall.sort((a, b) => b.totalPoints - a.totalPoints);

  // Add overall rank position
  return overall.map((item, idx) => ({
    ...item,
    overallRank: idx + 1
  }));
};
