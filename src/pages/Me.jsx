import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { useProperties } from '../hooks/useProperties.jsx'

export default function Me() {
  const { t } = useI18n()
  const { user, ready, logout } = useAuth()
  const { properties } = useProperties()

  if (!ready) return <p className="py-10 text-center text-ink/60">{t('common.loading')}</p>

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-line bg-white p-6 text-center">
        <h1 className="text-xl font-bold">{t('me.title')}</h1>
        <p className="mt-1 text-ink/70">{t('me.loginPrompt')}</p>
        <div className="mt-5 flex justify-center gap-2">
          <Link to="/login" className="btn-primary">{t('auth.login')}</Link>
          <Link to="/register" className="btn-ghost">{t('auth.registerBtn')}</Link>
        </div>
      </div>
    )
  }

  const mine = properties.filter((p) => p.owner === user.username)

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-xl border border-line bg-white p-5">
        <div>
          <p className="text-sm text-ink/60">{t('me.account')}</p>
          <h1 className="text-xl font-bold">{user.username}</h1>
        </div>
        <button onClick={logout} className="btn-ghost">{t('nav.logout')}</button>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{t('me.myListings', { n: mine.length })}</h2>
          <div className="flex flex-wrap gap-2">
            <Link to="/commissions" className="btn-ghost !py-1.5 text-sm">{t('me.commissions')}</Link>
            {mine.length > 0 && <Link to="/promote" className="btn-gold !py-1.5 text-sm">{t('me.promote')}</Link>}
          </div>
        </div>
        {mine.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white py-12 text-center">
            <p className="font-semibold">{t('me.noListings')}</p>
            <Link to="/post" className="btn-primary mt-4">{t('nav.post')}</Link>
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
