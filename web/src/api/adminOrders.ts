import { adminFetch } from './adminClient'
import type { AdminOrder, AdminOrderStatusPatch } from '../types/adminOrder'

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

export function normalizeOrderFromApi(raw: Record<string, unknown>): AdminOrder {
  const orderId = String(raw.orderId ?? raw.id ?? '').trim()
  const buyerRaw =
    raw.buyer && typeof raw.buyer === 'object'
      ? (raw.buyer as Record<string, unknown>)
      : {}
  const mpRaw =
    raw.mercadoPago && typeof raw.mercadoPago === 'object'
      ? (raw.mercadoPago as Record<string, unknown>)
      : {}
  const deliveryRaw =
    raw.delivery && typeof raw.delivery === 'object'
      ? (raw.delivery as Record<string, unknown>)
      : {}

  const items = Array.isArray(raw.items)
    ? raw.items.map((item) => {
        const i = item as Record<string, unknown>
        const quantity = Number(i.quantity) || 1
        const unitPrice = Number(i.unitPrice) || 0
        const subtotal = Number.isFinite(Number(i.subtotal))
          ? Number(i.subtotal)
          : unitPrice * quantity
        return {
          productId: String(i.productId ?? ''),
          title: String(i.title ?? ''),
          unitPrice,
          quantity,
          subtotal,
        }
      })
    : []

  return {
    id: orderId,
    orderId,
    customerId: raw.customerId != null ? String(raw.customerId) : null,
    status: String(raw.status ?? 'pending'),
    items,
    total: Number(raw.total) || 0,
    buyer: {
      name: String(buyerRaw.name ?? '').trim(),
      email: String(buyerRaw.email ?? raw.buyerEmail ?? '').trim(),
      phone: String(buyerRaw.phone ?? '').trim(),
    },
    mercadoPago: {
      preferenceId: String(mpRaw.preferenceId ?? raw.preferenceId ?? '').trim(),
      paymentId: String(mpRaw.paymentId ?? '').trim(),
      status: String(mpRaw.status ?? '').trim(),
    },
    preferenceId: String(mpRaw.preferenceId ?? raw.preferenceId ?? '').trim() || null,
    buyerEmail: String(buyerRaw.email ?? raw.buyerEmail ?? '').trim() || null,
    delivery: {
      status: String(deliveryRaw.status ?? 'pending'),
      downloadLinks: Array.isArray(deliveryRaw.downloadLinks)
        ? deliveryRaw.downloadLinks.map(String)
        : [],
      sentAt: deliveryRaw.sentAt != null ? String(deliveryRaw.sentAt) : null,
    },
    createdAt: String(raw.createdAt ?? ''),
    paidAt: raw.paidAt != null ? String(raw.paidAt) : null,
    deliveredAt: raw.deliveredAt != null ? String(raw.deliveredAt) : null,
    updatedAt: raw.updatedAt != null ? String(raw.updatedAt) : null,
  }
}

function normalizeOrderList(data: unknown): AdminOrder[] {
  const list = Array.isArray(data) ? data : []
  return list.map((item) => normalizeOrderFromApi(item as Record<string, unknown>))
}

export interface GetAdminOrdersParams {
  status?: string
  q?: string
}

export async function getAdminOrders(
  params: GetAdminOrdersParams = {},
): Promise<AdminOrder[]> {
  const search = new URLSearchParams()
  if (params.status?.trim()) search.set('status', params.status.trim())
  if (params.q?.trim()) search.set('q', params.q.trim())
  const qs = search.toString()
  const path = qs ? `/api/admin/orders?${qs}` : '/api/admin/orders'

  const res = await adminFetch(path)
  if (!res.ok) await parseAdminError(res, 'No se pudieron cargar las órdenes')

  const data = await res.json()
  return normalizeOrderList(data)
}

export async function getAdminOrder(id: string): Promise<AdminOrder> {
  const res = await adminFetch(`/api/admin/orders/${encodeURIComponent(id)}`)
  if (!res.ok) await parseAdminError(res, 'No se pudo cargar la orden')

  const data = await res.json()
  return normalizeOrderFromApi(
    data && typeof data === 'object' ? (data as Record<string, unknown>) : {},
  )
}

export async function patchAdminOrderStatus(
  id: string,
  status: AdminOrderStatusPatch,
): Promise<AdminOrder> {
  const res = await adminFetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  if (!res.ok) await parseAdminError(res, 'No se pudo actualizar el estado')

  const data = await res.json()
  return normalizeOrderFromApi(
    data && typeof data === 'object' ? (data as Record<string, unknown>) : {},
  )
}
