import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOCATIONS, PROPERTY_TYPES, PURPOSES } from '../data/options'
import { useProperties } from '../hooks/useProperties.jsx'
import { resizeImage } from '../lib/image'

const INITIAL = {
  title: '',
  purpose: 'លក់',
  type: 'ផ្ទះ',
  price: '',
  location: 'ភ្នំពេញ',
  bedrooms: '',
  bathrooms: '',
  area: '',
  phone: '',
  description: '',
  image: '',
}

function validate(f) {
  const e = {}
  if (f.title.trim().length < 5) e.title = 'ចំណងជើងត្រូវមានយ៉ាងតិច ៥ តួអក្សរ'
  if (!(Number(f.price) > 0)) e.price = 'សូមបញ្ចូលតម្លៃជាលេខធំជាង 0'
  if (!(Number(f.area) > 0)) e.area = 'សូមបញ្ចូលទំហំជាលេខធំជាង 0'
  if (!/^0\d{8,9}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'លេខទូរស័ព្ទមិនត្រឹមត្រូវ (ឧ. 012345678)'
  if (f.description.trim().length < 20) e.description = 'ការពិពណ៌នាត្រូវមានយ៉ាងតិច ២០ តួអក្សរ'
  if (!f.image) e.image = 'សូមបញ្ចូលរូបភាពយ៉ាងតិចមួយ'
  return e
}

function Err({ message }) {
  return message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null
}

export default function PostProperty() {
  const { addProperty } = useProperties()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const image = await resizeImage(file)
      setForm((f) => ({ ...f, image }))
      setErrors((er) => ({ ...er, image: undefined }))
    } catch (err) {
      setErrors((er) => ({ ...er, image: err.message }))
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const created = await addProperty({
        title: form.title.trim(),
        purpose: form.purpose,
        type: form.type,
        price: Number(form.price),
        location: form.location,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area),
        phone: form.phone.replace(/\s/g, ''),
        description: form.description.trim(),
        image: form.image,
      })
      navigate(`/property/${created.id}`)
    } catch (err) {
      setSubmitError('ផ្សាយមិនបានសម្រេច៖ ' + err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">ផ្សាយអចលនទ្រព្យ</h1>
      <p className="mt-1 text-ink/70">បំពេញព័ត៌មានខាងក្រោម ហើយចុច «ផ្សាយឥឡូវនេះ»។</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5 rounded-xl border border-line bg-white p-5">
        <div>
          <label htmlFor="title" className="label">ចំណងជើង</label>
          <input id="title" className="field" value={form.title} onChange={set('title')} placeholder="ឧ. ផ្ទះវីឡា ២ ជាន់ ជិតសួនច្បារ" />
          <Err message={errors.title} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="purpose" className="label">លក់ ឬជួល</label>
            <select id="purpose" className="field" value={form.purpose} onChange={set('purpose')}>
              {PURPOSES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="label">ប្រភេទ</label>
            <select id="type" className="field" value={form.type} onChange={set('type')}>
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="label">
              តម្លៃ ($){form.purpose === 'ជួល' && ' ក្នុងមួយខែ'}
            </label>
            <input id="price" type="number" min="0" className="field" value={form.price} onChange={set('price')} />
            <Err message={errors.price} />
          </div>
          <div>
            <label htmlFor="location" className="label">ទីតាំង</label>
            <select id="location" className="field" value={form.location} onChange={set('location')}>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="bedrooms" className="label">បន្ទប់គេង</label>
            <input id="bedrooms" type="number" min="0" className="field" value={form.bedrooms} onChange={set('bedrooms')} />
          </div>
          <div>
            <label htmlFor="bathrooms" className="label">បន្ទប់ទឹក</label>
            <input id="bathrooms" type="number" min="0" className="field" value={form.bathrooms} onChange={set('bathrooms')} />
          </div>
          <div>
            <label htmlFor="area" className="label">ទំហំ (ម²)</label>
            <input id="area" type="number" min="0" className="field" value={form.area} onChange={set('area')} />
            <Err message={errors.area} />
          </div>
          <div>
            <label htmlFor="phone" className="label">លេខទូរស័ព្ទ</label>
            <input id="phone" type="tel" className="field" value={form.phone} onChange={set('phone')} placeholder="012345678" />
            <Err message={errors.phone} />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">ពិពណ៌នា</label>
          <textarea id="description" rows={5} className="field" value={form.description} onChange={set('description')} placeholder="ប្រាប់អំពីស្ថានភាព ផ្លូវ ជិតអ្វី និងអ្វីដែលរួមបញ្ចូល" />
          <Err message={errors.description} />
        </div>

        <div>
          <label htmlFor="image" className="label">រូបភាព</label>
          <input id="image" type="file" accept="image/*" onChange={onImage} className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:font-medium file:text-brand" />
          <Err message={errors.image} />
          {form.image && <img src={form.image} alt="មើលរូបភាពជាមុន" className="mt-3 aspect-[4/3] w-full max-w-xs rounded-lg object-cover" />}
        </div>

        {submitError && <p className="rounded-lg bg-red-50 p-3 text-red-700">{submitError}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'កំពុងផ្សាយ…' : 'ផ្សាយឥឡូវនេះ'}
        </button>
      </form>
    </div>
  )
}
