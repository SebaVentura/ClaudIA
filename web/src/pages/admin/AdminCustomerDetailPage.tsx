import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAdminCustomer, getAdminCustomerOrders } from '../../api/adminCustomers'
import { AdminApiError } from '../../api/adminClient'
import type { AdminCustomer } from '../../types/adminCustomer'
import type { AdminOrder } from '../../types/adminOrder'
import {
  formatAdminDate,
  orderStatusBadgeClass,
  orderStatusLabel,
  shortOrderId,
} from '../../utils/adminOrderUi'
import { formatPrice } from '../../utils/formatPrice'

export function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<AdminCustomer | null>(null)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [customerData, ordersData] = await Promise.all([
        getAdminCustomer(id),
        getAdminCustomerOrders(id),
      ])
      setCustomer(customerData)
      setOrders(ordersData)
    } catch (e) {
      setCustomer(null)
      setOrders([])
      setError(e instanceof Error ? e.message : 'Error al cargar el cliente')
      if (e instanceof AdminApiError && e.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return <p className="text-sm text-claudia-muted">Cargando cliente…</p>
  }

  if (!customer) {
    return (
      <section>
        <Link to="/admin/clientes" className="text-sm font-medium text-claudia-turquoise hover:underline">
          ← Volver a clientes
        </Link>
        {error && (
          <p className="mt-4 rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose">{error}</p>
        )}
      </section>
    )
  }

  return (
    <section className="max-w-3xl">
      <Link to="/admin/clientes" className="text-sm font-medium text-claudia-turquoise hover:underline">
        ← Volver a clientes
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-claudia-navy">
        {customer.name || customer.email || 'Cliente'}
      </h1>
      <p className="mt-1 text-sm text-claudia-muted">{customer.email}</p>

      {error && (
        <p className="mt-4 rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Compras" value={String(customer.totalOrders)} />
        <MetricCard label="Total gastado" value={formatPrice(customer.totalSpent)} />
        <MetricCard label="Última compra" value={formatAdminDate(customer.lastPurchaseAt)} />
      </div>

      <div className="mt-6 rounded-xl border border-claudia-lavender/25 bg-white/90 p-4">
        <h2 className="text-sm font-semibold text-claudia-navy">Datos de contacto</h2>
        <dl className="mt-2 space-y-1 text-sm text-claudia-muted">
          <div>
            <dt className="inline font-medium text-claudia-navy">Teléfono: </dt>
            <dd className="inline">{customer.phone || '—'}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-claudia-navy">Registrado: </dt>
            <dd className="inline">{formatAdminDate(customer.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-claudia-navy">Historial de órdenes</h2>

      {orders.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-claudia-lavender/40 bg-white/80 px-4 py-6 text-center text-sm text-claudia-muted">
          Este cliente aún no tiene órdenes registradas.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-claudia-lavender/25 bg-white/90 shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-claudia-blush bg-claudia-warm/50 text-xs uppercase text-claudia-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Orden</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-claudia-blush/80">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-mono text-xs" title={order.id}>
                    {shortOrderId(order.id)}
                  </td>
                  <td className="px-4 py-3 text-claudia-muted">
                    {formatAdminDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
                    >
                      {orderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/ordenes/${order.id}`}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-claudia-turquoise hover:bg-claudia-turquoise/10"
                    >
                      Ver orden
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-claudia-lavender/25 bg-white/90 p-4 text-center">
      <p className="text-xs font-medium text-claudia-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-claudia-navy">{value}</p>
    </div>
  )
}
