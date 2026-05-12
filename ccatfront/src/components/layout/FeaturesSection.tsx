'use client'
import FeatureCard from '@/components/ui/FeatureCard'
import { useI18n } from '@/context/I18nContext'

export default function FeaturesSection() {
  const { t } = useI18n()
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{t.features.title}</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">{t.features.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.features.items.map((item, i) => (
            <FeatureCard key={i} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
