// លេខទូរស័ព្ទអ្នកគ្រប់គ្រង សម្រាប់តែ "ម៉ូដសាកល្បង" (គ្មាន Supabase) — ដាក់ក្នុង VITE_ADMIN_PHONES (បំបែកដោយក្បៀស)
// ពេលប្រើ Supabase សិទ្ធិ Admin មកពី app_metadata.role = 'admin' (មើល README)
export const ADMIN_PHONES = (import.meta.env.VITE_ADMIN_PHONES || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// ចំណែកលំនាំដើម/អតិបរមារបស់ភ្នាក់ងារ (% នៃកម្រៃដែលបានទទួលពិតប្រាកដ) និងចំនួនបើកប្រាក់អប្បបរមា ($)
export const AGENCY = { defaultRate: 20, maxRate: 50, minPayout: 10 }
