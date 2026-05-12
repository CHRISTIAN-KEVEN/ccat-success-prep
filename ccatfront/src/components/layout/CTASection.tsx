'use client'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useI18n } from '@/context/I18nContext'

export default function CTASection() {
  const { t } = useI18n()
  return (
    <section className="bg-blue-600 py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white flex flex-col items-center gap-5 sm:gap-6">
        <h2 className="text-2xl sm:text-3xl font-bold">{t.cta.title}</h2>
        <p className="text-blue-100 max-w-md leading-relaxed text-sm sm:text-base">{t.cta.subtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-gray-900 font-semibold px-6 py-3 min-h-[48px]">
              {t.cta.primary}
            </Button>
          </Link>
          <button className="flex items-center gap-2 text-white font-semibold text-sm min-h-[48px] px-2 hover:underline">
            <ExternalLink size={16} />{t.cta.linkedin}
          </button>
        </div>
      </div>
    </section>
  )
}
