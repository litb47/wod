import { Reorder, AnimatePresence } from 'framer-motion'
import ExerciseRow from './ExerciseRow'

export default function ExerciseList({ exercises, onReorder, onUpdate, onRemove }) {
  if (exercises.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
        <p className="text-sm text-white/30">
          Search and add exercises above
        </p>
      </div>
    )
  }

  return (
    <Reorder.Group
      axis="y"
      values={exercises}
      onReorder={onReorder}
      className="flex flex-col gap-2"
    >
      <AnimatePresence mode="popLayout">
        {exercises.map((ex, i) => (
          <ExerciseRow
            key={ex._key}
            exercise={ex}
            index={i}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  )
}
