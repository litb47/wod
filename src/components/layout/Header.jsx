import { format } from 'date-fns'
import { Dumbbell } from 'lucide-react'

export default function Header() {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <Dumbbell size={20} className="text-accent" />
        <h1 className="text-xl font-bold tracking-tight text-white">WOD Architect</h1>
      </div>
      <span className="text-xs text-white/40">
        {format(new Date(), 'EEE, MMM d')}
      </span>
    </div>
  )
}
