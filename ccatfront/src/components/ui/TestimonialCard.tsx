import Badge from './Badge'

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  percentile: string
  avatarUrl?: string
}

export default function TestimonialCard({ quote, name, role, percentile, avatarUrl }: TestimonialCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('')
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
      <p className="text-sm text-gray-700 leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-3 mt-auto">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center justify-center shrink-0">
            {initials}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
          <Badge variant="percentile">{percentile}</Badge>
        </div>
      </div>
    </div>
  )
}
