import { formatDayClock } from '../../lib/billing'

const TYPE_STYLES = {
  cut: 'text-signal',
  rank: 'text-ice',
  start: 'text-mint',
  recharge: 'text-mint',
  maintenance: 'text-amber',
  warn: 'text-amber',
  end: 'text-muted',
  info: 'text-muted',
}


export function EventLog({ entries }) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold text-text">Bitácora del turno</h3>
      <ol className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-2 font-mono text-xs" tabIndex={0} aria-label="Bitácora del turno, eventos más recientes primero">
        {entries.map((entry) => (
          <li key={entry.id} className="log-entry flex gap-3">
            <time className="shrink-0 text-faint tabular">{formatDayClock(entry.clock)}</time>
            <span className={TYPE_STYLES[entry.type]}>{entry.text}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
