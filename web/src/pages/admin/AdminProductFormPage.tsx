import { FormEvent, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createAdminProduct,
  getAdminProduct,
  updateAdminProduct,
  uploadAdminProductCover,
  uploadAdminProductGallerySlot,
} from '../../api/adminProducts'
import { ProductImage } from '../../components/catalog/ProductImage'
import { AdminApiError } from '../../api/adminClient'
import type { AdminProduct, DeliveryMode } from '../../types/adminProduct'
import { emptyAdminProduct } from '../../types/adminProduct'
import {
  arrayToLines,
  gallerySlotsFromProduct,
  gallerySlotsToPayload,
  GALLERY_SLOT_COUNT,
  isAllowedCoverFile,
  linesToArray,
  validateAdminProductForm,
} from '../../utils/adminProductForm'
import { formatPrice } from '../../utils/formatPrice'

const COVER_ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'

export function AdminProductFormPage() {
  const { id: routeId } = useParams<{ id: string }>()
  const isNew = !routeId
  const navigate = useNavigate()

  const [form, setForm] = useState<AdminProduct>(() => emptyAdminProduct())
  const [includesText, setIncludesText] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [coverPreviewKey, setCoverPreviewKey] = useState(0)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [galleryUploading, setGalleryUploading] = useState<Record<number, boolean>>({})
  const [galleryErrors, setGalleryErrors] = useState<Record<number, string | null>>({})
  const [galleryPreviewKeys, setGalleryPreviewKeys] = useState<Record<number, number>>({})

  const productIdForUpload = (routeId ?? form.id).trim()
  const canUploadCover = !isNew && Boolean(productIdForUpload)

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

  const applyProductToForm = (product: AdminProduct) => {
    setForm((prev) => ({
      ...prev,
      ...product,
      image: product.image?.trim() ?? '',
      gallery: gallerySlotsFromProduct(product.gallery),
    }))
    setIncludesText(arrayToLines(product.includes))
    setGalleryPreviewKeys({})
    setCoverPreviewKey((k) => k + 1)
  }

  const coverPreviewSrc = (() => {
    const url = form.image.trim()
    if (!url) return null
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}v=${coverPreviewKey}`
  })()

  const handleGalleryFile = async (slot: 0 | 1 | 2, file: File) => {
    if (!canUploadCover) return

    if (!isAllowedCoverFile(file)) {
      setGalleryErrors((prev) => ({
        ...prev,
        [slot]: 'Formato no válido. Usá JPG, PNG o WebP.',
      }))
      return
    }

    setGalleryUploading((prev) => ({ ...prev, [slot]: true }))
    setGalleryErrors((prev) => ({ ...prev, [slot]: null }))
    setSuccess(null)
    try {
      const updated = await uploadAdminProductGallerySlot(productIdForUpload, slot, file)
      applyProductToForm(updated)
      setGalleryPreviewKeys((prev) => ({ ...prev, [slot]: (prev[slot] ?? 0) + 1 }))
      setSuccess(`Imagen de detalle ${slot + 1} subida correctamente`)
    } catch (err) {
      setGalleryErrors((prev) => ({
        ...prev,
        [slot]: err instanceof Error ? err.message : 'No se pudo subir la imagen',
      }))
      if (err instanceof AdminApiError && err.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setGalleryUploading((prev) => ({ ...prev, [slot]: false }))
      const input = galleryInputRefs.current[slot]
      if (input) input.value = ''
    }
  }

  const galleryPreviewSrc = (slot: number) => {
    const url = (Array.isArray(form.gallery) ? form.gallery[slot] : '')?.trim()
    if (!url) return null
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}v=${galleryPreviewKeys[slot] ?? 0}`
  }

  const handleCoverFile = async (file: File) => {
    if (!canUploadCover) return

    if (!isAllowedCoverFile(file)) {
      setCoverError('Formato no válido. Usá JPG, PNG o WebP.')
      return
    }

    setCoverUploading(true)
    setCoverError(null)
    setSuccess(null)
    try {
      const updated = await uploadAdminProductCover(productIdForUpload, file)
      applyProductToForm(updated)
      setSuccess('Portada subida correctamente')
    } catch (err) {
      setCoverError(err instanceof Error ? err.message : 'No se pudo subir la portada')
      if (err instanceof AdminApiError && err.status === 401) {
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setCoverUploading(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
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
      gallery: gallerySlotsToPayload(
        Array.isArray(form.gallery) ? form.gallery : gallerySlotsFromProduct([]),
      ),
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

        <div className="rounded-xl border border-claudia-lavender/30 bg-gradient-to-br from-white via-claudia-cream/40 to-claudia-warm/30 p-4">
          <h2 className="text-sm font-semibold text-claudia-navy">Portada del producto</h2>
          <p className="mt-1 text-xs text-claudia-muted">
            La imagen se guardará en el servidor y reemplazará la portada actual.
          </p>

          <div className="mt-4 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl border border-claudia-blush/60">
            <ProductImage
              key={`cover-${coverPreviewKey}-${form.image}`}
              src={coverPreviewSrc}
              alt={form.title || 'Portada'}
              frameClassName="h-full w-full"
              iconClassName="text-5xl opacity-70"
            />
          </div>

          {!canUploadCover ? (
            <p className="mt-3 text-sm text-claudia-muted">
              Guardá el producto antes de subir una portada.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                ref={coverInputRef}
                type="file"
                accept={COVER_ACCEPT}
                className="sr-only"
                aria-hidden
                disabled={coverUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleCoverFile(file)
                }}
              />
              <button
                type="button"
                disabled={coverUploading}
                onClick={() => coverInputRef.current?.click()}
                className="rounded-full bg-claudia-navy px-5 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              >
                {coverUploading ? 'Subiendo…' : 'Subir portada'}
              </button>
              {coverUploading && (
                <span className="text-sm text-claudia-muted">Guardando en el servidor…</span>
              )}
            </div>
          )}

          {coverError && (
            <p className="mt-3 rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose" role="alert">
              {coverError}
            </p>
          )}
        </div>

        <FormField label="URL de imagen (portada) *" error={fieldErrors.image}>
          <input
            type="text"
            value={form.image}
            onChange={(e) => updateField('image', e.target.value)}
            className={inputClass(!!fieldErrors.image)}
            placeholder="/uploads/products/mi-producto/cover.jpg"
          />
          <p className="mt-1 text-xs text-claudia-muted">
            Se actualiza automáticamente al subir una portada. Podés editarla manualmente si hace falta.
          </p>
        </FormField>

        <div className="rounded-xl border border-claudia-lavender/30 bg-gradient-to-br from-white via-claudia-cream/40 to-claudia-warm/30 p-4">
          <h2 className="text-sm font-semibold text-claudia-navy">Imágenes de detalle</h2>
          <p className="mt-1 text-xs text-claudia-muted">
            Hasta 3 imágenes para el detalle del producto. Independientes de la portada.
          </p>

          {!canUploadCover ? (
            <p className="mt-3 text-sm text-claudia-muted">
              Guardá el producto antes de subir imágenes de detalle.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: GALLERY_SLOT_COUNT }, (_, slot) => {
                const src = galleryPreviewSrc(slot)
                const uploading = Boolean(galleryUploading[slot])
                const slotError = galleryErrors[slot]
                return (
                  <div
                    key={slot}
                    className="rounded-lg border border-claudia-blush/60 bg-white/80 p-3"
                  >
                    <p className="text-xs font-medium text-claudia-navy">
                      Imagen detalle {slot + 1}
                    </p>
                    <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded-lg border border-claudia-blush/50">
                      <ProductImage
                        key={`gallery-${slot}-${src ?? 'empty'}-${galleryPreviewKeys[slot] ?? 0}`}
                        src={src}
                        alt={`Detalle ${slot + 1}`}
                        frameClassName="h-full w-full"
                        iconClassName="text-3xl opacity-60"
                      />
                    </div>
                    <input
                      ref={(el) => {
                        galleryInputRefs.current[slot] = el
                      }}
                      type="file"
                      accept={COVER_ACCEPT}
                      className="sr-only"
                      aria-hidden
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) void handleGalleryFile(slot as 0 | 1 | 2, file)
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => galleryInputRefs.current[slot]?.click()}
                      className="mt-3 w-full rounded-full border border-claudia-navy/30 px-3 py-1.5 text-xs font-semibold text-claudia-navy hover:bg-claudia-warm disabled:opacity-60"
                    >
                      {uploading ? 'Subiendo…' : src ? 'Reemplazar' : 'Subir'}
                    </button>
                    {slotError && (
                      <p className="mt-2 text-xs text-claudia-rose" role="alert">
                        {slotError}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

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
