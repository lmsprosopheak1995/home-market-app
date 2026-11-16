import { useCallback, useEffect, useMemo, useState } from 'react'
import { AGENCY } from '../config/agency'
import { useI18n } from '../hooks/useI18n.jsx'
import {
  agencyBalance, confirmCommissionPaid, createAgency, listAgencies, listAllCommissions,
  listPayouts, resolvePayout, setAgencyActive,
} from '../lib/agencyStore'
import { formatDate, money } from '../lib/format'
import { listVerificationRequests, reviewVerification, revokeVerification } from '../lib/verification'

const COMM_BADGE = { pending: 'bg-gold-soft text-ink', reported: 'bg-brand-soft text-brand-dark', paid: 'bg-brand text-white' }
const PAY_BADGE = { requested: 'bg-gold-soft text-ink', paid: 'bg-brand text-white', rejected: 'bg-line text-ink/70' }
const ORDER = { reported: 0, pending: 1, paid: 2 }

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-paper p-2 text-center">
      <p className="text-xs text-ink/60">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  )
}

export default function Admin() {
  const { t, locale } = useI18n()
  const [tab, setTab] = useState('agencies')
  const [data, setData] = useState({ agencies: [], commissions: [], payouts: [], requests: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', rate: String(AGENCY.defaultRate) })
  const [formError, setFormError] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [refs, setRefs] = useState({})

  const reload = useCallback(async () => {
    try {
      const [agencies, commissions, payouts, requests] = await Promise.all([listAgencies(), listAllCommissions(), listPayouts(), listVerificationRequests()])
      setData({ agencies, commissions, payouts, requests })
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }, [])
  useEffect(() => { reload() }, [reload])

  const run = async (fn) => {
    setError('')
    try {
      await fn()
      await reload()
    } catch (e) {
      setError(e.message)
    }
  }

  const byCode = useMemo(() => Object.fromEntries(data.agencies.map((a) => [a.code, a])), [data.agencies])
  const byId = useMemo(() => Object.fromEntries(data.agencies.map((a) => [a.id, a])), [data.agencies])
  const sortedComm = useMemo(
    () => [...data.commissions].sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9)),
    [data.commissions]
  )

  async function onCreate(e) {
    e.preventDefault()
    const phone = form.phone.replace(/\s/g, '')
    const rate = Number(form.rate)
    if (form.name.trim().length < 2) return setFormError(t('val.agencyName'))
    if (!/^0\d{8,9}$/.test(phone)) return setFormError(t('val.phone'))
    if (!(rate >= 0 && rate <= AGENCY.maxRate)) return setFormError(t('val.rate', { max: AGENCY.maxRate }))
    setFormError('')
    await run(async () => {
      const a = await createAgency({ name: form.name.trim(), phone, rate })
      setCreatedCode(a.code)
      setForm({ name: '', phone: '', rate: String(AGENCY.defaultRate) })
    })
  }

  const tabs = ['agencies', 'commissions', 'payouts', 'verification']

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
        <p className="mt-1 text-ink/70">{t('admin.desc')}</p>
      </header>

      <div role="tablist" className="flex gap-2">
        {tabs.map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`btn !py-1.5 text-sm ${tab === k ? 'bg-ink text-white' : 'border border-line bg-white'}`}>
            {t(`admin.tab.${k}`)}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      {loading && <p className="py-6 text-center text-ink/60">{t('common.loading')}</p>}

      {!loading && tab === 'agencies' && (
        <div className="space-y-6">
          <form onSubmit={onCreate} noValidate className="space-y-3 rounded-xl border border-line bg-white p-5">
            <h2 className="font-bold">{t('admin.agency.new')}</h2>
            <div>
              <label htmlFor="aname" className="label">{t('admin.agency.name')}</label>
              <input id="aname" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="aphone" className="label">{t('admin.agency.phone')}</label>
                <input id="aphone" type="tel" inputMode="numeric" className="field" placeholder="012345678"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label htmlFor="arate" className="label">{t('admin.agency.rate')}</label>
                <input id="arate" type="number" inputMode="decimal" min="0" max={AGENCY.maxRate} className="field"
                  value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
              </div>
            </div>
            {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
            <button type="submit" className="btn-primary w-full">{t('admin.agency.create')}</button>
            {createdCode && (
              <p role="status" className="rounded-lg bg-brand-soft p-3 font-semibold text-brand-dark">
                {t('admin.agency.created', { code: createdCode })}
              </p>
            )}
          </form>

          {data.agencies.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-white py-8 text-center text-ink/60">{t('admin.agency.empty')}</p>
          ) : (
            <ul className="space-y-3">
              {data.agencies.map((a) => {
                const b = agencyBalance(a, data.commissions, data.payouts)
                return (
                  <li key={a.id} className="rounded-xl border border-line bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words font-semibold">{a.name}</p>
                        <p className="text-sm text-ink/70">{a.phone} · {a.rate}%</p>
                        <p className="mt-1 text-sm text-ink/60">{t('admin.agency.code')}: <span className="select-all font-mono text-lg font-bold text-ink">{a.code}</span></p>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold ${a.active ? 'bg-brand text-white' : 'bg-line text-ink/70'}`}>
                        {a.active ? t('admin.agency.active') : t('admin.agency.inactive')}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
                      <Stat label={t('agency.earned')} value={money(b.earned)} />
                      <Stat label={t('agency.paidOut')} value={money(b.paid)} />
                      <Stat label={t('agency.requested')} value={money(b.requested)} />
                      <Stat label={t('agency.available')} value={money(b.available)} />
                    </div>
                    <button type="button" onClick={() => run(() => setAgencyActive(a.id, !a.active))} className="btn-ghost mt-3 !py-1.5 text-sm">
                      {a.active ? t('admin.agency.disable') : t('admin.agency.enable')}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {!loading && tab === 'commissions' && (
        sortedComm.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white py-8 text-center text-ink/60">{t('comm.empty')}</p>
        ) : (
          <ul className="space-y-3">
            {sortedComm.map((c) => {
              const ag = c.agencyCode ? byCode[c.agencyCode] : null
              return (
                <li key={c.id} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold">{c.propertyTitle}</p>
                      <p className="text-sm text-ink/70">{t('comm.row', { deal: money(c.dealAmount), rate: c.rate, amount: money(c.amount) })}</p>
                      <p className="mt-1 text-xs text-ink/60">
                        {t('admin.comm.owner')}: {c.owner} · {formatDate(c.createdAt, locale)} · <span className="select-all font-mono">{c.reference}</span>
                      </p>
                      {c.agencyCode && (
                        <p className="text-xs text-ink/60">
                          {t('admin.comm.agency')}: {ag ? ag.name : '?'} ({c.agencyCode})
                          {c.status === 'paid' && c.agencyShare != null && <> · {t('admin.comm.share', { amount: money(c.agencyShare) })}</>}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold ${COMM_BADGE[c.status] ?? COMM_BADGE.pending}`}>
                      {t(`comm.status.${c.status}`)}
                    </span>
                  </div>
                  {c.status !== 'paid' && (
                    <button type="button" onClick={() => run(() => confirmCommissionPaid(c, ag))} className="btn-primary mt-3 w-full !py-1.5 text-sm">
                      {t('admin.comm.confirm')}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )
      )}

      {!loading && tab === 'payouts' && (
        data.payouts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white py-8 text-center text-ink/60">{t('admin.payout.empty')}</p>
        ) : (
          <ul className="space-y-3">
            {data.payouts.map((p) => {
              const ag = byId[p.agencyId]
              const bal = ag ? agencyBalance(ag, data.commissions, data.payouts) : null
              // available ដកសំណើទាំងអស់ដែលកំពុងរង់ចាំរួចហើយ ដូច្នេះអវិជ្ជមាន = សំណើលើសចំនួនដែលមាន
              const exceeds = p.status === 'requested' && bal && bal.available < 0
              return (
                <li key={p.id} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{ag ? ag.name : '?'} · {money(p.amount)}</p>
                      <p className="text-xs text-ink/60">{formatDate(p.createdAt, locale)}{p.reference && <> · {p.reference}</>}</p>
                    </div>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold ${PAY_BADGE[p.status]}`}>{t(`payout.status.${p.status}`)}</span>
                  </div>
                  {exceeds && <p className="mt-2 text-sm text-red-600">{t('admin.payout.over')}</p>}
                  {p.status === 'requested' && (
                    <div className="mt-3 space-y-2">
                      <input className="field" placeholder={t('admin.payout.reference')} value={refs[p.id] ?? ''}
                        onChange={(e) => setRefs((r) => ({ ...r, [p.id]: e.target.value }))} />
                      <div className="flex gap-2">
                        <button type="button" className="btn-primary flex-1 !py-1.5 text-sm"
                          onClick={() => run(() => resolvePayout(p.id, { status: 'paid', reference: refs[p.id] }))}>{t('admin.payout.markPaid')}</button>
                        <button type="button" className="btn-ghost flex-1 !py-1.5 text-sm"
                          onClick={() => run(() => resolvePayout(p.id, { status: 'rejected', reference: refs[p.id] }))}>{t('admin.payout.reject')}</button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )
      )}

      {!loading && tab === 'verification' && (
        data.requests.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white py-8 text-center text-ink/60">{t('admin.ver.empty')}</p>
        ) : (
          <ul className="space-y-3">
            {data.requests.map((r) => (
              <li key={r.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-semibold">{r.fullName}</p>
                    <p className="text-sm text-ink/70">{r.owner} · {t(`verified.doc.${r.docType}`)}</p>
                    {r.note && <p className="mt-1 whitespace-pre-line break-words text-sm text-ink/70">{r.note}</p>}
                    <p className="mt-1 text-xs text-ink/60">
                      {formatDate(r.createdAt, locale)} · <span className="select-all font-mono">{r.reference}</span>
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold ${PAY_BADGE[r.status === 'pending' ? 'requested' : r.status === 'approved' ? 'paid' : 'rejected']}`}>
                    {t(`verified.status.${r.status}`)}
                  </span>
                </div>
                {r.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="btn-primary flex-1 !py-1.5 text-sm" onClick={() => run(() => reviewVerification(r, true))}>{t('admin.ver.approve')}</button>
                    <button type="button" className="btn-ghost flex-1 !py-1.5 text-sm" onClick={() => run(() => reviewVerification(r, false))}>{t('admin.ver.reject')}</button>
                  </div>
                )}
                {r.status === 'approved' && (
                  <button type="button" className="btn-ghost mt-3 !py-1.5 text-sm" onClick={() => run(() => revokeVerification(r.owner))}>{t('admin.ver.revoke')}</button>
                )}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
