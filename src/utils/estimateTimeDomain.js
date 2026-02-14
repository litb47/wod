// Rough per-rep durations by modality (seconds)
const AVG_SECONDS = { W: 4, G: 2.5, M: 3 }

// Rest between sets in seconds
const REST_BETWEEN_SETS = 30

// Stimulus intent time ranges (minutes)
export const STIMULUS_RANGES = {
  sprint: { min: 0, max: 5, label: '<5 min' },
  moderate: { min: 8, max: 12, label: '8-12 min' },
  long: { min: 15, max: 20, label: '15-20 min' },
  endurance: { min: 20, max: Infinity, label: '20+ min' },
}

export function estimateTimeDomain(exercises) {
  if (!exercises || exercises.length === 0) return null

  let totalSeconds = 0
  for (const ex of exercises) {
    const sets = ex.sets || 1
    const reps = parseInt(ex.reps) || 0
    const avgSec = AVG_SECONDS[ex.modality] || 3
    totalSeconds += sets * reps * avgSec + (sets - 1) * REST_BETWEEN_SETS
  }

  return Math.round(totalSeconds / 60)
}

export function checkStimulusConflict(estimatedMinutes, intent) {
  if (!intent || estimatedMinutes === null) return null
  const range = STIMULUS_RANGES[intent]
  if (!range) return null

  if (estimatedMinutes < range.min) {
    return {
      type: 'under',
      message: `~${estimatedMinutes} min is below ${intent} range (${range.label})`,
      estimated: estimatedMinutes,
      intent,
    }
  }
  if (estimatedMinutes > range.max) {
    return {
      type: 'over',
      message: `~${estimatedMinutes} min exceeds ${intent} range (${range.label})`,
      estimated: estimatedMinutes,
      intent,
    }
  }
  return null
}
