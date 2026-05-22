import { CatalogSection } from '../components/catalog/CatalogSection'
import { CartDrawer } from '../components/cart/CartDrawer'
import { Beneficios } from '../components/landing/Beneficios'
import { Faq } from '../components/landing/Faq'
import { ComoFunciona } from '../components/landing/ComoFunciona'
import { Footer } from '../components/landing/Footer'
import { Hero } from '../components/landing/Hero'
import { Historia } from '../components/landing/Historia'
import { Resenas } from '../components/landing/Resenas'
import { Header } from '../components/layout/Header'

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-claudia-page">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-claudia-lavender/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-claudia-turquoise/12 blur-3xl" />
        <div className="absolute bottom-40 left-1/3 h-72 w-72 rounded-full bg-claudia-rose/10 blur-3xl" />
      </div>
      <div className="relative">
        <Header />
        <main>
          <Hero />
          <Historia />
          <CatalogSection />
          <Beneficios />
          <ComoFunciona />
          <Faq />
          <Resenas />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </div>
  )
}
