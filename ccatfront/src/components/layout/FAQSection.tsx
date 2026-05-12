'use client'
import FAQAccordion from '@/components/ui/FAQAccordion'
import { useI18n } from '@/context/I18nContext'

export default function FAQSection() {
  const { t } = useI18n()
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
          {t.faq.title}
        </h2>
        <FAQAccordion items={t.faq.items} />
      </div>
    </section>
  )
}
