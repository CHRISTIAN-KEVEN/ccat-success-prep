import { ArrowRight, ChevronLeft } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
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

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
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
        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          {l.submitForgot} <ArrowRight size={15} />
        </button>
      </form>
    </>
  )
}
