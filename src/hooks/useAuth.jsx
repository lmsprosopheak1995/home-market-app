import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const USERS_KEY = 'home-market:users'
const SESSION_KEY = 'home-market:session'
const AuthContext = createContext(null)

// Supabase Auth ប្រើ email ដូច្នេះបម្លែងឈ្មោះអ្នកប្រើជា email ក្លែងក្លាយ
const toEmail = (username) => `${username.toLowerCase()}@users.home-market.app`

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (supabase) {
      const toUser = (s) => (s?.user ? { username: s.user.user_metadata?.username ?? s.user.email } : null)
      supabase.auth.getSession().then(({ data }) => {
        setUser(toUser(data.session))
        setReady(true)
      })
      const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(toUser(s)))
      return () => data.subscription.unsubscribe()
    }
    setUser(read(SESSION_KEY, null))
    setReady(true)
  }, [])

  const register = useCallback(async ({ username, password, invitationCode }) => {
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email: toEmail(username),
        password,
        options: { data: { username, invitation_code: invitationCode || null } },
      })
      if (error) {
        if (/already/i.test(error.message)) throw new Error('err.exists')
        throw new Error(error.message)
      }
      return
    }
    const users = read(USERS_KEY, {})
    const key = username.toLowerCase()
    if (users[key]) throw new Error('err.exists')
    users[key] = { username, passwordHash: await sha256(key + password), invitationCode: invitationCode || null }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const session = { username }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }, [])

  const login = useCallback(async ({ username, password }) => {
    const bad = new Error('err.badLogin')
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: toEmail(username), password })
      if (error) throw bad
      return
    }
    const key = username.toLowerCase()
    const record = read(USERS_KEY, {})[key]
    if (!record || record.passwordHash !== (await sha256(key + password))) throw bad
    const session = { username: record.username }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }, [])

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    else {
      localStorage.removeItem(SESSION_KEY)
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, ready, register, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth ត្រូវប្រើក្នុង <AuthProvider>')
  return ctx
}
