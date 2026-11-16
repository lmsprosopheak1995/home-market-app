export function formatPrice(price, purpose, perMonth = '/ខែ') {
  const text = `$${Number(price).toLocaleString('en-US')}`
  return purpose === 'ជួល' ? `${text}${perMonth}` : text
}

export function formatDate(iso, locale = 'en-GB') {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function isFeatured(p) {
  return Boolean(p?.featuredUntil) && new Date(p.featuredUntil) > new Date()
}

export const money = (n) => `$${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
