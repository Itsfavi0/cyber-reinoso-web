import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'

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
        <section id="inicio" className="container-page pt-32 pb-24">
          <h1 className="text-5xl">Cyber Reinoso</h1>
        </section>
      </main>
      <Footer />
    </>
  )
}
