'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { History, TrendingUp, Target, Clock, ChevronRight, RotateCcw, Filter, Loader2 } from 'lucide-react'
import { sessionService, type TestSessionResponse } from '@/lib/sessionService'

const statusColor: Record<string, string> = {
  SUBMITTED: 'bg-green-100 text-green-700',
  ACTIVE: 'bg-yellow-100 text-yellow-700',
  EXPIRED: 'bg-red-100 text-red-600',
}

const statusLabel: Record<string, string> = {
  SUBMITTED: 'Completed',
  ACTIVE: 'In Progress',
  EXPIRED: 'Timed Out',
}

const scoreColor = (pct: number) =>
  pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-500'

function formatDate(dt: string) {
  return new Date(dt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDuration(session: TestSessionResponse) {
  if (!session.dtSubmitted || !session.dtStarted) return '—'
  const ms = new Date(session.dtSubmitted).getTime() - new Date(session.dtStarted).getTime()
  const s = Math.floor(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<TestSessionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'All' | 'SUBMITTED' | 'EXPIRED' | 'ACTIVE'>('All')

  useEffect(() => {
    sessionService.getMyHistory().then(setSessions).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? sessions : sessions.filter(s => s.emStatus === filter)
  const submitted = sessions.filter(s => s.emStatus === 'SUBMITTED')
  const best = submitted.length ? Math.max(...submitted.map(s => s.intQuestionsAnswered)) : 0
  const avg = submitted.length ? Math.round(submitted.reduce((a, s) => a + s.intQuestionsAnswered, 0) / submitted.length) : 0

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-blue-600" />
    </div>
  )

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900">Test History</h1>
        </div>
        <button onClick={() => router.push('/dashboard/test')}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
          <RotateCcw size={14} /> New Test
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Sessions</p>
          <p className="text-2xl font-extrabold text-gray-900">{sessions.length}</p>
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
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Completed</p>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{submitted.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter size={13} className="text-gray-400" />
        {(['All', 'SUBMITTED', 'EXPIRED', 'ACTIVE'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {f === 'All' ? 'All' : statusLabel[f]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((session, i) => (
          <div key={session.lgId}
            className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                #{i + 1}
              </div>
              <div>
                <p className={`text-2xl font-extrabold leading-none ${scoreColor((session.intQuestionsAnswered / session.intQuestionCount) * 100)}`}>
                  {session.intQuestionsAnswered}<span className="text-base text-gray-300 font-normal">/{session.intQuestionCount}</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{session.emSessionType}</p>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColor[session.emStatus] ?? 'bg-gray-100 text-gray-500'}`}>
                  {statusLabel[session.emStatus] ?? session.emStatus}
                </span>
                <span className="text-xs text-gray-400">{formatDate(session.dtStarted)}</span>
                {session.dtSubmitted && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} /> {formatDuration(session)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400">Answered</span>
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(session.intQuestionsAnswered / session.intQuestionCount) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600">{session.intQuestionsAnswered}/{session.intQuestionCount}</span>
                </div>
                {session.intQuestionsSkipped > 0 && (
                  <span className="text-[10px] text-gray-400">{session.intQuestionsSkipped} skipped</span>
                )}
              </div>
            </div>

            <button onClick={() => router.push('/dashboard/test')}
              className="shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
              Retry <ChevronRight size={14} />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
            Aucune session trouvée.
          </div>
        )}
      </div>
    </div>
  )
}
