import { format } from 'date-fns'
import ModalityBadge from '../shared/ModalityBadge'

export default function WorkoutPreview({ workout }) {
  if (!workout) return null

  return (
    <div className="rounded-2xl bg-card border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{workout.type}</h3>
        <span className="text-xs text-white/40">
          {format(new Date(workout.date), 'EEE, MMM d')}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {workout.exercises.map((ex, i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <ModalityBadge modality={ex.modality} />
            <span className="text-sm text-white">{ex.name}</span>
            <span className="ml-auto text-xs text-white/50 font-mono">
              {ex.sets > 1 ? `${ex.sets} x ` : ''}{ex.reps}
              {ex.weight && ex.weight !== 'BW' ? ` @ ${ex.weight}` : ''}
            </span>
          </div>
        ))}
      </div>

      {workout.notes && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-xs text-white/40 italic">{workout.notes}</p>
        </div>
      )}
    </div>
  )
}
