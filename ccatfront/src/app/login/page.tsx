'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Activity, ArrowRight, BarChart2, Info, ShieldCheck, Zap } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

const iconMap: Record<string, React.ElementType> = {
  chart: BarChart2,
  bolt: Zap,
  shield: ShieldCheck,
}

/* ---------- Left panel ---------- */
function LeftPanel() {
  const { t } = useI18n()
  const l = t.login
  return (
    <div className="hidden lg:flex flex-col justify-between bg-slate-100 p-10 w-[360px] xl:w-[400px] shrink-0 rounded-l-2xl min-h-full">
      <div className="flex flex-col gap-7">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-sm">
          <Activity size={18} className="text-blue-600" />
          CCAT Pro
        </Link>

        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-widest text-blue-600 border border-blue-200 bg-blue-50 rounded-full px-3 py-1 w-fit">
            {l.leftBadge}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">{l.leftTitle}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{l.leftSubtitle}</p>
        </div>

        <ul className="flex flex-col gap-5">
          {l.leftFeatures.map((f, i) => {
            const Icon = iconMap[f.icon] ?? ShieldCheck
            return (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <Icon size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Trial card */}
      <div className="bg-white rounded-xl p-4 flex items-start gap-3 border border-slate-200 mt-8">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
          <Zap size={15} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-700">{l.trialBadge}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{l.trialDesc}</p>
          <p className="text-xs font-bold text-gray-800 mt-1">{l.trialNote}</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- Main page ---------- */
export default function LoginPage() {
  const { t } = useI18n()
  const l = t.login
  const router = useRouter()
  const [tab, setTab] = useState<'create' | 'login'>('login')

  return (
    <div className="min-h-screen bg-gray-50 flex items-start lg:items-center justify-center p-4 py-10 lg:p-6">

      {/* Language switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex overflow-hidden">
        <LeftPanel />

        {/* Right form panel */}
        <div className="flex-1 p-7 sm:p-10 flex flex-col gap-5 min-w-0">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {tab === 'create' ? l.titleCreate : l.titleLogin}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {tab === 'create' ? l.subtitleCreate : l.subtitleLogin}
            </p>
          </div>

          {/* Tab switcher — exact design: border box, active = dark fill */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm font-medium">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2.5 transition-colors ${
                tab === 'login' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {l.tabLogin}
            </button>
            <button
              type="button"
              onClick={() => setTab('create')}
              className={`flex-1 py-2.5 transition-colors ${
                tab === 'create' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {l.tabCreate}
            </button>
          </div>

          {/* Social auth */}
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

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex-1 h-px bg-gray-200" />
            <span>{l.orEmail}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); router.push('/dashboard') }}>

            {/* Create Account fields */}
            {tab === 'create' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">{l.firstName}</label>
                  <input
                    type="text"
                    placeholder={l.placeholderFirst}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">{l.lastName}</label>
                  <input
                    type="text"
                    placeholder={l.placeholderLast}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">{l.email}</label>
              <input
                type="email"
                placeholder={l.placeholderEmail}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {tab === 'create' ? l.password : l.passwordLogin}
                </label>
                {tab === 'login' && (
                  <button type="button" className="text-xs text-blue-600 hover:underline">
                    {l.forgotPassword}
                  </button>
                )}
              </div>
              <input
                type="password"
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              {tab === 'create' && (
                <p className="text-xs text-gray-400">{l.passwordHint}</p>
              )}
            </div>

            {/* Terms (Create only) */}
            {tab === 'create' && (
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
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {tab === 'create' ? l.submitCreate : l.submitLogin}
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Pricing link */}
          <p className="text-center text-sm text-gray-500">
            {l.pricingLink}{' '}
            <Link href="/" className="text-blue-600 font-semibold hover:underline">
              {l.pricingCta}
            </Link>
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-gray-400 pt-1">
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              {l.gdpr}
            </span>
            <span>·</span>
            <a href="#" className="hover:text-gray-600 underline underline-offset-2">{l.deletion}</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-600 underline underline-offset-2">{l.enterprise}</a>
          </div>

        </div>
      </div>
    </div>
  )
}
