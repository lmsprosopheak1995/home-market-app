import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { LANGUAGES } from '../i18n/translations'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { t, lang, setLang } = useI18n()
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`

  return (
    <header className="bg-ink pt-[env(safe-area-inset-top)] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="shrink-0 text-lg font-bold">{t('brand')}</Link>
        <nav className="flex flex-wrap items-center justify-end gap-1">
          <NavLink to="/" end className={(s) => `hidden md:inline-block ${linkClass(s)}`}>{t('nav.home')}</NavLink>
          <NavLink to="/market" className={(s) => `hidden md:inline-block ${linkClass(s)}`}>{t('nav.market')}</NavLink>
          {user ? (
            <>
              <Link to="/me" className="px-2 text-sm text-white/80 hover:underline">{user.username}</Link>
              <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">{t('nav.logout')}</button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>{t('nav.login')}</NavLink>
          )}
          <select
            aria-label={t('lang.label')}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="min-h-[40px] max-w-[9rem] rounded-lg border border-white/25 bg-ink px-2 py-1.5 text-sm text-white"
          >
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <Link to="/post" className="btn-gold ml-1 hidden !py-1.5 text-sm sm:inline-flex">{t('nav.post')}</Link>
        </nav>
      </div>
    </header>
  )
}
