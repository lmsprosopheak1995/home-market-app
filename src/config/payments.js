// កញ្ចប់ផ្សព្វផ្សាយ។ តម្លៃ (price) ត្រូវតែដូចចំនួនទឹកប្រាក់ក្នុង Payment Link ដែលអ្នកបង្កើតនៅអ្នកផ្តល់សេវាទូទាត់
// (ឧ. ABA PayWay, Bakong KHQR, PayPal, Stripe Payment Link)។ ដាក់តំណក្នុង Environment Variables ។
export const PACKAGES = [
  { id: '7d', days: 7, price: 2, url: import.meta.env.VITE_PAY_URL_7D },
  { id: '30d', days: 30, price: 5, url: import.meta.env.VITE_PAY_URL_30D },
  { id: '90d', days: 90, price: 12, url: import.meta.env.VITE_PAY_URL_90D },
]

// Telegram username របស់អ្នកគ្រប់គ្រង (មិនបាច់មាន @)
export const SUPPORT_TELEGRAM = (import.meta.env.VITE_SUPPORT_TELEGRAM || '').replace(/^@/, '')

// អនុញ្ញាតតែតំណ https ប៉ុណ្ណោះ
export const isSafeUrl = (u) => /^https:\/\//i.test(u || '')

// កម្រៃជើងសារ (%) — ដែនកំណត់ដែលអ្នកលក់អាចជ្រើសរើស ហើយតម្លៃលំនាំដើម
export const COMMISSION = { min: 1, max: 10, default: 2 }

// ការទូទាត់កម្រៃតាម KHQR ទៅគណនីអាជីវកម្មរបស់អ្នក (មិនមានសមតុល្យក្នុងកម្មវិធី)
// - ដាក់រូប KHQR របស់អ្នកក្នុង public/khqr.png
// - ឬដាក់តំណទំព័របង់ប្រាក់ (https) ក្នុង VITE_KHQR_URL
export const KHQR_IMAGE = '/khqr.png'
export const KHQR_URL = import.meta.env.VITE_KHQR_URL
export const BUSINESS_NAME = import.meta.env.VITE_BUSINESS_NAME || ''
