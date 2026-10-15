import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: '¿Es una aplicación web?',
    a: 'No. Cyber Reinoso es una aplicación de escritorio hecha en Python con Tkinter que corre en la PC de la caja. Esta página es solo su vitrina, y la demo de arriba es una recreación en el navegador.',
  },
  {
    q: '¿Qué necesito para instalarlo?',
    a: 'Python 3.10 o superior, Microsoft SQL Server 2019 o 2022 con SSMS, el ODBC Driver 17 o 18 y las librerías pyodbc y Pillow. Se ejecuta el script estructura_db.sql para crear la base y luego python main.py.',
  },
  {
    q: '¿Qué pasa si se va la luz en medio del turno?',
    a: 'Las sesiones se guardan en SQL Server desde que empiezan. Al volver a abrir el sistema, se reconstruyen con su hora de inicio original y el estado real de cada cuenta, así que nadie juega gratis ni pierde su tiempo pagado.',
  },
  {
    q: '¿Puedo cambiar las tarifas por hora?',
    a: 'Sí. Las tarifas de Regular, eSports y Streaming VIP están en la tabla CategoriasEstacion, no escritas en el código. Cada tipo de PC lee la suya al calcular el cobro.',
  },
  {
    q: '¿Cómo se calcula el descuento VIP?',
    a: 'El rango depende de los minutos acumulados: Plata desde 10 horas (5 %), Oro desde 50 (10 %) y Diamante desde 100 (15 %). El descuento se aplica al costo de la sesión y también al proyectar el Kill Switch, para no cortar antes de tiempo a un cliente con descuento.',
  },
  {
    q: '¿Qué puede hacer un cajero y qué un administrador?',
    a: 'El cajero abre y cierra sesiones, recarga billeteras y vende en el kiosco. El administrador, además, da de alta equipos, los envía a mantenimiento, inhabilita cuentas y revisa los reportes de caja.',
  },
  {
    q: '¿En qué estado está el proyecto?',
    a: 'En desarrollo activo. El código completo está en GitHub, incluidos el script de base de datos y usuarios de prueba para probarlo en local.',
  },
]

export function FaqSection() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-title" className="section-pad border-t border-line">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 id="preguntas-title" className="text-4xl font-semibold sm:text-5xl">
          Preguntas frecuentes
        </h2>
        <div className="border-t border-line">
          {FAQS.map((item) => (
            <details key={item.q} className="faq group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-medium text-text [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-200 ease-out group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="max-w-2xl pb-6 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
