import { useState } from 'react'

export default function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="field pr-16"
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
        {show ? 'លាក់' : 'បង្ហាញ'}
      </button>
    </div>
  )
}
