interface TrafficPlaceholder {
  key: string
  title: string
  message: string
}

interface TrafficComingSoonSectionProps {
  cards: TrafficPlaceholder[]
}

export function TrafficComingSoonSection({ cards }: TrafficComingSoonSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-claudia-lavender/30 bg-white/90 p-4 pb-5 shadow-card">
      <h3 className="text-base font-semibold text-claudia-navy">Métricas de página y comportamiento</h3>
      <p className="mt-1 text-sm text-claudia-muted">
        Bloque preparado para la siguiente etapa de tracking.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {cards.map((card) => (
          <article
            key={card.key}
            className="min-w-0 rounded-lg border border-dashed border-claudia-lavender/50 bg-claudia-cream/40 p-3"
          >
            <p className="text-sm font-medium leading-snug text-claudia-navy">{card.title}</p>
            <p className="mt-2 break-words text-xs leading-relaxed text-claudia-muted">{card.message}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
