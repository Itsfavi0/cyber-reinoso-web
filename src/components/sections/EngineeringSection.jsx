import { ArchitectureDiagram } from '../engineering/ArchitectureDiagram'
import { SqlSnippets } from '../engineering/SqlSnippets'

const DECISIONS = [
  {
    title: 'Mediator en main.py',
    text: 'Los paneles no se hablan entre sí: todo pasa por AppCyberReinoso. Cambiar un panel no rompe los demás.',
  },
  {
    title: 'DAO como única puerta a la base',
    text: 'La interfaz consume métodos como procesar_compra_kiosco() y nunca ve una línea de SQL.',
  },
  {
    title: 'Polimorfismo para las tarifas',
    text: 'PC_Regular, PC_eSports y PC_StreamingVIP heredan de una clase abstracta y cada una calcula su costo, sin cadenas de if.',
  },
  {
    title: 'Concurrencia sin hilos',
    text: 'Un bucle de eventos de 1 s audita más de 12 sesiones en paralelo, revisa stock y refresca el mapa sin congelar la ventana ni crear bloqueos.',
  },
  {
    title: 'Lenguaje del dominio',
    text: 'Los botones dicen "Enviar a mantenimiento" o "Alternar estado operativo", no "Eliminar". La interfaz describe el negocio.',
  },
  {
    title: 'Códigos que se generan solos',
    text: 'Al dar de alta hardware, el DAO lee el mayor código existente y propone el siguiente (PC-013) en un campo de solo lectura.',
  },
]

export function EngineeringSection() {
  return (
    <section id="ingenieria" aria-labelledby="ingenieria-title" className="section-pad border-t border-line">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <ArchitectureDiagram />
          </div>
          <div className="order-1 lg:order-2">
            <h2 id="ingenieria-title" className="text-4xl font-semibold sm:text-5xl">
              Ingeniería que aguanta un turno completo
            </h2>
            <p className="mt-5 text-lg text-muted">
              Programación orientada a objetos, Clean Code y diseño guiado por el dominio, sobre una base de datos
              normalizada en tercera forma normal. Así está organizado por dentro.
            </p>
            <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {DECISIONS.map((decision) => (
                <div key={decision.title}>
                  <dt className="font-display text-lg font-semibold">{decision.title}</dt>
                  <dd className="mt-1.5 text-sm text-muted">{decision.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h3 className="text-2xl font-semibold sm:text-3xl">SQL de verdad, no de ejemplo</h3>
            <p className="mt-4 text-muted">
              Tres consultas tal como están en el repositorio. Todas usan parámetros (?) en lugar de concatenar texto,
              lo que cierra la puerta a la inyección SQL.
            </p>
          </div>
          <SqlSnippets />
        </div>
      </div>
    </section>
  )
}
