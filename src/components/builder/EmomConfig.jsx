import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const INTERVALS = [1, 2, 3]

export default function EmomConfig({ config, onChange }) {
  const { interval = 2, rounds = 10 } = config || {}
  const totalMinutes = interval * rounds

  const update = (field, value) => {
    onChange({ interval, rounds, pattern: 'same', ...config, [field]: value })
  }

  return (
    <div className="rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/[0.08] p-4 flex flex-col gap-3">
      {/* Interval row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Interval</span>
        <div className="flex gap-1.5">
          {INTERVALS.map(val => (
            <motion.button
              key={val}
              whileTap={{ scale: 0.95 }}
              onClick={() => update('interval', val)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors',
                interval === val
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
                  : 'bg-white/[0.04] text-white/35 border-transparent'
              )}
            >
              {val} min
            </motion.button>
          ))}
        </div>
      </div>

      {/* Rounds row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Rounds</span>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={30}
            value={rounds}
            onChange={(e) => update('rounds', Math.max(1, parseInt(e.target.value) || 1))}
            className="w-14 rounded-lg bg-white/[0.06] border border-cyan-500/10 px-2 py-1.5 text-sm text-white text-center outline-none focus:border-cyan-500/30 font-mono"
          />
          <span className="text-[11px] font-mono text-white/40">
            {totalMinutes} min total
          </span>
        </div>
      </div>
    </div>
  )
}
