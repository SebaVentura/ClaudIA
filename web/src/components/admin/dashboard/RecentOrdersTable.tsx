import { Link } from 'react-router-dom'
import { formatPrice } from '../../../utils/formatPrice'
import { formatAdminDate, orderStatusBadgeClass, orderStatusLabel } from '../../../utils/adminOrderUi'

interface RecentOrderRow {
  orderId: string
  createdAt: string
  status: string
  total: number
  customerEmail: string
  customerName: string
}

interface RecentOrdersTableProps {
  rows: RecentOrderRow[]
}

export function RecentOrdersTable({ rows }: RecentOrdersTableProps) {
  return (
    <section className="rounded-xl border border-claudia-lavender/30 bg-white/90 p-4 shadow-card">
      <h3 className="text-sm font-semibold text-claudia-navy">Últimas órdenes</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-claudia-muted">No hay órdenes recientes para mostrar.</p>
      ) : (
        <div className="mt-3 -mx-1 overflow-x-auto px-2 pb-1">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-claudia-blush/60 text-xs uppercase tracking-wide text-claudia-muted">
                <th className="whitespace-nowrap py-2.5 pl-3 pr-3">Fecha</th>
                <th className="whitespace-nowrap py-2.5 pl-3 pr-3">Cliente</th>
                <th className="whitespace-nowrap py-2.5 pl-3 pr-3">Estado</th>
                <th className="whitespace-nowrap py-2.5 pl-3 pr-3 text-right">Total</th>
                <th className="whitespace-nowrap py-2.5 pl-4 pr-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.orderId} className="border-b border-claudia-blush/30 last:border-b-0">
                  <td className="whitespace-nowrap py-2.5 pl-3 pr-3 text-claudia-muted">
                    {formatAdminDate(row.createdAt)}
                  </td>
                  <td className="max-w-[12rem] py-2.5 pl-3 pr-3 text-claudia-navy">
                    <span className="line-clamp-2">{row.customerName || row.customerEmail || 'Sin datos'}</span>
                  </td>
                  <td className="whitespace-nowrap py-2.5 pl-3 pr-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${orderStatusBadgeClass(row.status)}`}>
                      {orderStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-2.5 pl-3 pr-3 text-right font-medium text-claudia-navy">
                    {formatPrice(row.total)}
                  </td>
                  <td className="whitespace-nowrap py-2.5 pl-4 pr-5 text-right">
                    <Link
                      to={`/admin/ordenes/${encodeURIComponent(row.orderId)}`}
                      className="inline-block text-xs font-medium text-claudia-turquoise hover:underline"
                    >
                      Ver
                    </Link>
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
