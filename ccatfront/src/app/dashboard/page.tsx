'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronRight, PlayCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { sessionService, type TestSessionResponse, type TestResultResponse } from '@/lib/sessionService'
import { domainService, type DomainResponse } from '@/lib/domainService'

function LineChart({ data }: { data: { label: string; score: number }[] }) {
  if (data.length < 2) return <p className="text-xs text-gray-400 py-8 text-center">Not enough sessions yet.</p>
  const scores = data.map(d => d.score)
  const min = Math.min(...scores) - 5
  const max = Math.max(...scores) + 3
  const W = 400, H = 100
  const px = (i: number) => (i / (data.length - 1)) * W
  const py = (v: number) => H - ((v - min) / (max - min)) * H
  const points = data.map((d, i) => `${px(i)},${py(d.score)}`).join(' ')
  const area = `${px(0)},${H} ${points} ${px(data.length - 1)},${H}`
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H + 4}`} className="w-full h-28 sm:h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#chartGrad)" />
        <polyline points={points} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />
        {data.map((d, i) => (
          <circle key={i} cx={px(i)} cy={py(d.score)} r="4" fill="white" stroke="#2563EB" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
        {data.map(d => <span key={d.label}>{d.label}</span>)}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<TestSessionResponse[]>([])
  const [results, setResults] = useState<TestResultResponse[]>([])
  const [domains, setDomains] = useState<DomainResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      sessionService.getMyHistory(),
      domainService.findAllActive(),
    ]).then(async ([sess, doms]) => {
      setSessions(sess)
      setDomains(doms)
      // Fetch results for submitted sessions (last 10 max)
      const submitted = sess.filter(s => s.emStatus === 'SUBMITTED').slice(0, 10)
      const res = await Promise.allSettled(submitted.map(s => sessionService.getResult(s.lgId)))
      setResults(res.filter(r => r.status === 'fulfilled').map(r => (r as PromiseFulfilledResult<TestResultResponse>).value))
    }).finally(() => setLoading(false))
  }, [])

  // Derived stats
  const submitted = sessions.filter(s => s.emStatus === 'SUBMITTED')
  const scores = results.map(r => r.intTotalScore)
  const bestScore = scores.length ? Math.max(...scores) : 0
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const avgAccuracy = results.length ? Math.round(results.reduce((a, r) => a + r.dbAccuracyPercent, 0) / results.length) : 0
  const latestPercentile = results.length ? results[0].intPercentileEstimate : 0

  const stats = [
    { label: 'PERCENTILE RANK', value: submitted.length ? `${latestPercentile}th` : '—', sub: 'Latest session', change: null, up: null },
    { label: 'BEST SCORE', value: submitted.length ? `${bestScore}/50` : '—', sub: `${submitted.length} completed session(s)`, change: null, up: null },
    { label: 'AVERAGE SCORE', value: submitted.length ? `${avgScore}/50` : '—', sub: 'Across all sessions', change: null, up: null },
    { label: 'AVG. ACCURACY', value: submitted.length ? `${avgAccuracy}%` : '—', sub: 'Correct answers / attempted', change: null, up: null },
  ]

  // Score progression (last 6 submitted)
  const progression = results.slice(0, 6).reverse().map((r, i) => ({
    label: `#${i + 1}`,
    score: r.intTotalScore,
  }))

  // Domain performance from latest result
  const latestResult = results[0]
  const domainPerfs = latestResult?.domainPerformances ?? []

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-blue-600" />
    </div>
  )

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Hello, {user?.strFirstName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here is your progress over the last 30 days.</p>
        </div>
        <Link href="/dashboard/test">
          <button className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
            <PlayCircle size={14} /> Start a test
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase">{s.label}</p>
              {s.change && (
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                  <ArrowUpRight size={10} />{s.change}
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">

          {/* Score Progression */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Score Progression</h2>
            <p className="text-xs text-gray-400 mb-4">How your score has changed across recent sessions.</p>
            {progression.length >= 2 ? (
              <div className="flex gap-4 items-start">
                <div className="flex flex-col justify-between text-[10px] text-gray-300 h-28 sm:h-32 pb-1 shrink-0">
                  {[50, 38, 25].map(v => <span key={v}>{v}</span>)}
                </div>
                <LineChart data={progression} />
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-gray-400">
                Complete at least 2 tests to see your progress.
              </div>
            )}
          </div>

          {/* Domain Proficiency */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>↗</span> Domain Performance
            </h2>
            {domainPerfs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {domainPerfs.map(dp => (
                  <div key={dp.strDomainCode} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">{dp.strDomainLabel || dp.strDomainCode}</p>
                      {dp.dbAccuracyPercent < 60 && (
                        <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Needs work</span>
                      )}
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>ACCURACY</span><span>{Math.round(dp.dbAccuracyPercent)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: dp.dbAccuracyPercent + '%' }} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{dp.intCorrectCount}/{dp.intTotalCount} correct</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">Complete a test to see your domain performance.</p>
            )}
          </div>

          {/* Domains available */}
          {domains.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Available Domains</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="text-[11px] text-gray-400 border-b border-gray-100">
                      {['Domain', 'Questions', 'Default Ratio'].map(h => (
                        <th key={h} className="text-left font-medium pb-2 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {domains.map(d => (
                      <tr key={d.strDomainCode}>
                        <td className="py-2.5 pr-4 font-medium text-gray-800">{d.strLabel}</td>
                        <td className="py-2.5 pr-4 text-gray-500">{d.intQuestionCount}</td>
                        <td className="py-2.5 text-gray-500">{d.intDefaultRatio}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4 sm:gap-6">

          {/* Session summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest mb-3">SUMMARY</p>
            {[
              { label: 'Total sessions', value: sessions.length },
              { label: 'Completed', value: submitted.length },
              { label: 'In Progress', value: sessions.filter(s => s.emStatus === 'ACTIVE').length },
              { label: 'Expired', value: sessions.filter(s => s.emStatus === 'EXPIRED').length },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest mb-3">QUICK ACTIONS</p>
            {[
              { label: 'View History', href: '/dashboard/history' },
              { label: 'Study Plan', href: '/dashboard/study' },
              { label: 'Settings', href: '/dashboard/settings' },
            ].map(a => (
              <Link key={a.label} href={a.href}
                className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded transition-colors">
                {a.label} <ChevronRight size={14} className="text-gray-400" />
              </Link>
            ))}
          </div>

          {/* Latest result detail */}
          {latestResult && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-[10px] font-semibold text-gray-400 tracking-widest mb-3">LATEST TEST</p>
              {[
                { label: 'Score', value: `${latestResult.intTotalScore}/${latestResult.intQuestionCount}` },
                { label: 'Accuracy', value: `${Math.round(latestResult.dbAccuracyPercent)}%` },
                { label: 'Completed', value: `${Math.round(latestResult.dbCompletionPercent)}%` },
                { label: 'Passed Threshold', value: latestResult.bPassedThreshold ? '✓ Yes' : '✗ No' },
                { label: 'Pace', value: latestResult.emPaceRating },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className={`text-xs font-bold ${item.label === 'Passed Threshold' ? (latestResult.bPassedThreshold ? 'text-green-600' : 'text-red-500') : 'text-gray-900'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
