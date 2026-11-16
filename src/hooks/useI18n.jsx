import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { LANGUAGES, translations } from '../i18n/translations'

const KEY = 'home-market:lang'
const I18nContext = createContext(null)

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY)
    if (LANGUAGES.some((l) => l.code === saved)) return saved
  } catch {
    /* ignore */
  }
  return 'km'
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  const t = useCallback(
    (key, vars) => {
      let s = translations[lang]?.[key] ?? translations.en[key] ?? translations.km[key] ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
      return s
    },
    [lang]
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t('meta.title')
  }, [lang, t])

  const setLang = (code) => {
    setLangState(code)
    try {
      localStorage.setItem(KEY, code)
    } catch {
      /* ignore */
    }
  }

  const locale = LANGUAGES.find((l) => l.code === lang)?.locale ?? 'en-GB'

  return <I18nContext.Provider value={{ lang, setLang, t, locale }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n ត្រូវប្រើក្នុង <I18nProvider>')
  return ctx
}
