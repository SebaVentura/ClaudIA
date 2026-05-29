/** Número WhatsApp sin + ni espacios (ej. 5492914267160). Override opcional: VITE_WHATSAPP_NUMBER */
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '') || '5492914267160'

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
