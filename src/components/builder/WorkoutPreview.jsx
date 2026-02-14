import { format } from 'date-fns'
import ModalityBadge from '../shared/ModalityBadge'

const SECTION_COLOR_MAP = {
  'Warm-up': 'bg-amber-400',
  'Buy-In': 'bg-lime-400',
  'Strength': 'bg-purple-400',
  'Metcon': 'bg-orange-400',
  'Accessory': 'bg-teal-400',
  'Buy-Out': 'bg-rose-400',
  'Cool-down': 'bg-sky-400',
}

function formatTimeDomain(workout) {
  if (workout.type === 'EMOM' && workout.emomConfig) {
    const { interval, rounds } = workout.emomConfig
    return `${rounds} rds, every ${interval} min (${interval * rounds} min)`
  }
  if (!workout.timeCap) return null
  if (workout.type === 'For Time') return `Cap ${workout.timeCap}`
  return workout.timeCap
}

function formatWeight(ex) {
  const m = ex.weightMale ?? ex.weight
  const f = ex.weightFemale ?? ex.weight
  if (!m && !f) return ''
  if (m === 'BW' && f === 'BW') return ''
  if (m === 'BW' || f === 'BW') return ''
  if (m && f && m !== f) return `@ ${m}/${f}`
  if (m) return `@ ${m}`
  if (f) return `@ ${f}`
  return ''
}

export default function WorkoutPreview({ workout }) {
  if (!workout) return null

  const timeDomain = formatTimeDomain(workout)

  // Normalize: use sections if available, fall back to flat exercises
  const sections = workout.sections && workout.sections.length > 0
    ? workout.sections
    : [{ id: '_flat', title: '', exercises: workout.exercises || [] }]

  const showSectionHeaders = sections.length > 1 || (sections.length === 1 && sections[0].title && sections[0].title !== 'Metcon')

  return (
    <div className="rounded-2xl bg-card border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-bold text-white">{workout.type}</h3>
          {timeDomain && (
            <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
              {timeDomain}
            </span>
          )}
          {workout.stimulusIntent && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">
              {workout.stimulusIntent}
            </span>
          )}
        </div>
        <span className="text-xs text-white/40">
          {format(new Date(workout.date), 'EEE, MMM d')}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map(section => (
          <div key={section.id}>
            {showSectionHeaders && section.title && (
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-[3px] h-3 rounded-full ${SECTION_COLOR_MAP[section.title] || 'bg-white/30'}`} />
                <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium">
                  {section.title}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {section.exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <ModalityBadge modality={ex.modality} />
                  <span className="text-sm text-white">{ex.name}</span>
                  <span className="ml-auto text-xs text-white/50 font-mono">
                    {ex.sets > 1 ? `${ex.sets} x ` : ''}{ex.reps}
                    {formatWeight(ex) ? ` ${formatWeight(ex)}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {workout.notes && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-xs text-white/40 italic">{workout.notes}</p>
        </div>
      )}
    </div>
  )
}
