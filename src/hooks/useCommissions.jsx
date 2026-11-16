import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const KEY = 'home-market:commissions'

export const commissionFromRow = (r) => ({
  id: r.id,
  propertyId: r.property_id,
  propertyTitle: r.property_title,
  owner: r.owner,
  dealAmount: Number(r.deal_amount),
  rate: Number(r.rate),
  amount: Number(r.amount),
  status: r.status,
  reference: r.reference,
  createdAt: r.created_at,
  paidAt: r.paid_at,
  agencyCode: r.agency_code ?? null,
  agencyShare: r.agency_share == null ? null : Number(r.agency_share),
})
const fromRow = commissionFromRow

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

const writeMine = (owner, mine) => {
  try {
    const others = readAll().filter((c) => c.owner !== owner)
    localStorage.setItem(KEY, JSON.stringify([...mine, ...others]))
  } catch {
    /* ignore */
  }
}

export function useCommissions(owner) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    if (supabase) {
      supabase
        .from('commissions')
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
      setItems(readAll().filter((c) => c.owner === owner))
      setLoading(false)
    }
    return () => {
      cancelled = true
    }
  }, [owner])

  // កត់ត្រាកិច្ចព្រមព្រៀង (ស្ថានភាពចាប់ផ្តើមជា pending ជានិច្ច)
  const add = useCallback(
    async ({ propertyId, propertyTitle, dealAmount, rate, agencyCode = null }) => {
      const amount = Math.round(dealAmount * rate) / 100
      const reference = `HM-C-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      if (supabase) {
        const { data, error } = await supabase
          .from('commissions')
          .insert({
            property_id: String(propertyId),
            property_title: propertyTitle,
            owner,
            deal_amount: dealAmount,
            rate,
            amount,
            status: 'pending',
            reference,
            agency_code: agencyCode,
          })
          .select()
          .single()
        if (error) throw new Error(error.message)
        setItems((prev) => [fromRow(data), ...prev])
        return
      }
      const created = {
        id: Date.now().toString(36),
        propertyId, propertyTitle, owner, dealAmount, rate, amount,
        status: 'pending',
        reference,
        createdAt: new Date().toISOString(),
        paidAt: null,
        agencyCode,
        agencyShare: null,
      }
      setItems((prev) => {
        const next = [created, ...prev]
        writeMine(owner, next)
        return next
      })
    },
    [owner]
  )

  // អ្នកលក់រាយការណ៍ថាបានបង់ — ស្ថានភាព "paid" ត្រូវកំណត់ដោយអ្នកគ្រប់គ្រងប៉ុណ្ណោះ
  const markReported = useCallback(
    async (id) => {
      if (supabase) {
        const { error } = await supabase.from('commissions').update({ status: 'reported' }).eq('id', id)
        if (error) throw new Error(error.message)
      }
      setItems((prev) => {
        const next = prev.map((c) => (c.id === id && c.status === 'pending' ? { ...c, status: 'reported' } : c))
        if (!supabase) writeMine(owner, next)
        return next
      })
    },
    [owner]
  )

  return { items, loading, error, add, markReported }
}
