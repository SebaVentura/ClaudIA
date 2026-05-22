import { nivelesFiltro } from '../../data/products'
import { useProducts } from '../../context/ProductsContext'
import { useCatalogFilter } from '../../hooks/useCatalogFilter'
import type { NivelFiltro } from '../../types/product'
import { ProductCard } from './ProductCard'

export function CatalogSection() {
  const { products, loading, error, refetch } = useProducts()
  const { nivel, setNivel, query, setQuery, filtered } = useCatalogFilter(products)

  return (
    <section id="catalogo" className="section-anchor px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-claudia-ink">Catálogo de ebooks</h2>
        <p className="mt-2 text-center text-claudia-muted">Filtrá por nivel o buscá por título y tema</p>

        {loading && (
          <p className="mt-10 text-center text-claudia-muted" role="status">
            Cargando catálogo…
          </p>
        )}

        {error && !loading && (
          <div
            className="mx-auto mt-10 max-w-lg rounded-2xl border border-claudia-coral/40 bg-white p-6 text-center shadow-card"
            role="alert"
          >
            <p className="font-semibold text-claudia-ink">No se pudo cargar el catálogo</p>
            <p className="mt-2 text-sm text-claudia-muted">{error}</p>
            <p className="mt-2 text-sm text-claudia-muted">
              Asegurate de tener la API en ejecución:{' '}
              <code className="text-xs">python -m uvicorn main:app --reload --port 8000</code>
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-full bg-claudia-coral px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, descripción o nivel…"
              className="mx-auto mt-8 block w-full max-w-md rounded-full border border-claudia-rose/30 bg-white px-5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-claudia-coral/40"
              aria-label="Buscar ebooks"
            />

            <div className="mt-4 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Nivel">
              {nivelesFiltro.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="tab"
                  aria-selected={nivel === n}
                  onClick={() => setNivel(n as NivelFiltro)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    nivel === n
                      ? 'bg-claudia-coral text-white shadow-sm'
                      : 'border border-claudia-blush bg-white text-claudia-muted hover:border-claudia-coral/50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="mt-12 text-center text-claudia-muted">No hay ebooks con esos criterios.</p>
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
