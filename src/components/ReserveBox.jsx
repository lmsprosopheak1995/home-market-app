import { useState } from 'react'
import { useI18n } from '../hooks/useI18n.jsx'
import { createReservation } from '../hooks/useReservations.jsx'
import { getPaymentDetails } from '../lib/paymentDetails'

export default function ReserveBox({ property }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')
  const [pay, setPay] = useState(null)
  const [submitError, setSubmitError] = useState('')

  if (!property.owner) return null

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  if (property.reserved) {
    return (
      <section className="rounded-xl border border-line bg-gold-soft p-5 font-semibold">
        {t('reserve.reservedNotice')}
      </section>
    )
  }

  async function onSubmit(e) {
    e.preventDefault()
    const phone = form.phone.replace(/\s/g, '')
    const errs = {}
    if (form.name.trim().length < 2) errs.name = 'val.name'
    if (!/^0\d{8,9}$/.test(phone)) errs.phone = 'val.phone'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    setSubmitError('')
    try {
      const reference = await createReservation({ property, name: form.name.trim(), phone, message: form.message.trim() })
      setRef(reference)
      setSent(true)
      try {
        setPay(await getPaymentDetails({ propertyId: property.id, reference }))
      } catch {
        setPay(null)
      }
    } catch (err) {
      setSubmitError(`${t('post.submitFail')}: ${err.message}`)
    }
    setBusy(false)
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <p className="rounded-lg bg-gold-soft p-3 text-sm text-ink/80">{t('reserve.warning')}</p>

      {sent ? (
        <div className="mt-3 space-y-3">
          <p role="status" className="rounded-lg bg-brand-soft p-3 font-semibold text-brand-dark">{t('reserve.sent')}</p>
          {pay ? (
            <div className="rounded-lg border border-line p-3">
              <h2 className="font-bold">{t('reserve.payTitle')}</h2>
              <p className="mt-2 text-sm text-ink/60">{t('pay.name')}</p>
              <p className="break-words font-semibold">{pay.name}</p>
              {pay.info && <p className="mt-1 whitespace-pre-line break-words text-sm">{pay.info}</p>}
              {pay.qr && pay.qr.startsWith('data:image/') && (
                <img src={pay.qr} alt="KHQR" className="mx-auto mt-3 w-full max-w-[14rem] rounded-lg border border-line" />
              )}
              <p className="mt-3 text-sm text-ink/60">{t('promote.reference')}</p>
              <p className="select-all font-mono text-lg font-bold">{ref}</p>
              <p className="mt-2 text-sm text-ink/70">{t('reserve.payNote')}</p>
            </div>
          ) : (
            <p className="text-sm text-ink/70">{t('reserve.noPay')}</p>
          )}
        </div>
      ) : !open ? (
        <button type="button" onClick={() => setOpen(true)} className="btn-gold mt-3 w-full">{t('reserve.button')}</button>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-3 space-y-3">
          <h2 className="font-bold">{t('reserve.title')}</h2>
          <div>
            <label htmlFor="rname" className="label">{t('reserve.name')}</label>
            <input id="rname" className="field" autoComplete="name" value={form.name} onChange={set('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{t(errors.name)}</p>}
          </div>
          <div>
            <label htmlFor="rphone" className="label">{t('post.phone')}</label>
            <input id="rphone" type="tel" inputMode="numeric" autoComplete="tel" className="field" placeholder="012345678"
              value={form.phone} onChange={set('phone')} />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{t(errors.phone)}</p>}
          </div>
          <div>
            <label htmlFor="rmsg" className="label">{t('reserve.message')}</label>
            <textarea id="rmsg" rows={3} className="field" value={form.message} onChange={set('message')} />
          </div>
          {submitError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{submitError}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">{t('reserve.submit')}</button>
        </form>
      )}
    </section>
  )
}
