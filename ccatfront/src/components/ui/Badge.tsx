import { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'announcement' | 'percentile' | 'recommended'
  children: ReactNode
}

export default function Badge({ variant = 'announcement', children }: BadgeProps) {
  const variants = {
    announcement: 'bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1 rounded-full',
    percentile: 'bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium',
    recommended: 'bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold',
  }
  return <span className={variants[variant]}>{children}</span>
}
