import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { useProperties } from '../hooks/useProperties.jsx'
import { isFeatured } from '../lib/format'

export default function Home() {
  const { t } = useI18n()
  const { properties, loading } = useProperties()
  const latest = [...properties]
    .sort((a, b) => Number(isFeatured(b)) - Number(isFeatured(a)) || new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-ink px-6 py-10 text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('home.title')}</h1>
        <p className="mt-2 max-w-xl text-white/75">{t('home.desc')}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/market" className="btn-gold">{t('home.viewMarket')}</Link>
          <Link to="/post" className="btn border border-white/30 text-white hover:bg-white/10">{t('nav.post')}</Link>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-bold">{t('home.latest')}</h2>
          <Link to="/market" className="text-sm font-medium text-brand hover:underline">{t('home.viewAll')}</Link>
        </div>
        {loading ? (
          <p className="py-8 text-center text-ink/60">{t('common.loading')}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
