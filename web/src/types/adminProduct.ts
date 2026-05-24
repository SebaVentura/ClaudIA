export type DeliveryMode = 'automatic_download' | 'manual'
export type CheckoutMode = 'cart'

export interface AdminProduct {
  id: string
  title: string
  level: string
  age: string
  description: string
  longDescription: string
  price: number
  badge: string | null
  active: boolean
  image: string
  gallery: string[]
  includes: string[]
  pages: number
  audience: string
  category: string
  downloadLink: string
  deliveryMode: DeliveryMode
  checkoutMode: CheckoutMode
}

export type AdminProductPayload = Omit<AdminProduct, 'id'> & { id?: string }

export const emptyAdminProduct = (): AdminProduct => ({
  id: '',
  title: '',
  level: '',
  age: '',
  description: '',
  longDescription: '',
  price: 0,
  badge: null,
  active: true,
  image: '',
  gallery: [],
  includes: [],
  pages: 0,
  audience: '',
  category: '',
  downloadLink: '',
  deliveryMode: 'automatic_download',
  checkoutMode: 'cart',
})
