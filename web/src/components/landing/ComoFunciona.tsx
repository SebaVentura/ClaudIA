const steps = [
  { n: '1', title: 'Elegís el ebook', text: 'Explorá el catálogo por nivel y agregá al carrito.' },
  { n: '2', title: 'Pagás con Mercado Pago', text: 'Checkout seguro (Fase 4).' },
  { n: '3', title: 'Verificamos el pago', text: 'Confirmación automática del sistema.' },
  { n: '4', title: 'Recibís por mail', text: 'Enlaces de descarga en tu correo.' },
]

export function ComoFunciona() {
  return (
    <section id="como-comprar" className="section-anchor bg-gradient-to-b from-claudia-blush/50 to-claudia-cream px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-claudia-ink">Cómo funciona la compra</h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl border border-claudia-rose/20 bg-white p-6 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-claudia-coral font-bold text-white">{s.n}</span>
              <h3 className="mt-4 font-semibold text-claudia-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-claudia-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
