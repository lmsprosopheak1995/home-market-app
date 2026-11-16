// លេខយោងចៃដន្យ (មិនងាយទាយ) សម្រាប់ភ្ជាប់ការកក់/ការបង់ប្រាក់
export function randomRef(prefix) {
  const bytes = crypto.getRandomValues(new Uint8Array(7))
  const body = Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 10).toUpperCase()
  return `${prefix}-${body}`
}
