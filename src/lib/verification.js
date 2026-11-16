// ការផ្ទៀងផ្ទាត់ម្ចាស់ (ស្លាក "ម្ចាស់បានផ្ទៀងផ្ទាត់")
// កម្មវិធីមិនរក្សារូបថតឯកសារទេ — អ្នកលក់ផ្ញើឯកសារទៅ Admin តាម Telegram ជាមួយលេខយោង ហើយ Admin អនុម័តក្នុង /admin
import { supabase } from './supabaseClient'
import { randomRef } from './ids'

const KEYS = { requests: 'home-market:verification-requests', owners: 'home-market:verified-owners' }

const readList = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? []
  } catch {
    return []
  }
}
const writeList = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}
const check = ({ data, error }) => {
  if (error) throw new Error(error.message)
  return data
}

const fromRow = (r) => ({
  id: r.id, owner: r.owner, fullName: r.full_name, docType: r.doc_type, note: r.note ?? '',
  reference: r.reference, status: r.status, createdAt: r.created_at,
})

// បញ្ជីលេខទូរស័ព្ទម្ចាស់ដែលបានផ្ទៀងផ្ទាត់ (សាធារណៈ — មានតែជួរ owner)
export async function listVerifiedOwners() {
  if (supabase) return check(await supabase.from('verified_owners').select('owner')).map((r) => r.owner)
  return readList(KEYS.owners).map((o) => o.owner)
}

export async function getMyVerification(owner) {
  if (supabase) {
    const data = check(
      await supabase.from('verification_requests').select('*').eq('owner', owner)
        .order('created_at', { ascending: false }).limit(1)
    )
    return data[0] ? fromRow(data[0]) : null
  }
  return readList(KEYS.requests).find((r) => r.owner === owner) ?? null
}

export async function requestVerification({ owner, fullName, docType, note }) {
  const reference = randomRef('HM-V')
  if (supabase) {
    const data = check(
      await supabase.from('verification_requests')
        .insert({ owner, full_name: fullName, doc_type: docType, note: note || null, reference, status: 'pending' })
        .select().single()
    )
    return fromRow(data)
  }
  const req = {
    id: Date.now().toString(36), owner, fullName, docType, note: note || '',
    reference, status: 'pending', createdAt: new Date().toISOString(),
  }
  writeList(KEYS.requests, [req, ...readList(KEYS.requests)])
  return req
}

/* ---------- Admin ---------- */
export async function listVerificationRequests() {
  if (supabase) {
    return check(await supabase.from('verification_requests').select('*').order('created_at', { ascending: false })).map(fromRow)
  }
  return readList(KEYS.requests)
}

export async function reviewVerification(req, approve) {
  if (supabase) {
    const { error } = await supabase.rpc('admin_review_verification', { p_id: req.id, p_approve: approve })
    if (error) throw new Error(error.message)
    return
  }
  writeList(KEYS.requests, readList(KEYS.requests).map((r) => (r.id === req.id ? { ...r, status: approve ? 'approved' : 'rejected' } : r)))
  if (approve) {
    const owners = readList(KEYS.owners).filter((o) => o.owner !== req.owner)
    writeList(KEYS.owners, [{ owner: req.owner, fullName: req.fullName, verifiedAt: new Date().toISOString() }, ...owners])
  }
}

export async function revokeVerification(owner) {
  if (supabase) {
    const { error } = await supabase.rpc('admin_revoke_verification', { p_owner: owner })
    if (error) throw new Error(error.message)
    return
  }
  writeList(KEYS.owners, readList(KEYS.owners).filter((o) => o.owner !== owner))
  writeList(KEYS.requests, readList(KEYS.requests).map((r) => (r.owner === owner && r.status === 'approved' ? { ...r, status: 'rejected' } : r)))
}
