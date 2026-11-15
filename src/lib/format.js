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
