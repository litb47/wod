import { useState, useCallback } from 'react'
import { startOfDay } from 'date-fns'
import * as storage from '../services/storageService'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(() => storage.getWorkouts())

  const addWorkout = useCallback((workout) => {
    const newWorkout = { ...workout, id: workout.id || generateId() }
    const updated = storage.saveWorkout(newWorkout)
    setWorkouts(updated)
    return newWorkout
  }, [])

  const updateWorkout = useCallback((workout) => {
    const updated = storage.saveWorkout(workout)
    setWorkouts(updated)
  }, [])

  const deleteWorkout = useCallback((id) => {
    const updated = storage.deleteWorkout(id)
    setWorkouts(updated)
  }, [])

  const toggleComplete = useCallback((id) => {
    const all = storage.getWorkouts()
    const target = all.find(w => w.id === id)
    if (target) {
      target.completed = !target.completed
      const updated = storage.saveWorkout(target)
      setWorkouts(updated)
    }
  }, [])

  const getWorkoutForDate = useCallback((date) => {
    const dayStart = startOfDay(new Date(date)).toISOString()
    return workouts.filter(w => {
      return startOfDay(new Date(w.date)).toISOString() === dayStart
    })
  }, [workouts])

  return { workouts, addWorkout, updateWorkout, deleteWorkout, toggleComplete, getWorkoutForDate }
}
