import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { sampleProperties } from '../data/sampleProperties'

const STORAGE_KEY = 'home-market:properties:v2'
const PropertiesContext = createContext(null)

const fromRow = ({ created_at, featured_until, ...rest }) => ({
  ...rest,
  createdAt: created_at,
  featuredUntil: featured_until ?? null,
})

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function PropertiesProvider({ children }) {
  const [properties, setProperties] = useState(() =>
    supabase ? [] : loadLocal() ?? sampleProperties
  )
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState('')

  // ទាញទិន្នន័យពី Supabase (បើមាន)
  useEffect(() => {
    if (!supabase) return
    supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setProperties(data.map(fromRow))
        setLoading(false)
      })
  }, [])

  // រក្សាទុកក្នុង localStorage ពេលមិនប្រើ Supabase
  useEffect(() => {
    if (supabase) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties))
    } catch {
      /* ឃ្លាំងពេញ — មិនបាច់ធ្វើអ្វី */
    }
  }, [properties])

  const addProperty = useCallback(async (input) => {
    if (supabase) {
      const { data, error } = await supabase.from('properties').insert(input).select().single()
      if (error) throw new Error(error.message)
      const created = fromRow(data)
      setProperties((prev) => [created, ...prev])
      return created
    }
    const created = {
      ...input,
      id: Date.now().toString(36),
      createdAt: new Date().toISOString(),
    }
    setProperties((prev) => [created, ...prev])
    return created
  }, [])

  const getById = useCallback((id) => properties.find((p) => p.id === id), [properties])

  return (
    <PropertiesContext.Provider value={{ properties, loading, error, addProperty, getById }}>
      {children}
    </PropertiesContext.Provider>
  )
}

export function useProperties() {
  const ctx = useContext(PropertiesContext)
  if (!ctx) throw new Error('useProperties ត្រូវប្រើក្នុង <PropertiesProvider>')
  return ctx
}
