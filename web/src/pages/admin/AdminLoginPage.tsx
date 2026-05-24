import { FormEvent, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export function AdminLoginPage() {
  const { login, token, loading, error, clearError } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/admin'

  useEffect(() => {
    clearError()
  }, [clearError])

  if (!loading && token) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch {
      // error en context
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-claudia-page px-4">
      <div className="w-full max-w-md rounded-2xl border border-claudia-lavender/30 bg-white p-8 shadow-lg">
        <h1 className="text-xl font-bold text-claudia-navy">Panel Super Admin</h1>
        <p className="mt-2 text-sm text-claudia-muted">
          Ingresá con tu usuario de administración.
        </p>
        <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <div>
            <label htmlFor="admin-user" className="block text-sm font-medium text-claudia-navy">
              Usuario
            </label>
            <input
              id="admin-user"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-claudia-blush px-3 py-2 text-sm focus:border-claudia-turquoise focus:outline-none focus:ring-1 focus:ring-claudia-turquoise"
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="block text-sm font-medium text-claudia-navy">
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-claudia-blush px-3 py-2 text-sm focus:border-claudia-turquoise focus:outline-none focus:ring-1 focus:ring-claudia-turquoise"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-claudia-rose/10 px-3 py-2 text-sm text-claudia-rose" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full rounded-full bg-claudia-cta py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
