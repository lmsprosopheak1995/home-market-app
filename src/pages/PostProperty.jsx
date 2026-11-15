import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOCATIONS, PROPERTY_TYPES, PURPOSES, optionLabel } from '../data/options'
import { useAuth } from '../hooks/useAuth.jsx'
import { useI18n } from '../hooks/useI18n.jsx'
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
  if (f.title.trim().length < 5) e.title = 'val.title'
  if (!(Number(f.price) > 0)) e.price = 'val.price'
  if (!(Number(f.area) > 0)) e.area = 'val.area'
  if (!/^0\d{8,9}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'val.phone'
  if (f.description.trim().length < 20) e.description = 'val.desc'
  if (!f.image) e.image = 'val.image'
  return e
}

function Err({ message }) {
  const { t } = useI18n()
  return message ? <p className="mt-1 text-sm text-red-600">{t(message)}</p> : null
}

export default function PostProperty() {
  const { t } = useI18n()
  const { addProperty } = useProperties()
  const { user } = useAuth()
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
        owner: user?.username ?? null,
      })
      navigate(`/property/${created.id}`)
    } catch (err) {
      setSubmitError(`${t('post.submitFail')}: ${err.message}`)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">{t('post.title')}</h1>
      <p className="mt-1 text-ink/70">{t('post.subtitle')}</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5 rounded-xl border border-line bg-white p-5">
        <div>
          <label htmlFor="title" className="label">{t('post.titleLabel')}</label>
          <input id="title" className="field" value={form.title} onChange={set('title')} placeholder={t('post.titlePlaceholder')} />
          <Err message={errors.title} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="purpose" className="label">{t('post.purposeLabel')}</label>
            <select id="purpose" className="field" value={form.purpose} onChange={set('purpose')}>
              {PURPOSES.map((p) => <option key={p} value={p}>{optionLabel(t, 'purpose', PURPOSES, p)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="label">{t('post.typeLabel')}</label>
            <select id="type" className="field" value={form.type} onChange={set('type')}>
              {PROPERTY_TYPES.map((x) => <option key={x} value={x}>{optionLabel(t, 'type', PROPERTY_TYPES, x)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="label">{form.purpose === 'ជួល' ? t('post.priceRent') : t('post.price')}</label>
            <input id="price" type="number" min="0" className="field" value={form.price} onChange={set('price')} />
            <Err message={errors.price} />
          </div>
          <div>
            <label htmlFor="location" className="label">{t('post.location')}</label>
            <select id="location" className="field" value={form.location} onChange={set('location')}>
              {LOCATIONS.map((l) => <option key={l} value={l}>{optionLabel(t, 'loc', LOCATIONS, l)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="bedrooms" className="label">{t('post.bedrooms')}</label>
            <input id="bedrooms" type="number" min="0" className="field" value={form.bedrooms} onChange={set('bedrooms')} />
          </div>
          <div>
            <label htmlFor="bathrooms" className="label">{t('post.bathrooms')}</label>
            <input id="bathrooms" type="number" min="0" className="field" value={form.bathrooms} onChange={set('bathrooms')} />
          </div>
          <div>
            <label htmlFor="area" className="label">{t('post.area')}</label>
            <input id="area" type="number" min="0" className="field" value={form.area} onChange={set('area')} />
            <Err message={errors.area} />
          </div>
          <div>
            <label htmlFor="phone" className="label">{t('post.phone')}</label>
            <input id="phone" type="tel" className="field" value={form.phone} onChange={set('phone')} placeholder="012345678" />
            <Err message={errors.phone} />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">{t('post.description')}</label>
          <textarea id="description" rows={5} className="field" value={form.description} onChange={set('description')} placeholder={t('post.descPlaceholder')} />
          <Err message={errors.description} />
        </div>

        <div>
          <label htmlFor="image" className="label">{t('post.image')}</label>
          <input id="image" type="file" accept="image/*" onChange={onImage} className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:font-medium file:text-brand" />
          <Err message={errors.image} />
          {form.image && <img src={form.image} alt={t('post.preview')} className="mt-3 aspect-[4/3] w-full max-w-xs rounded-lg object-cover" />}
        </div>

        {submitError && <p className="rounded-lg bg-red-50 p-3 text-red-700">{submitError}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? t('post.submitting') : t('post.submit')}
        </button>
      </form>
    </div>
  )
}
