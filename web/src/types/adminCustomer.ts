export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastPurchaseAt: string | null
  createdAt: string
  updatedAt: string | null
}
