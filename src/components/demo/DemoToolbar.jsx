import { Pause, Play, RotateCcw } from 'lucide-react'
import { SPEEDS } from '../../hooks/useStationSimulation'
import { StatusGlyph } from '../ui/Status'
import { formatDayClock } from '../../lib/billing'

const SPEED_OPTIONS = [
  { value: SPEEDS.fast, label: '1 s = 1 min' },
  { value: SPEEDS.realtime, label: 'Tiempo real' },
]

export function DemoToolbar({ clock, counts, speed, paused, dispatch }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line px-3 py-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        <p className="flex items-center gap-2 font-mono text-sm text-text">
          <span className={`size-2 rounded-full ${paused ? 'bg-amber' : 'animate-pulse-dot bg-mint'}`} aria-hidden="true" />
          <span className="tabular" aria-label={`Hora simulada ${formatDayClock(clock)}`}>{formatDayClock(clock)}</span>
          <span className="text-faint">{paused ? 'en pausa' : 'en vivo'}</span>
        </p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted" aria-label="Resumen del mapa">
          <li className="flex items-center gap-1.5"><StatusGlyph status="available" /> {counts.available} disponibles</li>
          <li className="flex items-center gap-1.5"><StatusGlyph status="busy" /> {counts.busy} ocupadas</li>
          <li className="flex items-center gap-1.5"><StatusGlyph status="maintenance" className="size-3" /> {counts.maintenance} en mantenimiento</li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Velocidad de la simulación" className="flex rounded-md border border-line p-0.5">
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={speed === option.value}
              onClick={() => dispatch({ type: 'setSpeed', speed: option.value })}
              className={`min-h-10 rounded-[5px] px-3 text-xs font-medium transition-colors duration-150 ${
                speed === option.value ? 'bg-raised text-text' : 'text-muted hover:text-text'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'togglePause' })}
          className="inline-flex size-11 items-center justify-center rounded-md border border-line text-text transition-[border-color,transform] duration-150 hover:border-line-strong active:scale-[0.95]"
          aria-label={paused ? 'Reanudar simulación' : 'Pausar simulación'}
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'reset' })}
          className="inline-flex size-11 items-center justify-center rounded-md border border-line text-text transition-[border-color,transform] duration-150 hover:border-line-strong active:scale-[0.95]"
          aria-label="Reiniciar simulación"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
