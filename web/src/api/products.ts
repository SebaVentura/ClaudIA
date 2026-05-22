import type { NivelEducativo, Product } from '../types/product'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface ApiProduct {
  id: string
  title: string
  level: string
  age: string
  description: string
  price: number
  badge: string | null
  active: boolean
  image: string | null
}

function mapApiProduct(item: ApiProduct): Product {
  return {
    id: item.id,
    titulo: item.title,
    nivel: item.level as NivelEducativo,
    edad: item.age,
    descripcion: item.description,
    precio: item.price,
    badge: item.badge ?? undefined,
    imagen: item.image ?? undefined,
  }
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`)
  if (!res.ok) {
    throw new Error(`Error al cargar el catálogo (${res.status})`)
  }
  const data = (await res.json()) as ApiProduct[]
  return data.map(mapApiProduct)
}

export { API_URL }
