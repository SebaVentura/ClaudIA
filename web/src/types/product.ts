export type NivelEducativo =
  | 'Inicial'
  | 'Primaria'
  | 'Secundaria'
  | 'Técnica'
  | 'Superior'
  | 'IA educativa'

export type NivelFiltro = NivelEducativo | 'Todos'

export interface Product {
  id: string
  titulo: string
  nivel: NivelEducativo
  edad: string
  descripcion: string
  descripcionLarga: string
  precio: number
  imagen?: string
  galeria: string[]
  incluye: string[]
  paginas?: number
  audiencia?: string
  badge?: string
}

export interface CartItem {
  productId: string
  quantity: number
}
