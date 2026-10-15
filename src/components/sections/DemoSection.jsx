import { useMemo } from 'react'
import { FlaskConical } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import { useStationSimulation } from '../../hooks/useStationSimulation'
import { StationTile } from '../demo/StationTile'
import { StationDetail } from '../demo/StationDetail'
import { EventLog } from '../demo/EventLog'
import { DemoToolbar } from '../demo/DemoToolbar'

export function DemoSection() {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -15% 0px' })
  const [state, dispatch] = useStationSimulation(inView)
  const { stations, gamers, selectedCode, ticks, lastCut } = state

  const selected = stations.find((station) => station.code === selectedCode)
  const playingIds = useMemo(
    () => new Set(stations.filter((s) => s.session).map((s) => s.session.gamerId)),
    [stations],
  )
  const counts = useMemo(
    () => stations.reduce((acc, s) => ({ ...acc, [s.status]: acc[s.status] + 1 }), { available: 0, busy: 0, maintenance: 0 }),
    [stations],
  )
  const selectStation = (code) => dispatch({ type: 'select', code })

  return (
    <section id="demo" aria-labelledby="demo-title" className="section-pad border-t border-line">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="max-w-2xl">
            <h2 id="demo-title" className="text-4xl font-semibold sm:text-5xl">
              El mapa de estaciones, funcionando
            </h2>
            <p className="mt-5 text-lg text-muted">
              Esta es la pantalla que el cajero tiene abierta todo el turno. Haz clic en cualquier estación para ver
              su detalle, recargar saldo, cobrar o sentar a otro gamer. Wacho está por quedarse sin saldo en
              la PC-002: mira lo que pasa cuando llega a S/ 0.00.
            </p>
          </div>
          <p className="flex gap-3 rounded-md border border-line bg-panel p-4 text-sm text-muted">
            <FlaskConical className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden="true" />
            <span>
              Simulación en tu navegador con los datos de prueba reales del sistema (tarifas, rangos, gamers y
              hardware). Nada se guarda.
            </span>
          </p>
        </div>

        <div ref={ref} className="hud-frame mt-10 bg-line-strong/60 p-px md:mt-14">
          <div className="hud-frame bg-panel">
            <DemoToolbar clock={state.clock} counts={counts} speed={state.speed} paused={state.paused} dispatch={dispatch} />

            <div className="grid lg:grid-cols-[1fr_22rem]">
              <div className="border-line p-3 sm:p-4 lg:border-r">
                <ul className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3 sm:gap-3 md:grid-cols-4" aria-label="Estaciones">
                  {stations.map((station) => (
                    <li key={station.code}>
                      <StationTile
                        station={station}
                        gamer={station.session ? gamers[station.session.gamerId] : null}
                        isSelected={station.code === selectedCode}
                        ticks={ticks}
                        onSelect={selectStation}
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-line pt-4">
                  <EventLog entries={state.log} />
                </div>
              </div>

              <aside aria-label={`Detalle de ${selected.code}`} className="border-t border-line p-4 sm:p-5 lg:border-t-0">
                <StationDetail
                  key={selected.code}
                  station={selected}
                  gamers={gamers}
                  playingIds={playingIds}
                  dispatch={dispatch}
                />
              </aside>
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {lastCut ? `Corte automático en ${lastCut.code}: ${lastCut.alias} se quedó sin saldo.` : ''}
        </p>
      </div>
    </section>
  )
}
