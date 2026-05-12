'use client'
import { useI18n } from '@/context/I18nContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  return (
    <div className="flex items-center gap-1 text-sm border border-gray-200 rounded-lg overflow-hidden">
      {(['en', 'fr'] as const).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 font-medium transition-colors ${
            lang === l ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
