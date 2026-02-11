import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function NeglectAlert({ alert }) {
  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="mx-4 overflow-hidden"
        >
          <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
            <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-300">Balance Warning</p>
              <p className="mt-0.5 text-xs text-amber-200/70">{alert.message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
