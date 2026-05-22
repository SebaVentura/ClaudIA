import { Logo } from '../layout/Logo'

const email = import.meta.env.VITE_SUPPORT_EMAIL ?? 'contacto@claudia.edu.ar'
const whatsapp = import.meta.env.VITE_WHATSAPP_LINK ?? 'https://wa.me/5490000000000'

export function Footer() {
  return (
    <footer className="relative border-t-4 border-claudia-turquoise/40 bg-claudia-navy px-4 py-14 text-claudia-cream sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        <div>
          <Logo size="footer" href="/" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Contacto</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            <li><a href={`mailto:${email}`} className="hover:text-claudia-turquoise">{email}</a></li>
            <li>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-claudia-turquoise">
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
