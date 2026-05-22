import { Button } from '../ui/Button'

const scrollTo = (id: string) =>
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

export function Hero() {
  return (
    <section id="inicio" className="section-anchor relative overflow-hidden px-4 pb-16 pt-10 sm:px-6">
      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-claudia-rose/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-claudia-amber/25 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="animate-fade-in space-y-6">
          <p className="inline-flex rounded-full border border-claudia-blush bg-white/80 px-4 py-1 text-sm font-medium text-claudia-coral shadow-sm">
            Ebooks educativos · Entrega digital
          </p>
          <h1 className="text-4xl font-bold leading-tight text-claudia-ink sm:text-5xl">
            Recursos pedagógicos listos para{' '}
            <span className="bg-gradient-to-r from-claudia-coral to-claudia-rose bg-clip-text text-transparent">
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
          <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-gradient-to-br from-white via-claudia-blush to-claudia-amber/30 p-8 shadow-soft">
            <p className="text-2xl font-bold text-claudia-ink">📚 Tu aula, en un clic</p>
            <ul className="mt-4 space-y-2 text-sm text-claudia-muted">
              <li>✓ PDF listo para imprimir</li>
              <li>✓ Del nivel Inicial a Superior</li>
              <li>✓ IA educativa para docentes</li>
            </ul>
            <span className="absolute -bottom-4 -right-4 rotate-3 rounded-2xl bg-claudia-coral px-4 py-2 text-sm font-semibold text-white shadow-lg">
              +6 ebooks
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
