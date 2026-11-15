export const PROPERTY_TYPES = ['ផ្ទះ', 'ផ្ទះល្វែង', 'ខុនដូ', 'ដី', 'បន្ទប់ជួល']
export const PURPOSES = ['លក់', 'ជួល']
export const LOCATIONS = [
  'ភ្នំពេញ',
  'កណ្ដាល',
  'សៀមរាប',
  'បាត់ដំបង',
  'កំពត',
  'កែប',
  'ព្រះសីហនុ',
  'កំពង់ចាម',
]

// បង្ហាញឈ្មោះតាមភាសា (តម្លៃដែលរក្សាទុកនៅតែជាខ្មែរ)
export function optionLabel(t, prefix, list, value) {
  const i = list.indexOf(value)
  return i < 0 ? value : t(`${prefix}.${i}`)
}
