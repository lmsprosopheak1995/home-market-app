import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { randomRef } from '../lib/ids'

const KEY = 'home-market:reservations'

const fromRow = (r) => ({
  id: r.id,
  propertyId: r.property_id,
  propertyTitle: r.property_title,
  owner: r.owner,
  buyerName: r.buyer_name,
  buyerPhone: r.buyer_phone,
  message: r.message ?? '',
  amount: r.amount == null ? null : Number(r.amount),
  status: r.status,
  reference: r.reference ?? '',
  createdAt: r.created_at,
})

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}
const writeAll = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

// អ្នកទិញផ្ញើសំណើកក់ (មិនបាច់ចូលគណនី) — គ្មានលុយឆ្លងកាត់កម្មវិធីទេ
export async function createReservation({ property, name, phone, message }) {
  const reference = randomRef('HM-R')
  if (supabase) {
    const { error } = await supabase.from('reservations').insert({
      property_id: String(property.id),
      property_title: property.title,
      owner: property.owner,
      buyer_name: name,
      buyer_phone: phone,
      message: message || null,
      amount: property.deposit ?? null,
      status: 'new',
      reference,
    })
    if (error) throw new Error(error.message)
    return reference
  }
  writeAll([
    {
      id: Date.now().toString(36),
      propertyId: property.id,
      propertyTitle: property.title,
      owner: property.owner,
      buyerName: name,
      buyerPhone: phone,
      message: message || '',
      amount: property.deposit ?? null,
      status: 'new',
      reference,
      createdAt: new Date().toISOString(),
    },
    ...readAll(),
  ])
  return reference
}

export function useReservations(owner) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    if (supabase) {
      supabase
        .from('reservations')
        .select('*')
        .eq('owner', owner)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (cancelled) return
          if (error) setError(error.message)
          else setItems(data.map(fromRow))
          setLoading(false)
        })
    } else {
      setItems(readAll().filter((r) => r.owner === owner))
      setLoading(false)
    }
    return () => {
      cancelled = true
    }
  }, [owner])

  const setStatus = useCallback(async (id, status) => {
    if (supabase) {
      const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
      if (error) throw new Error(error.message)
    } else {
      writeAll(readAll().map((r) => (r.id === id ? { ...r, status } : r)))
    }
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }, [])

  return { items, loading, error, setStatus }
}
