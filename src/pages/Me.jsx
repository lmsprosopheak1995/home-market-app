import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useProperties } from '../hooks/useProperties.jsx'

export default function Me() {
  const { user, ready, logout } = useAuth()
  const { properties } = useProperties()

  if (!ready) return <p className="py-10 text-center text-ink/60">កំពុងផ្ទុក…</p>

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-line bg-white p-6 text-center">
        <h1 className="text-xl font-bold">គណនីរបស់ខ្ញុំ</h1>
        <p className="mt-1 text-ink/70">ចូលគណនីដើម្បីមើល និងគ្រប់គ្រងការផ្សាយរបស់អ្នក។</p>
        <div className="mt-5 flex justify-center gap-2">
          <Link to="/login" className="btn-primary">ចូលគណនី</Link>
          <Link to="/register" className="btn-ghost">ចុះឈ្មោះ</Link>
        </div>
      </div>
    )
  }

  const mine = properties.filter((p) => p.owner === user.username)

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-xl border border-line bg-white p-5">
        <div>
          <p className="text-sm text-ink/60">គណនី</p>
          <h1 className="text-xl font-bold">{user.username}</h1>
        </div>
        <button onClick={logout} className="btn-ghost">ចាកចេញ</button>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">ការផ្សាយរបស់ខ្ញុំ ({mine.length})</h2>
        {mine.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white py-12 text-center">
            <p className="font-semibold">អ្នកមិនទាន់បានផ្សាយអចលនទ្រព្យទេ</p>
            <Link to="/post" className="btn-primary mt-4">ផ្សាយអចលនទ្រព្យ</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
