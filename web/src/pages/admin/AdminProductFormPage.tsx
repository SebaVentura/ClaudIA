import { FormEvent, useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createAdminProduct,
  getAdminProduct,
  updateAdminProduct,
} from '../../api/adminProducts'
import { AdminApiError } from '../../api/adminClient'
import type { AdminProduct, DeliveryMode } from '../../types/adminProduct'
import { emptyAdminProduct } from '../../types/adminProduct'
import {
  arrayToLines,
  linesToArray,
  validateAdminProductForm,
} from '../../utils/adminProductForm'
import { formatPrice } from '../../utils/formatPrice'

export function AdminProductFormPage() {
  const { id: routeId } = useParams<{ id: string }>()
  const isNew = !routeId
  const navigate = useNavigate()

  const [form, setForm] = useState<AdminProduct>(() => emptyAdminProduct())
  const [galleryText, setGalleryText] = useState('')
  const [includesText, setIncludesText] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const product = await getAdminProduct(routeId!)
        if (cancelled) return
        setForm(product)
        setGalleryText(arrayToLines(product.gallery))
        setIncludesText(arrayToLines(product.includes))
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error al cargar')
          if (e instanceof AdminApiError && e.status === 401) {
            navigate('/admin/login', { replace: true })
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isNew, routeId, navigate])

  const updateField = <K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[key as string]
      return next
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    const errors = validateAdminProductForm({
      id: form.id,
      title: form.title,
      price: form.price,
      image: form.image,
      isNew,
    })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const payload = {
      title: form.title.trim(),
      level: form.level.trim(),
      age: form.age.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      price: form.price,
      badge: form.badge?.trim() || null,
      active: form.active,
      image: form.image.trim(),
      gallery: linesToArray(galleryText),
      includes: linesToArray(includesText),
      pages: form.pages || 0,
      audience: form.audience.trim(),
      category: form.category.trim(),
      downloadLink: form.downloadLink.trim(),
      deliveryMode: form.deliveryMode,
      checkoutMode: form.checkoutMode,
    }

    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        await createAdminProduct({ ...payload, id: form.id.trim() })
        navigate('/admin/productos', {
          replace: true,
          state: { message: 'Producto creado correctamente' },
        })
      } else {
        await updateAdminProduct(routeId!, payload)
        setSuccess('Guardado correctamente')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
      if (err instanceof AdminApiError && err.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-claudia-muted">Cargando producto…</p>
  }

  return (
    <section className="max-w-3xl">
      <Link
        to="/admin/productos"
        className="text-sm font-medium text-claudia-turquoise hover:underline"
      >
        ← Volver a productos
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-claudia-navy">
        {isNew ? 'Nuevo producto' : 'Editar producto'}
      </h1>

      {error && (
        <p className="mt-4 rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-lg bg-claudia-turquoise/15 px-3 py-2 text-sm text-claudia-navy" role="status">
          {success}
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <FormField label="ID (slug)" error={fieldErrors.id}>
          <input
            type="text"
            value={form.id}
            disabled={!isNew}
            onChange={(e) => updateField('id', e.target.value)}
            className={inputClass(!!fieldErrors.id)}
            placeholder="taller-funcion-lineal"
          />
        </FormField>

        <FormField label="Título *" error={fieldErrors.title}>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            className={inputClass(!!fieldErrors.title)}
            required
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nivel">
            <input
              type="text"
              value={form.level}
              onChange={(e) => updateField('level', e.target.value)}
              className={inputClass()}
            />
          </FormField>
          <FormField label="Edad">
            <input
              type="text"
              value={form.age}
              onChange={(e) => updateField('age', e.target.value)}
              className={inputClass()}
            />
          </FormField>
        </div>

        <FormField label="Categoría">
          <input
            type="text"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            className={inputClass()}
          />
        </FormField>

        <FormField label="Descripción breve">
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={2}
            className={inputClass()}
          />
        </FormField>

        <FormField label="Descripción larga">
          <textarea
            value={form.longDescription}
            onChange={(e) => updateField('longDescription', e.target.value)}
            rows={4}
            className={inputClass()}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Precio *" error={fieldErrors.price}>
            <input
              type="number"
              min={0}
              step={1}
              value={form.price || ''}
              onChange={(e) => updateField('price', Number(e.target.value))}
              className={inputClass(!!fieldErrors.price)}
            />
            {form.price > 0 && (
              <p className="mt-1 text-xs text-claudia-muted">{formatPrice(form.price)}</p>
            )}
          </FormField>
          <FormField label="Páginas">
            <input
              type="number"
              min={0}
              value={form.pages || ''}
              onChange={(e) => updateField('pages', Number(e.target.value))}
              className={inputClass()}
            />
          </FormField>
          <FormField label="Badge">
            <input
              type="text"
              value={form.badge ?? ''}
              onChange={(e) => updateField('badge', e.target.value || null)}
              className={inputClass()}
            />
          </FormField>
        </div>

        <FormField label="Imagen principal (ruta) *" error={fieldErrors.image}>
          <input
            type="text"
            value={form.image}
            onChange={(e) => updateField('image', e.target.value)}
            className={inputClass(!!fieldErrors.image)}
            placeholder="/products/mi-producto/cover.jpg"
          />
          {form.image.trim() && (
            <img
              src={form.image}
              alt=""
              className="mt-2 h-24 w-auto rounded-lg border border-claudia-blush object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
        </FormField>

        <FormField label="Galería (una ruta por línea)">
          <textarea
            value={galleryText}
            onChange={(e) => setGalleryText(e.target.value)}
            rows={3}
            className={inputClass()}
            placeholder="/products/.../page-1.jpg"
          />
        </FormField>

        <FormField label="Incluye (un ítem por línea)">
          <textarea
            value={includesText}
            onChange={(e) => setIncludesText(e.target.value)}
            rows={3}
            className={inputClass()}
          />
        </FormField>

        <FormField label="Audiencia">
          <textarea
            value={form.audience}
            onChange={(e) => updateField('audience', e.target.value)}
            rows={2}
            className={inputClass()}
          />
        </FormField>

        <FormField label="Link de descarga (admin)">
          <input
            type="url"
            value={form.downloadLink}
            onChange={(e) => updateField('downloadLink', e.target.value)}
            className={inputClass()}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Modo de entrega">
            <select
              value={form.deliveryMode}
              onChange={(e) =>
                updateField('deliveryMode', e.target.value as DeliveryMode)
              }
              className={inputClass()}
            >
              <option value="automatic_download">Descarga automática</option>
              <option value="manual">Manual</option>
            </select>
          </FormField>
          <FormField label="Modo checkout">
            <select value={form.checkoutMode} className={inputClass()} disabled>
              <option value="cart">Carrito</option>
            </select>
          </FormField>
        </div>

        <label className="flex items-center gap-2 text-sm text-claudia-navy">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => updateField('active', e.target.checked)}
            className="rounded border-claudia-blush"
          />
          Producto activo (visible en catálogo público)
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-claudia-cta px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {saving ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios'}
          </button>
          <Link
            to="/admin/productos"
            className="rounded-full border border-claudia-blush px-6 py-2.5 text-sm font-medium text-claudia-navy hover:bg-claudia-warm"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

function inputClass(hasError?: boolean) {
  return `mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
    hasError
      ? 'border-claudia-rose focus:border-claudia-rose focus:ring-claudia-rose'
      : 'border-claudia-blush focus:border-claudia-turquoise focus:ring-claudia-turquoise'
  }`
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-claudia-navy">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-claudia-rose">{error}</p>}
    </div>
  )
}
