const PANELS = [
  { name: 'PanelMapa', x: 16, y: 50, w: 114 },
  { name: 'PanelUsuario', x: 143, y: 50, w: 114 },
  { name: 'PanelKiosco', x: 270, y: 50, w: 114 },
  { name: 'PanelAdministrador', x: 16, y: 90, w: 176 },
  { name: 'VentanaLogin', x: 208, y: 90, w: 176 },
]

function Arrow({ x, y1, y2, label }) {
  return (
    <g>
      <line x1={x} x2={x} y1={y1} y2={y2 - 6} stroke="var(--color-line-strong)" strokeWidth="1.5" />
      <path d={`M${x - 5} ${y2 - 8} L${x} ${y2} L${x + 5} ${y2 - 8}`} fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" />
      {label && (
        <text x={x + 10} y={(y1 + y2) / 2 + 4} className="fill-faint font-sans text-[12px]">
          {label}
        </text>
      )}
    </g>
  )
}

function Layer({ x, y, w, h, file, role, lines = [], accent = false }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="var(--color-panel)" stroke={accent ? 'var(--color-ice)' : 'var(--color-line-strong)'} />
      <text x={x + 14} y={y + 24} className="fill-ice font-mono text-[14px]">{file}</text>
      <text x={x + 14} y={y + 42} className="fill-text font-sans text-[12px] font-medium">{role}</text>
      {lines.map((line, index) => (
        <text key={line} x={x + 14} y={y + 66 + index * 17} className="fill-muted font-mono text-[12px]">
          {line}
        </text>
      ))}
    </g>
  )
}

/** Capas del sistema real: UI → Mediador → (Negocio | DAO) → SQL Server. */
export function ArchitectureDiagram() {
  return (
    <figure>
      <svg viewBox="0 0 400 590" className="mx-auto h-auto w-full max-w-md" role="img" aria-labelledby="arch-title arch-desc">
        <title id="arch-title">Arquitectura en capas de Cyber Reinoso</title>
        <desc id="arch-desc">
          Los paneles de la interfaz en modulos_ui envían eventos al mediador main.py. El mediador usa las clases de
          negocio de modelos.py y pide los datos al DAO conexion.py, que es la única capa que habla con SQL Server.
        </desc>

        <text x="0" y="14" className="fill-faint font-sans text-[12px]">Presentación, modulos_ui/</text>
        <rect x="0" y="24" width="400" height="110" rx="8" fill="none" stroke="var(--color-line-strong)" strokeDasharray="4 4" />
        {PANELS.map((panel) => (
          <g key={panel.name}>
            <rect x={panel.x} y={panel.y} width={panel.w} height="30" rx="5" fill="var(--color-raised)" stroke="var(--color-line)" />
            <text x={panel.x + panel.w / 2} y={panel.y + 19} textAnchor="middle" className="fill-text font-mono text-[12px]">
              {panel.name}
            </text>
          </g>
        ))}

        <Arrow x={200} y1={134} y2={172} label="eventos de la UI" />
        <Layer x={0} y={172} w={400} h={76} file="main.py" role="AppCyberReinoso, patrón Mediator" lines={['Coordina paneles y el reloj after(1000)']} accent />

        <Arrow x={95} y1={248} y2={290} />
        <Arrow x={305} y1={248} y2={290} />
        <Layer
          x={0}
          y={290}
          w={190}
          h={156}
          file="modelos.py"
          role="Negocio en memoria"
          lines={['Usuario, Sesion', 'EstacionTrabajo (ABC)', '├ PC_Regular', '├ PC_eSports', '└ PC_StreamingVIP']}
        />
        <Layer
          x={210}
          y={290}
          w={190}
          h={156}
          file="conexion.py"
          role="DAO: DBManager"
          lines={['Consultas con ?', 'Transacciones ACID', 'ROLLBACK ante error', 'Borrado lógico']}
        />

        <Arrow x={305} y1={446} y2={490} label="pyodbc" />
        <g>
          <path d="M210 502 v62 a95 14 0 0 0 190 0 v-62" fill="var(--color-panel)" stroke="var(--color-ice)" />
          <ellipse cx="305" cy="502" rx="95" ry="14" fill="var(--color-raised)" stroke="var(--color-ice)" />
          <text x="305" y="540" textAnchor="middle" className="fill-text font-sans text-[14px] font-medium">SQL Server</text>
          <text x="305" y="558" textAnchor="middle" className="fill-muted font-mono text-[12px]">13 tablas en 3FN</text>
        </g>

        <text x="0" y="482" className="fill-faint font-sans text-[12px]">La UI y el negocio</text>
        <text x="0" y="498" className="fill-faint font-sans text-[12px]">nunca escriben SQL.</text>
      </svg>
    </figure>
  )
}
