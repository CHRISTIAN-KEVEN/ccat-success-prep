'use client'
import { ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useI18n } from '@/context/I18nContext'

export default function CTASection() {
  const { t } = useI18n()
  return (
    <section className="bg-blue-600 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center text-white flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold">{t.cta.title}</h2>
        <p className="text-blue-100 max-w-md leading-relaxed">{t.cta.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="text-gray-900 font-semibold px-6 py-3">
            {t.cta.primary}
          </Button>
          <button className="flex items-center gap-2 text-white font-semibold text-sm hover:underline">
            <ExternalLink size={18} />{t.cta.linkedin}
          </button>
        </div>
      </div>
    </section>
  )
}
