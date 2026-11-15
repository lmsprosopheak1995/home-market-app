import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard.jsx'
import SearchFilter from '../components/SearchFilter.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { useProperties } from '../hooks/useProperties.jsx'

const EMPTY = { q: '', purpose: '', type: '', location: '', maxPrice: '' }

export default function Market() {
  const { t } = useI18n()
  const { properties, loading, error } = useProperties()
  const [filters, setFilters] = useState(EMPTY)

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    const max = Number(filters.maxPrice)
    return properties.filter((p) => {
      if (filters.purpose && p.purpose !== filters.purpose) return false
      if (filters.type && p.type !== filters.type) return false
      if (filters.location && p.location !== filters.location) return false
      if (max && p.price > max) return false
      if (q && !`${p.title} ${p.description} ${p.location}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [properties, filters])

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('market.title')}</h1>
        <p className="mt-1 text-ink/70">{t('market.desc')}</p>
      </section>

      <SearchFilter filters={filters} onChange={setFilters} />

      {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{t('err.load')}: {error}</p>}

      {loading ? (
        <p className="py-10 text-center text-ink/60">{t('common.loading')}</p>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white py-14 text-center">
          <p className="font-semibold">{t('market.emptyTitle')}</p>
          <p className="mt-1 text-sm text-ink/60">{t('market.emptyDesc')}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button className="btn-ghost" onClick={() => setFilters(EMPTY)}>{t('market.clear')}</button>
            <Link to="/post" className="btn-primary">{t('nav.post')}</Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink/60">{t('market.found', { n: results.length })}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </>
      )}
    </div>
  )
}
