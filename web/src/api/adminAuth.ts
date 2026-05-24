import { API_URL } from './products'
import { adminFetch } from './adminClient'

export interface AdminUser {
  username: string
}

export interface LoginAdminResponse {
  token: string
  user?: AdminUser
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<LoginAdminResponse> {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const detail =
      typeof data.detail === 'string'
        ? data.detail
        : typeof data.message === 'string'
          ? data.message
          : 'Credenciales inválidas'
    throw new Error(detail)
  }

  if (!data.token || typeof data.token !== 'string') {
    throw new Error('Respuesta de login inválida')
  }

  return data as LoginAdminResponse
}

export async function getAdminMe(): Promise<AdminUser> {
  const res = await adminFetch('/api/admin/me')

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const detail =
      typeof data.detail === 'string'
        ? data.detail
        : 'No se pudo validar la sesión'
    throw new Error(detail)
  }

  const username =
    typeof data.username === 'string'
      ? data.username
      : typeof data.user?.username === 'string'
        ? data.user.username
        : null

  if (!username) {
    throw new Error('Respuesta de sesión inválida')
  }

  return { username }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await adminFetch('/api/admin/logout', { method: 'POST' })
  } catch {
    // Limpiar sesión local aunque falle el servidor
  }
}
