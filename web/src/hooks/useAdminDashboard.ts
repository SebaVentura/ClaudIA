import { useEffect, useState } from 'react'
import { AdminApiError } from '../api/adminClient'
import {
  getAdminDashboardSummary,
  type DashboardPeriodKey,
  type DashboardSummaryResponse,
} from '../api/adminDashboard'

export function useAdminDashboard(period: DashboardPeriodKey) {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setUnauthorized(false)

    ;(async () => {
      try {
        const summary = await getAdminDashboardSummary(period)
        if (cancelled) return
        setData(summary)
      } catch (e) {
        if (cancelled) return
        setData(null)
        setError(e instanceof Error ? e.message : 'Error al cargar dashboard')
        if (e instanceof AdminApiError && e.status === 401) {
          setUnauthorized(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [period])

  return { data, loading, error, unauthorized }
}
