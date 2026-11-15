import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`

  return (
    <header className="bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-bold">ទីផ្សារផ្ទះ</Link>
        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={linkClass}>ទំព័រដើម</NavLink>
          {user ? (
            <>
              <span className="px-2 text-sm text-white/70">{user.username}</span>
              <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">ចាកចេញ</button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>ចូលគណនី</NavLink>
          )}
          <Link to="/post" className="btn-gold ml-2 !py-1.5 text-sm">ផ្សាយអចលនទ្រព្យ</Link>
        </nav>
      </div>
    </header>
  )
}
