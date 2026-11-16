import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useCommissions } from '../hooks/useCommissions.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { useProperties } from '../hooks/useProperties.jsx'
import { useReservations } from '../hooks/useReservations.jsx'
import { getMyAgency } from '../lib/agencyStore'
import { formatDate, money } from '../lib/format'

const glass = 'rounded-2xl bg-white/10 ring-1 ring-white/15'

export default function Me() {
  const { t, locale } = useI18n()
  const { user, ready, logout } = useAuth()
  const { properties } = useProperties()
  const [isAgency, setIsAgency] = useState(false)
  const owner = user?.username ?? ''
  const commissions = useCommissions(owner)
  const reservations = useReservations(owner)

  useEffect(() => {
    if (owner) getMyAgency(owner).then((a) => setIsAgency(Boolean(a))).catch(() => {})
  }, [owner])

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
  const reservedCount = mine.filter((p) => p.reserved).length
  const newRequests = reservations.items.filter((r) => r.status === 'new').length
  const due = commissions.items.filter((c) => c.status !== 'paid').reduce((s, c) => s + c.amount, 0)

  const tiles = [
    { label: t('dash.tab.dashboard'), icon: 'grid', active: true },
    { label: t('me.reservations'), icon: 'receipt', to: '/reservations' },
    { label: t('me.commissions'), icon: 'percent', to: '/commissions' },
    { label: t('me.promote'), icon: 'star', to: '/promote' },
    { label: t('me.verify'), icon: 'check', to: '/verify' },
    user.isAdmin && { label: t('me.admin'), icon: 'shield', to: '/admin' },
    isAgency && { label: t('me.agency'), icon: 'briefcase', to: '/agency' },
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl bg-gradient-to-br from-ink via-ink to-brand-dark p-4 text-white shadow-lg sm:p-5">
        <div className={`${glass} flex items-center justify-between gap-3 p-3`}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Icon name="user" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold">{user.username}</p>
              <p className="text-sm text-white/70">{t('dash.account')}</p>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {t('dash.connected')}
              </span>
            </div>
          </div>
          <button onClick={logout} aria-label={t('nav.logout')} title={t('nav.logout')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20">
            <Icon name="logout" />
          </button>
        </div>

        <nav aria-label={t('nav.menuLabel')} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((tile) => {
            const inner = (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-gold">
                  <Icon name={tile.icon} />
                </span>
                <span className="mt-2 text-sm font-semibold">{tile.label}</span>
                {tile.active && <span className="mt-2 h-0.5 w-6 rounded bg-gold" />}
              </>
            )
            const base = `${glass} flex min-h-[7rem] flex-col items-center justify-center p-3 text-center`
            return tile.to ? (
              <Link key={tile.label} to={tile.to} className={`${base} hover:bg-white/15`}>{inner}</Link>
            ) : (
              <div key={tile.label} aria-current="page" className={`${base} ring-gold/60`}>{inner}</div>
            )
          })}
        </nav>

        <section className={`${glass} p-4`}>
          <header className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-gold">
              <Icon name="chart" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-gold">{t('dash.tab.dashboard')}</p>
              <h1 className="break-words text-xl font-bold">{t('dash.welcome', { name: user.username })}</h1>
              <p className="text-sm text-white/70">{t('dash.sub')}</p>
            </div>
          </header>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="flex items-center gap-2 text-sm text-white/70"><Icon name="building" size={16} />{t('dash.listings')}</p>
              <p className="mt-1 text-3xl font-bold">{mine.length}</p>
            </div>
            <Link to="/commissions" className="flex items-center justify-between rounded-xl bg-white/10 p-4 hover:bg-white/15">
              <div>
                <p className="flex items-center gap-2 text-sm text-white/70"><Icon name="percent" size={16} />{t('dash.commissionDue')}</p>
                <p className="mt-1 text-3xl font-bold text-gold">{money(due)}</p>
              </div>
              <Icon name="arrow" className="text-gold" />
            </Link>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Link to="/reservations" className="flex items-center justify-between rounded-xl bg-white/10 p-4 hover:bg-white/15">
              <span className="flex items-center gap-2 text-sm text-white/70"><Icon name="bell" size={16} />{t('dash.requests')}</span>
              <span className="text-2xl font-bold">{newRequests}</span>
            </Link>
            <div className="flex items-center justify-between rounded-xl bg-white/10 p-4">
              <span className="flex items-center gap-2 text-sm text-white/70"><Icon name="check" size={16} />{t('dash.reserved')}</span>
              <span className="text-2xl font-bold">{reservedCount}</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-white/10 p-4">
              <span className="flex items-center gap-2 text-sm text-white/70"><Icon name="calendar" size={16} />{t('dash.memberSince')}</span>
              <span className="text-right text-sm font-semibold">{user.createdAt ? formatDate(user.createdAt, locale) : '—'}</span>
            </div>
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold">{t('me.myListings', { n: mine.length })}</h2>
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
