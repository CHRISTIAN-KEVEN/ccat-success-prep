import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  children: ReactNode
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
