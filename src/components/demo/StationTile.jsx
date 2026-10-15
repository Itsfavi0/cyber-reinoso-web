import { CATEGORIES, STATUS } from '../../data/catalog'
import { formatClock, formatSoles } from '../../lib/billing'
import { remainingBalance } from '../../hooks/useStationSimulation'
import { StatusGlyph } from '../ui/Status'
import { STATUS_STYLES } from '../ui/statusStyles'

const CUT_FLASH_TICKS = 4

export function StationTile({ station, gamer, isSelected, ticks, onSelect }) {
  const { session } = station
  const style = STATUS_STYLES[station.status]
  const justCut = station.cutTick != null && ticks - station.cutTick < CUT_FLASH_TICKS
  const balance = session ? remainingBalance(station) : 0
  const isLow = session && balance < 1

  const summary = [
    station.code,
    CATEGORIES[station.category].label,
    justCut ? 'Corte automático, ahora disponible' : STATUS[station.status],
    gamer && `${gamer.alias}, saldo ${formatSoles(balance)}`,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <button
      type="button"
      onClick={() => onSelect(station.code)}
      aria-pressed={isSelected}
      aria-label={summary}
      className={`group relative flex min-h-[6.5rem] w-full flex-col rounded-md border p-2.5 text-left transition-[transform,border-color] duration-150 ease-out active:scale-[0.97] sm:min-h-[7.25rem] sm:p-3 ${
        justCut ? 'cut-flash border-signal/70 bg-signal/10' : `${style.border} ${style.bg} hover:border-line-strong`
      } ${isSelected ? 'ring-2 ring-ice ring-offset-2 ring-offset-panel' : ''}`}
    >
      <span className="flex items-center justify-between gap-1">
        <span className="font-mono text-xs font-medium text-text sm:text-sm">{station.code}</span>
        <StatusGlyph status={justCut ? 'available' : station.status} className="size-2.5" />
      </span>
      <span className="mt-0.5 truncate text-[11px] text-faint sm:text-xs">{CATEGORIES[station.category].label}</span>

      <span className="mt-auto pt-2">
        {justCut ? (
          <span className="block font-mono text-xs font-medium text-signal">Corte S/ 0.00</span>
        ) : session ? (
          <>
            <span className="block font-mono text-xs text-ice tabular sm:text-sm">{formatClock(session.elapsedSeconds)}</span>
            <span className="flex items-baseline justify-between gap-1 text-[11px] sm:text-xs">
              <span className="truncate text-muted">{gamer.alias}</span>
              <span className={`font-mono tabular ${isLow ? 'text-signal' : 'text-muted'}`}>{balance.toFixed(2)}</span>
            </span>
          </>
        ) : (
          <span className={`block font-mono text-xs ${style.text}`}>{station.status === 'maintenance' ? 'En taller' : 'Libre'}</span>
        )}
      </span>
    </button>
  )
}
