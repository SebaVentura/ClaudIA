import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { getProducts } from '../api/products'
import type { Product } from '../types/product'

interface ProductsContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (e) {
      setProducts([])
      setError(
        e instanceof Error
          ? e.message
          : 'No pudimos conectar con el servidor. Verificá que la API esté corriendo en el puerto 8000.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <ProductsContext.Provider value={{ products, loading, error, refetch: load }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts requiere ProductsProvider')
  return ctx
}
