import { CatalogSection } from '../components/catalog/CatalogSection'
import { CartDrawer } from '../components/cart/CartDrawer'
import { Beneficios } from '../components/landing/Beneficios'
import { ComoFunciona } from '../components/landing/ComoFunciona'
import { Footer } from '../components/landing/Footer'
import { Hero } from '../components/landing/Hero'
import { Historia } from '../components/landing/Historia'
import { Resenas } from '../components/landing/Resenas'
import { Header } from '../components/layout/Header'

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Historia />
        <CatalogSection />
        <Beneficios />
        <ComoFunciona />
        <Resenas />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
