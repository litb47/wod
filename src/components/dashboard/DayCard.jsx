import { motion } from 'framer-motion'
import { format, isToday } from 'date-fns'
import { CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'

const typeColors = {
  AMRAP: 'text-yellow-400',
  'For Time': 'text-orange-400',
  EMOM: 'text-cyan-400',
  Strength: 'text-purple-400',
}

export default function DayCard({ date, workouts, isSelected, onClick }) {
  const today = isToday(date)
  const hasWorkouts = workouts.length > 0
  const allCompleted = hasWorkouts && workouts.every(w => w.completed)

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={clsx(
        'flex flex-col items-center rounded-2xl px-4 py-3 min-w-[72px] transition-colors',
        isSelected
          ? 'bg-accent/20 border border-accent/50'
          : 'bg-card border border-transparent',
        today && !isSelected && 'border-white/10',
      )}
    >
      <span className="text-[10px] uppercase tracking-wider text-white/40">
        {format(date, 'EEE')}
      </span>
      <span className={clsx(
        'mt-0.5 text-lg font-bold',
        today ? 'text-accent' : 'text-white',
      )}>
        {format(date, 'd')}
      </span>

      {hasWorkouts ? (
        <div className="mt-1.5 flex flex-col items-center gap-0.5">
          {workouts.slice(0, 1).map(w => (
            <span key={w.id} className={clsx('text-[10px] font-medium', typeColors[w.type])}>
              {w.type}
            </span>
          ))}
          {allCompleted && (
            <CheckCircle2 size={14} className="text-green-400 mt-0.5" />
          )}
        </div>
      ) : (
        <div className="mt-1.5 h-5 flex items-center">
          <span className="text-[10px] text-white/20">Rest</span>
        </div>
      )}
    </motion.button>
  )
}
