export function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-3 group" aria-label="ClaudIA Educación Digital">
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-claudia-rose to-claudia-coral shadow-soft animate-float">
        <svg viewBox="0 0 32 32" className="h-7 w-7 text-white" aria-hidden>
          <path fill="currentColor" d="M6 24V10a2 2 0 012-2h8a2 2 0 012 2v3l-4 2.5V24H6z" opacity=".9" />
          <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10 8v12M14 8v9" />
          <path fill="currentColor" d="M20 20c2-3 5-4 7-3 2.5 1 3 4 1 6-2 2-6 2-8 0" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 text-[10px]" aria-hidden>♥</span>
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-bold text-claudia-ink group-hover:text-claudia-coral transition-colors">
          ClaudIA
        </span>
        <span className="block text-xs font-medium text-claudia-muted">Educación Digital</span>
      </span>
    </a>
  )
}
