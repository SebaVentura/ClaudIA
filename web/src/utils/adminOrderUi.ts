import type { AdminOrderStatusPatch } from '../types/adminOrder'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagada',
  cancelled: 'Cancelada',
  delivered: 'Entregada',
  rejected: 'Rechazada',
  in_process: 'En proceso',
  amount_mismatch: 'Monto no coincide',
  refunded: 'Reembolsada',
  charged_back: 'Contracargo',
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-claudia-amber/20 text-claudia-navy',
  paid: 'bg-claudia-turquoise/20 text-claudia-navy',
  cancelled: 'bg-claudia-rose/15 text-claudia-rose',
  delivered: 'bg-claudia-lavender/25 text-claudia-navy',
  rejected: 'bg-claudia-rose/15 text-claudia-rose',
  in_process: 'bg-claudia-warm text-claudia-navy',
  amount_mismatch: 'bg-claudia-rose/15 text-claudia-rose',
}

export function orderStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

export function orderStatusBadgeClass(status: string): string {
  return STATUS_BADGE[status] ?? 'bg-claudia-warm text-claudia-navy'
}

export function shortOrderId(id: string): string {
  const s = id.trim()
  if (s.length <= 12) return s
  return `${s.slice(0, 8)}…`
}

export function formatAdminDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export interface OrderAdminAction {
  label: string
  nextStatus: AdminOrderStatusPatch
  confirmMessage: string
}

export function getOrderAdminActions(status: string): OrderAdminAction[] {
  if (status === 'pending') {
    return [
      {
        label: 'Cancelar orden',
        nextStatus: 'cancelled',
        confirmMessage: '¿Cancelar esta orden? El pago no se completó o no aplicará.',
      },
    ]
  }
  if (status === 'paid') {
    return [
      {
        label: 'Marcar como entregada',
        nextStatus: 'delivered',
        confirmMessage: '¿Marcar esta orden como entregada?',
      },
    ]
  }
  return []
}
