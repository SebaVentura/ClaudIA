interface KpiCardProps {
  title: string
  value: string
  hint?: string
}

export function KpiCard({ title, value, hint }: KpiCardProps) {
  return (
    <article className="rounded-xl border border-claudia-lavender/30 bg-white/90 p-4 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-claudia-muted">{title}</p>
      <p className="mt-2 text-2xl font-bold text-claudia-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-claudia-muted">{hint}</p> : null}
    </article>
  )
}
