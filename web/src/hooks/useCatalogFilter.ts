import { useMemo, useState } from 'react'
import type { NivelFiltro, Product } from '../types/product'

export function useCatalogFilter(products: Product[]) {
  const [nivel, setNivel] = useState<NivelFiltro>('Todos')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const okNivel = nivel === 'Todos' || p.nivel === nivel
      const okQuery =
        !q ||
        p.titulo.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.nivel.toLowerCase().includes(q)
      return okNivel && okQuery
    })
  }, [products, nivel, query])

  return { nivel, setNivel, query, setQuery, filtered }
}
