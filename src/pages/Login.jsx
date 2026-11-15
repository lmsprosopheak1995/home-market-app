import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/'
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (!form.username.trim() || !form.password) return setError('សូមបញ្ចូលឈ្មោះអ្នកប្រើ និងពាក្យសម្ងាត់')
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
      <h1 className="text-2xl font-bold">ចូលគណនី</h1>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5">
        <div>
          <label htmlFor="username" className="label">ឈ្មោះអ្នកប្រើ</label>
          <input id="username" className="field" autoComplete="username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div>
          <label htmlFor="password" className="label">ពាក្យសម្ងាត់</label>
          <PasswordInput id="password" autoComplete="current-password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'កំពុងចូល…' : 'ចូលគណនី'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        មិនទាន់មានគណនី? <Link to="/register" state={{ from }} className="font-semibold text-brand hover:underline">ចុះឈ្មោះឥឡូវនេះ</Link>
      </p>
    </div>
  )
}
