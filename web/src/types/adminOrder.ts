export interface AdminOrderItem {
  productId: string
  title: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export interface AdminBuyer {
  name: string
  email: string
  phone: string
}

export interface AdminMercadoPago {
  preferenceId: string
  paymentId: string
  status: string
}

export interface AdminDelivery {
  status: string
  downloadLinks: string[]
  sentAt: string | null
}

export interface AdminOrder {
  id: string
  orderId: string
  customerId: string | null
  status: string
  items: AdminOrderItem[]
  total: number
  buyer: AdminBuyer
  mercadoPago: AdminMercadoPago
  preferenceId: string | null
  buyerEmail: string | null
  delivery: AdminDelivery
  createdAt: string
  paidAt: string | null
  deliveredAt: string | null
  updatedAt: string | null
}

export type AdminOrderStatusPatch = 'cancelled' | 'delivered'
