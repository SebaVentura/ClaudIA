import { useEffect, useState } from 'react'
import { createPreference } from '../../api/checkout'
import { useCart } from '../../context/CartContext'
import { openWhatsAppCheckout } from '../../utils/whatsappCheckout'
import { formatPrice } from '../../utils/formatPrice'
import { Button } from '../ui/Button'

// TODO Etapa 6: cerrar integración Mercado Pago Checkout + descarga automática

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    cartProducts,
    total,
    itemCount,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCart()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerFieldError, setBuyerFieldError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    setBuyerFieldError(null)
  }, [cartProducts])

  if (!isOpen) return null

  const handleCheckout = async () => {
    if (!cartProducts.length || loading) return

    const name = buyerName.trim()
    const email = buyerEmail.trim()
    const phone = buyerPhone.trim()

    if (!name) {
      setBuyerFieldError('Ingresá tu nombre para continuar.')
      return
    }
    if (!email) {
      setBuyerFieldError('Ingresá tu email para continuar.')
      return
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailOk) {
      setBuyerFieldError('Ingresá un email válido.')
      return
    }

    setBuyerFieldError(null)
    setLoading(true)
    setError(null)
    try {
      const result = await createPreference({
        items: cartProducts.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
        buyer: {
          name,
          email,
          phone,
        },
      })
      window.location.href = result.initPoint
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'No se pudo iniciar el pago. Intentá de nuevo.',
      )
      setLoading(false)
    }
  }

  const handleWhatsApp = () => {
    if (!cartProducts.length) return
    openWhatsAppCheckout(cartProducts, total)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-claudia-navy/30 backdrop-blur-sm" onClick={closeCart} aria-hidden />
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md animate-fade-in flex-col bg-gradient-to-b from-claudia-warm via-claudia-cream to-white shadow-2xl"
        role="dialog"
        aria-labelledby="cart-title"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-claudia-blush px-5 py-4">
          <h2 id="cart-title" className="text-lg font-bold">
            Tu carrito ({itemCount})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 hover:bg-claudia-blush"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartProducts.length === 0 ? (
            <p className="py-8 text-center text-claudia-muted">El carrito está vacío.</p>
          ) : (
            <ul className="space-y-4">
              {cartProducts.map(({ product, quantity }) => (
                <li key={product.id} className="rounded-xl border border-claudia-blush/60 bg-white p-4 shadow-card">
                  <div className="flex gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-claudia-blush text-2xl">
                      📖
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">{product.titulo}</p>
                      <p className="text-xs text-claudia-muted">{product.nivel}</p>
                      <p className="mt-1 text-sm text-claudia-muted">
                        {formatPrice(product.precio)} c/u
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="shrink-0 text-xs text-claudia-muted hover:text-claudia-rose"
                      aria-label="Quitar del carrito"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-claudia-muted">Cantidad</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decrementQuantity(product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-claudia-blush bg-claudia-cream text-lg font-bold text-claudia-ink hover:bg-claudia-blush"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementQuantity(product.id)}
                        disabled={quantity >= 10}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-claudia-blush bg-claudia-cream text-lg font-bold text-claudia-ink hover:bg-claudia-blush disabled:opacity-40"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-claudia-muted">Subtotal</p>
                      <p className="text-sm font-bold text-claudia-turquoise">
                        {formatPrice(product.precio * quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3 border-t border-claudia-lavender/25 bg-white/90 px-5 py-5">
          {cartProducts.length > 0 && (
            <div className="rounded-xl border border-claudia-blush/60 bg-claudia-cream/40 p-4">
              <p className="text-sm font-semibold text-claudia-navy">Datos del comprador</p>
              <p className="mt-1 text-xs text-claudia-muted">
                Necesarios para registrar tu compra y el acceso al material.
              </p>
              <div className="mt-3 space-y-2">
                <label className="block">
                  <span className="text-xs font-medium text-claudia-navy">Nombre *</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={buyerName}
                    onChange={(e) => {
                      setBuyerName(e.target.value)
                      setBuyerFieldError(null)
                    }}
                    className="mt-1 w-full rounded-lg border border-claudia-blush px-3 py-2 text-sm focus:border-claudia-turquoise focus:outline-none focus:ring-1 focus:ring-claudia-turquoise"
                    placeholder="Tu nombre"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-claudia-navy">Email *</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={buyerEmail}
                    onChange={(e) => {
                      setBuyerEmail(e.target.value)
                      setBuyerFieldError(null)
                    }}
                    className="mt-1 w-full rounded-lg border border-claudia-blush px-3 py-2 text-sm focus:border-claudia-turquoise focus:outline-none focus:ring-1 focus:ring-claudia-turquoise"
                    placeholder="tu@email.com"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-claudia-navy">Teléfono (opcional)</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={buyerPhone}
                    onChange={(e) => {
                      setBuyerPhone(e.target.value)
                      setBuyerFieldError(null)
                    }}
                    className="mt-1 w-full rounded-lg border border-claudia-blush px-3 py-2 text-sm focus:border-claudia-turquoise focus:outline-none focus:ring-1 focus:ring-claudia-turquoise"
                    placeholder="291…"
                  />
                </label>
              </div>
              {buyerFieldError && (
                <p className="mt-2 text-xs text-claudia-rose" role="alert">
                  {buyerFieldError}
                </p>
              )}
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-claudia-coral/40 bg-claudia-blush px-4 py-3 text-sm text-claudia-ink"
            >
              {error}
            </div>
          )}
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-claudia-turquoise">{formatPrice(total)}</span>
          </div>
          <Button
            variant="primary"
            className="w-full"
            disabled={!cartProducts.length || loading}
            onClick={handleCheckout}
          >
            {loading ? 'Redirigiendo a Mercado Pago…' : 'Pagar con Mercado Pago'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={!cartProducts.length}
            onClick={handleWhatsApp}
          >
            Coordinar compra por WhatsApp
          </Button>
          <Button variant="secondary" className="w-full" onClick={closeCart}>
            Seguir viendo materiales
          </Button>
        </div>
      </aside>
    </>
  )
}
