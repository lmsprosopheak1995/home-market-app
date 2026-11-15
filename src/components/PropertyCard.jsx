import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'

export default function PropertyCard({ property }) {
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
          {purpose}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xl font-bold text-brand">{formatPrice(price, purpose)}</p>
        <h3 className="mt-1 line-clamp-1 font-semibold">{title}</h3>
        <p className="text-sm text-ink/60">
          {type} · {location}
        </p>
        <div className="mt-3 flex gap-4 border-t border-line pt-3 text-sm text-ink/80">
          {bedrooms > 0 && <span>{bedrooms} បន្ទប់គេង</span>}
          {bathrooms > 0 && <span>{bathrooms} បន្ទប់ទឹក</span>}
          <span>{area} ម²</span>
        </div>
      </div>
    </Link>
  )
}
