import { Logo } from '../layout/Logo'
import { SUPPORT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '../../config/contact'

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
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-claudia-turquoise">
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-claudia-turquoise"
              >
                WhatsApp · {WHATSAPP_DISPLAY}
              </a>
            </li>
          </ul>
        </div>
        <div className="sm:text-right">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} ClaudIA Educación Digital</p>
          <p className="mt-2 text-xs opacity-60">Todos los derechos reservados.</p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center text-xs tracking-wide text-claudia-cream/45">
        Sitio desarrollado por SV Data Lab
      </p>
    </footer>
  )
}
