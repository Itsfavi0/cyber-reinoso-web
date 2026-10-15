import { useId, useState } from 'react'
import { Plus, Power, Wrench, RotateCcw, LogIn } from 'lucide-react'
import { CATEGORIES } from '../../data/catalog'
import { formatClock, formatSoles, rankFor, nextRank, formatHours } from '../../lib/billing'
import { minutesUntilCut, remainingBalance } from '../../hooks/useStationSimulation'
import { StatusLabel } from '../ui/Status'

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'
const primaryButton = `${buttonBase} bg-ice text-night hover:bg-[#9ad5ff]`
const secondaryButton = `${buttonBase} border border-line-strong text-text hover:border-ice/60`

export function StationDetail({ station, gamers, playingIds, dispatch }) {
  const category = CATEGORIES[station.category]
  const gamer = station.session ? gamers[station.session.gamerId] : null

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-semibold">{station.code}</h3>
          <p className="mt-0.5 text-sm text-muted">
            {category.label}, {formatSoles(category.ratePerHour)} por hora
          </p>
        </div>
        <StatusLabel status={station.status} className="mt-1 text-sm font-medium" />
      </div>
      <p className="mt-2 font-mono text-xs text-faint">
        new {category.className}(tarifa_hora={category.ratePerHour.toFixed(2)})
      </p>

      <div className="mt-5 flex-1">
        {station.status === 'busy' && <SessionPanel station={station} gamer={gamer} dispatch={dispatch} />}
        {station.status === 'available' && (
          <StartPanel station={station} gamers={gamers} playingIds={playingIds} dispatch={dispatch} />
        )}
        {station.status === 'maintenance' && <MaintenancePanel station={station} dispatch={dispatch} />}
      </div>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-line pt-4 text-xs">
        <dt className="text-faint">CPU</dt>
        <dd className="text-muted">{station.cpu}</dd>
        <dt className="text-faint">GPU</dt>
        <dd className="text-muted">{station.gpu}</dd>
        <dt className="text-faint">RAM</dt>
        <dd className="text-muted">{station.ram}</dd>
        <dt className="text-faint">Monitor</dt>
        <dd className="text-muted">{station.monitor}</dd>
      </dl>
    </div>
  )
}

function SessionPanel({ station, gamer, dispatch }) {
  const { session } = station
  const rank = rankFor(gamer.minutes)
  const upcoming = nextRank(gamer.minutes)
  const balance = remainingBalance(station)
  const share = Math.max(0, Math.min(1, balance / session.startBalance))
  const minutesLeft = minutesUntilCut(station)
  const isCritical = minutesLeft <= 5

  return (
    <div>
      <div className="rounded-md border border-line bg-raised/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-lg font-semibold">{gamer.alias}</p>
          <span className="rounded-sm bg-ice/10 px-2 py-0.5 text-xs font-medium text-ice">
            {rank.name}
            {rank.discount > 0 && `, ${rank.discount * 100} % menos`}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {formatHours(gamer.minutes)} jugadas
          {upcoming && `. Le faltan ${formatHours(upcoming.fromMinutes - gamer.minutes)} para ${upcoming.name}.`}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs text-faint">Tiempo</dt>
            <dd className="font-mono text-xl text-text tabular">{formatClock(session.elapsedSeconds)}</dd>
          </div>
          <div>
            <dt className="text-xs text-faint">Saldo restante</dt>
            <dd className={`font-mono text-xl tabular ${isCritical ? 'text-signal' : 'text-text'}`}>{formatSoles(balance)}</dd>
          </div>
        </dl>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div
            className={`h-full origin-left rounded-full transition-transform duration-700 ease-linear ${isCritical ? 'bg-signal' : 'bg-ice'}`}
            style={{ transform: `scaleX(${share})` }}
          />
        </div>
        <p className={`mt-2 text-xs ${isCritical ? 'text-signal' : 'text-muted'}`}>
          {minutesLeft > 0 ? `Kill Switch en ${minutesLeft} min si no recarga.` : 'Corte en el próximo minuto.'}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <button type="button" className={primaryButton} onClick={() => dispatch({ type: 'topUp', gamerId: gamer.id })}>
          <Plus className="size-4" aria-hidden="true" />
          Recargar S/ 5.00
        </button>
        <button type="button" className={secondaryButton} onClick={() => dispatch({ type: 'end', code: station.code })}>
          <Power className="size-4" aria-hidden="true" />
          Cerrar y cobrar
        </button>
      </div>
    </div>
  )
}

function StartPanel({ station, gamers, playingIds, dispatch }) {
  const selectId = useId()
  // Primero quienes tienen saldo: es a quien el cajero sentaría.
  const waiting = Object.values(gamers)
    .filter((gamer) => !playingIds.has(gamer.id))
    .sort((a, b) => Number(b.balance > 0) - Number(a.balance > 0))
  const [chosenId, setChosenId] = useState('')
  const validChoice = waiting.some((gamer) => String(gamer.id) === chosenId) ? chosenId : String(waiting[0]?.id ?? '')

  const start = (event) => {
    event.preventDefault()
    if (validChoice) dispatch({ type: 'start', code: station.code, gamerId: Number(validChoice) })
  }

  return (
    <div>
      {station.cutTick != null && (
        <p className="mb-4 rounded-md border border-signal/40 bg-signal/10 p-3 text-sm text-text">
          El Kill Switch liberó esta estación al llegar a S/ 0.00. Ya puede recibir a otro gamer.
        </p>
      )}
      {waiting.length > 0 ? (
        <form onSubmit={start} className="flex flex-col gap-3">
          <label htmlFor={selectId} className="text-sm font-medium text-text">
            Gamer que se sienta
          </label>
          <select
            id={selectId}
            value={validChoice}
            onChange={(event) => setChosenId(event.target.value)}
            className="min-h-11 rounded-md border border-line-strong bg-night px-3 text-sm text-text"
          >
            {waiting.map((gamer) => (
              <option key={gamer.id} value={gamer.id}>
                {gamer.alias} ({rankFor(gamer.minutes).name}), {gamer.balance > 0 ? `saldo ${formatSoles(gamer.balance)}` : 'sin saldo'}
              </option>
            ))}
          </select>
          <button type="submit" className={primaryButton}>
            <LogIn className="size-4" aria-hidden="true" />
            Iniciar sesión
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted">Todos los gamers registrados ya están jugando.</p>
      )}
      <button
        type="button"
        className={`${secondaryButton} mt-2 w-full`}
        onClick={() => dispatch({ type: 'toggleMaintenance', code: station.code })}
      >
        <Wrench className="size-4" aria-hidden="true" />
        Enviar a mantenimiento
      </button>
    </div>
  )
}

function MaintenancePanel({ station, dispatch }) {
  return (
    <div>
      <p className="text-sm text-muted">
        Retirada del mapa operativo sin borrar nada: el registro y su historial se conservan en la base de datos
        (borrado lógico).
      </p>
      <button
        type="button"
        className={`${secondaryButton} mt-4 w-full`}
        onClick={() => dispatch({ type: 'toggleMaintenance', code: station.code })}
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Alternar estado operativo
      </button>
    </div>
  )
}
