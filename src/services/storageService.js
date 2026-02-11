import { subDays, startOfDay, format } from 'date-fns'
import { exercises } from '../data/exercises'
import { benchmarkWods } from '../data/benchmarkWods'

const PREFIX = 'wod_architect_'
const KEYS = {
  workouts: `${PREFIX}workouts`,
  customExercises: `${PREFIX}custom_exercises`,
  initialized: `${PREFIX}initialized`,
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ─── Workouts ────────────────────────────────────────────

export function getWorkouts() {
  return read(KEYS.workouts) || []
}

export function saveWorkout(workout) {
  const workouts = getWorkouts()
  const idx = workouts.findIndex(w => w.id === workout.id)
  if (idx >= 0) {
    workouts[idx] = workout
  } else {
    workouts.push(workout)
  }
  write(KEYS.workouts, workouts)
  return workouts
}

export function deleteWorkout(id) {
  const workouts = getWorkouts().filter(w => w.id !== id)
  write(KEYS.workouts, workouts)
  return workouts
}

export function getWorkoutsByDateRange(startDate, endDate) {
  const workouts = getWorkouts()
  const start = startOfDay(new Date(startDate)).getTime()
  const end = startOfDay(new Date(endDate)).getTime() + 86400000
  return workouts.filter(w => {
    const t = new Date(w.date).getTime()
    return t >= start && t < end
  })
}

// ─── Custom Exercises ────────────────────────────────────

export function getCustomExercises() {
  return read(KEYS.customExercises) || []
}

export function saveCustomExercise(exercise) {
  const customs = getCustomExercises()
  customs.push(exercise)
  write(KEYS.customExercises, customs)
  return customs
}

// ─── Seed Data ───────────────────────────────────────────

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function pickRandom(arr, n = 1) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, n)
}

const WOD_TYPES = ['AMRAP', 'For Time', 'EMOM', 'Strength']

function createSeedWorkout(date, forceComplete = true) {
  const type = WOD_TYPES[Math.floor(Math.random() * WOD_TYPES.length)]
  const numExercises = type === 'Strength' ? 2 : Math.floor(Math.random() * 3) + 2
  const selected = pickRandom(exercises, numExercises)

  return {
    id: generateId(),
    date: startOfDay(date).toISOString(),
    type,
    exercises: selected.map(ex => ({
      name: ex.name,
      modality: ex.modality,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
      weight: ex.defaultWeight,
    })),
    notes: '',
    completed: forceComplete,
  }
}

export function initializeWithSeedData() {
  if (read(KEYS.initialized)) return false

  const workouts = []
  const today = new Date()

  for (let i = 13; i >= 1; i--) {
    const day = subDays(today, i)
    const dayOfWeek = day.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (Math.random() > 0.5) {
        workouts.push(createSeedWorkout(day, true))
      }
    } else {
      workouts.push(createSeedWorkout(day, true))
    }
  }

  // Today: add one incomplete workout
  workouts.push(createSeedWorkout(today, false))

  write(KEYS.workouts, workouts)
  write(KEYS.initialized, true)
  return true
}
