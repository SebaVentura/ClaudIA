const resenas = [
  { nombre: 'María G.', rol: 'Maestra 1.º grado', texto: 'El ebook de división ordenó mis clases. Los chicos entendieron repartos con las fichas.' },
  { nombre: 'Lucas R.', rol: 'Prof. matemática técnica', texto: 'Los desarrollos planos están muy claros. Ideal para el taller.' },
  { nombre: 'Carolina P.', rol: 'Formación docente', texto: 'El taller lógico es excelente para reflexionar sobre situaciones problemáticas.' },
]

export function Resenas() {
  return (
    <section
      id="reseñas"
      className="section-anchor relative overflow-hidden bg-gradient-to-t from-claudia-turquoise/10 via-claudia-warm to-claudia-lavender/12 px-4 py-14 sm:px-6"
    >
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-claudia-rose/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-claudia-ink">Lo que dicen docentes</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {resenas.map((r) => (
            <blockquote
              key={r.nombre}
              className="rounded-2xl border border-claudia-turquoise/25 border-l-4 border-l-claudia-turquoise bg-white/95 p-6 shadow-[0_8px_24px_rgba(23,59,99,0.08)]"
            >
              <p className="italic text-claudia-muted">&ldquo;{r.texto}&rdquo;</p>
              <footer className="mt-4">
                <cite className="not-italic font-semibold text-claudia-ink">{r.nombre}</cite>
                <p className="text-sm text-claudia-muted">{r.rol}</p>
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-claudia-muted">Reseñas de ejemplo — editables en código.</p>
      </div>
    </section>
  )
}
