'use client'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useI18n } from '@/context/I18nContext'
import { ScaleIn, FadeUp } from '@/components/ui/Motion'

export default function CTASection() {
  const { t } = useI18n()
  return (
    <section className="bg-blue-600 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white flex flex-col items-center gap-5 sm:gap-6">
        <ScaleIn>
          <h2 className="text-2xl sm:text-3xl font-bold">{t.cta.title}</h2>
        </ScaleIn>

        <FadeUp delay={0.1}>
          <p className="text-blue-100 max-w-md leading-relaxed text-sm sm:text-base">{t.cta.subtitle}</p>
        </FadeUp>

        <FadeUp delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-gray-900 font-semibold px-6 py-3 min-h-12">
              {t.cta.primary}
            </Button>
          </Link>
          <button className="flex items-center gap-2 text-white font-semibold text-sm min-h-12 px-2 hover:underline">
            <ExternalLink size={16} />{t.cta.linkedin}
          </button>
        </FadeUp>
      </div>
    </section>
  )
}
