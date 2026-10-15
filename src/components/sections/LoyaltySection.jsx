import { useId, useState } from 'react'
import { CATEGORIES } from '../../data/catalog'
import { RANKS, costFor, formatSoles, nextRank, rankFor } from '../../lib/billing'

const MAX_HOURS = 150
const SESSION_HOURS = 3
// Opacidad del acento por rango: la escala se lee como "más intenso = más alto" sin sumar colores nuevos.
const RANK_TINT = ['bg-ice/15', 'bg-ice/35', 'bg-ice/60', 'bg-ice']

export function LoyaltySection() {
  return (
    <section id="fidelizacion" aria-labelledby="fidelizacion-title" className="section-pad border-t border-line">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 id="fidelizacion-title" className="text-4xl font-semibold sm:text-5xl">
            Rangos que se ganan jugando
          </h2>
          <p className="mt-5 text-lg text-muted">
            Cada minuto jugado suma al historial del gamer. Al cruzar un umbral sube de rango, la caja le muestra la
            felicitación en ese momento y el descuento se aplica solo en su siguiente cobro.
          </p>

          <table className="mt-10 w-full text-left text-sm">
            <caption className="sr-only">Rangos de fidelización, horas necesarias y descuento</caption>
            <thead>
              <tr className="border-b border-line-strong text-faint">
                <th scope="col" className="py-3 pr-4 font-normal">Rango</th>
                <th scope="col" className="py-3 pr-4 font-normal">Desde</th>
                <th scope="col" className="py-3 text-right font-normal">Descuento</th>
              </tr>
            </thead>
            <tbody>
              {RANKS.map((rank, index) => (
                <tr key={rank.name} className="border-b border-line">
                  <th scope="row" className="py-4 pr-4 font-display text-base font-semibold">
                    <span className="flex items-center gap-3">
                      <span className={`size-3 rotate-45 rounded-[2px] ${RANK_TINT[index]}`} aria-hidden="true" />
                      {rank.name}
                    </span>
                  </th>
                  <td className="py-4 pr-4 font-mono text-muted tabular">
                    {rank.fromMinutes === 0 ? 'Primera sesión' : `${rank.fromMinutes / 60} h (${rank.fromMinutes} min)`}
                  </td>
                  <td className="py-4 text-right font-mono text-text tabular">{rank.discount * 100} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SavingsCalculator />
      </div>
    </section>
  )
}

function SavingsCalculator() {
  const sliderId = useId()
  const [hours, setHours] = useState(52)
  const [categoryKey, setCategoryKey] = useState('esports')

  const minutes = hours * 60
  const rank = rankFor(minutes)
  const rankIndex = RANKS.indexOf(rank)
  const upcoming = nextRank(minutes)
  const category = CATEGORIES[categoryKey]
  const base = costFor(category.ratePerHour, SESSION_HOURS * 60)
  const final = base * (1 - rank.discount)

  return (
    <div className="hud-frame self-start bg-line-strong/60 p-px">
      <div className="hud-frame bg-panel p-6 sm:p-8">
        <h3 className="text-xl font-semibold">Calcula el ahorro de un gamer</h3>

        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={sliderId} className="text-sm text-muted">
              Horas acumuladas
            </label>
            <output htmlFor={sliderId} className="font-mono text-2xl text-text tabular">
              {hours} h
            </output>
          </div>
          <input
            id={sliderId}
            type="range"
            min="0"
            max={MAX_HOURS}
            step="1"
            value={hours}
            onChange={(event) => setHours(Number(event.target.value))}
            aria-valuetext={`${hours} horas, rango ${rank.name}`}
            className="rank-slider mt-4 w-full"
          />
          <RankScale activeIndex={rankIndex} />
        </div>

        <fieldset className="mt-8">
          <legend className="text-sm text-muted">Sesión de {SESSION_HOURS} horas en</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {Object.entries(CATEGORIES).map(([key, item]) => (
              <label
                key={key}
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-line px-2 text-center text-sm text-muted transition-colors duration-150 has-checked:border-ice has-checked:bg-ice/10 has-checked:text-text has-focus-visible:outline-2 has-focus-visible:outline-ice"
              >
                <input
                  type="radio"
                  name="session-category"
                  value={key}
                  checked={categoryKey === key}
                  onChange={() => setCategoryKey(key)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6" aria-live="polite">
          <div>
            <p className="text-sm text-muted">Rango</p>
            <p className="mt-1 font-display text-2xl font-semibold">{rank.name}</p>
            <p className="text-sm text-ice">{rank.discount > 0 ? `${rank.discount * 100} % de descuento` : 'Sin descuento aún'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Paga por la sesión</p>
            <p className="mt-1 font-mono text-2xl text-text tabular">{formatSoles(final)}</p>
            <p className="text-sm text-muted">
              {rank.discount > 0 ? (
                <>
                  <s className="text-faint">{formatSoles(base)}</s> ahorra {formatSoles(base - final)}
                </>
              ) : (
                'Tarifa completa'
              )}
            </p>
          </div>
        </div>
        <p className="mt-5 text-sm text-faint">
          {upcoming
            ? `Le faltan ${upcoming.fromMinutes / 60 - hours} h para llegar a ${upcoming.name}.`
            : 'Ya está en el rango más alto.'}
        </p>
      </div>
    </div>
  )
}

function RankScale({ activeIndex }) {
  return (
    <ol className="mt-3 grid grid-cols-4 gap-1 text-[11px] sm:text-xs" aria-hidden="true">
      {RANKS.map((rank, index) => (
        <li key={rank.name} className={index === activeIndex ? 'text-ice' : 'text-faint'}>
          <span className={`mb-1.5 block h-1 rounded-full ${index <= activeIndex ? RANK_TINT[index] : 'bg-line'}`} />
          {rank.name}
        </li>
      ))}
    </ol>
  )
}
