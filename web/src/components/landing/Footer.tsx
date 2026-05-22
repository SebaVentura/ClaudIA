const email = import.meta.env.VITE_SUPPORT_EMAIL ?? 'contacto@claudia.edu.ar'
const whatsapp = import.meta.env.VITE_WHATSAPP_LINK ?? 'https://wa.me/5490000000000'

export function Footer() {
  return (
    <footer className="border-t border-claudia-rose/20 bg-claudia-ink px-4 py-12 text-claudia-cream sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">ClaudIA</p>
          <p className="text-sm text-claudia-rose/90">Educación Digital</p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Contacto</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            <li><a href={`mailto:${email}`} className="hover:text-claudia-amber">{email}</a></li>
            <li>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-claudia-amber">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div className="sm:text-right">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} ClaudIA Educación Digital</p>
          <p className="mt-2 text-xs opacity-60">Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
