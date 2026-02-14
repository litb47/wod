import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { estimateTimeDomain, checkStimulusConflict } from '../../utils/estimateTimeDomain'

export default function TimeDomainEstimator({ exercises, stimulusIntent }) {
  const estimated = useMemo(() => estimateTimeDomain(exercises), [exercises])
  const conflict = useMemo(
    () => checkStimulusConflict(estimated, stimulusIntent),
    [estimated, stimulusIntent]
  )

  if (estimated === null) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Est. Time</span>
        <span className="text-[11px] font-mono text-white/40">~{estimated} min</span>
      </div>

      <AnimatePresence>
        {conflict && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2.5 rounded-lg bg-amber-500/[0.06] border border-amber-500/[0.08] px-3 py-2">
              <div className="w-1 h-4 rounded-full bg-amber-400/60 shrink-0" />
              <p className="text-[11px] text-amber-300/70">
                <span className="text-amber-300 font-medium">~{conflict.estimated} min</span>
                {conflict.type === 'over' ? ' exceeds ' : ' is below '}
                <span className="text-amber-300 font-medium capitalize">{conflict.intent}</span>
                {' '}range
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
