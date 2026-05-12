'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import en from '@/data/locales/en.json'
import fr from '@/data/locales/fr.json'

type Lang = 'en' | 'fr'
type Translations = typeof en

const translations: Record<Lang, Translations> = { en, fr }

interface I18nContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
