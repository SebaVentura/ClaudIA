import { adminFetch } from './adminClient'

export type DashboardPeriodKey = 'today' | '7d' | '30d' | 'month'

export interface DashboardSummaryResponse {
  period: {
    key: DashboardPeriodKey | string
    label: string
    fromIso: string
    toIso: string
  }
  kpis: {
    revenueTotal: number
    paidOrders: number
    pendingOrders: number
    rejectedOrCancelledOrders: number
    averageTicket: number
    customersTotal: number
    newCustomers: number
    productsTotal: number
    productsSold: number
  }
  salesByDay: Array<{ date: string; revenue: number; orders: number }>
  topProducts: Array<{
    productId: string
    title: string
    quantity: number
    revenue: number
  }>
  recentOrders: Array<{
    orderId: string
    createdAt: string
    status: string
    total: number
    customerEmail: string
    customerName: string
  }>
  insights: {
    topProduct: {
      productId: string
      title: string
      quantity: number
      revenue: number
    } | null
    bestDay: { date: string; revenue: number; orders: number } | null
    pendingToReview: number
    averageTicket: number
    revenueTotal: number
  }
  trafficPlaceholders: Array<{ key: string; title: string; message: string }>
}

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

export async function getAdminDashboardSummary(
  period: DashboardPeriodKey,
): Promise<DashboardSummaryResponse> {
  const qs = new URLSearchParams({ period }).toString()
  const res = await adminFetch(`/api/admin/dashboard/summary?${qs}`)
  if (!res.ok) {
    await parseAdminError(res, 'No se pudieron cargar las métricas del dashboard')
  }
  return (await res.json()) as DashboardSummaryResponse
}
