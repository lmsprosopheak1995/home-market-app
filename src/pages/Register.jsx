import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/'
  const [form, setForm] = useState({ username: '', password: '', invitationCode: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!/^[A-Za-z0-9_]{3,20}$/.test(form.username)) errs.username = 'ប្រើអក្សរឡាតាំង លេខ ឬ _ ចំនួន ៣–២០ តួ'
    if (form.password.length < 6) errs.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួ'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    setSubmitError('')
    try {
      await register({ ...form, invitationCode: form.invitationCode.trim() })
      navigate(from, { replace: true })
    } catch (err) {
      setSubmitError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">ចុះឈ្មោះគណនី</h1>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5">
        <div>
          <label htmlFor="username" className="label">ឈ្មោះអ្នកប្រើ</label>
          <input id="username" className="field" autoComplete="username" value={form.username} onChange={set('username')} />
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
        </div>
        <div>
          <label htmlFor="password" className="label">ពាក្យសម្ងាត់</label>
          <PasswordInput id="password" autoComplete="new-password" value={form.password} onChange={set('password')} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="invitationCode" className="label">លេខកូដអញ្ជើញ (ស្រេចចិត្ត)</label>
          <input id="invitationCode" className="field" value={form.invitationCode} onChange={set('invitationCode')} />
        </div>
        {submitError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{submitError}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'កំពុងចុះឈ្មោះ…' : 'ចុះឈ្មោះ'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        មានគណនីរួចហើយ? <Link to="/login" state={{ from }} className="font-semibold text-brand hover:underline">ចូលគណនី</Link>
      </p>
    </div>
  )
}
