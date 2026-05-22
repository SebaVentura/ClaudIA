const faqs = [
  {
    q: '¿Cómo recibo el material?',
    a: 'Los materiales se entregan en formato digital. Tras confirmar tu compra, coordinamos el envío por los canales acordados (correo o mensaje).',
  },
  {
    q: '¿En qué formato viene?',
    a: 'El formato principal es PDF, listo para descargar e imprimir.',
  },
  {
    q: '¿Puedo imprimirlo?',
    a: 'Sí. Están pensados para imprimir y usar en casa o en el aula.',
  },
  {
    q: '¿Sirve para usar en el aula?',
    a: 'Sí. Cada recurso incluye actividades aplicables con mirada pedagógica para docentes.',
  },
  {
    q: '¿La compra es por única vez?',
    a: 'Sí. La compra es por única vez para uso personal o docente según las condiciones de cada material.',
  },
  {
    q: '¿Puedo pedir un material personalizado?',
    a: 'Sí. Podés consultarnos por WhatsApp o correo para solicitar producciones a medida.',
  },
]

export function Faq() {
  return (
    <section
      id="faq"
      className="section-anchor relative overflow-hidden bg-gradient-to-b from-claudia-warm to-claudia-mist/30 px-4 py-14 sm:px-6"
    >
      <div className="relative mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold text-claudia-ink">Preguntas frecuentes</h2>
        <p className="mt-2 text-center text-sm text-claudia-muted">
          Dudas habituales sobre formato, uso en el aula y entrega digital
        </p>
        <dl className="mt-10 space-y-4">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-claudia-lavender/30 bg-white/95 px-5 py-4 shadow-[0_6px_20px_rgba(23,59,99,0.06)]"
            >
              <dt className="font-semibold text-claudia-ink">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-claudia-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
