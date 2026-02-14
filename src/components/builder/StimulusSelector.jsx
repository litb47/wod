import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const OPTIONS = [
  { value: 'sprint', label: 'Sprint', sub: '<5 min' },
  { value: 'moderate', label: 'Moderate', sub: '8-12 min' },
  { value: 'long', label: 'Long', sub: '15-20 min' },
  { value: 'endurance', label: 'Endurance', sub: '20+ min' },
]

export default function StimulusSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Stimulus Intent</span>
      <div className="flex gap-1.5">
        {OPTIONS.map(opt => {
          const selected = value === opt.value
          return (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(selected ? null : opt.value)}
              className={clsx(
                'flex-1 flex flex-col items-center rounded-lg px-3 py-1.5 border transition-colors',
                selected
                  ? 'bg-white/[0.08] text-white/80 border-white/[0.12]'
                  : 'bg-white/[0.04] text-white/35 border-white/[0.06]'
              )}
            >
              <span className="text-[11px] font-medium">{opt.label}</span>
              <span className="text-[9px] text-white/20 mt-0.5">{opt.sub}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
