import { useCart } from '../../context/CartContext'
import { Logo } from './Logo'

const links = [
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#como-comprar', label: 'Cómo comprar' },
  { href: '#reseñas', label: 'Reseñas' },
]

export function Header() {
  const { itemCount, toggleCart } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-claudia-rose/20 bg-claudia-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden md:flex gap-6" aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-claudia-muted hover:text-claudia-coral">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={toggleCart}
          className="relative rounded-full border border-claudia-blush bg-white px-4 py-2 text-sm font-semibold shadow-card hover:shadow-soft"
          aria-label={`Carrito, ${itemCount} ítems`}
        >
          🛒 Carrito
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-claudia-coral text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
