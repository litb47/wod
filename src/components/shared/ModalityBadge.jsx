import { clsx } from 'clsx'

const config = {
  G: { label: 'G', bg: 'bg-gym/20', text: 'text-gym', full: 'Gymnastics' },
  W: { label: 'W', bg: 'bg-weight/20', text: 'text-weight', full: 'Weightlifting' },
  M: { label: 'M', bg: 'bg-mono/20', text: 'text-mono', full: 'Monostructural' },
}

export default function ModalityBadge({ modality, showFull = false, className = '' }) {
  const c = config[modality]
  if (!c) return null

  return (
    <span className={clsx('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold', c.bg, c.text, className)}>
      {showFull ? c.full : c.label}
    </span>
  )
}
