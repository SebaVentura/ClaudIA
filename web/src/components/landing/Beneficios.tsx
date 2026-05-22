const items = [
  { icon: '🖨️', title: 'PDF listo para imprimir', text: 'Descargá y usá en clase sin reformatos.' },
  { icon: '🎯', title: 'Diseño pedagógico', text: 'Actividades por objetivos y momentos de enseñanza.' },
  { icon: '✂️', title: 'Recursos visuales', text: 'Ilustraciones y recortables para manipular.' },
  { icon: '⚡', title: 'Entrega digital', text: 'Tras confirmar el pago, enlaces por correo.' },
]

export function Beneficios() {
  return (
    <section id="beneficios" className="section-anchor px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-claudia-ink">Por qué elegir ClaudIA</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-claudia-blush bg-white p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-3xl" aria-hidden>{item.icon}</span>
              <h3 className="mt-3 font-semibold text-claudia-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-claudia-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
