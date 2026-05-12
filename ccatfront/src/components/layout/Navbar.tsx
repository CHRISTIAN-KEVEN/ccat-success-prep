'use client'
import { useState } from 'react'
import { Activity, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useI18n } from '@/context/I18nContext'

export default function Navbar() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
          <Activity size={20} className="text-blue-600" />
          CCAT Pro
        </Link>

        {/* Desktop — medium+ */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 min-h-[44px] flex items-center px-2 transition-colors"
          >
            {t.nav.login}
          </Link>
          <Link href="/login">
            <Button variant="primary" className="text-sm px-4 py-2.5 min-h-[44px]">
              {t.nav.startFree}
            </Button>
          </Link>
        </div>

        {/* Mobile — compact */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 flex flex-col gap-2">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-gray-700 min-h-[48px] flex items-center px-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t.nav.login}
          </Link>
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button variant="primary" className="w-full min-h-[48px] text-sm">
              {t.nav.startFree}
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
