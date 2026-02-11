import { useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { subDays, addDays, startOfDay, format } from 'date-fns'
import { Flame, TrendingUp } from 'lucide-react'
import WeeklyRingView from './WeeklyRingView'
import DayCard from './DayCard'
import NeglectAlert from './NeglectAlert'
import { useAnalytics } from '../../hooks/useAnalytics'
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation'

export default function DashboardPage({ workouts, getWorkoutForDate, onSelectDate, toggleComplete }) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))
  const scrollRef = useRef(null)

  const analytics = useAnalytics(workouts)

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      days.push(subDays(startOfDay(new Date()), i))
    }
    return days
  }, [])

  const selectedWorkouts = useMemo(() => {
    return getWorkoutForDate(selectedDate)
  }, [getWorkoutForDate, selectedDate])

  const handleSelectDay = (date) => {
    setSelectedDate(date)
    onSelectDate?.(date)
  }

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => {
      const next = addDays(selectedDate, 1)
      if (next <= startOfDay(new Date())) handleSelectDay(next)
    },
    onSwipeRight: () => {
      const prev = subDays(selectedDate, 1)
      handleSelectDay(prev)
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 pb-24"
      {...swipeHandlers}
    >
      {/* Stats bar */}
      <div className="flex items-center gap-4 px-5 pt-2">
        <div className="flex items-center gap-1.5">
          <Flame size={16} className="text-orange-400" />
          <span className="text-sm font-semibold text-white">{analytics.streak}</span>
          <span className="text-xs text-white/40">day streak</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-white">{analytics.weeklyCompletionRate}%</span>
          <span className="text-xs text-white/40">completion</span>
        </div>
      </div>

      {/* Activity Rings */}
      <WeeklyRingView
        modalityPercentages={analytics.modalityPercentages}
        totalWorkouts={analytics.weeklyWorkouts.length}
      />

      {/* Neglect Alert */}
      <NeglectAlert alert={analytics.neglectAlert} />

      {/* Day Cards */}
      <div className="px-4">
        <h3 className="mb-2 text-sm font-medium text-white/50">This Week</h3>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {weekDays.map(day => (
            <DayCard
              key={day.toISOString()}
              date={day}
              workouts={getWorkoutForDate(day)}
              isSelected={startOfDay(day).toISOString() === selectedDate.toISOString()}
              onClick={() => handleSelectDay(day)}
            />
          ))}
        </div>
      </div>

      {/* Selected Day Detail */}
      <div className="px-4">
        <h3 className="mb-3 text-sm font-medium text-white/50">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h3>
        {selectedWorkouts.length > 0 ? (
          <div className="flex flex-col gap-3">
            {selectedWorkouts.map(workout => (
              <motion.div
                key={workout.id}
                layout
                className="rounded-2xl bg-card p-4 border border-white/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">{workout.type}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleComplete(workout.id)}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      workout.completed
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {workout.completed ? 'Completed' : 'Mark Done'}
                  </motion.button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {workout.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        ex.modality === 'G' ? 'bg-gym/20 text-gym' :
                        ex.modality === 'W' ? 'bg-weight/20 text-weight' :
                        'bg-mono/20 text-mono'
                      }`}>
                        {ex.modality}
                      </span>
                      <span className="text-white/80">{ex.name}</span>
                      <span className="text-white/40 ml-auto">
                        {ex.sets > 1 ? `${ex.sets}x` : ''}{ex.reps} {ex.weight !== 'BW' ? `@ ${ex.weight}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
                {workout.notes && (
                  <p className="mt-2 text-xs text-white/30 italic">{workout.notes}</p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-card/50 p-8 text-center border border-white/5">
            <p className="text-sm text-white/30">Rest day</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
