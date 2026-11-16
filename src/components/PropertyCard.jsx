import { Link } from 'react-router-dom'
import { LOCATIONS, PROPERTY_TYPES, PURPOSES, optionLabel } from '../data/options'
import VerifiedBadge from './VerifiedBadge.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
import { formatPrice, isFeatured } from '../lib/format'

export default function PropertyCard({ property }) {
  const { t } = useI18n()
  const { id, title, type, purpose, price, location, bedrooms, bathrooms, area, image } = property
  const isRent = purpose === 'ជួល'

  return (
    <Link
      to={`/property/${id}`}
      className="group block overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-sm font-semibold ${
            isRent ? 'bg-gold text-ink' : 'bg-brand text-white'
          }`}
        >
          {optionLabel(t, 'purpose', PURPOSES, purpose)}
        </span>
        {property.reserved && (
          <span className="absolute bottom-3 left-3 rounded-md bg-ink/85 px-2 py-0.5 text-sm font-semibold text-white">
            {t('badge.reserved')}
          </span>
        )}
        {isFeatured(property) && (
          <span className="absolute right-3 top-3 rounded-md bg-ink px-2 py-0.5 text-sm font-semibold text-gold">
            {t('badge.featured')}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xl font-bold text-brand">{formatPrice(price, purpose, t('price.perMonth'))}</p>
        <h3 className="mt-1 line-clamp-1 font-semibold">{title}</h3>
        <VerifiedBadge owner={property.owner} className="mt-0.5" />
        <p className="text-sm text-ink/60">
          {optionLabel(t, 'type', PROPERTY_TYPES, type)} · {optionLabel(t, 'loc', LOCATIONS, location)}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-sm text-ink/80">
          {bedrooms > 0 && <span>{t('card.bedrooms', { n: bedrooms })}</span>}
          {bathrooms > 0 && <span>{t('card.bathrooms', { n: bathrooms })}</span>}
          <span>{area} m²</span>
        </div>
      </div>
    </Link>
  )
}
