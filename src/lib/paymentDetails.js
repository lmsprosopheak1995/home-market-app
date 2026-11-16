// ព័ត៌មានទទួលប្រាក់របស់អ្នកលក់ (គណនីផ្ទាល់ខ្លួន/KHQR) — អ្នកទិញបង់ត្រង់ទៅអ្នកលក់ កម្មវិធីមិនប៉ះលុយទេ។
// ព័ត៌មាននេះបង្ហាញតែចំពោះអ្នកទិញដែលមានលេខយោងនៃសំណើកក់ត្រឹមត្រូវប៉ុណ្ណោះ (ពិនិត្យនៅ server តាម RPC)។
import { supabase } from './supabaseClient'

const PAY_KEY = 'home-market:seller-payment'
const RESV_KEY = 'home-market:reservations'

const readObj = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? {}
  } catch {
    return {}
  }
}

export async function savePaymentDetails({ propertyId, owner, name, info, qr }) {
  if (supabase) {
    const { error } = await supabase.from('seller_payment').upsert(
      { property_id: String(propertyId), owner, pay_name: name, pay_info: info || null, pay_qr: qr || null },
      { onConflict: 'property_id' }
    )
    if (error) throw new Error(error.message)
    return
  }
  const all = readObj(PAY_KEY)
  all[propertyId] = { name, info: info || '', qr: qr || '' }
  try {
    localStorage.setItem(PAY_KEY, JSON.stringify(all))
  } catch {
    /* ignore */
  }
}

export async function getPaymentDetails({ propertyId, reference }) {
  if (supabase) {
    const { data, error } = await supabase.rpc('get_payment_details', {
      p_property_id: String(propertyId),
      p_reference: reference,
    })
    if (error) throw new Error(error.message)
    const row = data?.[0]
    return row ? { name: row.pay_name, info: row.pay_info ?? '', qr: row.pay_qr ?? '' } : null
  }
  let list = []
  try {
    list = JSON.parse(localStorage.getItem(RESV_KEY)) ?? []
  } catch {
    /* ignore */
  }
  const ok = list.some((r) => r.reference === reference && String(r.propertyId) === String(propertyId) && r.status !== 'cancelled')
  return ok ? readObj(PAY_KEY)[propertyId] ?? null : null
}
