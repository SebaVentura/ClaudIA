import type { CartItem } from '../types/product'

const STORAGE_KEY = 'claudia-cart-v1'

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (i) =>
        typeof i.productId === 'string' &&
        typeof i.quantity === 'number' &&
        i.quantity > 0,
    )
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
