const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const COVER_EXT_RE = /\.(jpe?g|png|webp)$/i
const COVER_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])

export function isAllowedCoverFile(file: File): boolean {
  if (COVER_MIME.has(file.type)) return true
  return COVER_EXT_RE.test(file.name)
}

export function linesToArray(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function arrayToLines(items: string[]): string {
  return items.join('\n')
}

export const GALLERY_SLOT_COUNT = 3

export function gallerySlotsFromProduct(gallery: string[] | undefined): string[] {
  const slots = Array.isArray(gallery) ? gallery.map((u) => String(u).trim()) : []
  return [0, 1, 2].map((i) => slots[i] ?? '')
}

export function gallerySlotsToPayload(slots: string[]): string[] {
  return slots
    .slice(0, GALLERY_SLOT_COUNT)
    .map((u) => u.trim())
    .filter(Boolean)
}

export function validateAdminProductForm(
  values: {
    id: string
    title: string
    price: number
    image: string
    isNew: boolean
  },
): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!values.title.trim()) {
    errors.title = 'El título es obligatorio'
  }

  if (values.isNew && !values.image.trim()) {
    errors.image = 'La imagen principal es obligatoria al crear'
  }

  if (!Number.isFinite(values.price) || values.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0'
  }

  const id = values.id.trim()
  if (values.isNew && !id) {
    errors.id = 'El ID es obligatorio al crear'
  }
  if (id && !SLUG_RE.test(id)) {
    errors.id = 'El ID debe ser un slug (minúsculas, números y guiones)'
  }

  return errors
}
