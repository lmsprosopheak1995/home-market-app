import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BUSINESS_NAME, COMMISSION, KHQR_IMAGE, KHQR_URL, isSafeUrl } from '../config/payments'
import { useAuth } from '../hooks/useAuth.jsx'
import { useCommissions } from '../hooks/useCommissions.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { useProperties } from '../hooks/useProperties.jsx'
import { formatDate } from '../lib/format'

const money = (n) => `$${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}`

const BADGE = {
  pending: 'bg-gold-soft text-ink',
  reported: 'bg-brand-soft text-brand-dark',
  paid: 'bg-brand text-white',
}

export default function Commissions() {
  const { t, locale } = useI18n()
  const { user } = useAuth()
  const { properties } = useProperties()
  const { items, loading, error, add, markReported } = useCommissions(user.username)

  const mine = properties.filter((p) => p.owner === user.username)
  const [listingId, setListingId] = useState('')
  const [deal, setDeal] = useState('')
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const [qrOk, setQrOk] = useState(true)

  const listing = mine.find((p) => p.id === listingId) ?? mine[0]
  const rate = listing ? Number(listing.commission ?? COMMISSION.default) : COMMISSION.default
  const dealNum = Number(deal)
  const due = dealNum > 0 ? Math.round(dealNum * rate) / 100 : 0
  const hasPayUrl = isSafeUrl(KHQR_URL)

  const totals = { pending: 0, reported: 0, paid: 0 }
  items.forEach((c) => { totals[c.status] = (totals[c.status] ?? 0) + c.amount })

  async function onSubmit(e) {
    e.preventDefault()
    if (!listing) return
    if (!(dealNum > 0)) return setFormError('val.price')
    setBusy(true)
    setFormError('')
    try {
      await add({ propertyId: listing.id, propertyTitle: listing.title, dealAmount: dealNum, rate, agencyCode: listing.agency_code ?? null })
      setDeal('')
    } catch (err) {
      setFormError(`${t('post.submitFail')}: ${err.message}`)
    }
    setBusy(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t('comm.title')}</h1>
        <p className="mt-1 text-ink/70">{t('comm.desc')}</p>
      </header>

      <section className="grid grid-cols-3 gap-3 text-center">
        {['pending', 'reported', 'paid'].map((s) => (
          <div key={s} className="rounded-xl border border-line bg-white p-3">
            <p className="text-xs text-ink/60">{t(`comm.status.${s}`)}</p>
            <p className="text-lg font-bold">{money(totals[s])}</p>
          </div>
        ))}
      </section>

      {mine.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center">
          <p className="font-semibold">{t('comm.noListings')}</p>
          <Link to="/post" className="btn-primary mt-4">{t('nav.post')}</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border border-line bg-white p-5">
          <h2 className="font-bold">{t('comm.recordTitle')}</h2>
          <div>
            <label htmlFor="listing" className="label">{t('comm.listing')}</label>
            <select id="listing" className="field" value={listing.id} onChange={(e) => setListingId(e.target.value)}>
              {mine.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="deal" className="label">{t('comm.dealAmount')}</label>
            <input id="deal" type="number" min="0" inputMode="decimal" className="field" value={deal}
              onChange={(e) => setDeal(e.target.value)} />
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-paper p-3 text-sm">
            <div>
              <dt className="text-ink/60">{t('comm.rate')}</dt>
              <dd className="text-lg font-bold">{rate}%</dd>
            </div>
            <div>
              <dt className="text-ink/60">{t('comm.due')}</dt>
              <dd className="text-lg font-bold text-brand">{money(due)}</dd>
            </div>
          </dl>
          {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{formError.startsWith('val.') ? t(formError) : formError}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">{t('comm.record')}</button>
        </form>
      )}

      <section className="rounded-xl border border-line bg-white p-5">
        <h2 className="font-bold">{t('comm.payTitle')}</h2>
        <p className="mt-1 text-sm text-ink/70">{t('comm.payDesc')}</p>
        {BUSINESS_NAME && <p className="mt-2 font-semibold">{BUSINESS_NAME}</p>}
        {qrOk && (
          <img src={KHQR_IMAGE} alt="KHQR" onError={() => setQrOk(false)}
            className="mx-auto mt-3 w-full max-w-[16rem] rounded-lg border border-line" />
        )}
        {hasPayUrl && (
          <a href={KHQR_URL} target="_blank" rel="noopener noreferrer" className="btn-gold mt-3 w-full">{t('comm.openPay')}</a>
        )}
        {!qrOk && !hasPayUrl && <p className="mt-3 text-sm text-ink/60">{t('comm.notConfigured')}</p>}
        <p className="mt-4 text-sm text-ink/60">{t('comm.note')}</p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">{t('comm.listTitle')}</h2>
        {error && <p className="mb-3 rounded-lg bg-red-50 p-3 text-red-700">{t('err.load')}: {error}</p>}
        {loading ? (
          <p className="py-6 text-center text-ink/60">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white py-8 text-center text-ink/60">{t('comm.empty')}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((c) => (
              <li key={c.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-semibold">{c.propertyTitle}</p>
                    <p className="text-sm text-ink/70">
                      {t('comm.row', { deal: money(c.dealAmount), rate: c.rate, amount: money(c.amount) })}
                    </p>
                    <p className="mt-1 text-xs text-ink/50">
                      {formatDate(c.createdAt, locale)} · <span className="select-all font-mono">{c.reference}</span>
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold ${BADGE[c.status] ?? BADGE.pending}`}>
                    {t(`comm.status.${c.status}`)}
                  </span>
                </div>
                {c.status === 'pending' && (
                  <button type="button" onClick={() => markReported(c.id)} className="btn-ghost mt-3 w-full">{t('comm.iPaid')}</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
