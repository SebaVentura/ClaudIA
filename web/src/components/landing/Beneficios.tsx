const items = [
  {
    icon: '🖨️',
    title: 'Materiales listos para imprimir',
    text: 'PDF digital listo para descargar y usar sin reformatos.',
  },
  {
    icon: '✨',
    title: 'Diseño visual cuidado',
    text: 'Recursos con identidad ClaudIA, claros y atractivos.',
  },
  {
    icon: '👩‍🏫',
    title: 'Pensados para docentes reales',
    text: 'Propuestas aplicables en aula, apoyo y familia.',
  },
  {
    icon: '📋',
    title: 'Actividades aplicables en el aula',
    text: 'Secuencias y consignas listas para enseñar.',
  },
  {
    icon: '⚡',
    title: 'Entrega digital rápida',
    text: 'Coordinación ágil tras confirmar tu pedido.',
  },
  {
    icon: '🎨',
    title: 'Identidad visual propia',
    text: 'Producciones educativas con estilo ClaudIA.',
  },
]

export function Beneficios() {
  return (
    <section
      id="beneficios"
      className="section-anchor relative overflow-hidden bg-gradient-to-br from-claudia-rose/8 via-claudia-warm to-claudia-lavender/12 px-4 py-14 sm:px-6"
    >
      <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-claudia-amber/15 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-claudia-ink">Por qué elegir ClaudIA</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-claudia-lavender/30 bg-white/95 p-6 shadow-[0_8px_24px_rgba(23,59,99,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(23,59,99,0.1)]"
            >
              <span className="text-3xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-3 font-semibold text-claudia-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-claudia-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
