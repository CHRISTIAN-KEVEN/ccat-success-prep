import Link from 'next/link'
import { Activity, BarChart2, ShieldCheck, Zap } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

const iconMap: Record<string, React.ElementType> = {
  chart: BarChart2,
  bolt: Zap,
  shield: ShieldCheck,
}

export default function LeftPanel() {
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
