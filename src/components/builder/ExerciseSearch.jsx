import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, AlertTriangle } from 'lucide-react'
import { subDays, startOfDay, differenceInDays } from 'date-fns'
import { searchExercises } from '../../data/exercises'
import { getCustomExercises } from '../../services/storageService'
import ModalityBadge from '../shared/ModalityBadge'

function getRecentUsage(exerciseName, workouts) {
  const today = startOfDay(new Date())
  const sevenDaysAgo = subDays(today, 7)
  for (const workout of workouts) {
    const d = startOfDay(new Date(workout.date))
    if (d < sevenDaysAgo) continue
    // Check sections first, then fall back to flat exercises
    const allExercises = workout.sections
      ? workout.sections.flatMap(s => s.exercises || [])
      : (workout.exercises || [])
    const match = allExercises.find(ex => ex.name.toLowerCase() === exerciseName.toLowerCase())
    if (match) {
      const wm = match.weightMale ?? match.weight ?? ''
      const wf = match.weightFemale ?? match.weight ?? ''
      const display = (wm && wf && wm !== wf) ? `${wm}/${wf}` : (wm || wf)
      return { daysAgo: differenceInDays(today, d), reps: match.reps, weightDisplay: display }
    }
  }
  return null
}

export default function ExerciseSearch({ onSelect, onCreateCustom, workouts = [] }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const customs = getCustomExercises()
  const results = query.length > 0 ? searchExercises(query, customs) : []
  const showDropdown = focused && (results.length > 0 || query.length > 0)

  const handleSelect = (exercise) => {
    const wm = exercise.defaultWeightMale ?? exercise.defaultWeight
    const wf = exercise.defaultWeightFemale ?? exercise.defaultWeight
    onSelect({
      name: exercise.name,
      modality: exercise.modality,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      weightMale: wm,
      weightFemale: wf,
    })
    setQuery('')
    inputRef.current?.blur()
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl bg-card border border-white/10 px-3 py-2.5">
        <Search size={16} className="text-white/30 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search exercises..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-40 mt-1 max-h-64 overflow-y-auto rounded-xl bg-card border border-white/10 shadow-2xl origin-top"
          >
            {results.map((ex) => {
              const recentUsage = getRecentUsage(ex.name, workouts)
              return (
                <div key={ex.id}>
                  <button
                    onMouseDown={() => handleSelect(ex)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
                  >
                    <ModalityBadge modality={ex.modality} />
                    <span className="text-sm text-white">{ex.name}</span>
                    <span className="ml-auto text-[10px] text-white/30">
                      {ex.defaultReps}r
                    </span>
                  </button>
                  {recentUsage && (
                    <div className="flex items-center gap-1.5 px-3 pb-2 -mt-1">
                      <AlertTriangle size={12} className="text-amber-400" />
                      <span className="text-[11px] text-amber-300/80">
                        Performed {recentUsage.daysAgo === 0 ? 'today' : `${recentUsage.daysAgo}d ago`} ({recentUsage.reps}r{recentUsage.weightDisplay && recentUsage.weightDisplay !== 'BW' ? ` @ ${recentUsage.weightDisplay}` : ''})
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

            {query.length > 0 && results.length === 0 && (
              <div className="px-3 py-3 text-center text-xs text-white/30">
                No exercises found
              </div>
            )}

            <button
              onMouseDown={() => {
                onCreateCustom?.()
                setQuery('')
              }}
              className="flex w-full items-center gap-2 border-t border-white/5 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
            >
              <Plus size={14} className="text-accent" />
              <span className="text-sm text-accent">Create Custom Exercise</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
