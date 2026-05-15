'use client'
import { useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, Loader2, Mail } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import type { AuthView } from './types'

type Props = {
  email: string
  otp: string[]
  resendCountdown: number
  onOtpChange: (i: number, val: string) => void
  onOtpKey: (i: number, e: React.KeyboardEvent, refs: React.RefObject<(HTMLInputElement | null)[]>) => void
  onResend: () => Promise<void>
  onNavigate: (v: AuthView) => void
  onSubmit: (otp: string) => Promise<void>
  backView: AuthView
}

export default function OtpForm({ email, otp, resendCountdown, onOtpChange, onOtpKey, onResend, onNavigate, onSubmit, backView }: Props) {
  const { t } = useI18n()
  const l = t.login
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit(otp.join(''))
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Code invalide'
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await onResend()
    } catch {
      // silent
    }
  }

  return (
    <>
      <button type="button" onClick={() => onNavigate(backView)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">
        <ChevronLeft size={15} /> Back
      </button>

      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
          <Mail size={22} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          {l.forgotHelper}
          {email && <><br /><span className="font-medium text-gray-700">{email}</span></>}
        </p>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 text-center">Enter verification code</label>
          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { refs.current[i] = el }}
                type="text" inputMode="numeric" maxLength={1}
                value={digit}
                onChange={e => onOtpChange(i, e.target.value)}
                onKeyDown={e => onOtpKey(i, e, refs)}
                className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl focus:outline-none focus:border-blue-500 transition border-gray-200"
              />
            ))}
          </div>
        </div>
        <button type="submit" disabled={otp.some(d => !d) || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <>Verify code <ArrowRight size={15} /></>}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Didn&apos;t receive the code?{' '}
        {resendCountdown > 0
          ? <span className="text-gray-400">Resend in {resendCountdown}s</span>
          : <button type="button" onClick={handleResend} className="text-blue-600 font-semibold hover:underline">Resend</button>
        }
      </p>
    </>
  )
}
