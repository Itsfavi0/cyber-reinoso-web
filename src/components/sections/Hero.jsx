import { Play } from 'lucide-react'
import { GithubIcon } from '../ui/GithubIcon'
import { REPO_URL } from '../../data/site'
import { HeroPreview } from './HeroPreview'

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 md:pb-28">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <h1 id="hero-title" className="rise text-[clamp(2.4rem,6.4vw,4.6rem)] font-semibold tracking-[-0.02em]">
            <span className="block">Cobra cada minuto.</span>
            <span className="block">Corta a tiempo.</span>
            <span className="block">Premia a quien vuelve.</span>
          </h1>
          <p className="rise rise-2 mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            Cyber Reinoso es el sistema de escritorio que administra un LAN center de punta a punta: mapa de
            estaciones en tiempo real, billetera prepago con corte automático, rangos VIP y kiosco de snacks,
            todo sobre SQL Server.
          </p>
          <div className="rise rise-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#demo"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-md bg-ice px-6 font-semibold text-night transition-[background-color,transform] duration-150 ease-out hover:bg-[#9ad5ff] active:scale-[0.97]"
            >
              <Play className="size-4 fill-current" aria-hidden="true" />
              Probar la demo en vivo
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-md border border-line-strong px-6 font-medium text-text transition-[border-color,transform] duration-150 ease-out hover:border-ice/60 active:scale-[0.97]"
            >
              <GithubIcon className="size-5" />
              Ver código en GitHub
            </a>
          </div>
          <p className="rise rise-3 mt-5 text-sm text-faint">Python, Tkinter y SQL Server. Hecho en Lima.</p>
        </div>

        <div className="rise rise-4 mt-14 md:mt-20">
          <HeroPreview />
        </div>
      </div>
    </section>
  )
}
