'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { History, TrendingUp, Target, Clock, ChevronRight, RotateCcw, Filter } from 'lucide-react'

type Session = {
  id: number
  date: string
  score: number
  total: number
  percentile: number
  duration: string
  categories: { name: string; correct: number; total: number }[]
  status: 'Completed' | 'Skipped' | 'Timed Out'
}

const mockHistory: Session[] = [
  {
    id: 1,
    date: 'May 12, 2026 · 10:24 AM',
    score: 42,
    total: 50,
    percentile: 84,
    duration: '13:42',
    status: 'Completed',
    categories: [
      { name: 'Numerical', correct: 14, total: 18 },
      { name: 'Verbal', correct: 17, total: 19 },
      { name: 'Spatial', correct: 11, total: 13 },
    ],
  },
  {
    id: 2,
    date: 'May 10, 2026 · 02:11 PM',
    score: 38,
    total: 50,
    percentile: 76,
    duration: '14:50',
    status: 'Completed',
    categories: [
      { name: 'Numerical', correct: 12, total: 18 },
      { name: 'Verbal', correct: 16, total: 19 },
      { name: 'Spatial', correct: 10, total: 13 },
    ],
  },
  {
    id: 3,
    date: 'May 8, 2026 · 09:05 AM',
    score: 33,
    total: 50,
    percentile: 65,
    duration: '15:00',
    status: 'Timed Out',
    categories: [
      { name: 'Numerical', correct: 10, total: 18 },
      { name: 'Verbal', correct: 14, total: 19 },
      { name: 'Spatial', correct: 9, total: 13 },
    ],
  },
  {
    id: 4,
    date: 'May 5, 2026 · 07:30 PM',
    score: 28,
    total: 50,
    percentile: 54,
    duration: '11:20',
    status: 'Skipped',
    categories: [
      { name: 'Numerical', correct: 8, total: 18 },
      { name: 'Verbal', correct: 13, total: 19 },
      { name: 'Spatial', correct: 7, total: 13 },
    ],
  },
  {
    id: 5,
    date: 'May 2, 2026 · 03:45 PM',
    score: 22,
    total: 50,
    percentile: 40,
    duration: '14:10',
    status: 'Completed',
    categories: [
      { name: 'Numerical', correct: 6, total: 18 },
      { name: 'Verbal', correct: 11, total: 19 },
      { name: 'Spatial', correct: 5, total: 13 },
    ],
  },
]

const statusColor: Record<Session['status'], string> = {
  Completed: 'bg-green-100 text-green-700',
  Skipped: 'bg-yellow-100 text-yellow-700',
  'Timed Out': 'bg-red-100 text-red-600',
}

const scoreColor = (pct: number) =>
  pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-500'

export default function HistoryPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<'All' | Session['status']>('All')

  const filtered = filter === 'All' ? mockHistory : mockHistory.filter(s => s.status === filter)
  const best = Math.max(...mockHistory.map(s => s.score))
  const avg = Math.round(mockHistory.reduce((a, s) => a + s.score, 0) / mockHistory.length)
  const avgPct = Math.round(mockHistory.reduce((a, s) => a + s.percentile, 0) / mockHistory.length)

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900">Test History</h1>
        </div>
        <button
          onClick={() => router.push('/dashboard/test')}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          <RotateCcw size={14} /> New Test
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Sessions</p>
          <p className="text-2xl font-extrabold text-gray-900">{mockHistory.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Best Score</p>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-extrabold text-gray-900">{best}</p>
            <p className="text-sm text-gray-400 mb-0.5">/50</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={11} className="text-blue-500" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Avg. Score</p>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-extrabold text-gray-900">{avg}</p>
            <p className="text-sm text-gray-400 mb-0.5">/50</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-1 mb-1">
            <Target size={11} className="text-blue-500" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Avg. Percentile</p>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{avgPct}<span className="text-sm text-gray-400 font-normal">th</span></p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={13} className="text-gray-400" />
        {(['All', 'Completed', 'Timed Out', 'Skipped'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Session list */}
      <div className="flex flex-col gap-3">
        {filtered.map((session, i) => {
          const pct = Math.round((session.score / session.total) * 100)
          return (
            <div
              key={session.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Rank & score */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  #{i + 1}
                </div>
                <div>
                  <p className={`text-2xl font-extrabold leading-none ${scoreColor(session.percentile)}`}>
                    {session.score}<span className="text-base text-gray-300 font-normal">/{session.total}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{session.percentile}th percentile</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColor[session.status]}`}>
                    {session.status}
                  </span>
                  <span className="text-xs text-gray-400">{session.date}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} /> {session.duration}
                  </span>
                </div>

                {/* Category bars */}
                <div className="flex flex-wrap gap-3">
                  {session.categories.map(cat => (
                    <div key={cat.name} className="flex items-center gap-1.5 min-w-[110px]">
                      <span className="text-[10px] text-gray-400 w-14 shrink-0">{cat.name}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(cat.correct / cat.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-600 shrink-0">{cat.correct}/{cat.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => router.push('/dashboard/test')}
                className="shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                Retry <ChevronRight size={14} />
              </button>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
            No sessions found for this filter.
          </div>
        )}
      </div>
    </div>
  )
}
