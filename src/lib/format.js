export function formatPrice(price, purpose) {
  const text = `$${Number(price).toLocaleString('en-US')}`
  return purpose === 'ជួល' ? `${text}/ខែ` : text
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}
