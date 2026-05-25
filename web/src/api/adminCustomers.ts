import { adminFetch } from './adminClient'
import { normalizeOrderFromApi } from './adminOrders'
import type { AdminOrder } from '../types/adminOrder'
import type { AdminCustomer } from '../types/adminCustomer'

async function parseAdminError(res: Response, fallback: string): Promise<never> {
  const data = await res.json().catch(() => ({}))
  const detail =
    typeof data.detail === 'string'
      ? data.detail
      : typeof data.message === 'string'
        ? data.message
        : fallback
  throw new Error(detail)
}

function normalizeCustomer(raw: Record<string, unknown>): AdminCustomer {
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    email: String(raw.email ?? ''),
    phone: String(raw.phone ?? ''),
    totalOrders: Number(raw.totalOrders) || 0,
    totalSpent: Number(raw.totalSpent) || 0,
    lastPurchaseAt: raw.lastPurchaseAt != null ? String(raw.lastPurchaseAt) : null,
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: raw.updatedAt != null ? String(raw.updatedAt) : null,
  }
}

function normalizeCustomerList(data: unknown): AdminCustomer[] {
  const list = Array.isArray(data) ? data : []
  return list.map((item) => normalizeCustomer(item as Record<string, unknown>))
}

export interface GetAdminCustomersParams {
  q?: string
}

export async function getAdminCustomers(
  params: GetAdminCustomersParams = {},
): Promise<AdminCustomer[]> {
  const search = new URLSearchParams()
  if (params.q?.trim()) search.set('q', params.q.trim())
  const qs = search.toString()
  const path = qs ? `/api/admin/customers?${qs}` : '/api/admin/customers'

  const res = await adminFetch(path)
  if (!res.ok) await parseAdminError(res, 'No se pudieron cargar los clientes')

  const data = await res.json()
  return normalizeCustomerList(data)
}

export async function getAdminCustomer(id: string): Promise<AdminCustomer> {
  const res = await adminFetch(`/api/admin/customers/${encodeURIComponent(id)}`)
  if (!res.ok) await parseAdminError(res, 'No se pudo cargar el cliente')

  const data = await res.json()
  return normalizeCustomer(
    data && typeof data === 'object' ? (data as Record<string, unknown>) : {},
  )
}

export async function getAdminCustomerOrders(id: string): Promise<AdminOrder[]> {
  const res = await adminFetch(
    `/api/admin/customers/${encodeURIComponent(id)}/orders`,
  )
  if (!res.ok) await parseAdminError(res, 'No se pudieron cargar las órdenes del cliente')

  const data = await res.json()
  if (!Array.isArray(data)) return []
  return data.map((item) => normalizeOrderFromApi(item as Record<string, unknown>))
}
