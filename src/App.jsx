import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { ProblemSection } from './components/sections/ProblemSection'
import { DemoSection } from './components/sections/DemoSection'
import { FeaturesSection } from './components/sections/FeaturesSection'
import { LoyaltySection } from './components/sections/LoyaltySection'
import { KioskSection } from './components/sections/KioskSection'
import { EngineeringSection } from './components/sections/EngineeringSection'
import { StackSection } from './components/sections/StackSection'
import { FaqSection } from './components/sections/FaqSection'
import { CtaSection } from './components/sections/CtaSection'

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
        <ProblemSection />
        <DemoSection />
        <FeaturesSection />
        <LoyaltySection />
        <KioskSection />
        <EngineeringSection />
        <StackSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
