'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Info, Loader2 } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { authService } from '@/lib/authService'
import type { AuthView } from './types'

type Props = {
  onNavigate: (v: AuthView) => void
  onSubmit: (email: string) => void
}

export default function RegisterForm({ onNavigate, onSubmit }: Props) {
  const { t } = useI18n()
  const l = t.login

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.register(email, password, firstName, lastName)
      onSubmit(email)
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed to create account'
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{l.titleCreate}</h1>
        <p className="text-sm text-gray-500 mt-1">{l.subtitleCreate}</p>
      </div>

      <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm font-medium">
        <button type="button" onClick={() => onNavigate('login')} className="flex-1 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors">{l.tabLogin}</button>
        <button type="button" className="flex-1 py-2.5 bg-gray-900 text-white">{l.tabCreate}</button>
      </div>

      <div className="flex flex-col gap-3">
        <button className="w-full flex items-center justify-center gap-2 bg-[#117db8] hover:bg-[#0f6ea2] text-white font-semibold text-sm py-3 rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          {l.linkedin}
        </button>
        <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-3 rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {l.google}
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="flex-1 h-px bg-gray-200" /><span>{l.orEmail}</span><div className="flex-1 h-px bg-gray-200" />
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{l.firstName}</label>
            <input type="text" required placeholder={l.placeholderFirst} value={firstName} onChange={e => setFirstName(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{l.lastName}</label>
            <input type="text" required placeholder={l.placeholderLast} value={lastName} onChange={e => setLastName(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{l.email}</label>
          <input type="email" required placeholder={l.placeholderEmail} value={email} onChange={e => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{l.password}</label>
          <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          <p className="text-xs text-gray-400">{l.passwordHint}</p>
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
          <Info size={13} className="text-gray-400 shrink-0 mt-0.5" />
          <p>
            {l.terms}{' '}
            <a href="#" className="text-blue-600 underline underline-offset-2">{l.termsLink}</a>{' '}
            {l.termsAnd}{' '}
            <a href="#" className="text-blue-600 underline underline-offset-2">{l.privacyLink}</a>.{' '}
            {l.termsSuffix}
          </p>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <>{l.submitCreate} <ArrowRight size={15} /></>}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        {l.pricingLink}{' '}
        <Link href="/" className="text-blue-600 font-semibold hover:underline">{l.pricingCta}</Link>
      </p>
    </>
  )
}
