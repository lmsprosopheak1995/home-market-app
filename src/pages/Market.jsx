import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard.jsx'
import SearchFilter from '../components/SearchFilter.jsx'
import { useProperties } from '../hooks/useProperties.jsx'

const EMPTY = { q: '', purpose: '', type: '', location: '', maxPrice: '' }

export default function Market() {
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
        <h1 className="text-2xl font-bold sm:text-3xl">ទីផ្សារអចលនទ្រព្យ</h1>
        <p className="mt-1 text-ink/70">ស្វែងរក និងច្រោះតាមទីតាំង ប្រភេទ និងតម្លៃ។</p>
      </section>

      <SearchFilter filters={filters} onChange={setFilters} />

      {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-ink/60">កំពុងផ្ទុក…</p>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white py-14 text-center">
          <p className="font-semibold">រកមិនឃើញអចលនទ្រព្យដែលត្រូវនឹងលក្ខខណ្ឌទេ</p>
          <p className="mt-1 text-sm text-ink/60">សាកល្បងដកតម្រងខ្លះចេញ ឬផ្សាយអចលនទ្រព្យថ្មី។</p>
          <div className="mt-4 flex justify-center gap-2">
            <button className="btn-ghost" onClick={() => setFilters(EMPTY)}>សម្អាតតម្រង</button>
            <Link to="/post" className="btn-primary">ផ្សាយអចលនទ្រព្យ</Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink/60">រកឃើញ {results.length} ទំនិញ</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </>
      )}
    </div>
  )
}
