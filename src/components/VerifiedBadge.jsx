import { useI18n } from '../hooks/useI18n.jsx'
import { useVerified } from '../hooks/useVerified.jsx'
import Icon from './Icon.jsx'

export default function VerifiedBadge({ owner, className = '' }) {
  const { t } = useI18n()
  const { isVerified } = useVerified()
  if (!isVerified(owner)) return null
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark ${className}`}>
      <Icon name="check" size={12} />
      {t('verified.badge')}
    </span>
  )
}
