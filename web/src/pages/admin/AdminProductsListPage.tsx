import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  deleteAdminProduct,
  getAdminProducts,
  toggleAdminProductActive,
} from '../../api/adminProducts'
import { AdminApiError } from '../../api/adminClient'
import type { AdminProduct } from '../../types/adminProduct'
import { formatPrice } from '../../utils/formatPrice'

type StatusFilter = 'all' | 'active' | 'inactive'

export function AdminProductsListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const flashMessage = (location.state as { message?: string } | null)?.message

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(flashMessage ?? null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [actionId, setActionId] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminProducts()
      setProducts(data)
    } catch (e) {
      setProducts([])
      setError(e instanceof Error ? e.message : 'Error al cargar productos')
      if (e instanceof AdminApiError && e.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  useEffect(() => {
    if (!flashMessage) return
    navigate(location.pathname, { replace: true, state: {} })
  }, [flashMessage, location.pathname, navigate])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (statusFilter === 'active' && !p.active) return false
      if (statusFilter === 'inactive' && p.active) return false
      if (!q) return true
      const haystack = [
        p.id,
        p.title,
        p.level,
        p.category,
        p.description,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [products, search, statusFilter])

  const handleToggle = async (product: AdminProduct) => {
    if (actionId) return
    setActionId(product.id)
    setSuccess(null)
    setError(null)
    try {
      await toggleAdminProductActive(product.id)
      setSuccess(
        product.active
          ? `"${product.title}" desactivado`
          : `"${product.title}" activado`,
      )
      await loadProducts()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar el estado')
      if (e instanceof AdminApiError && e.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (product: AdminProduct) => {
    const ok = window.confirm(
      `¿Dar de baja "${product.title}"?\n\nSe aplicará baja lógica (no se elimina del historial de ventas).`,
    )
    if (!ok || actionId) return

    setActionId(product.id)
    setSuccess(null)
    setError(null)
    try {
      await deleteAdminProduct(product.id)
      setSuccess(`"${product.title}" dado de baja`)
      await loadProducts()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo dar de baja')
      if (e instanceof AdminApiError && e.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setActionId(null)
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-claudia-navy">Productos</h1>
          <p className="mt-1 text-sm text-claudia-muted">
            Gestión de cursos, talleres y materiales digitales.
          </p>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="rounded-full bg-claudia-cta px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Buscar por título, id, nivel…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-claudia-blush px-3 py-2 text-sm focus:border-claudia-turquoise focus:outline-none focus:ring-1 focus:ring-claudia-turquoise"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-claudia-blush px-3 py-2 text-sm text-claudia-navy"
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
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

      {loading && (
        <p className="mt-8 text-sm text-claudia-muted">Cargando productos…</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-claudia-lavender/40 bg-white/80 px-4 py-8 text-center text-sm text-claudia-muted">
          {products.length === 0
            ? 'No hay productos cargados.'
            : 'Ningún producto coincide con la búsqueda.'}
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-claudia-lavender/25 bg-white/90 shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-claudia-blush bg-claudia-warm/50 text-xs uppercase text-claudia-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold">Nivel / categoría</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold">Págs.</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-claudia-blush/80">
              {filtered.map((product) => (
                <tr key={product.id} className="text-claudia-navy">
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.title}</p>
                    <p className="text-xs text-claudia-muted">{product.id}</p>
                  </td>
                  <td className="px-4 py-3 text-claudia-muted">
                    <p>{product.level || '—'}</p>
                    <p className="text-xs">{product.category || '—'}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.pages || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.active
                          ? 'bg-claudia-turquoise/20 text-claudia-navy'
                          : 'bg-claudia-rose/15 text-claudia-rose'
                      }`}
                    >
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        to={`/admin/productos/${product.id}/editar`}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-claudia-turquoise hover:bg-claudia-turquoise/10"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        disabled={actionId === product.id}
                        onClick={() => void handleToggle(product)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-claudia-navy hover:bg-claudia-lavender/20 disabled:opacity-50"
                      >
                        {product.active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        disabled={actionId === product.id}
                        onClick={() => void handleDelete(product)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-claudia-rose hover:bg-claudia-rose/10 disabled:opacity-50"
                      >
                        Baja
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && products.length > 0 && (
        <p className="mt-3 text-xs text-claudia-muted">
          Mostrando {filtered.length} de {products.length} productos
        </p>
      )}
    </section>
  )
}
