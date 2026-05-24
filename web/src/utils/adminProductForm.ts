const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function linesToArray(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function arrayToLines(items: string[]): string {
  return items.join('\n')
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

  if (!values.image.trim()) {
    errors.image = 'La imagen principal es obligatoria'
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
