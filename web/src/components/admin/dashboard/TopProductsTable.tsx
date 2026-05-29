import { formatPrice } from '../../../utils/formatPrice'

interface TopProductRow {
  productId: string
  title: string
  quantity: number
  revenue: number
}

interface TopProductsTableProps {
  rows: TopProductRow[]
}

export function TopProductsTable({ rows }: TopProductsTableProps) {
  return (
    <section className="h-full rounded-xl border border-claudia-lavender/30 bg-white/90 p-4 shadow-card">
      <h3 className="text-sm font-semibold text-claudia-navy">Productos más vendidos</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-claudia-muted">Sin ventas en este período.</p>
      ) : (
        <div className="mt-3 overflow-x-auto px-1 xl:overflow-visible">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-claudia-blush/60 text-xs uppercase tracking-wide text-claudia-muted">
                <th className="py-2.5 pl-3 pr-3">Producto</th>
                <th className="whitespace-nowrap py-2.5 pl-3 pr-4">Unidades</th>
                <th className="whitespace-nowrap py-2.5 pl-3 pr-4 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.productId} className="border-b border-claudia-blush/30 last:border-b-0">
                  <td className="py-3 pl-3 pr-3 text-claudia-navy">{row.title}</td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-4 text-claudia-muted">{row.quantity}</td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right font-medium text-claudia-navy">
                    {formatPrice(row.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
