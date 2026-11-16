import { NavLink } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n.jsx'

const icons = {
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V11z',
  market: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  plus: 'M12 5v14M5 12h14',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
}

const items = [
  { to: '/', label: 'nav.home', icon: 'home', end: true },
  { to: '/market', label: 'nav.market', icon: 'market' },
  { to: '/post', label: 'nav.postShort', icon: 'plus' },
  { to: '/me', label: 'nav.me', icon: 'user' },
]

export default function BottomNav() {
  const { t } = useI18n()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label={t('nav.menuLabel')}>
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium ${isActive ? 'text-brand' : 'text-ink/60'}`
              }
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={icons[icon]} />
              </svg>
              {t(label)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
