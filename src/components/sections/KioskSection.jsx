import { useId, useState } from 'react'
import { CupSoda, Cookie, Minus, Plus, CircleCheck, CircleAlert } from 'lucide-react'
import { PRODUCTS } from '../../data/catalog'
import { formatSoles } from '../../lib/billing'

const BUYER = { alias: 'Jojo', balance: 25 }
const FIRST_SALE_NUMBER = 42
const TOP_UP = 10

const POINTS = [
  {
    title: 'Boleta cabecera-detalle',
    text: 'Cada venta es una cabecera (quién, cuándo, cuánto) y sus líneas de detalle, tal como manda la tercera forma normal.',
  },
  {
    title: 'Stock en caliente',
    text: 'El inventario se descuenta en la misma transacción que registra la venta. Lo que se ve en pantalla es lo que hay en el estante.',
  },
  {
    title: 'Primero la base de datos',
    text: 'El cobro se confirma en SQL Server antes de tocar el saldo en memoria. Si algo falla, ROLLBACK y nadie pierde un sol.',
  },
]

export function KioskSection() {
  return (
    <section id="kiosco" aria-labelledby="kiosco-title" className="section-pad border-t border-line">
      <div className="container-page grid gap-12 xl:grid-cols-[0.9fr_1.4fr] xl:gap-16">
        <div>
          <h2 id="kiosco-title" className="text-4xl font-semibold sm:text-5xl">
            Un kiosco que cuadra con la caja
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Snacks y bebidas se cobran desde la misma billetera con la que el gamer paga su tiempo. Prueba a
            venderle algo a Jojo, o fuerza un error de base de datos para ver el ROLLBACK.
          </p>
          <dl className="mt-10 grid gap-6 md:grid-cols-3 xl:grid-cols-1">
            {POINTS.map((point) => (
              <div key={point.title} className="border-l-2 border-line-strong pl-5">
                <dt className="font-display text-lg font-semibold">{point.title}</dt>
                <dd className="mt-1 text-muted">{point.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <PosMockup />
      </div>
    </section>
  )
}

function PosMockup() {
  const failId = useId()
  const [stock, setStock] = useState(() => Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock])))
  const [cart, setCart] = useState({})
  const [balance, setBalance] = useState(BUYER.balance)
  const [saleNumber, setSaleNumber] = useState(FIRST_SALE_NUMBER)
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [result, setResult] = useState(null)

  const lines = PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id], subtotal: p.price * cart[p.id] }))
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0)

  const changeQty = (id, delta) => {
    setResult(null)
    setCart((current) => {
      const qty = Math.min(stock[id], Math.max(0, (current[id] ?? 0) + delta))
      const next = { ...current, [id]: qty }
      if (qty === 0) delete next[id]
      return next
    })
  }

  const topUp = () => {
    setBalance((current) => current + TOP_UP)
    setResult({ ok: true, text: `Recarga de ${formatSoles(TOP_UP)} aplicada a la billetera de ${BUYER.alias}.` })
  }

  const checkout = () => {
    if (lines.length === 0) return
    if (total > balance) {
      setResult({ ok: false, text: `Saldo insuficiente: ${BUYER.alias} tiene ${formatSoles(balance)} y la boleta suma ${formatSoles(total)}. Quita productos o recarga.` })
      return
    }
    if (simulateFailure) {
      setResult({ ok: false, text: 'SQL Server rechazó el INSERT. Se aplicó ROLLBACK: no se guardó la venta y el saldo y el stock siguen intactos.' })
      return
    }
    setStock((current) => {
      const next = { ...current }
      lines.forEach((line) => {
        next[line.id] -= line.qty
      })
      return next
    })
    setBalance((current) => current - total)
    setResult({
      ok: true,
      text: `Venta N.° ${String(saleNumber).padStart(4, '0')} registrada: 1 cabecera y ${lines.length} ${lines.length === 1 ? 'línea' : 'líneas'} de detalle en una sola transacción.`,
    })
    setSaleNumber((n) => n + 1)
    setCart({})
  }

  return (
    <div className="hud-frame bg-line-strong/60 p-px">
      <div className="hud-frame grid bg-panel md:grid-cols-[1fr_17rem]">
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-sm font-semibold">Productos</h3>
            {/* En móvil la boleta queda debajo: este atajo muestra el total y lleva hasta ella. */}
            {lines.length > 0 && (
              <a href="#boleta" className="inline-flex min-h-11 items-center font-mono text-xs text-ice md:hidden">
                Ver boleta: {formatSoles(total)}
              </a>
            )}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => {
              const left = stock[product.id] - (cart[product.id] ?? 0)
              const Icon = product.kind === 'drink' ? CupSoda : Cookie
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => changeQty(product.id, 1)}
                    disabled={left <= 0}
                    className="flex h-full w-full flex-col rounded-md border border-line bg-raised/40 p-3 text-left transition-[border-color,transform] duration-150 ease-out hover:border-line-strong active:scale-[0.97] disabled:opacity-45"
                  >
                    <Icon className="size-4 text-faint" aria-hidden="true" />
                    <span className="mt-2 text-sm leading-snug text-text">
                      <span className="sr-only">Agregar </span>
                      {product.name}
                    </span>
                    <span className="text-xs text-faint">{product.size}</span>
                    <span className="mt-auto flex items-baseline justify-between pt-2">
                      <span className="font-mono text-sm text-ice tabular">
                        <span className="sr-only">, S/ </span>
                        {product.price.toFixed(2)}
                      </span>
                      <span className={`font-mono text-[11px] tabular ${left <= 3 ? 'text-amber' : 'text-faint'}`}>
                        {left > 0 ? (
                          <>
                            <span className="sr-only">, quedan </span>
                            {left} u.
                          </>
                        ) : (
                          'Agotado'
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div id="boleta" className="flex scroll-mt-20 flex-col border-t border-line bg-raised/30 p-4 sm:p-5 md:border-t-0 md:border-l">
          <div className="font-mono text-xs text-muted">
            <p className="text-sm text-text">Boleta N.° {String(saleNumber).padStart(4, '0')}</p>
            <p className="mt-1">Gamer: {BUYER.alias}</p>
            <p className="flex items-center justify-between gap-2">
              <span>
                Saldo: <span className="text-text tabular">{formatSoles(balance)}</span>
              </span>
              <button
                type="button"
                onClick={topUp}
                className="-my-2 inline-flex min-h-9 items-center gap-1 rounded px-2 font-sans text-xs text-ice transition-colors duration-150 hover:bg-ice/10 [@media(pointer:coarse)]:min-h-11"
              >
                <Plus className="size-3" aria-hidden="true" />
                Recargar S/ {TOP_UP}
              </button>
            </p>
            <p>Cajero: renzo_caja</p>
          </div>

          <div className="mt-4 flex-1 border-t border-dashed border-line-strong pt-3">
            {lines.length === 0 ? (
              <p className="text-sm text-faint">Toca un producto para agregarlo a la boleta.</p>
            ) : (
              <ul className="space-y-2" aria-label="Detalle de la boleta">
                {lines.map((line) => (
                  <li key={line.id} className="text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="text-text">{line.name}</span>
                      <span className="shrink-0 font-mono text-muted tabular">{line.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <QtyButton label={`Quitar una unidad de ${line.name}`} onClick={() => changeQty(line.id, -1)} icon={Minus} />
                      <span className="w-6 text-center font-mono text-xs tabular">{line.qty}</span>
                      <QtyButton
                        label={`Agregar una unidad de ${line.name}`}
                        onClick={() => changeQty(line.id, 1)}
                        icon={Plus}
                        disabled={line.qty >= stock[line.id]}
                      />
                      <span className="ml-1 font-mono text-xs text-faint">× {line.price.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 border-t border-dashed border-line-strong pt-3">
            <p className="flex items-baseline justify-between">
              <span className="text-sm text-muted">Total</span>
              <span className="font-mono text-xl text-text tabular">{formatSoles(total)}</span>
            </p>
            <label htmlFor={failId} className="mt-3 flex min-h-11 cursor-pointer items-center gap-2.5 text-xs text-muted">
              <input
                id={failId}
                type="checkbox"
                checked={simulateFailure}
                onChange={(event) => setSimulateFailure(event.target.checked)}
                className="size-4 accent-amber"
              />
              Simular un error de SQL Server
            </label>
            <button
              type="button"
              onClick={checkout}
              disabled={lines.length === 0}
              className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-ice px-4 text-sm font-semibold text-night transition-[background-color,transform] duration-150 ease-out hover:bg-[#9ad5ff] active:scale-[0.97] disabled:opacity-45"
            >
              Cobrar con billetera
            </button>
            <div aria-live="polite" className="mt-3 empty:hidden">
              {result && (
                <p key={result.text} className={`fade-in flex gap-2 text-xs ${result.ok ? 'text-mint' : 'text-signal'}`}>
                  {result.ok ? (
                    <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  )}
                  {result.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QtyButton({ label, onClick, icon: Icon, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-8 items-center justify-center rounded border border-line text-muted transition-colors duration-150 hover:text-text disabled:opacity-40 [@media(pointer:coarse)]:size-11"
    >
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  )
}
