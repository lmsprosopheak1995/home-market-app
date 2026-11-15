import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard.jsx'
import { useProperties } from '../hooks/useProperties.jsx'

export default function Home() {
  const { properties, loading } = useProperties()
  const latest = [...properties]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-ink px-6 py-10 text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">រកផ្ទះ ដី ឬបន្ទប់ជួល នៅកម្ពុជា</h1>
        <p className="mt-2 max-w-xl text-white/75">
          មើលអចលនទ្រព្យលក់ និងជួល ឬផ្សាយអចលនទ្រព្យរបស់អ្នកដោយឥតគិតថ្លៃ។
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/market" className="btn-gold">មើលទីផ្សារ</Link>
          <Link to="/post" className="btn border border-white/30 text-white hover:bg-white/10">ផ្សាយអចលនទ្រព្យ</Link>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-bold">ថ្មីៗ</h2>
          <Link to="/market" className="text-sm font-medium text-brand hover:underline">មើលទាំងអស់</Link>
        </div>
        {loading ? (
          <p className="py-8 text-center text-ink/60">កំពុងផ្ទុក…</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
