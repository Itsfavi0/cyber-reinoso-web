const ROWS = [
  {
    pain: 'Las horas se anotan en un cuaderno y se redondean a ojo. Cada turno se escapan minutos que nadie cobra.',
    fix: 'Cada estación lleva su propio cronómetro y calcula el consumo minuto a minuto con la tarifa de su categoría.',
  },
  {
    pain: 'El cliente pagó una hora, pero "una partida más" se convierte en cuarenta minutos gratis.',
    fix: 'Billetera prepago con Kill Switch: al llegar a S/ 0.00 la sesión se corta sola y la PC queda libre.',
  },
  {
    pain: 'Las gaseosas y los snacks se venden sueltos. Al cierre, la caja y el stock no cuadran.',
    fix: 'Kiosco POS con boleta cabecera-detalle: la venta, el cobro y el descuento de stock van en una sola transacción.',
  },
  {
    pain: 'El que viene todos los días paga lo mismo que el que entra una vez. No hay motivo para volver.',
    fix: 'Rangos Bronce, Plata, Oro y Diamante según horas jugadas, con descuento automático en cada cobro.',
  },
  {
    pain: 'Se va la luz y con ella se pierde quién estaba sentado dónde y cuánto llevaba.',
    fix: 'Las sesiones viven en SQL Server: al volver la energía se reconstruyen con su hora de inicio original.',
  },
]

export function ProblemSection() {
  return (
    <section id="problema" aria-labelledby="problema-title" className="section-pad">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 id="problema-title" className="text-4xl font-semibold sm:text-5xl">
            Un LAN center pierde plata en los detalles
          </h2>
          <p className="mt-5 text-lg text-muted">
            En el día a día de un local, el problema casi nunca son las PCs, sino todo lo que pasa alrededor de
            ellas: el tiempo, la caja, el kiosco y los clientes que vuelven.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <div aria-hidden="true" className="hidden grid-cols-2 gap-10 border-b border-line pb-3 text-sm md:grid">
            <p className="text-faint">Sin sistema</p>
            <p className="text-ice">Con Cyber Reinoso</p>
          </div>
          <ul>
            {ROWS.map((row) => (
              <li key={row.fix} className="grid gap-3 border-b border-line py-6 md:grid-cols-2 md:gap-10">
                <p className="text-muted">
                  <span className="sr-only">Sin sistema: </span>
                  <span aria-hidden="true" className="mb-1 block text-xs text-faint md:hidden">Sin sistema</span>
                  {row.pain}
                </p>
                <p className="text-text">
                  <span className="sr-only">Con Cyber Reinoso: </span>
                  <span aria-hidden="true" className="mb-1 block text-xs text-ice md:hidden">Con Cyber Reinoso</span>
                  {row.fix}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
