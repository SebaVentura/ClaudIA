import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../types/product'
import { useProducts } from './ProductsContext'
import { loadCart, saveCart } from '../utils/cartStorage'

const MAX_QUANTITY = 10

interface CartContextValue {
  cartProducts: { product: Product; quantity: number }[]
  itemCount: number
  total: number
  isOpen: boolean
  getQuantity: (productId: string) => number
  toggleCart: () => void
  closeCart: () => void
  openCart: () => void
  addToCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  incrementQuantity: (productId: string) => void
  decrementQuantity: (productId: string) => void
  removeFromCart: (productId: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts()
  const [items, setItems] = useState<CartItem[]>(() => loadCart())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const cartProducts = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          return product ? { product, quantity: item.quantity } : null
        })
        .filter((x): x is { product: Product; quantity: number } => x !== null),
    [items, products],
  )

  const itemCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items],
  )

  const total = useMemo(
    () =>
      cartProducts.reduce((s, { product, quantity }) => s + product.precio * quantity, 0),
    [cartProducts],
  )

  const getQuantity = useCallback(
    (productId: string) => items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items],
  )

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    const qty = Math.min(quantity, MAX_QUANTITY)
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId)
      if (found) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: qty } : i,
        )
      }
      return [...prev, { productId, quantity: qty }]
    })
  }, [])

  const addToCart = useCallback((productId: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId)
      if (found) {
        if (found.quantity >= MAX_QUANTITY) return prev
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }, [])

  const incrementQuantity = useCallback(
    (productId: string) => {
      const current = items.find((i) => i.productId === productId)?.quantity ?? 0
      if (current < MAX_QUANTITY) updateQuantity(productId, current + 1)
    },
    [items, updateQuantity],
  )

  const decrementQuantity = useCallback(
    (productId: string) => {
      const current = items.find((i) => i.productId === productId)?.quantity ?? 0
      updateQuantity(productId, current - 1)
    },
    [items, updateQuantity],
  )

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        itemCount,
        total,
        isOpen,
        getQuantity,
        toggleCart: () => setIsOpen((o) => !o),
        closeCart: () => setIsOpen(false),
        openCart: () => setIsOpen(true),
        addToCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart requiere CartProvider')
  return ctx
}
