import { LOCATIONS, PROPERTY_TYPES, PURPOSES } from '../data/options'

export default function SearchFilter({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })

  return (
    <div className="grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-4">
        <label htmlFor="q" className="label">ស្វែងរក</label>
        <input
          id="q"
          className="field"
          placeholder="ឧ. ផ្ទះវីឡា ជិតសួនច្បារ"
          value={filters.q}
          onChange={set('q')}
        />
      </div>
      <div>
        <label htmlFor="purpose" className="label">ប្រភេទប្រតិបត្តិការ</label>
        <select id="purpose" className="field" value={filters.purpose} onChange={set('purpose')}>
          <option value="">ទាំងអស់</option>
          {PURPOSES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="type" className="label">ប្រភេទអចលនទ្រព្យ</label>
        <select id="type" className="field" value={filters.type} onChange={set('type')}>
          <option value="">ទាំងអស់</option>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="location" className="label">ទីតាំង</label>
        <select id="location" className="field" value={filters.location} onChange={set('location')}>
          <option value="">ទាំងអស់</option>
          {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="maxPrice" className="label">តម្លៃអតិបរមា ($)</label>
        <input
          id="maxPrice"
          type="number"
          min="0"
          className="field"
          placeholder="គ្មានកំណត់"
          value={filters.maxPrice}
          onChange={set('maxPrice')}
        />
      </div>
    </div>
  )
}
