import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'

const digits = (v, max) => v.replace(/\D/g, '').slice(0, max)

export default function Register() {
  const { t } = useI18n()
  const { register } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/'
  const [form, setForm] = useState({ phone: '', password: '', confirm: '', invitationCode: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key, max) => (e) =>
    setForm((f) => ({ ...f, [key]: max ? digits(e.target.value, max) : e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    const phone = form.phone.replace(/\s/g, '')
    const errs = {}
    if (!/^0\d{8,9}$/.test(phone)) errs.phone = 'val.phone'
    if (!/^\d{6}$/.test(form.password)) errs.password = 'val.pass6'
    if (form.confirm !== form.password) errs.confirm = 'val.passMatch'
    if (form.invitationCode && !/^\d{4}$/.test(form.invitationCode)) errs.invitationCode = 'val.invite4'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    setSubmitError('')
    try {
      await register({ username: phone, password: form.password, invitationCode: form.invitationCode })
      navigate(from, { replace: true })
    } catch (err) {
      setSubmitError(err.message)
      setBusy(false)
    }
  }

  const Err = ({ k }) => (errors[k] ? <p className="mt-1 text-sm text-red-600">{t(errors[k])}</p> : null)

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">{t('auth.register')}</h1>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5">
        <div>
          <label htmlFor="phone" className="label">{t('auth.phone')}</label>
          <input id="phone" type="tel" inputMode="numeric" autoComplete="tel" className="field" placeholder="012345678"
            value={form.phone} onChange={set('phone')} />
          <Err k="phone" />
        </div>
        <div>
          <label htmlFor="password" className="label">{t('auth.password6')}</label>
          <PasswordInput id="password" autoComplete="new-password" inputMode="numeric" maxLength={6}
            value={form.password} onChange={set('password', 6)} />
          <Err k="password" />
        </div>
        <div>
          <label htmlFor="confirm" className="label">{t('auth.confirmPassword')}</label>
          <PasswordInput id="confirm" autoComplete="new-password" inputMode="numeric" maxLength={6}
            value={form.confirm} onChange={set('confirm', 6)} />
          <Err k="confirm" />
        </div>
        <div>
          <label htmlFor="invitationCode" className="label">{t('auth.invite4')}</label>
          <input id="invitationCode" inputMode="numeric" maxLength={4} className="field"
            value={form.invitationCode} onChange={set('invitationCode', 4)} />
          <Err k="invitationCode" />
        </div>
        {submitError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{t(submitError)}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? t('auth.registering') : t('auth.registerBtn')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" state={{ from }} className="font-semibold text-brand hover:underline">{t('auth.login')}</Link>
      </p>
    </div>
  )
}
