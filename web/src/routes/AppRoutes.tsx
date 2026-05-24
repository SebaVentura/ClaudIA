import { Outlet, Route, Routes } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { ProductsProvider } from '../context/ProductsContext'
import { AdminAuthProvider } from '../context/AdminAuthContext'
import { AdminLayout } from '../layouts/AdminLayout'
import { GraciasPage } from '../pages/GraciasPage'
import { LandingPage } from '../pages/LandingPage'
import { AdminCustomersListPage } from '../pages/admin/AdminCustomersListPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminOrdersListPage } from '../pages/admin/AdminOrdersListPage'
import { AdminProductFormPage } from '../pages/admin/AdminProductFormPage'
import { AdminProductsListPage } from '../pages/admin/AdminProductsListPage'
import { ProtectedRoute } from './ProtectedRoute'

function PublicShell() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </ProductsProvider>
  )
}

function AdminShell() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gracias" element={<GraciasPage />} />
      </Route>

      <Route element={<AdminShell />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="productos" element={<AdminProductsListPage />} />
            <Route path="productos/nuevo" element={<AdminProductFormPage />} />
            <Route path="productos/:id/editar" element={<AdminProductFormPage />} />
            <Route path="ordenes" element={<AdminOrdersListPage />} />
            <Route path="clientes" element={<AdminCustomersListPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
