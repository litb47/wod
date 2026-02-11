import { motion } from 'framer-motion'
import { LayoutDashboard, Hammer, Trophy } from 'lucide-react'
import { clsx } from 'clsx'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'builder', label: 'Builder', icon: Hammer },
  { id: 'benchmarks', label: 'Benchmarks', icon: Trophy },
]

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-black/80 backdrop-blur-xl border-t border-white/5 px-4 pb-[env(safe-area-inset-bottom)] pt-2">
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'relative flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors',
              isActive ? 'text-accent' : 'text-white/30',
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-2 h-0.5 w-6 rounded-full bg-accent"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <Icon size={20} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
