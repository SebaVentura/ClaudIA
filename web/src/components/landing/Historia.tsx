import { useState } from 'react'

// Imagen en web/public/history/ (png, jpg o webp). Reemplazar el archivo para cambiar la foto.
const historyImage = '/history/hero-historia.webp'
const historyImageAlt = 'ClaudIA Educación Digital — nuestra historia'

const parrafos = [
  'ClaudIA Educación Digital nace con una idea simple pero poderosa: crear materiales educativos que inviten a aprender con alegría, creatividad y sentido.',
  'Sabemos que cada niño aprende de una manera distinta. Algunos necesitan tocar, recortar y construir; otros disfrutan colorear, resolver desafíos o descubrir conceptos jugando. Por eso diseñamos talleres, cuadernillos y recursos imprimibles pensados para acompañar el aprendizaje desde una mirada cercana, visual y significativa.',
  'Cada material de ClaudIA combina diseño, pedagogía y tecnología. Buscamos que las actividades no sean solo lindas, sino también útiles, claras y listas para usar en casa, en el aula o en espacios de apoyo escolar.',
  'Nuestro objetivo es que docentes, familias y niños encuentren recursos cuidados, accesibles y motivadores, capaces de transformar un tema escolar en una experiencia de aprendizaje.',
  'En ClaudIA creemos que aprender también puede ser crear, imaginar y disfrutar.',
]

function HistoriaImagenFallback() {
  return (
    <div
      className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-claudia-lavender/30 bg-gradient-to-br from-claudia-warm via-white to-claudia-turquoise/15 px-6 text-center shadow-[0_8px_24px_rgba(23,59,99,0.08)]"
      role="img"
      aria-label="Aprender, crear y crecer"
    >
      <span className="text-5xl" aria-hidden>
        📚
      </span>
      <p className="text-sm font-medium text-claudia-ink">Aprender, crear y crecer</p>
    </div>
  )
}

function HistoriaImagen() {
  const [fallo, setFallo] = useState(false)

  if (fallo) {
    return <HistoriaImagenFallback />
  }

  return (
    <img
      src={historyImage}
      alt={historyImageAlt}
      className="aspect-[4/3] w-full rounded-2xl border border-claudia-lavender/30 object-cover shadow-[0_8px_24px_rgba(23,59,99,0.08)]"
      onError={() => setFallo(true)}
    />
  )
}

export function Historia() {
  return (
    <section
      id="historia"
      className="section-anchor relative overflow-hidden bg-gradient-to-r from-claudia-lavender/15 via-claudia-warm to-claudia-rose/10 px-4 py-14 sm:px-6"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-claudia-turquoise/10 blur-2xl" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl font-bold text-claudia-ink">Nuestra historia</h2>
          <div className="mt-6 space-y-4">
            {parrafos.map((texto, i) => (
              <p key={i} className="leading-relaxed text-claudia-muted">
                {texto}
              </p>
            ))}
          </div>
          <blockquote className="mt-8 rounded-2xl border border-claudia-lavender/30 bg-white/90 px-5 py-4 shadow-[0_6px_20px_rgba(23,59,99,0.06)]">
            <p className="font-semibold text-claudia-ink">ClaudIA Educación Digital</p>
            <p className="mt-1 text-sm text-claudia-muted">
              Recursos educativos para aprender, crear y crecer.
            </p>
          </blockquote>
        </div>
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="w-full max-w-md">
            <HistoriaImagen />
          </div>
        </div>
      </div>
    </section>
  )
}
