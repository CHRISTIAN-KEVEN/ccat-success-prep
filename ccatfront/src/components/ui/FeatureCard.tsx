import { Timer, BarChart2, Target, Zap, ShieldCheck, Globe } from 'lucide-react'

const icons: Record<string, React.ElementType> = {
  timer: Timer,
  chart: BarChart2,
  target: Target,
  bolt: Zap,
  shield: ShieldCheck,
  globe: Globe,
}

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const Icon = icons[icon] ?? Target
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  )
}
