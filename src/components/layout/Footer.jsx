import { Logo } from '../ui/Logo'
import { GithubIcon } from '../ui/GithubIcon'
import { AUTHOR_URL, NAV_LINKS, REPO_URL } from '../../data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm text-muted">
            Sistema de administración, monitoreo y punto de venta para LAN centers y arenas de eSports.
            Diseñado y desarrollado por{' '}
            <a href={AUTHOR_URL} target="_blank" rel="noreferrer" className="text-text underline decoration-line-strong underline-offset-4 hover:decoration-ice">
              Favio Brañez
            </a>
            , estudiante de Ingeniería de Sistemas en la UNAC (Lima, Perú).
          </p>
        </div>

        <nav aria-label="Secciones">
          <h2 className="font-display text-sm font-semibold text-text">En esta página</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 md:grid-cols-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-10 items-center text-sm text-muted hover:text-text">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold text-text">Proyecto</h2>
          <ul className="mt-3">
            <li>
              <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-text">
                <GithubIcon className="size-4" />
                Repositorio en GitHub
              </a>
            </li>
            <li>
              <a href={AUTHOR_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center text-sm text-muted hover:text-text">
                Perfil de Favio (@Itsfavi0)
              </a>
            </li>
            <li>
              <a href="mailto:hola@example.com" className="inline-flex min-h-10 items-center text-sm text-muted hover:text-text">
                hola@example.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-xs text-faint sm:flex-row sm:justify-between">
        <p>© 2026 Cyber Reinoso. Proyecto de portafolio en desarrollo activo.</p>
        <p>Los nombres de gamers y equipos de la demo provienen de los datos de prueba del sistema.</p>
      </div>
    </footer>
  )
}
