'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import LeftPanel from '@/components/auth/LeftPanel'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import ForgotForm from '@/components/auth/ForgotForm'
import OtpForm from '@/components/auth/OtpForm'
import ResetForm from '@/components/auth/ResetForm'
import { authService } from '@/lib/authService'
import type { AuthView } from '@/components/auth/types'

export default function LoginPage() {
  const router = useRouter()
  const [view, setView] = useState<AuthView>('login')
  const [registerEmail, setRegisterEmail] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendCountdown, setResendCountdown] = useState(0)

  useEffect(() => {
    if (resendCountdown <= 0) return
    const t = setInterval(() => setResendCountdown(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [resendCountdown])

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
  }

  const handleOtpKey = (
    i: number,
    e: React.KeyboardEvent,
    refs: React.RefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
    else if (otp[i] && i < 5) refs.current[i + 1]?.focus()
  }

  const startOtpFlow = (nextView: AuthView) => {
    setOtp(['', '', '', '', '', ''])
    setResendCountdown(30)
    setView(nextView)
  }

  // OTP submit handler: verify email after registration
  const handleVerifyEmail = async (code: string) => {
    await authService.verifyEmail(registerEmail, code)
    setView('login')
  }

  // OTP submit handler: validate code then go to reset form
  const handleValidateResetOtp = async (_code: string) => {
    // backend validates OTP on reset-password, so just navigate
    setView('reset')
  }

  // Resend handlers
  const handleResendVerification = async () => {
    await authService.resendVerification(registerEmail)
    setResendCountdown(30)
  }

  const handleResendReset = async () => {
    await authService.forgotPassword(resetEmail)
    setResendCountdown(30)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start lg:items-center justify-center p-4 py-10 lg:p-6">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex overflow-hidden">
        <LeftPanel />

        <div className="flex-1 p-7 sm:p-10 flex flex-col gap-5 min-w-0">
          {view === 'login' && (
            <LoginForm
              onNavigate={setView}
              onSubmit={(role) => router.push(role === 'ADMIN' ? '/admin' : '/dashboard')}
            />
          )}
          {view === 'register' && (
            <RegisterForm
              onNavigate={setView}
              onSubmit={(email) => {
                setRegisterEmail(email)
                startOtpFlow('verify')
              }}
            />
          )}
          {view === 'verify' && (
            <OtpForm
              email={registerEmail}
              otp={otp}
              resendCountdown={resendCountdown}
              onOtpChange={handleOtpChange}
              onOtpKey={handleOtpKey}
              onResend={handleResendVerification}
              onNavigate={setView}
              onSubmit={handleVerifyEmail}
              backView="register"
            />
          )}
          {view === 'forgot' && (
            <ForgotForm
              email={resetEmail}
              onEmailChange={setResetEmail}
              onNavigate={setView}
              onSubmit={() => startOtpFlow('otp')}
            />
          )}
          {view === 'otp' && (
            <OtpForm
              email={resetEmail}
              otp={otp}
              resendCountdown={resendCountdown}
              onOtpChange={handleOtpChange}
              onOtpKey={handleOtpKey}
              onResend={handleResendReset}
              onNavigate={setView}
              onSubmit={handleValidateResetOtp}
              backView="forgot"
            />
          )}
          {view === 'reset' && (
            <ResetForm
              email={resetEmail}
              otp={otp.join('')}
              onSubmit={() => setView('login')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
