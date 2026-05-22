const steps = [
  { n: '1', title: 'Elegís el ebook', text: 'Explorá el catálogo por nivel y agregá al carrito.' },
  { n: '2', title: 'Pagás con Mercado Pago', text: 'Checkout seguro (Fase 4).' },
  { n: '3', title: 'Verificamos el pago', text: 'Confirmación automática del sistema.' },
  { n: '4', title: 'Recibís por mail', text: 'Enlaces de descarga en tu correo.' },
]

export function ComoFunciona() {
  return (
    <section
      id="como-comprar"
      className="section-anchor relative overflow-hidden bg-gradient-to-b from-claudia-lavender/18 via-claudia-mist/40 to-claudia-warm px-4 py-14 sm:px-6"
    >
      <div className="pointer-events-none absolute left-1/4 top-0 h-48 w-48 rounded-full bg-claudia-turquoise/15 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-claudia-ink">Cómo funciona la compra</h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-claudia-lavender/30 bg-white/95 p-6 shadow-[0_8px_24px_rgba(23,59,99,0.08)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-claudia-navy font-bold text-white shadow-sm">
                {s.n}
              </span>
              <h3 className="mt-4 font-semibold text-claudia-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-claudia-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
