import { useI18n } from '../hooks/useI18n.jsx'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-5 text-sm text-ink/60">
        © {new Date().getFullYear()} {t('brand')} — {t('footer.tagline')}
      </div>
    </footer>
  )
}
