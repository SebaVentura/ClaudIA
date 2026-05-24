import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export function ProtectedRoute() {
  const { token, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-claudia-page text-claudia-navy">
        <p className="text-sm font-medium">Validando sesión…</p>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
