import { useEffect, useState } from 'react'
import { SUPPORT_TELEGRAM } from '../config/payments'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { useVerified } from '../hooks/useVerified.jsx'
import { getMyVerification, requestVerification } from '../lib/verification'

const BADGE = { none: 'bg-line text-ink/70', pending: 'bg-gold-soft text-ink', approved: 'bg-brand text-white', rejected: 'bg-line text-ink/70' }

export default function Verify() {
  const { t } = useI18n()
  const { user } = useAuth()
  const { isVerified } = useVerified()
  const [req, setReq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ fullName: '', docType: 'id', note: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getMyVerification(user.username).then(setReq).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [user.username])

  const verified = isVerified(user.username)
  const status = verified ? 'approved' : req?.status ?? 'none'
  const canRequest = !verified && (!req || req.status === 'rejected')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (form.fullName.trim().length < 2) return setError('val.name')
    setBusy(true)
    setError('')
    try {
      setReq(await requestVerification({ owner: user.username, fullName: form.fullName.trim(), docType: form.docType, note: form.note.trim() }))
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  if (loading) return <p className="py-10 text-center text-ink/60">{t('common.loading')}</p>

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <header>
        <h1 className="text-2xl font-bold">{t('verified.title')}</h1>
        <p className="mt-1 text-ink/70">{t('verified.desc')}</p>
      </header>

      <div className="flex items-center justify-between rounded-xl border border-line bg-white p-4">
        <span className="font-semibold">{user.username}</span>
        <span className={`rounded-md px-2 py-0.5 text-sm font-semibold ${BADGE[status]}`}>{t(`verified.status.${status}`)}</span>
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error.startsWith('val.') ? t(error) : error}</p>}

      {canRequest && (
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border border-line bg-white p-5">
          <div>
            <label htmlFor="vname" className="label">{t('verified.fullName')}</label>
            <input id="vname" className="field" autoComplete="name" value={form.fullName} onChange={set('fullName')} />
          </div>
          <div>
            <label htmlFor="vdoc" className="label">{t('verified.docType')}</label>
            <select id="vdoc" className="field" value={form.docType} onChange={set('docType')}>
              <option value="id">{t('verified.doc.id')}</option>
              <option value="title">{t('verified.doc.title')}</option>
              <option value="passport">{t('verified.doc.passport')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="vnote" className="label">{t('verified.note')}</label>
            <textarea id="vnote" rows={3} className="field" value={form.note} onChange={set('note')} />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">{t('verified.submit')}</button>
        </form>
      )}

      {req?.status === 'pending' && (
        <div className="space-y-3 rounded-xl border border-line bg-white p-5">
          <p className="text-sm text-ink/60">{t('promote.reference')}</p>
          <p className="select-all font-mono text-xl font-bold">{req.reference}</p>
          <p className="text-sm text-ink/70">{t('verified.sendDocs')}</p>
          {SUPPORT_TELEGRAM && (
            <a href={`https://t.me/${SUPPORT_TELEGRAM}`} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
              {t('verified.sendTelegram')}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
