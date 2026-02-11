import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus } from 'lucide-react'
import { searchExercises } from '../../data/exercises'
import { getCustomExercises } from '../../services/storageService'
import ModalityBadge from '../shared/ModalityBadge'

export default function ExerciseSearch({ onSelect, onCreateCustom }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const customs = getCustomExercises()
  const results = query.length > 0 ? searchExercises(query, customs) : []
  const showDropdown = focused && (results.length > 0 || query.length > 0)

  const handleSelect = (exercise) => {
    onSelect({
      name: exercise.name,
      modality: exercise.modality,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      weight: exercise.defaultWeight,
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
            {results.map((ex) => (
              <button
                key={ex.id}
                onMouseDown={() => handleSelect(ex)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
              >
                <ModalityBadge modality={ex.modality} />
                <span className="text-sm text-white">{ex.name}</span>
                <span className="ml-auto text-[10px] text-white/30">
                  {ex.defaultReps}r
                </span>
              </button>
            ))}

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
