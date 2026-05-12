'use client'
import FeatureCard from '@/components/ui/FeatureCard'
import { useI18n } from '@/context/I18nContext'
import { FadeUp, Stagger, StaggerItem } from '@/components/ui/Motion'

export default function FeaturesSection() {
  const { t } = useI18n()
  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.features.title}</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">{t.features.subtitle}</p>
        </FadeUp>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {t.features.items.map((item, i) => (
            <StaggerItem key={i}>
              <FeatureCard icon={item.icon} title={item.title} description={item.description} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
