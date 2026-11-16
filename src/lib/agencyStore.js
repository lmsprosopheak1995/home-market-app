// ទិន្នន័យភ្នាក់ងារ/កម្រៃ/ការបើកប្រាក់ — ដំណើរការទាំងម៉ូដ Supabase និង localStorage (សាកល្បង)
// កម្មវិធីនេះគ្រាន់តែ "កត់ត្រា" ។ ការបើកប្រាក់ពិតធ្វើនៅខាងក្រៅ ដោយអ្នកគ្រប់គ្រងពីគណនីធនាគាររបស់ខ្លួន។
import { supabase } from './supabaseClient'
import { commissionFromRow } from '../hooks/useCommissions.jsx'

const KEYS = {
  agencies: 'home-market:agencies',
  payouts: 'home-market:payouts',
  commissions: 'home-market:commissions',
}

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

const agencyFromRow = (r) => ({
  id: r.id, name: r.name, phone: r.phone, code: r.code,
  rate: Number(r.rate), active: r.active, createdAt: r.created_at,
})
const payoutFromRow = (r) => ({
  id: r.id, agencyId: r.agency_id, amount: Number(r.amount), status: r.status,
  reference: r.reference ?? '', createdAt: r.created_at, paidAt: r.paid_at,
})

const randomCode = () => String(1000 + Math.floor(Math.random() * 9000))
const check = ({ data, error }) => {
  if (error) throw new Error(error.message)
  return data
}

/* ---------- agencies ---------- */
export async function listAgencies() {
  if (supabase) {
    const data = check(await supabase.from('agencies').select('*').order('created_at', { ascending: false }))
    return data.map(agencyFromRow)
  }
  return readList(KEYS.agencies)
}

export async function getMyAgency(phone) {
  if (supabase) {
    const data = check(await supabase.from('agencies').select('*').eq('phone', phone).limit(1))
    return data[0] ? agencyFromRow(data[0]) : null
  }
  return readList(KEYS.agencies).find((a) => a.phone === phone) ?? null
}

export async function createAgency({ name, phone, rate }) {
  if (supabase) {
    for (let i = 0; i < 8; i++) {
      const code = randomCode()
      const { data, error } = await supabase.from('agencies').insert({ name, phone, code, rate }).select().single()
      if (!error) return agencyFromRow(data)
      const text = `${error.message} ${error.details ?? ''}`
      if (error.code === '23505' && /agencies_code/.test(text)) continue // លេខកូដជាន់គ្នា — សាកម្តងទៀត
      throw new Error(error.message)
    }
    throw new Error('Could not generate a unique code')
  }
  const list = readList(KEYS.agencies)
  if (list.some((a) => a.phone === phone)) throw new Error('This phone number is already an agency')
  const used = new Set(list.map((a) => a.code))
  let code = randomCode()
  while (used.has(code)) code = randomCode()
  const agency = { id: Date.now().toString(36), name, phone, code, rate, active: true, createdAt: new Date().toISOString() }
  writeList(KEYS.agencies, [agency, ...list])
  return agency
}

export async function setAgencyActive(id, active) {
  if (supabase) {
    check(await supabase.from('agencies').update({ active }).eq('id', id).select())
    return
  }
  writeList(KEYS.agencies, readList(KEYS.agencies).map((a) => (a.id === id ? { ...a, active } : a)))
}

/* ---------- commissions ---------- */
export async function listAllCommissions() {
  if (supabase) {
    const data = check(await supabase.from('commissions').select('*').order('created_at', { ascending: false }))
    return data.map(commissionFromRow)
  }
  return readList(KEYS.commissions)
}

// ភ្នាក់ងារមើលតែកម្រៃដែលបានបង់រួច ហើយមានលេខកូដរបស់ខ្លួន
export async function listAgencyCommissions(agency) {
  if (supabase) {
    const data = check(
      await supabase.from('commissions').select('*').eq('agency_code', agency.code).eq('status', 'paid')
        .order('paid_at', { ascending: false })
    )
    return data.map(commissionFromRow)
  }
  return readList(KEYS.commissions).filter((c) => c.agencyCode === agency.code && c.status === 'paid')
}

// Admin បញ្ជាក់ថាបានទទួលប្រាក់កម្រៃ។ ចំណែកភ្នាក់ងារត្រូវគណនាតែពេលនេះ (លើប្រាក់ដែលទទួលបានពិត)
export async function confirmCommissionPaid(commission, agency) {
  if (supabase) {
    const { error } = await supabase.rpc('admin_confirm_commission', { p_id: commission.id })
    if (error) throw new Error(error.message)
    return
  }
  const share = agency && agency.active ? Math.round(commission.amount * agency.rate) / 100 : 0
  writeList(
    KEYS.commissions,
    readList(KEYS.commissions).map((c) =>
      c.id === commission.id && c.status !== 'paid'
        ? { ...c, status: 'paid', paidAt: new Date().toISOString(), agencyShare: share }
        : c
    )
  )
}

/* ---------- payouts ---------- */
export async function listPayouts(agencyId) {
  if (supabase) {
    let q = supabase.from('payouts').select('*').order('created_at', { ascending: false })
    if (agencyId) q = q.eq('agency_id', agencyId)
    return check(await q).map(payoutFromRow)
  }
  const all = readList(KEYS.payouts)
  return agencyId ? all.filter((p) => p.agencyId === agencyId) : all
}

export async function requestPayout({ agencyId, amount }) {
  if (supabase) {
    check(await supabase.from('payouts').insert({ agency_id: agencyId, amount, status: 'requested' }).select())
    return
  }
  const p = { id: Date.now().toString(36), agencyId, amount, status: 'requested', reference: '', createdAt: new Date().toISOString(), paidAt: null }
  writeList(KEYS.payouts, [p, ...readList(KEYS.payouts)])
}

export async function resolvePayout(id, { status, reference }) {
  const paidAt = status === 'paid' ? new Date().toISOString() : null
  if (supabase) {
    check(await supabase.from('payouts').update({ status, reference: reference || null, paid_at: paidAt }).eq('id', id).select())
    return
  }
  writeList(
    KEYS.payouts,
    readList(KEYS.payouts).map((p) => (p.id === id ? { ...p, status, reference: reference || '', paidAt } : p))
  )
}

/* ---------- balance ---------- */
export function agencyBalance(agency, commissions, payouts) {
  const earned = commissions
    .filter((c) => c.status === 'paid' && c.agencyCode === agency.code)
    .reduce((s, c) => s + (c.agencyShare ?? 0), 0)
  const mine = payouts.filter((p) => p.agencyId === agency.id)
  const paid = mine.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const requested = mine.filter((p) => p.status === 'requested').reduce((s, p) => s + p.amount, 0)
  const round = (n) => Math.round(n * 100) / 100
  return { earned: round(earned), paid: round(paid), requested: round(requested), available: round(earned - paid - requested) }
}
