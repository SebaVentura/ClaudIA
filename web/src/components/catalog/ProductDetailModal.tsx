import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { nivelBadge } from '../../theme/colors'
import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/formatPrice'
import { Button } from '../ui/Button'
import { ProductImage } from './ProductImage'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart, getQuantity, openCart } = useCart()
  const [mainSrc, setMainSrc] = useState<string | undefined>()
  const [justAdded, setJustAdded] = useState(false)

  const thumbs = useMemo(() => {
    if (!product) return []
    const list = product.galeria.length > 0 ? product.galeria : product.imagen ? [product.imagen] : []
    return [...new Set(list)]
  }, [product])

  useEffect(() => {
    if (product) {
      setMainSrc(thumbs[0] ?? product.imagen)
      setJustAdded(false)
    }
  }, [product, thumbs])

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  const qty = getQuantity(product.id)

  const handleAdd = () => {
    addToCart(product.id)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-claudia-navy/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
      >
        <div
          className="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-claudia-lavender/35 bg-gradient-to-b from-claudia-warm via-white to-claudia-mist/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-claudia-lavender/25 bg-claudia-lavender/12 px-4 py-3 sm:px-6">
            <p className="text-sm font-semibold text-claudia-navy">Detalle del ebook</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-claudia-muted hover:bg-claudia-blush"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto px-4 py-5 sm:px-6">
            <div className="overflow-hidden rounded-2xl border border-claudia-blush/60">
              <div className="aspect-[4/3] w-full bg-claudia-cream">
                <ProductImage
                  src={mainSrc}
                  alt={product.titulo}
                  nivel={product.nivel}
                  className="h-full w-full object-cover"
                  iconClassName="text-6xl opacity-80"
                />
              </div>
              {thumbs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-t border-claudia-blush/60 bg-claudia-cream/50 p-2">
                  {thumbs.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setMainSrc(src)}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        mainSrc === src ? 'border-claudia-turquoise' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <ProductImage
                        src={src}
                        alt=""
                        nivel={product.nivel}
                        className="h-full w-full object-cover"
                        iconClassName="text-xl"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${nivelBadge[product.nivel]}`}>
                {product.nivel}
              </span>
              {product.badge && (
                <span className="rounded-full bg-claudia-lavender px-2.5 py-0.5 text-xs font-bold text-white">
                  {product.badge}
                </span>
              )}
            </div>

            <h2 id="product-detail-title" className="mt-2 text-2xl font-bold text-claudia-ink">
              {product.titulo}
            </h2>
            <p className="text-sm text-claudia-muted">{product.edad}</p>
            <p className="mt-3 text-2xl font-bold text-claudia-turquoise">{formatPrice(product.precio)}</p>

            <p className="mt-4 leading-relaxed text-claudia-muted">
              {product.descripcionLarga || product.descripcion}
            </p>

            <p className="mt-4 rounded-xl border border-claudia-turquoise/25 bg-claudia-turquoise/10 px-4 py-3 text-sm text-claudia-ink">
              Material digital listo para descargar, imprimir y usar en el aula.
            </p>

            {product.audiencia && (
              <div className="mt-5 rounded-xl border border-claudia-turquoise/20 bg-claudia-turquoise/10 p-4">
                <h3 className="text-sm font-semibold text-claudia-ink">¿Para quién es?</h3>
                <p className="mt-1 text-sm text-claudia-muted">{product.audiencia}</p>
              </div>
            )}

            {product.incluye.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-claudia-ink">Incluye</h3>
                <ul className="mt-2 space-y-1.5">
                  {product.incluye.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-claudia-muted">
                      <span className="text-claudia-turquoise">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-claudia-muted">
              <span className="rounded-full bg-claudia-warm px-3 py-1 font-medium text-claudia-navy">
                Formato: PDF digital
              </span>
              {product.paginas != null && (
                <span className="rounded-full bg-claudia-warm px-3 py-1 font-medium text-claudia-navy">
                  {product.paginas} páginas
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-claudia-lavender/25 bg-gradient-to-r from-claudia-lavender/10 to-claudia-turquoise/10 px-4 py-4 sm:flex-row sm:px-6">
            <Button
              variant={qty > 0 && !justAdded ? 'outline' : 'primary'}
              className="flex-1"
              onClick={handleAdd}
              disabled={qty >= 10 && !justAdded}
            >
              {justAdded ? '¡Agregado!' : qty > 0 ? `En carrito (${qty})` : 'Agregar al carrito'}
            </Button>
            {qty > 0 && (
              <Button variant="secondary" className="flex-1" onClick={openCart}>
                Ir al carrito
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
