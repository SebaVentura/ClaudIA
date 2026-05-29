import { Link } from 'react-router-dom'
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
    <header className="sticky top-0 z-40 border-b border-claudia-lavender/25 bg-claudia-warm/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-claudia-muted hover:text-claudia-turquoise"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/admin/login"
            className="rounded-lg border border-claudia-lavender/45 bg-claudia-cream/90 px-3 py-1.5 text-xs font-semibold tracking-wide text-claudia-navy shadow-card transition hover:border-claudia-turquoise hover:text-claudia-turquoise focus:outline-none focus-visible:ring-2 focus-visible:ring-claudia-turquoise focus-visible:ring-offset-2"
          >
            ADMIN
          </Link>
        </nav>
        <Link
          to="/admin/login"
          className="rounded-lg border border-claudia-lavender/45 bg-claudia-cream/90 px-2.5 py-1.5 text-xs font-semibold tracking-wide text-claudia-navy shadow-card transition hover:border-claudia-turquoise hover:text-claudia-turquoise focus:outline-none focus-visible:ring-2 focus-visible:ring-claudia-turquoise focus-visible:ring-offset-2 md:hidden"
        >
          ADMIN
        </Link>
        <button
          type="button"
          onClick={toggleCart}
          className="relative rounded-full border border-claudia-lavender/40 bg-white/90 px-4 py-2 text-sm font-semibold text-claudia-navy shadow-card hover:border-claudia-turquoise hover:text-claudia-turquoise"
          aria-label={`Carrito, ${itemCount} ítems`}
        >
          🛒 Carrito
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-claudia-navy text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
