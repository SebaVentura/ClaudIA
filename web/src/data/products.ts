import type { Product } from '../types/product'

/** Fallback local — no se usa si el backend responde. Mantener sincronizado con server/data/products.json */
export const fallbackProducts: Product[] = [
  {
    id: 'geo-tangram-inicial',
    titulo: 'Geometría y Tangram',
    nivel: 'Inicial',
    edad: '5 a 7 años',
    descripcion: 'Taller visual, manipulativo y listo para imprimir.',
    descripcionLarga: 'Taller visual, manipulativo y listo para imprimir.',
    precio: 6600,
    badge: 'Más elegido',
    galeria: [],
    incluye: [],
  },
  {
    id: 'division-primaria',
    titulo: 'División: repartos y estrategias',
    nivel: 'Primaria',
    edad: '2.º a 4.º grado',
    descripcion:
      'Secuencias didácticas para construir el sentido de la división con repartos y problemas cotidianos.',
    precio: 7200,
    descripcionLarga:
      'Secuencias didácticas para construir el sentido de la división con repartos y problemas cotidianos.',
    galeria: [],
    incluye: [],
  },
  {
    id: 'cuerpos-geom-tecnica',
    titulo: 'Cuerpos geométricos en secundaria técnica',
    nivel: 'Técnica',
    edad: '1.º y 2.º año',
    descripcion:
      'Prismas, pirámides y desarrollos planos con fichas imprimibles para taller y geometría.',
    precio: 7800,
    descripcionLarga:
      'Prismas, pirámides y desarrollos planos con fichas imprimibles para taller y geometría.',
    galeria: [],
    incluye: [],
  },
  {
    id: 'irracionales-secundaria',
    titulo: 'Números irracionales',
    nivel: 'Secundaria',
    edad: '4.º año',
    descripcion:
      'Introducción guiada a √2 y π con representaciones, estimación y ejercicios.',
    precio: 7500,
    descripcionLarga:
      'Introducción guiada a √2 y π con representaciones, estimación y ejercicios.',
    galeria: [],
    incluye: [],
  },
  {
    id: 'taller-logico-superior',
    titulo: 'Taller de Pensamiento Lógico Matemático',
    nivel: 'Superior',
    edad: 'Profesorado',
    descripcion:
      'Propuestas para formación docente: razonamiento, demostración y diseño de situaciones.',
    precio: 8200,
    badge: 'Formación docente',
    descripcionLarga:
      'Propuestas para formación docente: razonamiento, demostración y diseño de situaciones.',
    galeria: [],
    incluye: [],
  },
  {
    id: 'ia-primera-experiencia',
    titulo: 'Mi primera experiencia con IA',
    nivel: 'IA educativa',
    edad: 'Niños y docentes',
    descripcion: 'Guía amable para usar IA en el aula con ética, ejemplos y actividades seguras.',
    precio: 6900,
    badge: 'Nuevo',
    descripcionLarga: 'Guía amable para usar IA en el aula con ética, ejemplos y actividades seguras.',
    galeria: [],
    incluye: [],
  },
]

export const nivelesFiltro = [
  'Todos',
  'Inicial',
  'Primaria',
  'Secundaria',
  'Técnica',
  'Superior',
  'IA educativa',
] as const
