import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminOrders } from '../../api/adminOrders'
import { AdminApiError } from '../../api/adminClient'
import type { AdminOrder } from '../../types/adminOrder'
import {
  formatAdminDate,
  orderStatusBadgeClass,
  orderStatusLabel,
  shortOrderId,
} from '../../utils/adminOrderUi'
import { formatPrice } from '../../utils/formatPrice'

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'delivered', label: 'Entregada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'in_process', label: 'En proceso' },
]

export function AdminOrdersListPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminOrders({
        status: statusFilter || undefined,
        q: search.trim() || undefined,
      })
      setOrders(data)
    } catch (e) {
      setOrders([])
      setError(e instanceof Error ? e.message : 'Error al cargar órdenes')
      if (e instanceof AdminApiError && e.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [navigate, statusFilter, search])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void loadOrders()
    }, 300)
    return () => window.clearTimeout(t)
  }, [loadOrders])

  return (
    <section>
      <h1 className="text-2xl font-bold text-claudia-navy">Órdenes</h1>
      <p className="mt-1 text-sm text-claudia-muted">
        Compras y pagos con Mercado Pago.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Buscar por email o ID de orden…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-claudia-blush px-3 py-2 text-sm focus:border-claudia-turquoise focus:outline-none focus:ring-1 focus:ring-claudia-turquoise"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-claudia-blush px-3 py-2 text-sm text-claudia-navy"
          aria-label="Filtrar por estado"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-8 text-sm text-claudia-muted">Cargando órdenes…</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-claudia-lavender/40 bg-white/80 px-4 py-8 text-center text-sm text-claudia-muted">
          No hay órdenes que coincidan con los filtros.
        </p>
      )}

      {!loading && orders.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-claudia-lavender/25 bg-white/90 shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-claudia-blush bg-claudia-warm/50 text-xs uppercase text-claudia-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Orden</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Comprador</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">MP</th>
                <th className="px-4 py-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-claudia-blush/80">
              {orders.map((order) => (
                <tr key={order.id} className="text-claudia-navy">
                  <td className="px-4 py-3">
                    <span title={order.id} className="font-mono text-xs">
                      {shortOrderId(order.id)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-claudia-muted">
                    {formatAdminDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{order.buyer.email || order.buyerEmail || '—'}</p>
                    {order.buyer.name && (
                      <p className="text-xs text-claudia-muted">{order.buyer.name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
                    >
                      {orderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-claudia-muted">
                    {order.mercadoPago.preferenceId
                      ? shortOrderId(order.mercadoPago.preferenceId)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/ordenes/${order.id}`}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-claudia-turquoise hover:bg-claudia-turquoise/10"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <p className="mt-3 text-xs text-claudia-muted">{orders.length} órdenes</p>
      )}
    </section>
  )
}
