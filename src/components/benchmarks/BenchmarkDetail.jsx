import { clsx } from 'clsx'
import { Loader, Dumbbell } from 'lucide-react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import ModalityBadge from '../shared/ModalityBadge'

export default function BenchmarkDetail({ wod, isOpen, onClose, onLoadToBuilder }) {
  if (!wod) return null

  const isHero = wod.category === 'hero'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={wod.name}>
      <div className="flex flex-col gap-4">
        {/* Type badge */}
        <div className="flex items-center gap-2">
          <span className={clsx(
            'text-xs font-semibold px-3 py-1 rounded-full',
            isHero
              ? 'bg-hero-gold/20 text-hero-gold'
              : 'bg-girl-pink/20 text-girl-pink',
          )}>
            {wod.type}
          </span>
          <span className={clsx(
            'text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-white/40',
          )}>
            {isHero ? 'Hero WOD' : 'The Girls'}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60">{wod.description}</p>

        {/* Exercises */}
        <div className="flex flex-col gap-2">
          {wod.exercises.map((ex, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <ModalityBadge modality={ex.modality} />
              <span className="text-sm text-white flex-1">{ex.name}</span>
              <span className="text-xs text-white/50 font-mono">
                {ex.sets > 1 ? `${ex.sets} x ` : ''}{ex.reps}
                {ex.weight && ex.weight !== 'BW' ? ` @ ${ex.weight}` : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Notes */}
        {wod.notes && (
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-white/40 leading-relaxed">{wod.notes}</p>
          </div>
        )}

        {/* Load to Builder */}
        <Button
          onClick={() => {
            onLoadToBuilder(wod)
            onClose()
          }}
          className="w-full mt-2"
        >
          <Dumbbell size={16} />
          Load into Builder
        </Button>
      </div>
    </Modal>
  )
}
