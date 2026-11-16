import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'

// ចំណាំ៖ នេះគ្រាន់តែលាក់ UI ។ សុវត្ថិភាពពិតមកពី RLS ក្នុង Supabase (មើល README)
export default function RequireAdmin({ children }) {
  const { user, ready } = useAuth()
  const { t } = useI18n()
  if (!ready) return <p className="py-10 text-center text-ink/60">{t('common.loading')}</p>
  if (!user?.isAdmin) return <Navigate to="/" replace />
  return children
}
