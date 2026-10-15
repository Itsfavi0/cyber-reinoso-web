import { Wrench } from 'lucide-react'
import { STATUS } from '../../data/catalog'

// Cada estado tiene color Y forma propia para que se lea sin depender del color.
export const STATUS_STYLES = {
  available: { text: 'text-mint', border: 'border-mint/40', bg: 'bg-mint/8' },
  busy: { text: 'text-ice', border: 'border-ice/45', bg: 'bg-ice/10' },
  maintenance: { text: 'text-amber', border: 'border-amber/40', bg: 'stripes' },
}

export function StatusGlyph({ status, className = 'size-2.5' }) {
  if (status === 'maintenance') return <Wrench className={`${className} text-amber`} strokeWidth={2.5} aria-hidden="true" />
  if (status === 'busy') return <span className={`${className} inline-block rounded-full bg-ice`} aria-hidden="true" />
  return <span className={`${className} inline-block rounded-full border-2 border-mint`} aria-hidden="true" />
}

export function StatusLabel({ status, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${STATUS_STYLES[status].text} ${className}`}>
      <StatusGlyph status={status} />
      {STATUS[status]}
    </span>
  )
}
