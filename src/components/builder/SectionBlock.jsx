import { useState } from 'react'
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion'
import { GripVertical, ChevronDown, Trash2, Clock } from 'lucide-react'
import { clsx } from 'clsx'
import ExerciseSearch from './ExerciseSearch'
import ExerciseList from './ExerciseList'
import EmomConfig from './EmomConfig'

const SECTION_COLOR_MAP = {
  'Warm-up': 'bg-amber-400',
  'Buy-In': 'bg-lime-400',
  'Strength': 'bg-purple-400',
  'Metcon': 'bg-orange-400',
  'Accessory': 'bg-teal-400',
  'Buy-Out': 'bg-rose-400',
  'Cool-down': 'bg-sky-400',
}

function getSectionColor(title) {
  return SECTION_COLOR_MAP[title] || 'bg-white/40'
}

const FORMAT_OPTIONS = [
  { value: null, label: 'None' },
  { value: 'AMRAP', label: 'AMRAP' },
  { value: 'For Time', label: 'For Time' },
  { value: 'EMOM', label: 'EMOM' },
  { value: 'Sets', label: 'Sets' },
]

const formatColors = {
  AMRAP: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'For Time': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  EMOM: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Sets: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
}

export default function SectionBlock({ section, onAddExercise, onUpdateExercise, onRemoveExercise, onReorder, onDelete, workouts, onCreateCustom, workoutType, onUpdateSection }) {
  const [collapsed, setCollapsed] = useState(false)
  const dragControls = useDragControls()

  const isHybrid = workoutType === 'Hybrid'
  const effectiveFormat = section.formatOverride || null

  const handleFormatChange = (format) => {
    const updates = { formatOverride: format }
    // Clear format-specific fields when switching
    if (format !== 'EMOM') updates.emomConfig = undefined
    if (format !== 'AMRAP' && format !== 'For Time') updates.timeCap = undefined
    // Init EMOM config when selecting EMOM
    if (format === 'EMOM' && !section.emomConfig) {
      updates.emomConfig = { interval: 2, rounds: 10, pattern: 'same' }
    }
    onUpdateSection?.(section.id, updates)
  }

  return (
    <Reorder.Item value={section} dragListener={false} dragControls={dragControls} className="rounded-2xl bg-card/60 border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <motion.div
          onPointerDown={(e) => dragControls.start(e)}
          className="cursor-grab touch-none p-1 -ml-1 text-white/20 hover:text-white/40 transition-colors"
        >
          <GripVertical size={16} />
        </motion.div>
        <div className={`w-[3px] h-4 rounded-full ${getSectionColor(section.title)}`} />
        <span className="text-sm font-semibold text-white tracking-tight">{section.title}</span>
        {section.exercises.length > 0 && (
          <span className="text-[10px] text-white/30">{section.exercises.length}</span>
        )}
        {isHybrid && effectiveFormat && (
          <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-full border', formatColors[effectiveFormat] || 'bg-white/5 text-white/40 border-white/10')}>
            {effectiveFormat}
          </span>
        )}
        <div className="flex-1" />
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setCollapsed(c => !c)}
          className="p-1.5 text-white/25 hover:text-white/50 transition-colors"
        >
          <ChevronDown
            size={14}
            className={clsx('transition-transform duration-200', collapsed && '-rotate-90')}
          />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onDelete}
          className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </motion.button>
      </div>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="p-3 flex flex-col gap-3">
              {/* Format override selector (Hybrid only) */}
              {isHybrid && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Format</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {FORMAT_OPTIONS.map(opt => (
                      <motion.button
                        key={opt.label}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleFormatChange(opt.value)}
                        className={clsx(
                          'rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition-colors',
                          effectiveFormat === opt.value
                            ? (opt.value ? formatColors[opt.value] : 'bg-white/10 text-white/60 border-white/15')
                            : 'bg-white/[0.03] text-white/30 border-transparent'
                        )}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Section-level EMOM config (Hybrid + EMOM override) */}
              {isHybrid && effectiveFormat === 'EMOM' && (
                <EmomConfig
                  config={section.emomConfig}
                  onChange={(emomConfig) => onUpdateSection?.(section.id, { emomConfig })}
                />
              )}

              {/* Section-level time cap (Hybrid + AMRAP/For Time override) */}
              {isHybrid && (effectiveFormat === 'AMRAP' || effectiveFormat === 'For Time') && (
                <div className="flex items-center gap-3 rounded-xl bg-card px-3 py-2.5 border border-white/10">
                  <Clock size={16} className="text-white/30 shrink-0" />
                  <label className="text-xs font-medium text-white/40 shrink-0">
                    {effectiveFormat === 'For Time' ? 'Time Cap' : 'Duration'}
                  </label>
                  <input
                    type="text"
                    value={section.timeCap || ''}
                    onChange={(e) => onUpdateSection?.(section.id, { timeCap: e.target.value })}
                    placeholder={effectiveFormat === 'For Time' ? '15:00' : '12 min'}
                    className="w-full bg-transparent text-sm text-white outline-none text-right placeholder:text-white/20 font-mono"
                  />
                </div>
              )}

              <ExerciseSearch
                onSelect={(ex) => onAddExercise(section.id, ex)}
                onCreateCustom={onCreateCustom}
                workouts={workouts}
              />
              <ExerciseList
                exercises={section.exercises}
                onReorder={(newOrder) => onReorder(section.id, newOrder)}
                onUpdate={(index, updated) => onUpdateExercise(section.id, index, updated)}
                onRemove={(index) => onRemoveExercise(section.id, index)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  )
}
