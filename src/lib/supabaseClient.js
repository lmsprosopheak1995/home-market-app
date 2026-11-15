import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// បើមិនបានកំណត់ .env វានឹងជា null ហើយកម្មវិធីប្រើទិន្នន័យគំរូ + localStorage
export const supabase = url && key ? createClient(url, key) : null
