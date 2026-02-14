import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Save, Share2, RotateCcw, ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react'
import { startOfDay, format, addDays, subDays } from 'date-fns'
import { clsx } from 'clsx'
import TypeSelector from './TypeSelector'
import EmomConfig from './EmomConfig'
import StimulusSelector from './StimulusSelector'
import TimeDomainEstimator from './TimeDomainEstimator'
import SectionBlock from './SectionBlock'
import CustomExerciseModal from './CustomExerciseModal'
import Button from '../shared/Button'

function generateKey() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

/* ── Section presets & color mapping ─────────────────────────── */

const SECTION_PRESETS = [
  { title: 'Warm-up', color: 'bg-amber-400' },
  { title: 'Buy-In', color: 'bg-lime-400' },
  { title: 'Strength', color: 'bg-purple-400' },
  { title: 'Metcon', color: 'bg-orange-400' },
  { title: 'Accessory', color: 'bg-teal-400' },
  { title: 'Buy-Out', color: 'bg-rose-400' },
  { title: 'Cool-down', color: 'bg-sky-400' },
]

/* ── Default session template ────────────────────────────────── */

const DEFAULT_TEMPLATE = [
  { title: 'Warm-up' },
  { title: 'Strength' },
  { title: 'Metcon' },
  { title: 'Cool-down' },
]

/* ── Empty workout factory ───────────────────────────────────── */

const emptyWorkout = (date) => ({
  type: 'For Time',
  date: startOfDay(new Date(date)).toISOString(),
  sections: DEFAULT_TEMPLATE.map(t => ({ id: generateKey(), title: t.title, exercises: [] })),
  timeCap: '',
  notes: '',
  completed: false,
  emomConfig: null,
  stimulusIntent: null,
})

/* ── Migrate legacy flat exercises → sections ────────────────── */

function migrateToSections(raw) {
  if (raw.sections) {
    return raw.sections.map(s => {
      const section = {
        id: s.id || generateKey(),
        title: s.title || 'Workout',
        exercises: (s.exercises || []).map(ex => ({ ...ex, _key: generateKey() })),
      }
      // Preserve section-level Hybrid fields if present
      if (s.formatOverride) section.formatOverride = s.formatOverride
      if (s.timeCap) section.timeCap = s.timeCap
      if (s.emomConfig) section.emomConfig = s.emomConfig
      return section
    })
  }
  return [{
    id: generateKey(),
    title: 'Metcon',
    exercises: (raw.exercises || []).map(ex => ({ ...ex, _key: generateKey() })),
  }]
}

/* ── Modality Balance Bar ────────────────────────────────────── */

const MODALITY_COLORS = {
  W: { bg: 'bg-red-500', label: 'W' },
  G: { bg: 'bg-emerald-500', label: 'G' },
  M: { bg: 'bg-blue-500', label: 'M' },
}

function BalanceBar({ exercises }) {
  const counts = useMemo(() => {
    const c = { G: 0, W: 0, M: 0 }
    for (const ex of exercises) {
      if (c[ex.modality] !== undefined) c[ex.modality]++
    }
    return c
  }, [exercises])

  const total = counts.G + counts.W + counts.M
  if (total === 0) return null

  const segments = ['W', 'G', 'M']
    .filter(k => counts[k] > 0)
    .map(k => ({ key: k, pct: Math.round((counts[k] / total) * 100) }))

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Balance</span>
        <div className="flex items-center gap-2">
          {segments.map(s => (
            <span key={s.key} className="text-[10px] text-white/50">
              {MODALITY_COLORS[s.key].label} {s.pct}%
            </span>
          ))}
        </div>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-white/5">
        {segments.map(s => (
          <motion.div
            key={s.key}
            className={`${MODALITY_COLORS[s.key].bg} h-full`}
            initial={{ width: 0 }}
            animate={{ width: `${s.pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Builder Page ────────────────────────────────────────────── */

export default function BuilderPage({ addWorkout, onExport, preloadedWorkout, onClearPreload,
                                       selectedDate, setSelectedDate, workouts }) {
  const [workout, setWorkout] = useState(() => {
    if (preloadedWorkout) {
      return {
        ...preloadedWorkout,
        date: startOfDay(new Date(selectedDate)).toISOString(),
        timeCap: preloadedWorkout.timeCap || '',
        sections: migrateToSections(preloadedWorkout),
        emomConfig: preloadedWorkout.emomConfig || null,
        stimulusIntent: preloadedWorkout.stimulusIntent || null,
      }
    }
    // Check if a saved workout exists for this date
    const dateStr = startOfDay(new Date(selectedDate)).toISOString()
    const existing = workouts.find(w => startOfDay(new Date(w.date)).toISOString() === dateStr)
    if (existing) {
      return {
        ...existing,
        timeCap: existing.timeCap || '',
        sections: migrateToSections(existing),
        emomConfig: existing.emomConfig || null,
        stimulusIntent: existing.stimulusIntent || null,
      }
    }
    return emptyWorkout(selectedDate)
  })

  const [showCustomModal, setShowCustomModal] = useState(false)
  const [saved, setSaved] = useState(() => {
    if (preloadedWorkout) return false
    const dateStr = startOfDay(new Date(selectedDate)).toISOString()
    return workouts.some(w => startOfDay(new Date(w.date)).toISOString() === dateStr)
  })
  const prevPreload = useRef(preloadedWorkout)
  const prevDateRef = useRef(startOfDay(new Date(selectedDate)).toISOString())
  const customModalSectionRef = useRef(null)

  // Derived data
  const allExercises = useMemo(() =>
    workout.sections.flatMap(s => s.exercises), [workout.sections])
  const hasExercises = workout.sections.some(s => s.exercises.length > 0)
  const activeTitles = useMemo(() =>
    new Set(workout.sections.map(s => s.title)), [workout.sections])
  const availablePresets = SECTION_PRESETS.filter(p => !activeTitles.has(p.title))

  // Sync workout when selectedDate changes — load existing or reset
  useEffect(() => {
    const dateStr = startOfDay(new Date(selectedDate)).toISOString()
    if (dateStr === prevDateRef.current) return
    prevDateRef.current = dateStr

    const existing = workouts.find(w => startOfDay(new Date(w.date)).toISOString() === dateStr)
    if (existing) {
      setWorkout({
        ...existing,
        timeCap: existing.timeCap || '',
        sections: migrateToSections(existing),
        emomConfig: existing.emomConfig || null,
        stimulusIntent: existing.stimulusIntent || null,
      })
      setSaved(true)
    } else {
      setWorkout(emptyWorkout(selectedDate))
      setSaved(false)
    }
  }, [selectedDate, workouts])

  // Sync preloaded workout (from Benchmarks page)
  useEffect(() => {
    if (preloadedWorkout && preloadedWorkout !== prevPreload.current) {
      setWorkout({
        ...preloadedWorkout,
        date: startOfDay(new Date(selectedDate)).toISOString(),
        timeCap: preloadedWorkout.timeCap || '',
        sections: migrateToSections(preloadedWorkout),
        emomConfig: preloadedWorkout.emomConfig || null,
        stimulusIntent: preloadedWorkout.stimulusIntent || null,
      })
      setSaved(false)
      onClearPreload?.()
    }
    prevPreload.current = preloadedWorkout
  }, [preloadedWorkout, onClearPreload, selectedDate])

  /* ── Global handlers ────────────────────────────────────── */

  const handleTypeChange = (type) => {
    setWorkout(w => {
      const update = {
        ...w,
        type,
        timeCap: '',
        emomConfig: type === 'EMOM' ? (w.emomConfig || { interval: 2, rounds: 10, pattern: 'same' }) : null,
      }
      // When switching away from Hybrid, strip section-level overrides
      if (type !== 'Hybrid' && w.type === 'Hybrid') {
        update.sections = w.sections.map(({ formatOverride, timeCap, emomConfig, ...rest }) => rest)
      }
      // When switching TO Hybrid, apply smart defaults to template sections
      if (type === 'Hybrid' && w.type !== 'Hybrid') {
        update.sections = w.sections.map(s => {
          if (s.title === 'Strength') return { ...s, formatOverride: 'Sets' }
          if (s.title === 'Metcon') return { ...s, formatOverride: 'AMRAP', timeCap: '12:00' }
          return s
        })
      }
      return update
    })
    setSaved(false)
  }

  /* ── Section-level field updates (Hybrid) ────────────────── */

  const handleUpdateSection = useCallback((sectionId, updates) => {
    setWorkout(w => ({
      ...w,
      sections: w.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }))
    setSaved(false)
  }, [])

  /* ── Section-scoped exercise handlers ───────────────────── */

  const handleAddExercise = useCallback((sectionId, exercise) => {
    setWorkout(w => ({
      ...w,
      sections: w.sections.map(s =>
        s.id === sectionId
          ? { ...s, exercises: [...s.exercises, { ...exercise, _key: generateKey() }] }
          : s
      ),
    }))
    setSaved(false)
  }, [])

  const handleUpdateExercise = useCallback((sectionId, index, updated) => {
    setWorkout(w => ({
      ...w,
      sections: w.sections.map(s =>
        s.id === sectionId
          ? { ...s, exercises: s.exercises.map((ex, i) => i === index ? { ...updated, _key: ex._key } : ex) }
          : s
      ),
    }))
    setSaved(false)
  }, [])

  const handleRemoveExercise = useCallback((sectionId, index) => {
    setWorkout(w => ({
      ...w,
      sections: w.sections.map(s =>
        s.id === sectionId
          ? { ...s, exercises: s.exercises.filter((_, i) => i !== index) }
          : s
      ),
    }))
    setSaved(false)
  }, [])

  const handleReorder = useCallback((sectionId, newOrder) => {
    setWorkout(w => ({
      ...w,
      sections: w.sections.map(s =>
        s.id === sectionId ? { ...s, exercises: newOrder } : s
      ),
    }))
    setSaved(false)
  }, [])

  /* ── Section CRUD ───────────────────────────────────────── */

  const handleAddSection = (title) => {
    setWorkout(w => ({
      ...w,
      sections: [...w.sections, { id: generateKey(), title, exercises: [] }],
    }))
    setSaved(false)
  }

  const handleSectionReorder = useCallback((newOrder) => {
    setWorkout(w => ({ ...w, sections: newOrder }))
    setSaved(false)
  }, [])

  const handleRemoveSection = (sectionId) => {
    const section = workout.sections.find(s => s.id === sectionId)
    if (section?.exercises.length > 0 && !window.confirm(`Delete "${section.title}" section with ${section.exercises.length} exercise(s)?`)) return
    setWorkout(w => ({
      ...w,
      sections: w.sections.filter(s => s.id !== sectionId),
    }))
    setSaved(false)
  }

  /* ── Save / Export / Reset ──────────────────────────────── */

  const handleSave = () => {
    if (!hasExercises) return
    const isHybrid = workout.type === 'Hybrid'
    const cleanSections = workout.sections.map(s => {
      const section = {
        ...s,
        exercises: s.exercises.map(({ _key, ...rest }) => rest),
      }
      // Strip section-level override fields for non-Hybrid workouts
      if (!isHybrid) {
        delete section.formatOverride
        delete section.timeCap
        delete section.emomConfig
      } else {
        // For Hybrid: clean up empty/null section fields
        if (!section.formatOverride) delete section.formatOverride
        if (!section.timeCap) delete section.timeCap
        if (!section.emomConfig) delete section.emomConfig
      }
      return section
    })
    const toSave = {
      ...workout,
      sections: cleanSections,
      exercises: cleanSections.flatMap(s => s.exercises), // backward compat
    }
    // Only include emomConfig/stimulusIntent when relevant
    if (!toSave.emomConfig) delete toSave.emomConfig
    if (!toSave.stimulusIntent) delete toSave.stimulusIntent
    delete toSave._preloaded
    addWorkout(toSave)
    setSaved(true)
  }

  const handleReset = () => {
    if (!window.confirm('Reset this workout? All changes will be lost.')) return
    setWorkout(emptyWorkout(selectedDate))
    setSaved(false)
  }

  const handleExport = () => {
    const cleanSections = workout.sections.map(s => ({
      ...s,
      exercises: s.exercises.map(({ _key, ...rest }) => rest),
    }))
    const toExport = {
      ...workout,
      sections: cleanSections,
      exercises: cleanSections.flatMap(s => s.exercises),
    }
    delete toExport._preloaded
    onExport?.(toExport)
  }

  /* ── Custom exercise modal (section-targeted) ───────────── */

  const handleCustomCreated = useCallback((exercise) => {
    const targetId = customModalSectionRef.current || workout.sections[0]?.id
    if (targetId) {
      handleAddExercise(targetId, exercise)
    }
    customModalSectionRef.current = null
  }, [handleAddExercise, workout.sections])

  /* ── Render ─────────────────────────────────────────────── */

  const isHybrid = workout.type === 'Hybrid'
  const timeLabel = workout.type === 'For Time' ? 'Time Cap' : 'Duration'
  const timePlaceholder = workout.type === 'For Time' ? '15:00' : '12 min'
  const showTimeInput = !isHybrid && workout.type !== 'Strength' && workout.type !== 'EMOM'
  const showEmomConfig = workout.type === 'EMOM'
  const isTimeCapValid = !workout.timeCap || /^\d+([:.]\d{0,2})?\s*(min|m)?$/.test(workout.timeCap.trim())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 px-4 pb-24"
    >
      <h2 className="text-lg font-bold tracking-tight text-white pt-1">Build WOD</h2>

      {/* Date Picker */}
      <div className="flex items-center justify-between rounded-xl bg-card border border-white/10 px-3 py-2">
        <button
          onClick={() => setSelectedDate(prev => subDays(new Date(prev), 1))}
          className="p-1 text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium text-white">
          {format(selectedDate, 'EEEE, MMM d')}
        </span>
        <button
          onClick={() => setSelectedDate(prev => addDays(new Date(prev), 1))}
          className="p-1 text-white/50 hover:text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Type Selector */}
      <TypeSelector value={workout.type} onChange={handleTypeChange} />

      {/* EMOM Config (workout-level, non-Hybrid only) */}
      {showEmomConfig && (
        <EmomConfig
          config={workout.emomConfig}
          onChange={(emomConfig) => {
            setWorkout(w => ({ ...w, emomConfig }))
            setSaved(false)
          }}
        />
      )}

      {/* Time Cap / Duration */}
      {showTimeInput && (
        <div className={clsx(
          "flex items-center gap-3 rounded-xl bg-card px-3 py-2.5 border",
          !isTimeCapValid ? "border-red-500/40" : "border-white/10"
        )}>
          <Clock size={16} className="text-white/30 shrink-0" />
          <label className="text-xs font-medium text-white/40 shrink-0">{timeLabel}</label>
          <input
            type="text"
            value={workout.timeCap}
            onChange={(e) => {
              setWorkout(w => ({ ...w, timeCap: e.target.value }))
              setSaved(false)
            }}
            placeholder={timePlaceholder}
            className={clsx(
              "w-full bg-transparent text-sm outline-none text-right placeholder:text-white/20 font-mono",
              !isTimeCapValid ? "text-red-400" : "text-white"
            )}
          />
        </div>
      )}

      {/* Stimulus Intent */}
      <StimulusSelector
        value={workout.stimulusIntent}
        onChange={(stimulusIntent) => {
          setWorkout(w => ({ ...w, stimulusIntent }))
          setSaved(false)
        }}
      />

      {/* Live Balance Bar */}
      <BalanceBar exercises={allExercises} />

      {/* Time Domain Estimator */}
      <TimeDomainEstimator exercises={allExercises} stimulusIntent={workout.stimulusIntent} />

      {/* Workout Sections */}
      <Reorder.Group axis="y" values={workout.sections} onReorder={handleSectionReorder} className="flex flex-col gap-4">
        {workout.sections.map(section => (
          <SectionBlock
            key={section.id}
            section={section}
            onAddExercise={handleAddExercise}
            onUpdateExercise={handleUpdateExercise}
            onRemoveExercise={handleRemoveExercise}
            onReorder={handleReorder}
            onDelete={() => handleRemoveSection(section.id)}
            workouts={workouts}
            onCreateCustom={() => {
              customModalSectionRef.current = section.id
              setShowCustomModal(true)
            }}
            workoutType={workout.type}
            onUpdateSection={handleUpdateSection}
          />
        ))}
      </Reorder.Group>

      {/* Add Section Chips */}
      {availablePresets.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Add Section</span>
          <div className="flex gap-2 flex-wrap">
            {availablePresets.map(preset => (
              <motion.button
                key={preset.title}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddSection(preset.title)}
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border border-dashed border-white/15 text-white/40 hover:border-white/25 hover:text-white/60 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${preset.color}`} />
                {preset.title}
              </motion.button>
            ))}
          </div>
        </div>
      )}

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
          placeholder="Scaling options, strategy..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!hasExercises}
          className="flex-1"
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save WOD'}
        </Button>
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={!hasExercises}
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
        onCreated={handleCustomCreated}
      />
    </motion.div>
  )
}
