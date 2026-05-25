import { API_URL } from './products'

export interface CheckoutItemPayload {
  productId: string
  quantity: number
}

export interface CheckoutBuyer {
  name: string
  email: string
  phone: string
}

export interface CreatePreferencePayload {
  items: CheckoutItemPayload[]
  buyer: CheckoutBuyer
}

export interface CreatePreferenceResponse {
  orderId: string
  preferenceId: string
  initPoint: string
}

export async function createPreference(
  payload: CreatePreferencePayload,
): Promise<CreatePreferenceResponse> {
  const res = await fetch(`${API_URL}/api/checkout/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const detail =
      typeof data.detail === 'string'
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map((d: { msg?: string }) => d.msg).join(', ')
          : 'No se pudo iniciar el pago'
    throw new Error(detail)
  }

  return data as CreatePreferenceResponse
}
