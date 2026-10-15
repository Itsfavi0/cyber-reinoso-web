import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'

export default function App() {
  return (
    <>
      <a
        href="#contenido"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-md bg-ice px-4 py-3 font-semibold text-night transition-transform duration-150 focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Nav />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
      </main>
      <Footer />
    </>
  )
}
