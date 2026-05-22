import { useState } from 'react'
import { nivelesFiltro } from '../../data/products'
import { useProducts } from '../../context/ProductsContext'
import { useCatalogFilter } from '../../hooks/useCatalogFilter'
import type { NivelFiltro, Product } from '../../types/product'
import { ProductCard } from './ProductCard'
import { ProductDetailModal } from './ProductDetailModal'

export function CatalogSection() {
  const { products, loading, error, refetch } = useProducts()
  const { nivel, setNivel, query, setQuery, filtered } = useCatalogFilter(products)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <section
      id="catalogo"
      className="section-anchor relative overflow-hidden bg-gradient-to-b from-claudia-turquoise/10 via-claudia-warm to-claudia-amber/8 px-4 py-14 sm:px-6"
    >
      <div className="pointer-events-none absolute left-0 top-1/4 h-64 w-64 rounded-full bg-claudia-lavender/12 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-claudia-ink">Catálogo de ebooks</h2>
        <p className="mt-2 text-center text-claudia-muted">Filtrá por nivel o buscá por título y tema</p>

        {loading && (
          <p className="mt-10 text-center text-claudia-muted" role="status">
            Cargando catálogo…
          </p>
        )}

        {error && !loading && (
          <div
            className="mx-auto mt-10 max-w-lg rounded-2xl border border-claudia-rose/40 bg-white p-6 text-center shadow-card"
            role="alert"
          >
            <p className="font-semibold text-claudia-ink">No se pudo cargar el catálogo</p>
            <p className="mt-2 text-sm text-claudia-muted">{error}</p>
            <p className="mt-2 text-sm text-claudia-muted">
              Asegurate de tener el backend Node en ejecución:{' '}
              <code className="text-xs">cd server &amp;&amp; npm run dev</code> (puerto 3000)
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-full bg-claudia-navy px-5 py-2 text-sm font-semibold text-white hover:bg-claudia-turquoise"
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
              className="mx-auto mt-8 block w-full max-w-md rounded-full border border-claudia-lavender/40 bg-white px-5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-claudia-turquoise/40"
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
                      ? 'bg-claudia-navy text-white shadow-sm'
                      : 'border border-claudia-lavender/30 bg-white text-claudia-muted hover:border-claudia-turquoise/50'
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
                  <ProductCard key={p.id} product={p} onViewDetail={setSelectedProduct} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  )
}
