import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { nivelBadge } from '../../theme/colors'
import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/formatPrice'
import { Button } from '../ui/Button'

const gradients: Record<string, string> = {
  Inicial: 'from-pink-200 via-rose-100 to-claudia-blush',
  Primaria: 'from-amber-100 via-yellow-50 to-claudia-cream',
  Secundaria: 'from-rose-100 via-claudia-blush to-white',
  'Técnica': 'from-orange-100 via-amber-50 to-claudia-cream',
  Superior: 'from-purple-100 via-violet-50 to-white',
  'IA educativa': 'from-sky-100 via-indigo-50 to-white',
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, getQuantity } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const qty = getQuantity(product.id)

  const handleAdd = () => {
    addToCart(product.id)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1500)
  }

  const buttonLabel = justAdded
    ? '¡Agregado!'
    : qty > 0
      ? `En carrito (${qty})`
      : 'Agregar al carrito'

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-claudia-blush/80 bg-white shadow-card transition-shadow hover:shadow-soft">
      <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${gradients[product.nivel] ?? 'from-claudia-blush to-white'}`}>
        <span className="text-5xl opacity-80" aria-hidden>📖</span>
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-claudia-coral px-3 py-0.5 text-xs font-bold text-white">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${nivelBadge[product.nivel]}`}>
          {product.nivel}
        </span>
        <h3 className="mt-2 font-semibold leading-snug text-claudia-ink">{product.titulo}</h3>
        <p className="mt-1 text-xs text-claudia-muted">{product.edad}</p>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-claudia-muted">{product.descripcion}</p>
        <p className="mt-4 text-xl font-bold text-claudia-coral">{formatPrice(product.precio)}</p>
        <Button
          variant={qty > 0 && !justAdded ? 'outline' : 'primary'}
          className="mt-3 w-full"
          onClick={handleAdd}
          disabled={qty >= 10 && !justAdded}
        >
          {buttonLabel}
        </Button>
      </div>
    </article>
  )
}
