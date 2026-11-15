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
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (!form.username.trim() || !form.password) return setError('err.enterCreds')
    setBusy(true)
    setError('')
    try {
      await login({ username: form.username.trim(), password: form.password })
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
          <label htmlFor="username" className="label">{t('auth.username')}</label>
          <input id="username" className="field" autoComplete="username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div>
          <label htmlFor="password" className="label">{t('auth.password')}</label>
          <PasswordInput id="password" autoComplete="current-password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
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
