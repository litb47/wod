import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export default function BenchmarkCard({ wod, onClick }) {
  const isHero = wod.category === 'hero'

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={clsx(
        'flex flex-col rounded-2xl p-4 text-left border transition-colors w-full',
        isHero
          ? 'bg-hero-gold/5 border-hero-gold/20'
          : 'bg-girl-pink/5 border-girl-pink/20',
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className={clsx(
          'text-base font-bold',
          isHero ? 'text-hero-gold' : 'text-girl-pink',
        )}>
          {wod.name}
        </h3>
        <span className={clsx(
          'text-[10px] font-semibold px-2 py-0.5 rounded-full',
          isHero
            ? 'bg-hero-gold/20 text-hero-gold'
            : 'bg-girl-pink/20 text-girl-pink',
        )}>
          {wod.type}
        </span>
      </div>
      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
        {wod.description}
      </p>
    </motion.button>
  )
}
