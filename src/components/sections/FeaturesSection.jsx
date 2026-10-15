import { Archive, FileText, PlugZap } from 'lucide-react'
import { CATEGORIES } from '../../data/catalog'

const MAX_RATE = 5

export function FeaturesSection() {
  return (
    <section id="funciones" aria-labelledby="funciones-title" className="section-pad border-t border-line">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 id="funciones-title" className="text-4xl font-semibold sm:text-5xl">
            Todo el local, desde la caja
          </h2>
          <p className="mt-5 text-lg text-muted">
            Una sola aplicación para el cajero y el administrador. Cada módulo resuelve una parte del turno y todos
            comparten la misma base de datos.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:mt-16 md:grid-cols-2 lg:grid-cols-6">
          <KillSwitchTile />
          <RatesTile />
          <RolesTile />
          <SmallTile icon={PlugZap} title="Sobrevive a los cortes de luz">
            Al reiniciar, las sesiones activas se reconstruyen desde SQL Server con su hora de inicio real, su saldo y
            el estado de la cuenta.
          </SmallTile>
          <SmallTile icon={Archive} title="Nada se borra">
            Ventas, gamers y equipos nunca reciben un DELETE. Una PC se retira a mantenimiento y una cuenta se
            inhabilita, pero el historial queda para auditar.
          </SmallTile>
          <SmallTile icon={FileText} title="Cierre de caja en PDF">
            Reportes de caja e informes de cierre exportados con reportlab, listos para imprimir o enviar al dueño.
          </SmallTile>
        </div>
      </div>
    </section>
  )
}

function Tile({ className = '', children }) {
  return <article className={`min-w-0 rounded-lg border border-line bg-panel p-6 sm:p-7 ${className}`}>{children}</article>
}

function KillSwitchTile() {
  return (
    <Tile className="flex flex-col md:col-span-2 lg:col-span-4 lg:row-span-2">
      <h3 className="text-2xl font-semibold sm:text-3xl">Billetera prepago con Kill Switch</h3>
      <p className="mt-3 max-w-xl text-muted">
        El gamer recarga antes de jugar. Cada segundo, el motor proyecta el costo del próximo minuto con su
        descuento VIP: si ya no le alcanza, cierra la sesión, cobra exactamente lo que quedaba y libera la estación.
        Sin discusiones en el mostrador.
      </p>
      <BalanceChart />
      <pre className="mt-4 overflow-x-auto rounded-md border border-line bg-night px-4 py-3 font-mono text-xs leading-relaxed text-muted sm:text-sm">
        <code>
          <span className="text-ice">if</span> tarifa_proximo_minuto * (1 - descuento) {'>'} saldo:
          {'\n    '}
          <span className="text-signal">cerrar_sesion(es_corte_automatico=True)</span>
        </code>
      </pre>
    </Tile>
  )
}

/**
 * Saldo que baja en línea recta hasta S/ 0.00, con el punto exacto del corte.
 * Las líneas son un SVG elástico y las etiquetas son HTML, así el texto no se encoge en móvil.
 */
function BalanceChart() {
  return (
    <figure className="mt-8 flex-1">
      <div className="relative h-44 pl-12 font-mono text-[11px] sm:h-52 sm:text-xs" role="img" aria-label="Gráfico: el saldo de S/ 5.00 baja minuto a minuto hasta S/ 0.00; en ese momento la sesión se corta y la estación queda disponible.">
        <span className="absolute top-0 left-0 -translate-y-1/2 text-faint" aria-hidden="true">5.00</span>
        <span className="absolute bottom-6 left-0 translate-y-1/2 text-faint" aria-hidden="true">0.00</span>

        <div className="relative h-[calc(100%-1.5rem)]" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            {[0, 33, 66].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--color-line)" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
            ))}
            <line x1="0" x2="100" y1="100" y2="100" stroke="var(--color-line-strong)" vectorEffect="non-scaling-stroke" />
            <path d="M0 0 L66 100 L0 100 Z" fill="var(--color-ice)" opacity="0.08" />
            <path d="M0 0 L66 100" fill="none" stroke="var(--color-ice)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <line x1="66" x2="66" y1="-6" y2="100" stroke="var(--color-signal)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            <path d="M66 100 L100 100" stroke="var(--color-mint)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="absolute bottom-0 left-[66%] size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-signal" />
          <span className="absolute top-0 left-[66%] pl-2 leading-snug">
            <span className="block text-signal">corte</span>
            <span className="block text-muted">PC liberada</span>
          </span>
        </div>

        <div className="mt-2 flex justify-between" aria-hidden="true">
          <span className="text-faint">inicio</span>
          <span className="text-mint">Disponible</span>
        </div>
      </div>
    </figure>
  )
}

function RatesTile() {
  return (
    <Tile className="lg:col-span-2">
      <h3 className="text-xl font-semibold">Tres categorías, tres tarifas</h3>
      <p className="mt-2 text-sm text-muted">
        Cada tipo de PC es una subclase que calcula su propio costo. Las tarifas viven en la base de datos.
      </p>
      <ul className="mt-5 space-y-3">
        {Object.values(CATEGORIES).map((category) => (
          <li key={category.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-text">{category.label}</span>
              <span className="font-mono text-muted tabular">S/ {category.ratePerHour.toFixed(2)}/h</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-line" aria-hidden="true">
              <div className="h-full rounded-full bg-ice" style={{ width: `${(category.ratePerHour / MAX_RATE) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Tile>
  )
}

function RolesTile() {
  return (
    <Tile className="lg:col-span-2">
      <h3 className="text-xl font-semibold">Acceso por roles</h3>
      <p className="mt-2 text-sm text-muted">
        El administrador gestiona equipos, cuentas y reportes; el cajero atiende sesiones, recargas y kiosco. La
        contraseña distingue mayúsculas.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <span className="rounded-md border border-line-strong px-3 py-1.5">Administrador</span>
        <span className="rounded-md border border-line-strong px-3 py-1.5">Cajero</span>
      </div>
      <p className="mt-4 font-mono text-xs text-muted">
        <span className="text-signal">ADMIN</span> ≠ <span className="text-mint">admin</span>
      </p>
    </Tile>
  )
}

function SmallTile({ icon: Icon, title, children }) {
  return (
    <Tile className="lg:col-span-2">
      <Icon className="size-6 text-ice" strokeWidth={1.75} aria-hidden="true" />
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{children}</p>
    </Tile>
  )
}
