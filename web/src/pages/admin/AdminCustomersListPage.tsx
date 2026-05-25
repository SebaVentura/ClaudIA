import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminCustomers } from '../../api/adminCustomers'
import { AdminApiError } from '../../api/adminClient'
import type { AdminCustomer } from '../../types/adminCustomer'
import { formatAdminDate } from '../../utils/adminOrderUi'
import { formatPrice } from '../../utils/formatPrice'

export function AdminCustomersListPage() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminCustomers({
        q: search.trim() || undefined,
      })
      setCustomers(data)
    } catch (e) {
      setCustomers([])
      setError(e instanceof Error ? e.message : 'Error al cargar clientes')
      if (e instanceof AdminApiError && e.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [navigate, search])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void loadCustomers()
    }, 300)
    return () => window.clearTimeout(t)
  }, [loadCustomers])

  return (
    <section>
      <h1 className="text-2xl font-bold text-claudia-navy">Clientes</h1>
      <p className="mt-1 text-sm text-claudia-muted">
        Compradores e historial de compras.
      </p>

      <div className="mt-6">
        <input
          type="search"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-claudia-blush px-3 py-2 text-sm focus:border-claudia-turquoise focus:outline-none focus:ring-1 focus:ring-claudia-turquoise"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-8 text-sm text-claudia-muted">Cargando clientes…</p>
      )}

      {!loading && !error && customers.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-claudia-lavender/40 bg-white/80 px-4 py-8 text-center text-sm text-claudia-muted">
          No hay clientes que coincidan con la búsqueda.
        </p>
      )}

      {!loading && customers.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-claudia-lavender/25 bg-white/90 shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-claudia-blush bg-claudia-warm/50 text-xs uppercase text-claudia-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Compras</th>
                <th className="px-4 py-3 font-semibold">Total gastado</th>
                <th className="px-4 py-3 font-semibold">Última compra</th>
                <th className="px-4 py-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-claudia-blush/80">
              {customers.map((customer) => (
                <tr key={customer.id} className="text-claudia-navy">
                  <td className="px-4 py-3 font-medium">{customer.name || '—'}</td>
                  <td className="px-4 py-3 text-claudia-muted">{customer.email || '—'}</td>
                  <td className="px-4 py-3 text-claudia-muted">{customer.phone || '—'}</td>
                  <td className="px-4 py-3">{customer.totalOrders}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-claudia-muted">
                    {formatAdminDate(customer.lastPurchaseAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/clientes/${customer.id}`}
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

      {!loading && customers.length > 0 && (
        <p className="mt-3 text-xs text-claudia-muted">{customers.length} clientes</p>
      )}
    </section>
  )
}
