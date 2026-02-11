import { useMemo } from 'react'
import { subDays, startOfDay, isAfter, isBefore, addDays } from 'date-fns'

export function useAnalytics(workouts) {
  const today = startOfDay(new Date())
  const sevenDaysAgo = subDays(today, 7)
  const threeDaysAgo = subDays(today, 3)

  const weeklyWorkouts = useMemo(() => {
    return workouts.filter(w => {
      const d = startOfDay(new Date(w.date))
      return !isBefore(d, sevenDaysAgo) && !isAfter(d, addDays(today, 1))
    })
  }, [workouts, sevenDaysAgo, today])

  const weeklyModality = useMemo(() => {
    const counts = { G: 0, W: 0, M: 0 }
    weeklyWorkouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (counts[ex.modality] !== undefined) {
          counts[ex.modality] += ex.reps * (ex.sets || 1)
        }
      })
    })
    return counts
  }, [weeklyWorkouts])

  const modalityPercentages = useMemo(() => {
    const total = weeklyModality.G + weeklyModality.W + weeklyModality.M
    if (total === 0) return { G: 0, W: 0, M: 0 }
    return {
      G: Math.round((weeklyModality.G / total) * 100),
      W: Math.round((weeklyModality.W / total) * 100),
      M: Math.round((weeklyModality.M / total) * 100),
    }
  }, [weeklyModality])

  const neglectAlert = useMemo(() => {
    const recentWorkouts = workouts.filter(w => {
      const d = startOfDay(new Date(w.date))
      return !isBefore(d, threeDaysAgo) && !isAfter(d, addDays(today, 1))
    })

    const counts = { G: 0, W: 0, M: 0 }
    recentWorkouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (counts[ex.modality] !== undefined) {
          counts[ex.modality] += ex.reps * (ex.sets || 1)
        }
      })
    })

    const total = counts.G + counts.W + counts.M
    if (total === 0) return null

    const labels = { G: 'Gymnastics', W: 'Weightlifting', M: 'Monostructural' }
    for (const mod of ['G', 'W', 'M']) {
      const pct = (counts[mod] / total) * 100
      if (pct < 10) {
        return {
          modality: mod,
          label: labels[mod],
          percentage: Math.round(pct),
          message: `${labels[mod]} is only ${Math.round(pct)}% of your last 3 days. Consider adding some ${labels[mod].toLowerCase()} work.`,
        }
      }
    }
    return null
  }, [workouts, threeDaysAgo, today])

  const weeklyCompletionRate = useMemo(() => {
    if (weeklyWorkouts.length === 0) return 0
    const completed = weeklyWorkouts.filter(w => w.completed).length
    return Math.round((completed / weeklyWorkouts.length) * 100)
  }, [weeklyWorkouts])

  const streak = useMemo(() => {
    let count = 0
    let checkDate = today
    for (let i = 0; i < 365; i++) {
      const dayStr = startOfDay(checkDate).toISOString()
      const hasCompleted = workouts.some(w =>
        w.completed && startOfDay(new Date(w.date)).toISOString() === dayStr
      )
      if (hasCompleted) {
        count++
        checkDate = subDays(checkDate, 1)
      } else {
        break
      }
    }
    return count
  }, [workouts, today])

  return {
    weeklyModality,
    modalityPercentages,
    neglectAlert,
    weeklyCompletionRate,
    weeklyWorkouts,
    streak,
  }
}
