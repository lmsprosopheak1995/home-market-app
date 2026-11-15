import { Link, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import PropertyDetail from './pages/PropertyDetail.jsx'
import PostProperty from './pages/PostProperty.jsx'
import Market from './pages/Market.jsx'
import Me from './pages/Me.jsx'
import BottomNav from './components/BottomNav.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import RequireAuth from './components/RequireAuth.jsx'

function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-2xl font-bold">រកមិនឃើញទំព័រនេះទេ</h1>
      <p className="mt-2 text-ink/70">តំណភ្ជាប់អាចខុស ឬទំព័រត្រូវបានលុប។</p>
      <Link to="/" className="btn-primary mt-6">ត្រឡប់ទៅទំព័រដើម</Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:pb-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/me" element={<Me />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/post" element={<RequireAuth><PostProperty /></RequireAuth>} />
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
