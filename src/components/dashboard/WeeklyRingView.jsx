import { motion } from 'framer-motion'

const RING_CONFIG = [
  { key: 'G', color: '#34D399', dimColor: '#065F46', label: 'Gymnastics' },
  { key: 'W', color: '#F87171', dimColor: '#7F1D1D', label: 'Weightlifting' },
  { key: 'M', color: '#60A5FA', dimColor: '#1E3A5F', label: 'Monostructural' },
]

export default function WeeklyRingView({ modalityPercentages, totalWorkouts }) {
  const size = 200
  const center = size / 2
  const strokeWidth = 16
  const gap = 4

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          {RING_CONFIG.map((ring, i) => {
            const radius = center - strokeWidth / 2 - (strokeWidth + gap) * i
            const circumference = 2 * Math.PI * radius
            const pct = (modalityPercentages[ring.key] || 0) / 100
            const offset = circumference * (1 - pct)

            return (
              <g key={ring.key}>
                {/* Background track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={ring.dimColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  opacity={0.4}
                />
                {/* Animated fill */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                  transform={`rotate(-90 ${center} ${center})`}
                />
              </g>
            )
          })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-tight text-white">{totalWorkouts}</span>
          <span className="text-xs text-white/50">WODs</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-5">
        {RING_CONFIG.map(ring => (
          <div key={ring.key} className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: ring.color }} />
            <span className="text-xs text-white/60">{ring.label}</span>
            <span className="text-xs font-semibold text-white">
              {modalityPercentages[ring.key] || 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
