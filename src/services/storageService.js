import { startOfDay } from 'date-fns'

const PREFIX = 'wod_architect_'
const KEYS = {
  workouts: `${PREFIX}workouts`,
  customExercises: `${PREFIX}custom_exercises`,
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
