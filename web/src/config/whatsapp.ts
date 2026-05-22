/** Número WhatsApp sin + ni espacios (ej. 54911XXXXXXXX). TODO: definir número real en .env */
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '') || '5490000000000'
