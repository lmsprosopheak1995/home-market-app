import { LOCATIONS, PROPERTY_TYPES, PURPOSES, optionLabel } from '../data/options'
import { useI18n } from '../hooks/useI18n.jsx'

export default function SearchFilter({ filters, onChange }) {
  const { t } = useI18n()
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })

  return (
    <div className="grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-4">
        <label htmlFor="q" className="label">{t('filter.search')}</label>
        <input id="q" className="field" placeholder={t('filter.placeholder')} value={filters.q} onChange={set('q')} />
      </div>
      <div>
        <label htmlFor="purpose" className="label">{t('filter.purpose')}</label>
        <select id="purpose" className="field" value={filters.purpose} onChange={set('purpose')}>
          <option value="">{t('common.all')}</option>
          {PURPOSES.map((p) => <option key={p} value={p}>{optionLabel(t, 'purpose', PURPOSES, p)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="type" className="label">{t('filter.type')}</label>
        <select id="type" className="field" value={filters.type} onChange={set('type')}>
          <option value="">{t('common.all')}</option>
          {PROPERTY_TYPES.map((x) => <option key={x} value={x}>{optionLabel(t, 'type', PROPERTY_TYPES, x)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="location" className="label">{t('filter.location')}</label>
        <select id="location" className="field" value={filters.location} onChange={set('location')}>
          <option value="">{t('common.all')}</option>
          {LOCATIONS.map((l) => <option key={l} value={l}>{optionLabel(t, 'loc', LOCATIONS, l)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="maxPrice" className="label">{t('filter.maxPrice')}</label>
        <input id="maxPrice" type="number" min="0" className="field" placeholder={t('filter.noLimit')} value={filters.maxPrice} onChange={set('maxPrice')} />
      </div>
    </div>
  )
}
