'use client'
import Link from 'next/link'
import { ArrowUpRight, ChevronRight, Download, PlayCircle } from 'lucide-react'
import { mockDomains, mockFocusAreas, mockProgression, mockStats, mockStudyPlan, mockUser } from '@/data/mockDashboard'

/* ── Mini line chart ── */
function LineChart({ data }: { data: { label: string; score: number }[] }) {
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

/* ── Domain bar ── */
function DomainBar({ name, accuracy, speed, status, ok }: typeof mockDomains[0]) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">{name}</p>
        {!ok && <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Needs Focus</span>}
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>ACCURACY</span><span>{accuracy}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: accuracy + '%' }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>AVG. SPEED <span className="font-semibold text-gray-800">{speed} /q</span></span>
        <span className={ok ? 'text-green-600 font-medium' : 'text-orange-500 font-medium'}>{status}</span>
      </div>
    </div>
  )
}

/* ── Status badge ── */
const statusStyles: Record<string, string> = {
  Critical: 'bg-red-100 text-red-600',
  Mastered: 'bg-blue-100 text-blue-600',
  Review: 'bg-gray-100 text-gray-500',
  Optional: 'bg-gray-100 text-gray-400',
}
const studyColors: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
}

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Detailed breakdown of your CCAT proficiency based on the last 30 days.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
            <Download size={14} /> Export Full Report
          </button>
          <Link href="/dashboard/test">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
              <PlayCircle size={14} /> Start Practice Test
            </button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {mockStats.map((s, i) => (
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

      {/* Main two-column layout */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Left — main content */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">

          {/* Score Progression */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Score Progression</h2>
            <p className="text-xs text-gray-400 mb-4">Visualizing your journey toward the target score of 45.</p>
            <div className="flex gap-4 items-start">
              <div className="flex flex-col justify-between text-[10px] text-gray-300 h-28 sm:h-32 pb-1 shrink-0">
                {[50, 38, 25].map(v => <span key={v}>{v}</span>)}
              </div>
              <LineChart data={mockProgression} />
            </div>
          </div>

          {/* Domain Proficiency */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>↗</span> Domain Proficiency
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mockDomains.map((d, i) => <DomainBar key={i} {...d} />)}
            </div>
          </div>

          {/* Focus Areas */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Focus Areas</h2>
            <p className="text-xs text-gray-400 mb-4">Question types where your performance is below your 80th percentile target.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="text-[11px] text-gray-400 border-b border-gray-100">
                    {['Category', 'Attempts', 'Accuracy', 'Pace', 'Status'].map(h => (
                      <th key={h} className="text-left font-medium pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockFocusAreas.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-4 font-medium text-gray-800">{r.category}</td>
                      <td className="py-2.5 pr-4 text-gray-500">{r.attempts}</td>
                      <td className={`py-2.5 pr-4 font-semibold ${r.accuracy < 60 ? 'text-red-500' : r.accuracy > 75 ? 'text-gray-800' : 'text-orange-500'}`}>
                        {r.accuracy}%
                      </td>
                      <td className="py-2.5 pr-4 text-gray-500">{r.pace}</td>
                      <td className="py-2.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="flex flex-col gap-4 sm:gap-6">

          {/* PRO ACTIVE card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full tracking-wide">PRO ACTIVE</span>
              <button className="text-gray-300 hover:text-gray-500">✕</button>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Full Training Access</h3>
            <p className="text-xs text-blue-600 mt-0.5">Next billing on {mockUser.nextBilling}</p>
            <ul className="mt-3 flex flex-col gap-1.5 text-xs text-gray-600">
              {['Unlimited Full Simulations', 'Topic-Specific Drills', 'AI Speed Optimization'].map(f => (
                <li key={f} className="flex items-center gap-1.5">
                  <span className="text-blue-500">✓</span>{f}
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full border border-gray-200 text-sm font-medium text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition-colors">
              Manage Subscription
            </button>
          </div>

          {/* Quick Action */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest mb-3">QUICK ACTION</p>
            {['Review Test History', 'Contact Strategy Coach', 'Download CCAT Cheat Sheet'].map(a => (
              <button key={a} className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded transition-colors">
                {a} <ChevronRight size={14} className="text-gray-400" />
              </button>
            ))}
          </div>

          {/* Recommended Study Plan */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Recommended Study Plan</h3>
            <div className="flex flex-col gap-2.5">
              {mockStudyPlan.map((s, i) => (
                <button key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors text-left w-full">
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${studyColors[s.color]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 tracking-wide">{s.type}</p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5 leading-snug">{s.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">⏱ Estimated: {s.duration}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
