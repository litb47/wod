import { useState } from 'react'
import { motion } from 'framer-motion'
import { benchmarkWods } from '../../data/benchmarkWods'
import BenchmarkCard from './BenchmarkCard'
import BenchmarkDetail from './BenchmarkDetail'

export default function BenchmarksPage({ onLoadToBuilder }) {
  const [selectedWod, setSelectedWod] = useState(null)

  const girls = benchmarkWods.filter(w => w.category === 'girl')
  const heroes = benchmarkWods.filter(w => w.category === 'hero')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 px-4 pb-24"
    >
      <h2 className="text-lg font-bold tracking-tight text-white pt-1">Benchmark WODs</h2>

      {/* The Girls */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-girl-pink/80">The Girls</h3>
        <div className="grid grid-cols-2 gap-2">
          {girls.map(wod => (
            <BenchmarkCard
              key={wod.id}
              wod={wod}
              onClick={() => setSelectedWod(wod)}
            />
          ))}
        </div>
      </div>

      {/* Hero WODs */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-hero-gold/80">Hero WODs</h3>
        <div className="grid grid-cols-2 gap-2">
          {heroes.map(wod => (
            <BenchmarkCard
              key={wod.id}
              wod={wod}
              onClick={() => setSelectedWod(wod)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <BenchmarkDetail
        wod={selectedWod}
        isOpen={!!selectedWod}
        onClose={() => setSelectedWod(null)}
        onLoadToBuilder={onLoadToBuilder}
      />
    </motion.div>
  )
}
