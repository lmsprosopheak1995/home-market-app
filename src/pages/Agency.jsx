import { useCallback, useEffect, useState } from 'react'
import { AGENCY } from '../config/agency'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { agencyBalance, getMyAgency, listAgencyCommissions, listPayouts, requestPayout } from '../lib/agencyStore'
import { formatDate, money } from '../lib/format'

const PAY_BADGE = { requested: 'bg-gold-soft text-ink', paid: 'bg-brand text-white', rejected: 'bg-line text-ink/70' }

export default function Agency() {
  const { t, locale } = useI18n()
  const { user } = useAuth()
  const [state, setState] = useState({ loading: true, agency: null, commissions: [], payouts: [] })
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const agency = await getMyAgency(user.username)
      if (!agency) return setState({ loading: false, agency: null, commissions: [], payouts: [] })
      const [commissions, payouts] = await Promise.all([listAgencyCommissions(agency), listPayouts(agency.id)])
      setState({ loading: false, agency, commissions, payouts })
    } catch (e) {
      setError(e.message)
      setState((s) => ({ ...s, loading: false }))
    }
  }, [user.username])
  useEffect(() => { load() }, [load])

  const { loading, agency, commissions, payouts } = state

  if (loading) return <p className="py-10 text-center text-ink/60">{t('common.loading')}</p>
  if (!agency) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-dashed border-line bg-white p-8 text-center">
        <p className="font-semibold">{t('agency.notAgency')}</p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  const bal = agencyBalance(agency, commissions, payouts)
  const canRequest = agency.active && bal.available >= AGENCY.minPayout

  async function onRequest(e) {
    e.preventDefault()
    const n = Number(amount)
    if (!(n >= AGENCY.minPayout && n <= bal.available)) {
      return setError(t('val.payout', { min: money(AGENCY.minPayout), max: money(bal.available) }))
    }
    setBusy(true)
    setError('')
    try {
      await requestPayout({ agencyId: agency.id, amount: n })
      setAmount('')
      await load()
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t('agency.title')}</h1>
        <p className="mt-1 text-ink/70">{t('agency.desc')}</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-sm text-ink/60">{t('agency.yourCode')}</p>
          <p className="select-all font-mono text-3xl font-bold text-brand">{agency.code}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-sm text-ink/60">{t('agency.yourRate')}</p>
          <p className="text-3xl font-bold">{agency.rate}%</p>
        </div>
      </section>
      {!agency.active && <p className="rounded-lg bg-gold-soft p-3">{t('agency.inactiveNote')}</p>}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['earned', bal.earned], ['paidOut', bal.paid], ['requested', bal.requested], ['available', bal.available]].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-white p-3 text-center">
            <p className="text-xs text-ink/60">{t(`agency.${k}`)}</p>
            <p className="text-lg font-bold">{money(v)}</p>
          </div>
        ))}
      </section>

      <form onSubmit={onRequest} noValidate className="space-y-3 rounded-xl border border-line bg-white p-5">
        <h2 className="font-bold">{t('agency.requestTitle')}</h2>
        <div>
          <label htmlFor="pamount" className="label">{t('agency.amount')}</label>
          <input id="pamount" type="number" inputMode="decimal" min="0" className="field" value={amount}
            onChange={(e) => setAmount(e.target.value)} disabled={!canRequest} />
          <p className="mt-1 text-sm text-ink/60">{t('agency.minPayout', { amount: money(AGENCY.minPayout) })}</p>
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
        <button type="submit" disabled={!canRequest || busy} className="btn-primary w-full disabled:opacity-60">{t('agency.request')}</button>
        <p className="text-sm text-ink/60">{t('agency.payoutNote')}</p>
      </form>

      <section>
        <h2 className="mb-3 text-lg font-bold">{t('agency.history')}</h2>
        {payouts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white py-6 text-center text-ink/60">{t('admin.payout.empty')}</p>
        ) : (
          <ul className="space-y-2">
            {payouts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
                <div>
                  <p className="font-semibold">{money(p.amount)}</p>
                  <p className="text-xs text-ink/60">{formatDate(p.createdAt, locale)}{p.reference && <> · {p.reference}</>}</p>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-sm font-semibold ${PAY_BADGE[p.status]}`}>{t(`payout.status.${p.status}`)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">{t('agency.deals')}</h2>
        {commissions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white py-6 text-center text-ink/60">{t('comm.empty')}</p>
        ) : (
          <ul className="space-y-2">
            {commissions.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
                <div className="min-w-0">
                  <p className="break-words font-medium">{c.propertyTitle}</p>
                  <p className="text-xs text-ink/60">{c.paidAt ? formatDate(c.paidAt, locale) : ''}</p>
                </div>
                <p className="shrink-0 font-bold text-brand">+{money(c.agencyShare ?? 0)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
