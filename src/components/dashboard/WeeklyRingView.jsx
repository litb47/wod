import { motion } from 'framer-motion'

const RING_CONFIG = [
  { key: 'G', color: '#34D399', dimColor: '#065F46', label: 'Gymnastics', gradientFrom: '#6EE7B7', gradientTo: '#059669', glowColor: '#34D399' },
  { key: 'W', color: '#F87171', dimColor: '#7F1D1D', label: 'Weightlifting', gradientFrom: '#FCA5A5', gradientTo: '#DC2626', glowColor: '#F87171' },
  { key: 'M', color: '#60A5FA', dimColor: '#1E3A5F', label: 'Monostructural', gradientFrom: '#93C5FD', gradientTo: '#2563EB', glowColor: '#60A5FA' },
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
          <defs>
            {RING_CONFIG.map(ring => (
              <linearGradient key={`grad-${ring.key}`} id={`ring-gradient-${ring.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={ring.gradientFrom} />
                <stop offset="100%" stopColor={ring.gradientTo} />
              </linearGradient>
            ))}
            {RING_CONFIG.map(ring => (
              <filter key={`filter-${ring.key}`} id={`ring-glow-${ring.key}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feFlood floodColor={ring.glowColor} floodOpacity="0.6" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

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
                  opacity={0.3}
                />
                {/* Animated fill */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={`url(#ring-gradient-${ring.key})`}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                  transform={`rotate(-90 ${center} ${center})`}
                  filter={`url(#ring-glow-${ring.key})`}
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
