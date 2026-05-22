import { WHATSAPP_NUMBER } from '../config/whatsapp'
import { formatPrice } from './formatPrice'
import type { Product } from '../types/product'

export interface CartLineForWhatsApp {
  product: Product
  quantity: number
}

export function buildWhatsAppOrderMessage(
  lines: CartLineForWhatsApp[],
  total: number,
): string {
  const itemsText = lines
    .map(
      ({ product, quantity }) =>
        `- ${product.titulo} x ${quantity} — ${formatPrice(product.precio * quantity)}`,
    )
    .join('\n')

  return `Hola, quiero comprar estos materiales de ClaudIA Educación Digital:

${itemsText}

Total: ${formatPrice(total)}

Quedo atento/a para coordinar el pago y la entrega digital.`
}

export function getWhatsAppCheckoutUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function openWhatsAppCheckout(lines: CartLineForWhatsApp[], total: number): void {
  if (!lines.length) return
  const url = getWhatsAppCheckoutUrl(buildWhatsAppOrderMessage(lines, total))
  window.open(url, '_blank', 'noopener,noreferrer')
}
