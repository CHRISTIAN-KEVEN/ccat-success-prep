'use client'
import { Activity } from 'lucide-react'
import Button from '@/components/ui/Button'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useI18n } from '@/context/I18nContext'

export default function Navbar() {
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-gray-900">
          <Activity size={20} className="text-blue-600" />
          CCAT Pro
        </a>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900 px-2">
            {t.nav.login}
          </button>
          <Button variant="primary" className="text-sm px-4 py-2">
            {t.nav.startFree}
          </Button>
        </div>
      </div>
    </header>
  )
}
