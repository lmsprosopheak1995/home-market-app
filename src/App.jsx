import { Link, Route, Routes } from 'react-router-dom'
import { useI18n } from './hooks/useI18n.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import PropertyDetail from './pages/PropertyDetail.jsx'
import PostProperty from './pages/PostProperty.jsx'
import Market from './pages/Market.jsx'
import Me from './pages/Me.jsx'
import BottomNav from './components/BottomNav.jsx'
import Verify from './pages/Verify.jsx'
import Admin from './pages/Admin.jsx'
import Agency from './pages/Agency.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import Reservations from './pages/Reservations.jsx'
import Commissions from './pages/Commissions.jsx'
import Promote from './pages/Promote.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import RequireAuth from './components/RequireAuth.jsx'

function NotFound() {
  const { t } = useI18n()
  return (
    <div className="py-24 text-center">
      <h1 className="text-2xl font-bold">{t('notFound.title')}</h1>
      <p className="mt-2 text-ink/70">{t('notFound.desc')}</p>
      <Link to="/" className="btn-primary mt-6">{t('notFound.back')}</Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/me" element={<Me />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/post" element={<RequireAuth><PostProperty /></RequireAuth>} />
          <Route path="/verify" element={<RequireAuth><Verify /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/agency" element={<RequireAuth><Agency /></RequireAuth>} />
          <Route path="/reservations" element={<RequireAuth><Reservations /></RequireAuth>} />
          <Route path="/commissions" element={<RequireAuth><Commissions /></RequireAuth>} />
          <Route path="/promote" element={<RequireAuth><Promote /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
