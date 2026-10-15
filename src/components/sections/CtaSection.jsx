import { GithubIcon } from '../ui/GithubIcon'
import { REPO_URL } from '../../data/site'
import { DemoRequestForm } from '../form/DemoRequestForm'

export function CtaSection() {
  return (
    <section id="solicitar-demo" aria-labelledby="cta-title" className="section-pad relative overflow-hidden border-t border-line">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-page relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 id="cta-title" className="text-4xl font-semibold sm:text-5xl">
            Mira el código o pide una demo guiada
          </h2>
          <p className="mt-5 text-lg text-muted">
            Si administras un LAN center, cuéntame cuántas estaciones tienes y te muestro el sistema funcionando con
            tus tarifas. Si vienes a revisar cómo está hecho, el repositorio tiene el script de base de datos y
            usuarios de prueba.
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-md border border-line-strong px-6 font-medium text-text transition-[border-color,transform] duration-150 ease-out hover:border-ice/60 active:scale-[0.97]"
          >
            <GithubIcon className="size-5" />
            Ver Cyber Reinoso en GitHub
          </a>
        </div>

        <DemoRequestForm />
      </div>
    </section>
  )
}
