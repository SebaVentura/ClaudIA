const messages: Record<string, { title: string; text: string }> = {
  success: {
    title: 'Gracias por tu compra',
    text: 'Estamos verificando tu pago. Si fue aprobado, recibirás el mail de descarga cuando activemos la entrega automática.',
  },
  pending: {
    title: 'Pago pendiente',
    text: 'Tu pago quedó pendiente. Te avisaremos cuando se confirme.',
  },
  failure: {
    title: 'Pago no completado',
    text: 'El pago no se completó. Podés volver al catálogo e intentar nuevamente.',
  },
}

export function GraciasPage() {
  const params = new URLSearchParams(window.location.search)
  const orderId = params.get('orderId')
  const status = params.get('status') ?? ''
  const msg = messages[status] ?? {
    title: 'Gracias por tu compra',
    text: 'Gracias por tu compra.',
  }

  return (
    <div className="min-h-screen bg-claudia-cream px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg rounded-3xl border border-claudia-blush bg-white p-8 shadow-soft text-center">
        <p className="text-4xl mb-4" aria-hidden>
          📚
        </p>
        <h1 className="text-2xl font-bold text-claudia-ink">{msg.title}</h1>
        <p className="mt-4 text-claudia-muted leading-relaxed">{msg.text}</p>
        {orderId && (
          <p className="mt-4 text-xs text-claudia-muted">
            Pedido: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <a
          href="/"
          className="mt-8 inline-flex rounded-full bg-claudia-coral px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Volver al catálogo
        </a>
      </div>
    </div>
  )
}
