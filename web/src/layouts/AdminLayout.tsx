import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-claudia-navy text-white'
      : 'text-claudia-navy hover:bg-claudia-lavender/20'
  }`

export function AdminLayout() {
  const { user, logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-claudia-page">
      <aside className="flex w-56 shrink-0 flex-col border-r border-claudia-lavender/30 bg-white/90 px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-claudia-muted">
          ClaudIA Admin
        </p>
        <p className="mt-1 truncate text-sm font-medium text-claudia-navy">
          {user?.username ?? 'Administrador'}
        </p>
        <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Admin">
          <NavLink to="/admin" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/productos" className={navLinkClass}>
            Productos
          </NavLink>
          <NavLink to="/admin/ordenes" className={navLinkClass}>
            Órdenes
          </NavLink>
          <NavLink to="/admin/clientes" className={navLinkClass}>
            Clientes
          </NavLink>
        </nav>
        <div className="mt-4 flex flex-col gap-2 border-t border-claudia-blush pt-4">
          <a
            href="/"
            className="rounded-lg px-3 py-2 text-sm text-claudia-navy hover:bg-claudia-warm"
          >
            Volver al sitio
          </a>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-lg px-3 py-2 text-left text-sm font-medium text-claudia-rose hover:bg-claudia-rose/10"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}
