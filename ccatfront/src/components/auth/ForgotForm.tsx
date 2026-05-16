'use client'
import { useState } from 'react'
import { ArrowRight, ChevronLeft, Loader2 } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { authService } from '@/lib/authService'
import type { AuthView } from './types'

type Props = {
  email: string
  onEmailChange: (v: string) => void
  onNavigate: (v: AuthView) => void
  onSubmit: () => void
}

export default function ForgotForm({ email, onEmailChange, onNavigate, onSubmit }: Props) {
  const { t } = useI18n()
  const l = t.login
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      onSubmit()
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed to send reset email'
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" onClick={() => onNavigate('login')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">
        <ChevronLeft size={15} /> {l.backToLogin}
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{l.titleForgot}</h1>
        <p className="text-sm text-gray-500 mt-1">{l.subtitleForgot}</p>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{l.email}</label>
          <input
            type="email" required
            placeholder={l.placeholderEmail}
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <>{l.submitForgot} <ArrowRight size={15} /></>}
        </button>
      </form>
    </>
  )
}
