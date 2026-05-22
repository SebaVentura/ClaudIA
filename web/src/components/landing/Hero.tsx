import { useState } from 'react'
import { Button } from '../ui/Button'

const scrollTo = (id: string) =>
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

const HERO_CARD_IMAGE = '/landing/claudia-aula-preview.png'

export function Hero() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section
      id="inicio"
      className="section-anchor relative overflow-hidden bg-claudia-hero px-4 pb-16 pt-10 sm:px-6"
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-claudia-turquoise/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-claudia-lavender/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/4 left-0 h-56 w-56 rounded-full bg-claudia-rose/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-48 w-48 rounded-full bg-claudia-amber/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="animate-fade-in space-y-6">
          <p className="inline-flex rounded-full border border-claudia-lavender/40 bg-white/90 px-4 py-1 text-sm font-medium text-claudia-navy shadow-sm">
            Ebooks educativos · Entrega digital
          </p>
          <h1 className="text-4xl font-bold leading-tight text-claudia-ink sm:text-5xl">
            Recursos pedagógicos listos para{' '}
            <span className="bg-claudia-hero-text bg-clip-text text-transparent">
              enseñar con alegría
            </span>
          </h1>
          <p className="max-w-xl text-lg text-claudia-muted">
            ClaudIA reúne ebooks por nivel: actividades imprimibles, diseño docente y recursos visuales para tu aula.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => scrollTo('#catalogo')}>
              Ver catálogo
            </Button>
            <Button variant="outline" onClick={() => scrollTo('#como-comprar')}>
              Cómo comprar
            </Button>
          </div>
        </div>
        <div className="animate-fade-in flex justify-center lg:justify-end [animation-delay:150ms]">
          <div className="relative w-full max-w-lg min-h-[280px] overflow-hidden rounded-3xl border border-claudia-lavender/30 shadow-[0_12px_40px_rgba(23,59,99,0.1)] sm:min-h-[300px]">
            {!imageFailed ? (
              <img
                src={HERO_CARD_IMAGE}
                alt="ClaudIA Educación Digital"
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-white via-claudia-warm to-claudia-turquoise/15"
                aria-hidden
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
