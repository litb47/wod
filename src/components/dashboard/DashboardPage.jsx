import { useMemo, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { eachDayOfInterval, startOfWeek, addDays, startOfDay, format } from 'date-fns'
import { Flame, TrendingUp, CalendarPlus } from 'lucide-react'
import WeeklyRingView from './WeeklyRingView'
import DayCard from './DayCard'
import NeglectAlert from './NeglectAlert'
import { useAnalytics } from '../../hooks/useAnalytics'

const SECTION_COLORS = {
  'Warm-up': 'bg-amber-400',
  'Buy-In': 'bg-lime-400',
  'Strength': 'bg-purple-400',
  'Metcon': 'bg-orange-400',
  'Accessory': 'bg-teal-400',
  'Buy-Out': 'bg-rose-400',
  'Cool-down': 'bg-sky-400',
}

export default function DashboardPage({ workouts, getWorkoutForDate, toggleComplete,
                                         selectedDate, setSelectedDate, onPlanWorkout }) {
  const scrollRef = useRef(null)
  const selectedCardRef = useRef(null)

  const analytics = useAnalytics(workouts)

  // 14-day sliding window: start of current week (Monday) → 13 days forward
  const days = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    return eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 13),
    })
  }, [])

  const selectedWorkouts = useMemo(() => {
    return getWorkoutForDate(selectedDate)
  }, [getWorkoutForDate, selectedDate])

  // Build a Set of date strings that have workouts for fast lookup
  const datesWithWorkouts = useMemo(() => {
    const set = new Set()
    for (const w of workouts) {
      set.add(startOfDay(new Date(w.date)).toISOString())
    }
    return set
  }, [workouts])

  // Auto-scroll selected card into view
  useEffect(() => {
    if (selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [selectedDate])

  const handleSelectDay = useCallback((date) => {
    setSelectedDate(date)
  }, [setSelectedDate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 pb-24"
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

      {/* 14-Day Strip */}
      <div className="px-4">
        <h3 className="mb-2 text-sm font-medium text-white/50">Schedule</h3>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {days.map(day => {
            const dayStr = startOfDay(day).toISOString()
            const isSelected = dayStr === startOfDay(new Date(selectedDate)).toISOString()
            const dayWorkouts = getWorkoutForDate(day)
            const hasWorkout = datesWithWorkouts.has(dayStr)

            return (
              <div
                key={dayStr}
                ref={isSelected ? selectedCardRef : null}
              >
                <DayCard
                  date={day}
                  workouts={dayWorkouts}
                  isSelected={isSelected}
                  onClick={() => handleSelectDay(day)}
                  hasWorkout={hasWorkout}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      <div className="px-4">
        <h3 className="mb-3 text-sm font-medium text-white/50">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h3>
        {selectedWorkouts.length > 0 ? (
          <div className="flex flex-col gap-3">
            {selectedWorkouts.map(workout => {
              // Gather exercises — handle both flat and sectioned formats
              const exercises = workout.exercises || []

              return (
                <motion.div
                  key={workout.id}
                  layout
                  className="rounded-2xl bg-card p-4 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{workout.type}</span>
                      {workout.type === 'EMOM' && workout.emomConfig ? (
                        <span className="text-xs text-cyan-400/70 font-mono">
                          {workout.emomConfig.rounds} rds / {workout.emomConfig.interval} min ({workout.emomConfig.interval * workout.emomConfig.rounds} min)
                        </span>
                      ) : workout.timeCap ? (
                        <span className="text-xs text-white/40">
                          {workout.type === 'For Time' ? `Cap ${workout.timeCap}` : workout.timeCap}
                        </span>
                      ) : null}
                      {workout.stimulusIntent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">
                          {workout.stimulusIntent}
                        </span>
                      )}
                    </div>
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

                  {/* Section headers if available */}
                  {workout.sections ? (
                    <div className="flex flex-col gap-3">
                      {workout.sections.map(section => (
                        <div key={section.id}>
                          {workout.sections.length > 1 && (
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className={`w-[3px] h-3 rounded-full ${SECTION_COLORS[section.title] || 'bg-white/30'}`} />
                              <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium">{section.title}</p>
                            </div>
                          )}
                          <div className="flex flex-col gap-1.5">
                            {section.exercises.map((ex, i) => (
                              <ExerciseDetailRow key={i} ex={ex} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {exercises.map((ex, i) => (
                        <ExerciseDetailRow key={i} ex={ex} />
                      ))}
                    </div>
                  )}

                  {workout.notes && (
                    <p className="mt-2 text-xs text-white/30 italic">{workout.notes}</p>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onPlanWorkout(selectedDate)}
            className="flex flex-col items-center gap-3 rounded-2xl bg-card/50 p-8 border border-dashed border-white/10 w-full"
          >
            <CalendarPlus size={32} className="text-accent/60" />
            <p className="text-sm font-medium text-white/70">Plan WOD for {format(selectedDate, 'EEEE')}</p>
            <p className="text-xs text-white/30">Tap to start building</p>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

function ExerciseDetailRow({ ex }) {
  const weightStr = (() => {
    const m = ex.weightMale ?? ex.weight
    const f = ex.weightFemale ?? ex.weight
    if (!m && !f) return ''
    if (m === 'BW' && f === 'BW') return ''
    if (m === 'BW' || f === 'BW') return ''
    if (m && f && m !== f) return `@ ${m}/${f}`
    return m ? `@ ${m}` : ''
  })()

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
        ex.modality === 'G' ? 'bg-gym/20 text-gym' :
        ex.modality === 'W' ? 'bg-weight/20 text-weight' :
        'bg-mono/20 text-mono'
      }`}>
        {ex.modality}
      </span>
      <span className="text-white/80">{ex.name}</span>
      <span className="text-white/40 ml-auto">
        {ex.sets > 1 ? `${ex.sets}x` : ''}{ex.reps} {weightStr}
      </span>
    </div>
  )
}
