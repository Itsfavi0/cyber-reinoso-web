import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { GithubIcon } from '../ui/GithubIcon'
import { NAV_LINKS, REPO_URL } from '../../data/site'

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 1024 && setIsOpen(false)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        isScrolled || isOpen ? 'border-line bg-night/90 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Principal" className="container-page flex h-16 items-center justify-between gap-6">
        <a href="#inicio" className="-m-2 rounded-md p-2" aria-label="Cyber Reinoso, ir al inicio">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="rounded-md px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-text">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-muted transition-colors duration-150 hover:text-text"
          >
            <GithubIcon className="size-4" />
            Código
          </a>
          <a
            href="#solicitar-demo"
            className="inline-flex min-h-10 items-center rounded-md bg-ice px-4 text-sm font-semibold text-night transition-[background-color,transform] duration-150 ease-out hover:bg-[#9ad5ff] active:scale-[0.97]"
          >
            Solicitar demo
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-text lg:hidden"
          aria-expanded={isOpen}
          aria-controls="menu-movil"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </nav>

      <div id="menu-movil" hidden={!isOpen} className="border-t border-line lg:hidden">
        <ul className="container-page flex flex-col py-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={closeMenu} className="flex min-h-12 items-center text-base text-text">
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-3 flex flex-col gap-2 border-t border-line pt-4 pb-2 sm:flex-row">
            <a
              href="#solicitar-demo"
              onClick={closeMenu}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-ice px-5 font-semibold text-night"
            >
              Solicitar demo
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line px-5 text-text"
            >
              <GithubIcon className="size-4" />
              Ver código en GitHub
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
