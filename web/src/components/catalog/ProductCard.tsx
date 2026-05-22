import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { nivelBadge } from '../../theme/colors'
import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/formatPrice'
import { Button } from '../ui/Button'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
}

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-claudia-lavender/35 bg-white/95 shadow-[0_8px_28px_rgba(23,59,99,0.09)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(23,59,99,0.12)]">
      <div className="relative h-40 overflow-hidden">
        <ProductImage
          src={product.imagen}
          alt={product.titulo}
          nivel={product.nivel}
          className="h-full w-full object-cover"
        />
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-claudia-lavender px-3 py-0.5 text-xs font-bold text-white">
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
        <p className="mt-4 text-xl font-bold text-claudia-turquoise">{formatPrice(product.precio)}</p>
        <p className="mt-1 text-xs text-claudia-muted">PDF digital · {product.nivel}</p>
        <div className="mt-3 flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={() => onViewDetail(product)}>
            Ver detalle
          </Button>
          <Button
            variant={qty > 0 && !justAdded ? 'outline' : 'primary'}
            className="w-full"
            onClick={handleAdd}
            disabled={qty >= 10 && !justAdded}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </article>
  )
}
