import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { startOfDay } from 'date-fns'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import DashboardPage from './components/dashboard/DashboardPage'
import BuilderPage from './components/builder/BuilderPage'
import BenchmarksPage from './components/benchmarks/BenchmarksPage'
import ExportModal from './components/export/ExportModal'
import { useWorkouts } from './hooks/useWorkouts'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [exportWorkout, setExportWorkout] = useState(null)
  const [preloadedWorkout, setPreloadedWorkout] = useState(null)
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))

  const { workouts, addWorkout, updateWorkout, deleteWorkout, toggleComplete, getWorkoutForDate } = useWorkouts()

  const handlePlanWorkout = (date) => {
    setSelectedDate(startOfDay(new Date(date)))
    setActiveTab('builder')
  }

  const handleLoadToBuilder = (benchmarkWod) => {
    setPreloadedWorkout({
      type: benchmarkWod.type,
      exercises: benchmarkWod.exercises,
      notes: benchmarkWod.notes || '',
      completed: false,
    })
    setActiveTab('builder')
  }

  const handleExport = (workout) => {
    setExportWorkout(workout)
  }

  return (
    <div className="relative min-h-dvh bg-black">
      <Header />

      <main className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <DashboardPage
              key="dashboard"
              workouts={workouts}
              getWorkoutForDate={getWorkoutForDate}
              toggleComplete={toggleComplete}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onPlanWorkout={handlePlanWorkout}
            />
          )}
          {activeTab === 'builder' && (
            <BuilderPage
              key="builder"
              addWorkout={addWorkout}
              onExport={handleExport}
              preloadedWorkout={preloadedWorkout}
              onClearPreload={() => setPreloadedWorkout(null)}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              workouts={workouts}
            />
          )}
          {activeTab === 'benchmarks' && (
            <BenchmarksPage
              key="benchmarks"
              onLoadToBuilder={handleLoadToBuilder}
            />
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      <ExportModal
        workout={exportWorkout}
        isOpen={!!exportWorkout}
        onClose={() => setExportWorkout(null)}
      />
    </div>
  )
}
