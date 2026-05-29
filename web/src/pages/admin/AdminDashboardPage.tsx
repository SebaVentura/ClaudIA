import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DashboardPeriodKey } from '../../api/adminDashboard'
import { InsightsPanel } from '../../components/admin/dashboard/InsightsPanel'
import { KpiCard } from '../../components/admin/dashboard/KpiCard'
import { RecentOrdersTable } from '../../components/admin/dashboard/RecentOrdersTable'
import { SalesTrendChart } from '../../components/admin/dashboard/SalesTrendChart'
import { TopProductsTable } from '../../components/admin/dashboard/TopProductsTable'
import { TrafficComingSoonSection } from '../../components/admin/dashboard/TrafficComingSoonSection'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import { formatPrice } from '../../utils/formatPrice'

const PERIOD_OPTIONS: Array<{ key: DashboardPeriodKey; label: string }> = [
  { key: 'today', label: 'Hoy' },
  { key: '7d', label: 'Últimos 7 días' },
  { key: '30d', label: 'Últimos 30 días' },
  { key: 'month', label: 'Mes actual' },
]

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<DashboardPeriodKey>('7d')
  const { data, loading, error, unauthorized } = useAdminDashboard(period)

  useEffect(() => {
    if (unauthorized) {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate, unauthorized])

  return (
    <section className="min-w-0 max-w-full pb-2">
      <header className="rounded-xl border border-claudia-lavender/30 bg-gradient-to-r from-white via-claudia-cream/50 to-claudia-mist/60 p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-claudia-navy">Dashboard</h1>
            <p className="mt-1 text-sm text-claudia-muted">
              Visión comercial para decisiones rápidas del Super Admin.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setPeriod(opt.key)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  period === opt.key
                    ? 'bg-claudia-navy text-white'
                    : 'bg-white text-claudia-navy hover:bg-claudia-blush'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <p className="mt-6 rounded-xl border border-claudia-lavender/30 bg-white/80 px-4 py-8 text-center text-sm text-claudia-muted">
          Cargando métricas comerciales…
        </p>
      ) : null}

      {!loading && error ? (
        <p className="mt-6 rounded-xl border border-claudia-rose/30 bg-claudia-rose/10 px-4 py-3 text-sm text-claudia-rose">
          {error}
        </p>
      ) : null}

      {!loading && data ? (
        <div className="mt-6 space-y-6 pb-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <KpiCard title="Ingresos totales" value={formatPrice(data.kpis.revenueTotal)} />
            <KpiCard title="Órdenes pagadas" value={String(data.kpis.paidOrders)} />
            <KpiCard title="Órdenes pendientes" value={String(data.kpis.pendingOrders)} />
            <KpiCard title="Ticket promedio" value={formatPrice(data.kpis.averageTicket)} />
            <KpiCard title="Clientes nuevos" value={String(data.kpis.newCustomers)} />
            <KpiCard title="Productos vendidos" value={String(data.kpis.productsSold)} />
          </div>

          <SalesTrendChart points={data.salesByDay} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="min-w-0 xl:col-span-2">
              <TopProductsTable rows={data.topProducts} />
            </div>
            <div className="min-w-0 xl:col-span-3">
              <RecentOrdersTable rows={data.recentOrders} />
            </div>
          </div>

          <InsightsPanel insights={data.insights} />

          <TrafficComingSoonSection cards={data.trafficPlaceholders} />
        </div>
      ) : null}
    </section>
  )
}
