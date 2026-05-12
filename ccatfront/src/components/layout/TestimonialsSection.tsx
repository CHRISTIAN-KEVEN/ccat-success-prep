'use client'
import TestimonialCard from '@/components/ui/TestimonialCard'
import { useI18n } from '@/context/I18nContext'
import { FadeUp, Stagger, StaggerItem } from '@/components/ui/Motion'

export default function TestimonialsSection() {
  const { t } = useI18n()
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.testimonials.title}</h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {t.testimonials.items.map((item, i) => (
            <StaggerItem key={i}>
              <TestimonialCard
                quote={item.quote}
                name={item.name}
                role={item.role}
                percentile={item.percentile}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
