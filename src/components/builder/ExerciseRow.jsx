import { motion } from 'framer-motion'
import { Reorder, useDragControls } from 'framer-motion'
import { GripVertical, Trash2 } from 'lucide-react'
import ModalityBadge from '../shared/ModalityBadge'

export default function ExerciseRow({ exercise, index, onUpdate, onRemove }) {
  const dragControls = useDragControls()

  const handleFieldChange = (field, value) => {
    onUpdate(index, { ...exercise, [field]: value })
  }

  return (
    <Reorder.Item
      value={exercise}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-2 rounded-xl bg-card border border-white/5 p-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Drag handle */}
      <motion.div
        onPointerDown={(e) => dragControls.start(e)}
        className="cursor-grab touch-none text-white/20 hover:text-white/40"
      >
        <GripVertical size={16} />
      </motion.div>

      {/* Modality indicator */}
      <div className={`w-1 h-10 rounded-full shrink-0 ${
        exercise.modality === 'G' ? 'bg-gym' :
        exercise.modality === 'W' ? 'bg-weight' :
        'bg-mono'
      }`} />

      {/* Exercise info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">{exercise.name}</span>
          <ModalityBadge modality={exercise.modality} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={exercise.sets}
              onChange={(e) => handleFieldChange('sets', parseInt(e.target.value) || 0)}
              className="w-10 rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-white text-center outline-none border border-transparent focus:border-white/20"
            />
            <span className="text-[10px] text-white/30">sets</span>
          </div>
          <span className="text-white/20">x</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={exercise.reps}
              onChange={(e) => handleFieldChange('reps', parseInt(e.target.value) || 0)}
              className="w-12 rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-white text-center outline-none border border-transparent focus:border-white/20"
            />
            <span className="text-[10px] text-white/30">reps</span>
          </div>
          <input
            type="text"
            value={exercise.weight}
            onChange={(e) => handleFieldChange('weight', e.target.value)}
            className="w-16 rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-white text-center outline-none border border-transparent focus:border-white/20"
            placeholder="weight"
          />
        </div>
      </div>

      {/* Delete */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onRemove(index)}
        className="text-white/20 hover:text-red-400 transition-colors p-1"
      >
        <Trash2 size={14} />
      </motion.button>
    </Reorder.Item>
  )
}
