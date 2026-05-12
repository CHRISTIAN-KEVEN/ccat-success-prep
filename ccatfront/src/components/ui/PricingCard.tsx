import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import Badge from './Badge'
import Button from './Button'

interface PricingFeature {
  included: boolean
  text: string
}

interface PricingCardProps {
  name: string
  description: string
  price: string
  period: string
  cta: string
  features: PricingFeature[]
  recommended?: boolean
  recommendedLabel?: string
}

export default function PricingCard({
  name, description, price, period, cta, features, recommended, recommendedLabel,
}: PricingCardProps) {
  return (
    <div className={`relative bg-white rounded-2xl border flex flex-col gap-4 sm:gap-5
      p-6 sm:p-8
      ${recommended ? 'border-blue-400 shadow-lg mt-4 sm:mt-0' : 'border-gray-200'}`}
    >
      {recommended && recommendedLabel && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <Badge variant="recommended">{recommendedLabel}</Badge>
        </div>
      )}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl sm:text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-500 mb-1 text-sm">{period}</span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            {f.included
              ? <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
              : <XCircle size={16} className="text-gray-300 shrink-0" />}
            {f.text}
          </li>
        ))}
      </ul>
      <Link href="/login" className="mt-auto">
        <Button variant={recommended ? 'primary' : 'outline'} className="w-full min-h-[48px]">
          {cta}
        </Button>
      </Link>
    </div>
  )
}
