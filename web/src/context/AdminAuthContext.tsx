import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from '../api/adminClient'
import {
  getAdminMe,
  loginAdmin,
  logoutAdmin,
  type AdminUser,
} from '../api/adminAuth'

interface AdminAuthContextValue {
  user: AdminUser | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loadCurrentUser: () => Promise<void>
  clearError: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(() => getAdminToken())
  const [loading, setLoading] = useState(() => Boolean(getAdminToken()))
  const [error, setError] = useState<string | null>(null)

  const loadCurrentUser = useCallback(async () => {
    const stored = getAdminToken()
    if (!stored) {
      setUser(null)
      setToken(null)
      setLoading(false)
      return
    }

    setToken(stored)
    setLoading(true)
    setError(null)
    try {
      const me = await getAdminMe()
      setUser(me)
    } catch (e) {
      clearAdminToken()
      setUser(null)
      setToken(null)
      setError(
        e instanceof Error ? e.message : 'No se pudo validar la sesión',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (getAdminToken()) {
      void loadCurrentUser()
    } else {
      setLoading(false)
    }
  }, [loadCurrentUser])

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await loginAdmin(username, password)
      setAdminToken(result.token)
      setToken(result.token)
      if (result.user) {
        setUser(result.user)
      } else {
        const me = await getAdminMe()
        setUser(me)
      }
    } catch (e) {
      clearAdminToken()
      setToken(null)
      setUser(null)
      const message =
        e instanceof Error ? e.message : 'No se pudo iniciar sesión'
      setError(message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await logoutAdmin()
    } finally {
      clearAdminToken()
      setToken(null)
      setUser(null)
      setError(null)
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      loadCurrentUser,
      clearError,
    }),
    [user, token, loading, error, login, logout, loadCurrentUser, clearError],
  )

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth requiere AdminAuthProvider')
  }
  return ctx
}
