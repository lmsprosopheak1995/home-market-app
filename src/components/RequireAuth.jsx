import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'

export default function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  const { t } = useI18n()
  const location = useLocation()
  if (!ready) return <p className="py-10 text-center text-ink/60">{t('common.loading')}</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
