import { Logo } from '../components/layout/Logo'

const messages: Record<string, { title: string; text: string; icon: string; accent: string }> = {
  success: {
    title: 'Gracias por tu compra',
    text: 'Estamos verificando tu pago. La confirmación automática y el envío por correo se activarán en la próxima etapa del proyecto.',
    icon: '✓',
    accent: 'text-claudia-turquoise',
  },
  pending: {
    title: 'Pago pendiente',
    text: 'Tu pago quedó pendiente. Te avisaremos cuando se confirme. La confirmación automática se activará en la próxima etapa.',
    icon: '⏳',
    accent: 'text-claudia-amber',
  },
  failure: {
    title: 'Pago no completado',
    text: 'El pago no se completó. Podés volver al catálogo e intentar nuevamente.',
    icon: '!',
    accent: 'text-claudia-rose',
  },
}

export function GraciasPage() {
  const params = new URLSearchParams(window.location.search)
  const orderId = params.get('orderId')
  const status = params.get('status') ?? ''
  const msg = messages[status] ?? {
    title: 'Gracias por tu interés',
    text: 'Si realizaste una compra, estamos verificando tu pago. La confirmación automática se activará en la próxima etapa.',
    icon: '📚',
    accent: 'text-claudia-lavender',
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-claudia-page px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-claudia-lavender/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-claudia-turquoise/18 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-claudia-rose/12 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-claudia-amber/15 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-lg">
        <div className="mb-8 flex justify-center">
          <Logo size="gracias" href="/" />
        </div>
        <div className="rounded-3xl border border-claudia-lavender/30 bg-white/95 p-8 text-center shadow-[0_12px_40px_rgba(23,59,99,0.1)]">
          <p className={`mb-4 text-5xl font-bold ${msg.accent}`} aria-hidden>
            {msg.icon}
          </p>
          <h1 className="text-2xl font-bold text-claudia-navy">{msg.title}</h1>
          <p className="mt-4 leading-relaxed text-claudia-muted">{msg.text}</p>
          {orderId && (
            <p className="mt-4 rounded-xl bg-claudia-warm px-3 py-2 text-xs text-claudia-muted">
              Referencia de pedido: <span className="font-mono text-claudia-navy">{orderId}</span>
            </p>
          )}
          <p className="mt-4 text-xs text-claudia-muted">
            No hay enlaces de descarga en esta etapa. El acceso al material se habilitará cuando activemos la entrega automática.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex rounded-full bg-claudia-cta px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95"
          >
            Volver al catálogo
          </a>
        </div>
      </div>
    </div>
  )
}
