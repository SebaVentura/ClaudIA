import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAdminOrder, patchAdminOrderStatus } from '../../api/adminOrders'
import { AdminApiError } from '../../api/adminClient'
import type { AdminOrder } from '../../types/adminOrder'
import {
  formatAdminDate,
  getOrderAdminActions,
  orderStatusBadgeClass,
  orderStatusLabel,
} from '../../utils/adminOrderUi'
import { formatPrice } from '../../utils/formatPrice'

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadOrder = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminOrder(id)
      setOrder(data)
    } catch (e) {
      setOrder(null)
      setError(e instanceof Error ? e.message : 'Error al cargar la orden')
      if (e instanceof AdminApiError && e.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    void loadOrder()
  }, [loadOrder])

  const handleStatusAction = async (
    nextStatus: 'cancelled' | 'delivered',
    confirmMessage: string,
  ) => {
    if (!id || !order || actionLoading) return
    if (!window.confirm(confirmMessage)) return

    setActionLoading(true)
    setSuccess(null)
    setError(null)
    try {
      const updated = await patchAdminOrderStatus(id, nextStatus)
      setOrder(updated)
      setSuccess('Estado actualizado correctamente')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar el estado')
      if (e instanceof AdminApiError && e.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-claudia-muted">Cargando orden…</p>
  }

  if (!order) {
    return (
      <section>
        <Link to="/admin/ordenes" className="text-sm font-medium text-claudia-turquoise hover:underline">
          ← Volver a órdenes
        </Link>
        {error && (
          <p className="mt-4 rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose">{error}</p>
        )}
      </section>
    )
  }

  const actions = getOrderAdminActions(order.status)

  return (
    <section className="max-w-3xl">
      <Link to="/admin/ordenes" className="text-sm font-medium text-claudia-turquoise hover:underline">
        ← Volver a órdenes
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-claudia-navy">Detalle de orden</h1>
          <p className="mt-1 font-mono text-xs text-claudia-muted">{order.id}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${orderStatusBadgeClass(order.status)}`}
        >
          {orderStatusLabel(order.status)}
        </span>
      </div>

      {success && (
        <p className="mt-4 rounded-lg bg-claudia-turquoise/15 px-3 py-2 text-sm text-claudia-navy" role="status">
          {success}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <InfoBlock label="Creada" value={formatAdminDate(order.createdAt)} />
        <InfoBlock label="Actualizada" value={formatAdminDate(order.updatedAt)} />
        <InfoBlock label="Pagada" value={formatAdminDate(order.paidAt)} />
        <InfoBlock label="Entregada" value={formatAdminDate(order.deliveredAt)} />
      </div>

      <div className="mt-6 rounded-xl border border-claudia-lavender/25 bg-white/90 p-4">
        <h2 className="text-sm font-semibold text-claudia-navy">Comprador</h2>
        <dl className="mt-2 space-y-1 text-sm text-claudia-muted">
          <div>
            <dt className="inline font-medium text-claudia-navy">Nombre: </dt>
            <dd className="inline">{order.buyer.name || '—'}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-claudia-navy">Email: </dt>
            <dd className="inline">{order.buyer.email || order.buyerEmail || '—'}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-claudia-navy">Teléfono: </dt>
            <dd className="inline">{order.buyer.phone || '—'}</dd>
          </div>
        </dl>
        {order.customerId && (
          <Link
            to={`/admin/clientes/${order.customerId}`}
            className="mt-3 inline-block text-sm font-medium text-claudia-turquoise hover:underline"
          >
            Ver cliente
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-claudia-lavender/25 bg-white/90">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-claudia-blush bg-claudia-warm/50 text-xs uppercase text-claudia-muted">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Cant.</th>
              <th className="px-4 py-3">P. unit.</th>
              <th className="px-4 py-3">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-claudia-blush/80">
            {order.items.map((item) => (
              <tr key={`${item.productId}-${item.title}`}>
                <td className="px-4 py-3 text-claudia-navy">{item.title || item.productId}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{formatPrice(item.unitPrice)}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-claudia-blush px-4 py-3 text-right text-lg font-bold text-claudia-turquoise">
          Total: {formatPrice(order.total)}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-claudia-lavender/25 bg-white/90 p-4">
        <h2 className="text-sm font-semibold text-claudia-navy">Mercado Pago</h2>
        <dl className="mt-2 space-y-1 text-sm text-claudia-muted">
          <div>
            <dt className="inline font-medium text-claudia-navy">Preference ID: </dt>
            <dd className="inline break-all font-mono text-xs">
              {order.mercadoPago.preferenceId || '—'}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-claudia-navy">Payment ID: </dt>
            <dd className="inline break-all font-mono text-xs">
              {order.mercadoPago.paymentId || '—'}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-claudia-navy">Estado MP: </dt>
            <dd className="inline">{order.mercadoPago.status || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-claudia-lavender/25 bg-white/90 p-4">
        <h2 className="text-sm font-semibold text-claudia-navy">Entrega</h2>
        <p className="mt-2 text-sm text-claudia-muted">
          Estado: <span className="font-medium text-claudia-navy">{order.delivery.status}</span>
        </p>
        {order.delivery.sentAt && (
          <p className="text-sm text-claudia-muted">
            Enviada: {formatAdminDate(order.delivery.sentAt)}
          </p>
        )}
        {order.delivery.downloadLinks.length > 0 && (
          <ul className="mt-2 list-inside list-disc text-xs text-claudia-muted">
            {order.delivery.downloadLinks.map((link) => (
              <li key={link} className="break-all">
                {link}
              </li>
            ))}
          </ul>
        )}
      </div>

      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map((action) => (
            <button
              key={action.nextStatus}
              type="button"
              disabled={actionLoading}
              onClick={() => void handleStatusAction(action.nextStatus, action.confirmMessage)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${
                action.nextStatus === 'cancelled'
                  ? 'bg-claudia-rose hover:opacity-95'
                  : 'bg-claudia-navy hover:opacity-95'
              }`}
            >
              {actionLoading ? 'Procesando…' : action.label}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-claudia-blush/60 bg-white/80 px-3 py-2">
      <p className="text-xs font-medium text-claudia-muted">{label}</p>
      <p className="text-sm text-claudia-navy">{value}</p>
    </div>
  )
}
