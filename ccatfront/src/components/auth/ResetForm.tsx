'use client'
import { useState } from 'react'
import { ArrowRight, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { authService } from '@/lib/authService'

type Props = {
  email: string
  otp: string
  onSubmit: () => void
}

export default function ResetForm({ email, otp, onSubmit }: Props) {
  const { t } = useI18n()
  const l = t.login
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.resetPassword(email, otp, newPassword)
      onSubmit()
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Erreur lors de la réinitialisation'
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
          <CheckCircle size={22} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create new password</h1>
        <p className="text-sm text-gray-500">Choose a strong password for your account.</p>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">New password</label>
          <div className="relative">
            <input type={showNew ? 'text' : 'password'} required minLength={8} placeholder="Min. 8 characters"
              value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            <button type="button" onClick={() => setShowNew(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p className="text-xs text-gray-400">{l.passwordHint}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Confirm new password</label>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} required minLength={8} placeholder="Repeat your password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            <button type="button" onClick={() => setShowConfirm(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <>Reset password <ArrowRight size={15} /></>}
        </button>
      </form>
    </>
  )
}
