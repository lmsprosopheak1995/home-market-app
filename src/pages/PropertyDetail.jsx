import { Link, useParams } from 'react-router-dom'
import { LOCATIONS, PROPERTY_TYPES, PURPOSES, optionLabel } from '../data/options'
import { useI18n } from '../hooks/useI18n.jsx'
import { useProperties } from '../hooks/useProperties.jsx'
import { formatDate, formatPrice } from '../lib/format'
import ReserveBox from '../components/ReserveBox.jsx'
import VerifiedBadge from '../components/VerifiedBadge.jsx'

export default function PropertyDetail() {
  const { t, locale } = useI18n()
  const { id } = useParams()
  const { getById, loading } = useProperties()
  const p = getById(id)

  if (loading) return <p className="py-10 text-center text-ink/60">{t('common.loading')}</p>

  if (!p) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-bold">{t('detail.notFoundTitle')}</h1>
        <p className="mt-1 text-ink/60">{t('detail.notFoundDesc')}</p>
        <Link to="/" className="btn-primary mt-5">{t('detail.backToList')}</Link>
      </div>
    )
  }

  const specs = [
    [t('spec.type'), optionLabel(t, 'type', PROPERTY_TYPES, p.type)],
    [t('spec.location'), optionLabel(t, 'loc', LOCATIONS, p.location)],
    p.bedrooms > 0 && [t('spec.bedrooms'), p.bedrooms],
    p.bathrooms > 0 && [t('spec.bathrooms'), p.bathrooms],
    [t('spec.area'), `${p.area} m²`],
    p.commission != null && [t('spec.commission'), `${p.commission}%`],
    p.deposit != null && [t('spec.deposit'), `$${Number(p.deposit).toLocaleString('en-US')}`],
    [t('spec.posted'), formatDate(p.createdAt, locale)],
  ].filter(Boolean)

  return (
    <div className="space-y-5">
      <Link to="/market" className="text-sm text-brand hover:underline">{t('detail.back')}</Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-line">
            <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
          </div>
          <section className="rounded-xl border border-line bg-white p-5">
            <h2 className="mb-2 text-lg font-bold">{t('detail.description')}</h2>
            <p className="whitespace-pre-line break-words text-ink/80">{p.description}</p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <section className="rounded-xl border border-line bg-white p-5">
            <span className={`rounded-md px-2 py-0.5 text-sm font-semibold ${p.purpose === 'ជួល' ? 'bg-gold text-ink' : 'bg-brand text-white'}`}>
              {optionLabel(t, 'purpose', PURPOSES, p.purpose)}
            </span>
            <h1 className="mt-2 break-words text-xl font-bold">{p.title}</h1>
            <VerifiedBadge owner={p.owner} className="mt-1" />
            <p className="mt-1 text-2xl font-bold text-brand">{formatPrice(p.price, p.purpose, t('price.perMonth'))}</p>
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
            <h2 className="font-bold">{t('detail.contact')}</h2>
            <a href={`tel:${p.phone}`} className="btn-primary mt-3 w-full">{t('detail.call', { phone: p.phone })}</a>
            <a
              href={`https://t.me/+855${p.phone.replace(/^0/, '')}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-2 w-full"
            >
              {t('detail.telegram')}
            </a>
          </section>

          <ReserveBox property={p} />
        </aside>
      </div>
    </div>
  )
}
