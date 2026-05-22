import { Button } from '../ui/Button'

const scrollTo = (id: string) =>
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

export function Hero() {
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
            <Button variant="primary" onClick={() => scrollTo('#catalogo')}>Ver catálogo</Button>
            <Button variant="outline" onClick={() => scrollTo('#como-comprar')}>Cómo comprar</Button>
          </div>
        </div>
        <div className="animate-fade-in flex justify-center lg:justify-end [animation-delay:150ms]">
          <div className="relative w-full max-w-md rounded-3xl border border-claudia-lavender/30 bg-gradient-to-br from-white via-claudia-warm to-claudia-turquoise/15 p-8 shadow-[0_12px_40px_rgba(23,59,99,0.1)]">
            <p className="text-2xl font-bold text-claudia-ink">📚 Tu aula, en un clic</p>
            <ul className="mt-4 space-y-2 text-sm text-claudia-muted">
              <li>✓ PDF listo para imprimir</li>
              <li>✓ Del nivel Inicial a Superior</li>
              <li>✓ IA educativa para docentes</li>
            </ul>
            <span className="absolute -bottom-4 -right-4 rotate-3 rounded-2xl bg-claudia-navy px-4 py-2 text-sm font-semibold text-white shadow-lg">
              +6 ebooks
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
