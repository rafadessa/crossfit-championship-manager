// Golf-style scoring: 1st place = 1 point, 2nd = 2 points, etc.
// The athlete with the LEAST total points wins the overall standings.
export const getPointsForRank = (rank) => {
  if (rank <= 0) return 0;
  return rank; // position directly equals points earned
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
  
  let str = String(timeStr).trim();
  if (str.includes('|||PUBLISH:')) {
    str = str.split('|||PUBLISH:')[0];
  }
  
  const parts = str.split(':');
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

  // Filter scores for this specific WOD and hide delayed scores
  const now = Date.now();
  const wodScores = scores.filter(s => {
    if (s.wodId !== wod.id) return false;
    if (s.timeStr && s.timeStr.includes('|||PUBLISH:')) {
      const parts = s.timeStr.split('|||PUBLISH:');
      const publishAt = parseInt(parts[1], 10);
      if (publishAt > now) return false; // Still hidden
    }
    return true;
  });

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
        if (['time_reps', 'for_time'].includes(wod.type)) {
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
        } else if (wod.type === 'time') {
          const sec = scoreObj.timeInSeconds || parseTimeToSeconds(scoreObj.timeStr);
          rawScore = sec;
          scoreDisplay = formatTime(sec);
        } else if (['distance'].includes(wod.type)) {
          const weight = scoreObj.weight || 0;
          rawScore = weight;
          scoreDisplay = `${weight} m`;
        } else if (['height'].includes(wod.type)) {
          const weight = scoreObj.weight || 0;
          rawScore = weight;
          scoreDisplay = `${weight} cm`;
        } else if (['weight', 'max_weight'].includes(wod.type)) {
          const weight = scoreObj.weight || 0;
          rawScore = weight;
          scoreDisplay = `${weight} kg`;
        } else if (['reps', 'calories'].includes(wod.type)) {
          const reps = scoreObj.reps || 0;
          rawScore = reps;
          scoreDisplay = `${reps} ${wod.type === 'calories' ? 'cal' : 'reps'}`;
        } else if (['rounds'].includes(wod.type)) {
          const rounds = scoreObj.rounds || 0;
          rawScore = rounds;
          scoreDisplay = `${rounds} rounds`;
        } else if (['rounds_reps', 'amrap', 'emom'].includes(wod.type)) {
          const reps = scoreObj.reps || 0;
          const rounds = scoreObj.rounds || 0;
          
          if (wod.type === 'rounds_reps') {
            rawScore = (rounds * 100000) + reps; // composite score for rounds + reps
            scoreDisplay = reps > 0 ? `${rounds} rounds + ${reps} reps` : `${rounds} rounds`;
          } else {
            rawScore = reps; // old AMRAP logic where reps is total reps
            scoreDisplay = rounds > 0 ? `${rounds} rounds + ${reps % (wod.repsPerRound || 100000)} reps (${reps} total)` : `${reps} reps`;
          }
        }

        if (scoreObj.tiebreakTime) {
          tiebreakDisplay = formatTime(scoreObj.tiebreakTime);
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

    if (['time_reps', 'for_time'].includes(wod.type)) {
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
    } else if (wod.type === 'time') {
      // Time-only WOD: lower time wins
      if (a.rawScore !== b.rawScore) return a.rawScore - b.rawScore;
      return (a.scoreObj?.tiebreakTime || 99999) - (b.scoreObj?.tiebreakTime || 99999);
    } else {
      // Distance, Height, Weight, Reps, Calories, Rounds: higher raw score wins
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

  // Sort overall standings by total points ascending (least points = winner)
  overall.sort((a, b) => a.totalPoints - b.totalPoints);

  // Add overall rank position
  return overall.map((item, idx) => ({
    ...item,
    overallRank: idx + 1
  }));
};
