'use client'
import TestimonialCard from '@/components/ui/TestimonialCard'
import { useI18n } from '@/context/I18nContext'

export default function TestimonialsSection() {
  const { t } = useI18n()
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t.testimonials.title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.testimonials.items.map((item, i) => (
            <TestimonialCard
              key={i}
              quote={item.quote}
              name={item.name}
              role={item.role}
              percentile={item.percentile}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
