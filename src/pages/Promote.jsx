import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PACKAGES, SUPPORT_TELEGRAM, isSafeUrl } from '../config/payments'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { useProperties } from '../hooks/useProperties.jsx'
import { formatDate, isFeatured } from '../lib/format'

export default function Promote() {
  const { t, locale } = useI18n()
  const { user } = useAuth()
  const { properties } = useProperties()
  const mine = properties.filter((p) => p.owner === user?.username)
  const [listingId, setListingId] = useState('')
  const [pkgId, setPkgId] = useState(PACKAGES[1].id)

  const listing = mine.find((p) => p.id === listingId) ?? mine[0]
  const pkg = PACKAGES.find((p) => p.id === pkgId)
  const canPay = Boolean(listing) && isSafeUrl(pkg?.url)
  const reference = listing ? `HM-${String(listing.id).slice(0, 8).toUpperCase()}` : ''

  if (mine.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-dashed border-line bg-white p-8 text-center">
        <p className="font-semibold">{t('promote.noListings')}</p>
        <Link to="/post" className="btn-primary mt-4">{t('nav.post')}</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t('promote.title')}</h1>
        <p className="mt-1 text-ink/70">{t('promote.desc')}</p>
      </header>

      <section className="rounded-xl border border-line bg-white p-5">
        <label htmlFor="listing" className="label">{t('promote.chooseListing')}</label>
        <select id="listing" className="field" value={listing.id} onChange={(e) => setListingId(e.target.value)}>
          {mine.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        {isFeatured(listing) && (
          <p className="mt-2 text-sm font-medium text-brand">
            {t('promote.activeUntil', { date: formatDate(listing.featuredUntil, locale) })}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-line bg-white p-5">
        <h2 className="label">{t('promote.choosePackage')}</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t('promote.choosePackage')}>
          {PACKAGES.map((p) => (
            <label
              key={p.id}
              className={`cursor-pointer rounded-xl border p-4 text-center ${
                pkgId === p.id ? 'border-brand bg-brand-soft' : 'border-line hover:bg-paper'
              }`}
            >
              <input type="radio" name="package" value={p.id} checked={pkgId === p.id}
                onChange={() => setPkgId(p.id)} className="sr-only" />
              <span className="block text-sm text-ink/70">{t('promote.packageDays', { n: p.days })}</span>
              <span className="block text-2xl font-bold text-brand">${p.price}</span>
            </label>
          ))}
        </div>

        {canPay ? (
          <a href={pkg.url} target="_blank" rel="noopener noreferrer" className="btn-gold mt-5 w-full">
            {t('promote.pay')}
          </a>
        ) : (
          <>
            <button type="button" disabled className="btn-gold mt-5 w-full opacity-50">{t('promote.pay')}</button>
            <p className="mt-2 text-sm text-ink/60">{t('promote.notConfigured')}</p>
          </>
        )}
      </section>

      <section className="rounded-xl border border-line bg-white p-5">
        <h2 className="font-bold">{t('promote.stepsTitle')}</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink/80">
          <li>{t('promote.step1')}</li>
          <li>{t('promote.step2')}</li>
          <li>{t('promote.step3')}</li>
        </ol>
        <div className="mt-4 rounded-lg bg-paper p-3">
          <p className="text-sm text-ink/60">{t('promote.reference')}</p>
          <p className="select-all font-mono text-lg font-bold">{reference}</p>
        </div>
        {SUPPORT_TELEGRAM && (
          <a href={`https://t.me/${SUPPORT_TELEGRAM}`} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3 w-full">
            {t('promote.sendReceipt')}
          </a>
        )}
        <p className="mt-4 text-sm text-ink/60">{t('promote.note')}</p>
      </section>
    </div>
  )
}
