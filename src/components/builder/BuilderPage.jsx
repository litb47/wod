import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, Share2, RotateCcw } from 'lucide-react'
import { startOfDay } from 'date-fns'
import TypeSelector from './TypeSelector'
import ExerciseSearch from './ExerciseSearch'
import ExerciseList from './ExerciseList'
import CustomExerciseModal from './CustomExerciseModal'
import Button from '../shared/Button'

function generateKey() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const emptyWorkout = () => ({
  type: 'For Time',
  date: startOfDay(new Date()).toISOString(),
  exercises: [],
  notes: '',
  completed: false,
})

export default function BuilderPage({ addWorkout, onExport, preloadedWorkout, onClearPreload }) {
  const [workout, setWorkout] = useState(() => {
    if (preloadedWorkout) {
      return {
        ...preloadedWorkout,
        date: startOfDay(new Date()).toISOString(),
        exercises: preloadedWorkout.exercises.map(ex => ({ ...ex, _key: generateKey() })),
      }
    }
    return emptyWorkout()
  })

  const [showCustomModal, setShowCustomModal] = useState(false)
  const [saved, setSaved] = useState(false)
  const prevPreload = useRef(preloadedWorkout)

  // Sync preloaded workout when it changes (e.g. from Benchmarks page)
  useEffect(() => {
    if (preloadedWorkout && preloadedWorkout !== prevPreload.current) {
      setWorkout({
        ...preloadedWorkout,
        date: startOfDay(new Date()).toISOString(),
        exercises: preloadedWorkout.exercises.map(ex => ({ ...ex, _key: generateKey() })),
      })
      setSaved(false)
      onClearPreload?.()
    }
    prevPreload.current = preloadedWorkout
  }, [preloadedWorkout, onClearPreload])

  const handleTypeChange = (type) => {
    setWorkout(w => ({ ...w, type }))
    setSaved(false)
  }

  const handleAddExercise = useCallback((exercise) => {
    setWorkout(w => ({
      ...w,
      exercises: [...w.exercises, { ...exercise, _key: generateKey() }],
    }))
    setSaved(false)
  }, [])

  const handleReorder = useCallback((newOrder) => {
    setWorkout(w => ({ ...w, exercises: newOrder }))
    setSaved(false)
  }, [])

  const handleUpdateExercise = useCallback((index, updated) => {
    setWorkout(w => ({
      ...w,
      exercises: w.exercises.map((ex, i) => i === index ? { ...updated, _key: ex._key } : ex),
    }))
    setSaved(false)
  }, [])

  const handleRemoveExercise = useCallback((index) => {
    setWorkout(w => ({
      ...w,
      exercises: w.exercises.filter((_, i) => i !== index),
    }))
    setSaved(false)
  }, [])

  const handleSave = () => {
    if (workout.exercises.length === 0) return
    const toSave = {
      ...workout,
      exercises: workout.exercises.map(({ _key, ...rest }) => rest),
    }
    delete toSave._preloaded
    addWorkout(toSave)
    setSaved(true)
  }

  const handleReset = () => {
    setWorkout(emptyWorkout())
    setSaved(false)
  }

  const handleExport = () => {
    const toExport = {
      ...workout,
      exercises: workout.exercises.map(({ _key, ...rest }) => rest),
    }
    delete toExport._preloaded
    onExport?.(toExport)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 px-4 pb-24"
    >
      <h2 className="text-lg font-bold tracking-tight text-white pt-1">Build WOD</h2>

      {/* Type Selector */}
      <TypeSelector value={workout.type} onChange={handleTypeChange} />

      {/* Exercise Search */}
      <ExerciseSearch
        onSelect={handleAddExercise}
        onCreateCustom={() => setShowCustomModal(true)}
      />

      {/* Exercise List */}
      <ExerciseList
        exercises={workout.exercises}
        onReorder={handleReorder}
        onUpdate={handleUpdateExercise}
        onRemove={handleRemoveExercise}
      />

      {/* Notes */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/40">Notes</label>
        <textarea
          value={workout.notes}
          onChange={(e) => {
            setWorkout(w => ({ ...w, notes: e.target.value }))
            setSaved(false)
          }}
          rows={2}
          className="w-full rounded-xl bg-card border border-white/10 px-3 py-2.5 text-sm text-white outline-none resize-none focus:border-accent/50 placeholder:text-white/20"
          placeholder="Time cap, scaling options, strategy..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={workout.exercises.length === 0}
          className="flex-1"
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save WOD'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={workout.exercises.length === 0}
        >
          <Share2 size={16} />
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw size={16} />
        </Button>
      </div>

      {/* Custom Exercise Modal */}
      <CustomExerciseModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onCreated={handleAddExercise}
      />
    </motion.div>
  )
}
