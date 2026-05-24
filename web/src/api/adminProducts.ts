import { adminFetch } from './adminClient'
import type { AdminProduct, AdminProductPayload } from '../types/adminProduct'

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

function normalizeProduct(raw: Record<string, unknown>): AdminProduct {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    level: String(raw.level ?? ''),
    age: String(raw.age ?? ''),
    description: String(raw.description ?? ''),
    longDescription: String(raw.longDescription ?? ''),
    price: Number(raw.price) || 0,
    badge: raw.badge == null || raw.badge === '' ? null : String(raw.badge),
    active: Boolean(raw.active),
    image: String(raw.image ?? ''),
    gallery: Array.isArray(raw.gallery) ? raw.gallery.map(String) : [],
    includes: Array.isArray(raw.includes) ? raw.includes.map(String) : [],
    pages: Number(raw.pages) || 0,
    audience: String(raw.audience ?? ''),
    category: String(raw.category ?? ''),
    downloadLink: String(raw.downloadLink ?? ''),
    deliveryMode:
      raw.deliveryMode === 'manual' ? 'manual' : 'automatic_download',
    checkoutMode: 'cart',
  }
}

export interface GetAdminProductsParams {
  active?: boolean
  q?: string
}

export async function getAdminProducts(
  _params?: GetAdminProductsParams,
): Promise<AdminProduct[]> {
  const res = await adminFetch('/api/admin/products')
  if (!res.ok) await parseAdminError(res, 'No se pudieron cargar los productos')

  const data = await res.json()
  const list = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : []
  return list.map((item: Record<string, unknown>) => normalizeProduct(item))
}

export async function getAdminProduct(id: string): Promise<AdminProduct> {
  const res = await adminFetch(`/api/admin/products/${encodeURIComponent(id)}`)
  if (!res.ok) await parseAdminError(res, 'No se pudo cargar el producto')

  const data = await res.json()
  const raw =
    data && typeof data === 'object' && 'id' in data
      ? data
      : data?.product && typeof data.product === 'object'
        ? data.product
        : data
  return normalizeProduct(raw as Record<string, unknown>)
}

export async function createAdminProduct(
  payload: AdminProductPayload & { id: string },
): Promise<AdminProduct> {
  const res = await adminFetch('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) await parseAdminError(res, 'No se pudo crear el producto')

  const data = await res.json()
  const raw = data?.product ?? data
  return normalizeProduct(raw as Record<string, unknown>)
}

export async function updateAdminProduct(
  id: string,
  payload: AdminProductPayload,
): Promise<AdminProduct> {
  const res = await adminFetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  if (!res.ok) await parseAdminError(res, 'No se pudo actualizar el producto')

  const data = await res.json()
  const raw = data?.product ?? data
  return normalizeProduct(raw as Record<string, unknown>)
}

export async function toggleAdminProductActive(id: string): Promise<AdminProduct> {
  const res = await adminFetch(
    `/api/admin/products/${encodeURIComponent(id)}/toggle-active`,
    { method: 'PATCH' },
  )
  if (!res.ok) await parseAdminError(res, 'No se pudo cambiar el estado')

  const data = await res.json()
  const raw = data?.product ?? data
  return normalizeProduct(raw as Record<string, unknown>)
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const res = await adminFetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  if (!res.ok) await parseAdminError(res, 'No se pudo dar de baja el producto')
}
