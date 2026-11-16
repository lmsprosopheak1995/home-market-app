import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { useProperties } from '../hooks/useProperties.jsx'
import { useReservations } from '../hooks/useReservations.jsx'
import { formatDate } from '../lib/format'

const BADGE = {
  new: 'bg-gold-soft text-ink',
  received: 'bg-brand text-white',
  cancelled: 'bg-line text-ink/70',
}

export default function Reservations() {
  const { t, locale } = useI18n()
  const { user } = useAuth()
  const { updateProperty } = useProperties()
  const { items, loading, error, setStatus } = useReservations(user.username)
  const [actionError, setActionError] = useState('')

  async function markReceived(r) {
    setActionError('')
    try {
      await setStatus(r.id, 'received')
      await updateProperty(r.propertyId, { reserved: true })
    } catch (err) {
      setActionError(err.message)
    }
  }

  async function cancel(r) {
    setActionError('')
    try {
      await setStatus(r.id, 'cancelled')
      if (r.status === 'received') await updateProperty(r.propertyId, { reserved: false })
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t('resv.title')}</h1>
        <p className="mt-1 text-ink/70">{t('resv.desc')}</p>
      </header>

      {(error || actionError) && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error || actionError}</p>
      )}

      {loading ? (
        <p className="py-6 text-center text-ink/60">{t('common.loading')}</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white py-10 text-center text-ink/60">{t('resv.empty')}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => (
            <li key={r.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-semibold">{r.propertyTitle}</p>
                  <p className="mt-1 font-medium">{r.buyerName}</p>
                  <a href={`tel:${r.buyerPhone}`} className="text-brand hover:underline">{r.buyerPhone}</a>
                  {r.message && <p className="mt-1 whitespace-pre-line break-words text-sm text-ink/70">{r.message}</p>}
                  <p className="mt-1 text-xs text-ink/50">
                    {formatDate(r.createdAt, locale)}{r.reference && <> · <span className="select-all font-mono">{r.reference}</span></>}
                    {r.amount != null && <> · {t('resv.deposit', { amount: `$${Number(r.amount).toLocaleString('en-US')}` })}</>}
                  </p>
                </div>
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold ${BADGE[r.status] ?? BADGE.new}`}>
                  {t(`resv.status.${r.status}`)}
                </span>
              </div>
              {r.status !== 'cancelled' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.status === 'new' && (
                    <button type="button" onClick={() => markReceived(r)} className="btn-primary !py-1.5 text-sm">{t('resv.markReceived')}</button>
                  )}
                  <button type="button" onClick={() => cancel(r)} className="btn-ghost !py-1.5 text-sm">{t('resv.cancel')}</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
