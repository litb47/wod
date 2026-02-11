import { useState } from 'react'
import { FileDown, Copy, Check } from 'lucide-react'
import { format } from 'date-fns'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import WorkoutPreview from '../builder/WorkoutPreview'
import { downloadWorkoutPDF } from './pdfGenerator'

function formatForWhatsApp(workout) {
  const dayName = format(new Date(workout.date), 'EEEE')
  const dateStr = format(new Date(workout.date), 'dd/MM/yyyy')

  let text = `\u{1F4C5} *${dayName} WOD* (${dateStr})\n\n`
  text += `\u{1F525} *${workout.type}*\n\n`

  workout.exercises.forEach((ex, i) => {
    const modEmoji = ex.modality === 'W' ? '\u{1F3CB}' : ex.modality === 'G' ? '\u{1F938}' : '\u{1F3C3}'
    const load = ex.weight && ex.weight !== 'BW' ? ` @ ${ex.weight}` : ''
    const sets = ex.sets > 1 ? `${ex.sets} x ` : ''
    text += `${modEmoji} ${ex.name} — ${sets}${ex.reps}${load}\n`
  })

  if (workout.notes) {
    text += `\n\u{1F4DD} _${workout.notes}_`
  }

  text += '\n\n\u{1F4AA} _WOD Architect_'

  return text
}

export default function ExportModal({ workout, isOpen, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!workout) return null

  const handlePDF = () => {
    downloadWorkoutPDF(workout)
  }

  const handleClipboard = async () => {
    const text = formatForWhatsApp(workout)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export WOD">
      <div className="flex flex-col gap-4">
        <WorkoutPreview workout={workout} />

        <div className="flex gap-3">
          <Button onClick={handlePDF} variant="secondary" className="flex-1">
            <FileDown size={16} />
            Download PDF
          </Button>
          <Button onClick={handleClipboard} className="flex-1">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy for WhatsApp'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
