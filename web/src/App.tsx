import { CartProvider } from './context/CartContext'
import { ProductsProvider } from './context/ProductsContext'
import { GraciasPage } from './pages/GraciasPage'
import { LandingPage } from './pages/LandingPage'

const isGraciasPage = window.location.pathname === '/gracias'

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        {isGraciasPage ? <GraciasPage /> : <LandingPage />}
      </CartProvider>
    </ProductsProvider>
  )
}
