import { WHATSAPP_NUMBER, WHATSAPP_URL } from './whatsapp'

/** Email de soporte / contacto oficial */
export const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL?.trim() || 'claudiaeducaciondigital@gmail.com'

/** Celular oficial para mostrar en UI */
export const WHATSAPP_DISPLAY = '+54 9 291 426 7160'

export { WHATSAPP_NUMBER, WHATSAPP_URL }
