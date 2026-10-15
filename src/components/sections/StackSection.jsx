const STACK = [
  { layer: 'Lenguaje', tech: 'Python 3.10+', role: 'Lógica de negocio, POO y manejo de eventos.' },
  { layer: 'Interfaz', tech: 'Tkinter y ttk', role: 'Ventanas modales, Canvas desplazable y grillas en modo oscuro.' },
  { layer: 'Base de datos', tech: 'Microsoft SQL Server', role: 'Motor relacional normalizado en 3FN, con transacciones ACID.' },
  { layer: 'Conectividad', tech: 'pyodbc (ODBC Driver 17/18)', role: 'Consultas parametrizadas entre Python y SQL Server.' },
  { layer: 'Imágenes', tech: 'Pillow', role: 'Carga, redimensionado y respaldo de fotos de hardware y logo.' },
  { layer: 'Documentos', tech: 'reportlab', role: 'Reportes de caja e informes de cierre en PDF.' },
]

export function StackSection() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="section-pad border-t border-line">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <h2 id="stack-title" className="text-4xl font-semibold sm:text-5xl">
            Stack
          </h2>
          <p className="mt-5 text-muted">
            Herramientas maduras y sin servicios externos: todo corre en la PC de la caja con un SQL Server local.
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Tecnologías usadas por Cyber Reinoso</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Capa</th>
              <th scope="col">Tecnología</th>
              <th scope="col">Para qué</th>
            </tr>
          </thead>
          <tbody>
            {STACK.map((item) => (
              <tr key={item.tech} className="grid grid-cols-[7rem_1fr] gap-x-4 border-b border-line py-4 first:border-t sm:table-row">
                <td className="text-faint sm:py-4 sm:pr-6">{item.layer}</td>
                <th scope="row" className="font-mono font-medium text-text sm:py-4 sm:pr-6">{item.tech}</th>
                <td className="col-start-2 mt-1 text-muted sm:mt-0 sm:py-4">{item.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
