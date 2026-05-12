'use client'
import PricingCard from '@/components/ui/PricingCard'
import { useI18n } from '@/context/I18nContext'

export default function PricingSection() {
  const { t } = useI18n()
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{t.pricing.title}</h2>
          <p className="text-gray-500 mt-3">{t.pricing.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 items-start">
          {t.pricing.plans.map((plan, i) => (
            <PricingCard
              key={i}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              cta={plan.cta}
              features={plan.features}
              recommended={'recommended' in plan ? plan.recommended : false}
              recommendedLabel={t.pricing.recommended}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
