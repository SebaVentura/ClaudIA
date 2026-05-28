import { formatPrice } from '../../../utils/formatPrice'

interface SalesPoint {
  date: string
  revenue: number
  orders: number
}

interface SalesTrendChartProps {
  points: SalesPoint[]
}

function shortDate(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

export function SalesTrendChart({ points }: SalesTrendChartProps) {
  if (!points.length) {
    return (
      <section className="rounded-xl border border-dashed border-claudia-lavender/40 bg-white/80 p-6 text-sm text-claudia-muted">
        No hay ventas pagadas en el período seleccionado.
      </section>
    )
  }

  const maxRevenue = Math.max(...points.map((p) => p.revenue), 1)

  const gridClass =
    points.length <= 2
      ? 'mt-4 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2'
      : points.length <= 4
        ? 'mt-4 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4'
        : 'mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7'

  return (
    <section className="rounded-xl border border-claudia-lavender/30 bg-white/90 p-4 shadow-card">
      <h3 className="text-sm font-semibold text-claudia-navy">Ventas por día</h3>
      <div className={gridClass}>
        {points.map((point) => {
          const heightPct = Math.max(8, Math.round((point.revenue / maxRevenue) * 100))
          return (
            <div
              key={point.date}
              className="min-w-[6.5rem] rounded-lg border border-claudia-blush/70 bg-claudia-cream/50 p-3"
            >
              <div className="flex h-28 items-end sm:h-32">
                <div
                  className="w-full rounded-md bg-gradient-to-t from-claudia-turquoise to-claudia-lavender"
                  style={{ height: `${heightPct}%` }}
                  title={`${shortDate(point.date)} · ${formatPrice(point.revenue)}`}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-claudia-navy">{shortDate(point.date)}</p>
              <p className="text-[11px] text-claudia-muted">{formatPrice(point.revenue)}</p>
              <p className="text-[11px] text-claudia-muted">{point.orders} órdenes</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
