import { formatPrice } from '../../../utils/formatPrice'

interface InsightsData {
  topProduct: { title: string; quantity: number; revenue: number } | null
  bestDay: { date: string; revenue: number; orders: number } | null
  pendingToReview: number
  averageTicket: number
  revenueTotal: number
}

interface InsightsPanelProps {
  insights: InsightsData
}

function shortDate(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-claudia-lavender/30 bg-gradient-to-br from-white via-claudia-cream/50 to-claudia-mist/60 p-4 shadow-card">
      <h3 className="text-sm font-semibold text-claudia-navy">Insights automáticos</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <article className="min-w-0 rounded-lg border border-claudia-blush/60 bg-white/80 p-3">
          <p className="text-xs text-claudia-muted">Producto más vendido</p>
          <p className="mt-1 break-words text-sm font-semibold leading-snug text-claudia-navy">
            {insights.topProduct?.title ?? 'Sin datos'}
          </p>
          <p className="text-xs text-claudia-muted">
            {insights.topProduct ? `${insights.topProduct.quantity} unidades` : '—'}
          </p>
        </article>
        <article className="min-w-0 rounded-lg border border-claudia-blush/60 bg-white/80 p-3">
          <p className="text-xs text-claudia-muted">Mejor día</p>
          <p className="mt-1 text-sm font-semibold text-claudia-navy">
            {insights.bestDay ? shortDate(insights.bestDay.date) : 'Sin datos'}
          </p>
          <p className="text-xs text-claudia-muted">
            {insights.bestDay ? formatPrice(insights.bestDay.revenue) : '—'}
          </p>
        </article>
        <article className="min-w-0 rounded-lg border border-claudia-blush/60 bg-white/80 p-3">
          <p className="text-xs text-claudia-muted">Pendientes a revisar</p>
          <p className="mt-1 text-sm font-semibold text-claudia-navy">{insights.pendingToReview}</p>
        </article>
        <article className="min-w-0 rounded-lg border border-claudia-blush/60 bg-white/80 p-3">
          <p className="text-xs text-claudia-muted">Ticket promedio</p>
          <p className="mt-1 text-sm font-semibold text-claudia-navy">
            {formatPrice(insights.averageTicket)}
          </p>
        </article>
        <article className="min-w-0 rounded-lg border border-claudia-blush/60 bg-white/80 p-3">
          <p className="text-xs text-claudia-muted">Total vendido</p>
          <p className="mt-1 text-sm font-semibold text-claudia-navy">
            {formatPrice(insights.revenueTotal)}
          </p>
        </article>
      </div>
    </section>
  )
}
