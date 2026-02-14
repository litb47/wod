import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const TYPES = ['AMRAP', 'For Time', 'EMOM', 'Strength', 'Hybrid']

const typeColors = {
  AMRAP: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'For Time': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  EMOM: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Strength: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Hybrid: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
}

export default function TypeSelector({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {TYPES.map(type => (
        <motion.button
          key={type}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(type)}
          className={clsx(
            'relative rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap border transition-colors',
            value === type
              ? typeColors[type]
              : 'bg-card/50 text-white/40 border-transparent',
          )}
        >
          {value === type && (
            <motion.div
              layoutId="type-indicator"
              className="absolute inset-0 rounded-xl border border-white/20"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          )}
          {type}
        </motion.button>
      ))}
    </div>
  )
}
