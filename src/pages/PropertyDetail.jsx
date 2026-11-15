import { Link, useParams } from 'react-router-dom'
import { useProperties } from '../hooks/useProperties.jsx'
import { formatDate, formatPrice } from '../lib/format'

export default function PropertyDetail() {
  const { id } = useParams()
  const { getById, loading } = useProperties()
  const p = getById(id)

  if (loading) return <p className="py-10 text-center text-ink/60">កំពុងផ្ទុក…</p>

  if (!p) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-bold">រកមិនឃើញអចលនទ្រព្យនេះទេ</h1>
        <p className="mt-1 text-ink/60">វាអាចត្រូវបានលុបចេញ។</p>
        <Link to="/" className="btn-primary mt-5">ត្រឡប់ទៅបញ្ជី</Link>
      </div>
    )
  }

  const specs = [
    ['ប្រភេទ', p.type],
    ['ទីតាំង', p.location],
    p.bedrooms > 0 && ['បន្ទប់គេង', p.bedrooms],
    p.bathrooms > 0 && ['បន្ទប់ទឹក', p.bathrooms],
    ['ទំហំ', `${p.area} ម²`],
    ['ផ្សាយនៅ', formatDate(p.createdAt)],
  ].filter(Boolean)

  return (
    <div className="space-y-5">
      <Link to="/" className="text-sm text-brand hover:underline">← ត្រឡប់ទៅបញ្ជី</Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <img src={p.image} alt={p.title} className="aspect-[4/3] w-full rounded-xl object-cover" />
          <section className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-2 text-lg font-bold">ពិពណ៌នា</h2>
            <p className="whitespace-pre-line text-ink/80">{p.description}</p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <section className="rounded-xl border border-line bg-white p-5">
            <span className={`rounded-md px-2 py-0.5 text-sm font-semibold ${p.purpose === 'ជួល' ? 'bg-gold text-ink' : 'bg-brand text-white'}`}>
              {p.purpose}
            </span>
            <h1 className="mt-2 text-xl font-bold">{p.title}</h1>
            <p className="mt-1 text-2xl font-bold text-brand">{formatPrice(p.price, p.purpose)}</p>
            <dl className="mt-4 divide-y divide-line text-sm">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <dt className="text-ink/60">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-bold">ទាក់ទងម្ចាស់</h2>
            <a href={`tel:${p.phone}`} className="btn-primary mt-3 w-full">ហៅ {p.phone}</a>
            <a
              href={`https://t.me/+855${p.phone.replace(/^0/, '')}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-2 w-full"
            >
              ផ្ញើសារតាម Telegram
            </a>
          </section>
        </aside>
      </div>
    </div>
  )
}
