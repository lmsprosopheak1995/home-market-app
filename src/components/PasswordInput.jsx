import { useState } from 'react'
import { useI18n } from '../hooks/useI18n.jsx'

export default function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const { t } = useI18n()
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="field pr-20"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
        className="absolute inset-y-0 right-2 px-2 text-sm text-brand hover:underline"
      >
        {show ? t('auth.hide') : t('auth.show')}
      </button>
    </div>
  )
}
