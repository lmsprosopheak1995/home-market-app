import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'

export default function Login() {
  const { t } = useI18n()
  const { login } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/'
  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const phone = form.phone.replace(/\s/g, '')
    if (!phone || !form.password) return setError('err.enterCreds')
    setBusy(true)
    setError('')
    try {
      await login({ username: phone, password: form.password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">{t('auth.login')}</h1>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5">
        <div>
          <label htmlFor="phone" className="label">{t('auth.phone')}</label>
          <input id="phone" type="tel" inputMode="numeric" className="field" autoComplete="tel" placeholder="012345678"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label htmlFor="password" className="label">{t('auth.password')}</label>
          <PasswordInput id="password" autoComplete="current-password" inputMode="numeric" maxLength={6} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{t(error)}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? t('auth.loggingIn') : t('auth.login')}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {t('auth.noAccount')}{' '}
        <Link to="/register" state={{ from }} className="font-semibold text-brand hover:underline">{t('auth.signupNow')}</Link>
      </p>
    </div>
  )
}
