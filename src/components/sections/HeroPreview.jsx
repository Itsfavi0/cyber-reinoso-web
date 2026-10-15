import { useEffect, useMemo, useState } from 'react'
import { Minus, Square, X } from 'lucide-react'
import { CATEGORIES, GAMERS } from '../../data/catalog'
import { createInitialState } from '../../hooks/useStationSimulation'
import { useInView } from '../../hooks/useInView'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { formatClock, formatSoles } from '../../lib/billing'
import { StatusGlyph } from '../ui/Status'
import { STATUS_STYLES } from '../ui/statusStyles'

const GAMER_BY_ID = Object.fromEntries(GAMERS.map((gamer) => [gamer.id, gamer]))
const FEATURED_GAMER = GAMER_BY_ID[5] // Dark, rango Diamante

/**
 * Captura "viva" de la ventana del sistema: solo avanzan los cronómetros.
 * Es decorativa; la versión interactiva está en la sección Demo.
 */
export function HeroPreview() {
  const stations = useMemo(() => createInitialState().stations, [])
  const [ref, inView] = useInView()
  const reducedMotion = usePrefersReducedMotion()
  const [extraSeconds, setExtraSeconds] = useState(0)

  useEffect(() => {
    if (!inView || reducedMotion) return undefined
    const timer = setInterval(() => setExtraSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [inView, reducedMotion])

  const busyCount = stations.filter((s) => s.status === 'busy').length

  return (
    <div ref={ref} className="hud-frame bg-line-strong/60 p-px" role="img" aria-label="Vista previa del panel de Cyber Reinoso: mapa de 12 estaciones con sus estados y cronómetros, y el panel del gamer activo.">
      <div className="hud-frame bg-panel" aria-hidden="true">
        <div className="flex h-9 items-center justify-between border-b border-line bg-raised/70 pl-3 text-xs text-muted">
          <span className="flex items-center gap-2 font-mono">
            <span className="size-2 rounded-full bg-mint" />
            Cyber Reinoso — Smart Center Dashboard
          </span>
          <span className="flex h-full text-faint">
            <span className="grid w-10 place-items-center"><Minus className="size-3.5" /></span>
            <span className="grid w-10 place-items-center"><Square className="size-3" /></span>
            <span className="grid w-10 place-items-center"><X className="size-3.5" /></span>
          </span>
        </div>

        <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-[1fr_15rem]">
          <div>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-sm font-semibold text-text">Mapa de estaciones</p>
              <p className="font-mono text-xs text-muted tabular">{busyCount} de 12 en uso</p>
            </div>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {stations.map((station) => (
                <PreviewTile key={station.code} station={station} extraSeconds={extraSeconds} />
              ))}
            </ul>
          </div>

          <div className="hidden flex-col gap-3 md:flex">
            <div className="rounded-md border border-line bg-raised/50 p-3">
              <p className="text-xs text-muted">Gamer en PC-010</p>
              <p className="mt-1 font-display text-lg font-semibold">{FEATURED_GAMER.alias}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-sm bg-ice/10 px-2 py-0.5 text-xs font-medium text-ice">
                Diamante, 15 % de descuento
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
                <div>
                  <dt className="text-faint">Saldo</dt>
                  <dd className="text-sm text-text tabular">{formatSoles(FEATURED_GAMER.balance - 11.33)}</dd>
                </div>
                <div>
                  <dt className="text-faint">Horas</dt>
                  <dd className="text-sm text-text tabular">{Math.floor(FEATURED_GAMER.minutes / 60)} h</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-md border border-line bg-raised/50 p-3">
              <p className="text-xs text-muted">Caja del turno</p>
              <p className="mt-1 font-mono text-2xl text-text tabular">S/ 184.50</p>
              <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-line">
                <span className="w-[62%] bg-ice" />
                <span className="w-[38%] bg-mint" />
              </div>
              <p className="mt-2 flex justify-between text-[11px] text-muted">
                <span>Tiempo de juego</span>
                <span>Kiosco</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewTile({ station, extraSeconds }) {
  const style = STATUS_STYLES[station.status]
  const { session } = station
  const gamer = session && GAMER_BY_ID[session.gamerId]

  return (
    <li className={`rounded-md border ${style.border} ${style.bg} p-2 sm:p-2.5`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-medium text-text sm:text-xs">{station.code}</span>
        <StatusGlyph status={station.status} className="size-2" />
      </div>
      <p className="mt-1 truncate text-[10px] text-faint sm:text-[11px]">{CATEGORIES[station.category].label}</p>
      <p className={`mt-2 font-mono text-[11px] tabular sm:text-xs ${style.text}`}>
        {session ? formatClock(session.elapsedSeconds + extraSeconds) : station.status === 'maintenance' ? 'Mant.' : 'Libre'}
      </p>
      <p className="truncate text-[10px] text-muted sm:text-[11px]">
        {gamer ? gamer.alias : ' '}
      </p>
    </li>
  )
}
