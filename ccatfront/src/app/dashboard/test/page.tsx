'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Volume2, VolumeX, CheckCircle, RotateCcw, BarChart2, Lightbulb, Clock, Loader2 } from 'lucide-react'
import { sessionService, type QuestionResponse, type TestResultResponse } from '@/lib/sessionService'

const TOTAL_TIME = 900

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function TestPage() {
  const router = useRouter()

  // Session state
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [startError, setStartError] = useState('')

  // Test state
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null) // lgId of selected answer
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [muted, setMuted] = useState(false)
  const [showStrategy, setShowStrategy] = useState(true)
  const [openShortcut, setOpenShortcut] = useState<number | null>(0)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<TestResultResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const questionStartTime = useRef(Date.now())

  // Start session on mount
  useEffect(() => {
    sessionService.start('FREE_DIAGNOSTIC')
      .then(session => {
        setSessionId(session.lgId)
        return sessionService.getQuestions(session.lgId)
      })
      .then(qs => { setQuestions(qs); setLoading(false) })
      .catch(err => {
        const msg = err?.message ?? 'Impossible de démarrer le test'
        setStartError(msg)
        setLoading(false)
      })
  }, [])

  // Timer
  useEffect(() => {
    if (done || loading) return
    const t = setInterval(() => setTimeLeft(s => {
      if (s <= 1) { clearInterval(t); handleFinish(true); return 0 }
      return s - 1
    }), 1000)
    return () => clearInterval(t)
  }, [done, loading])

  // Reset question timer when question changes
  useEffect(() => { questionStartTime.current = Date.now() }, [idx])

  const q = questions[idx]
  const urgent = timeLeft < 120

  const handleFinish = useCallback(async (timerExpired = false) => {
    if (!sessionId || done) return
    setSubmitting(true)
    try {
      const res = await sessionService.finish(sessionId, timerExpired)
      setResult(res)
      setDone(true)
    } catch {
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }, [sessionId, done])

  const goNext = useCallback(async (answerId: number | null) => {
    if (!sessionId || !q) return
    const responseTimeMs = Date.now() - questionStartTime.current
    const answersOrder = q.answers.map(a => String(a.lgId)).join(',')

    await sessionService.submitResponse(sessionId, {
      lgSessionId: sessionId,
      lgQuestionId: q.lgId,
      lgAnswerId: answerId,
      intResponseTimeMs: responseTimeMs,
      intDisplayOrder: idx + 1,
      strAnswerOptionsOrder: answersOrder,
    }).catch(() => {})

    if (idx + 1 >= questions.length) {
      await handleFinish(false)
    } else {
      setIdx(idx + 1)
      setSelected(null)
      setOpenShortcut(0)
    }
  }, [sessionId, q, idx, questions.length, handleFinish])

  const handleNext = useCallback(() => { if (selected !== null) goNext(selected) }, [selected, goNext])
  const handleSkip = useCallback(() => goNext(null), [goNext])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done || !q) return
      const key = e.key.toUpperCase()
      const letters = ['A', 'B', 'C', 'D']
      const li = letters.indexOf(key)
      if (li >= 0 && q.answers[li]) setSelected(q.answers[li].lgId)
      if (e.key === 'Enter') handleNext()
      if (e.key === 's' || e.key === 'S') handleSkip()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [done, q, handleNext, handleSkip])

  // Loading / Error
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <Loader2 size={32} className="animate-spin text-blue-600" />
      <p className="text-sm text-gray-500">Démarrage du test…</p>
    </div>
  )

  if (startError) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <p className="text-red-500 font-semibold text-center">{startError}</p>
      <button onClick={() => router.push('/dashboard')}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
        Retour au dashboard
      </button>
    </div>
  )

  // Results
  if (done && result) {
    const pct = Math.round((result.intTotalScore / result.intQuestionCount) * 100)
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6">
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${pct >= 75 ? 'bg-green-100' : pct >= 50 ? 'bg-yellow-100' : 'bg-red-100'}`}>
              <CheckCircle size={40} className={pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500'} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Test Complete</h1>
            <p className="text-gray-500 text-sm mt-1">Here&apos;s how you performed</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 mb-4 text-center">
            <p className="text-5xl font-extrabold text-blue-600">
              {result.intTotalScore}<span className="text-2xl text-gray-400">/{result.intQuestionCount}</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {pct}% correct · ~{result.intPercentileEstimate}th percentile · {result.emPaceRating}
            </p>
          </div>
          {result.domainPerformances.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {result.domainPerformances.map(dp => (
                <div key={dp.strDomainCode} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{dp.intCorrectCount}/{dp.intTotalCount}</p>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{dp.strDomainCode}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => window.location.reload()}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              <RotateCcw size={15} /> Retake
            </button>
            <button onClick={() => router.push('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition">
              <BarChart2 size={15} /> View Analytics
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (done || !q) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-blue-600" />
    </div>
  )

  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex-1 flex flex-col border-b border-gray-200 bg-white overflow-hidden">

        {/* Top bar */}
        <div className="shrink-0 border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4 bg-white">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-0.5">PROGRESS</p>
              <p className="text-sm font-bold text-gray-900 leading-none">
                Question <span className="text-blue-600">{idx + 1}</span> of {questions.length}
              </p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full hidden sm:inline">
              {q.strDomainCode}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setShowStrategy(s => !s)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
              <Lightbulb size={14} className="text-blue-500" />
              {showStrategy ? 'Hide Strategy' : 'Show Strategy'}
            </button>
            <button onClick={() => setMuted(m => !m)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <div className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg border ${
              urgent ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-800 border-gray-200'
            }`}>
              <Clock size={14} className={urgent ? 'text-red-500' : 'text-gray-400'} />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 bg-gray-50 overflow-y-auto p-6 sm:p-10 flex flex-col">
            <p className="flex items-center gap-2 text-[10px] font-semibold text-blue-500 tracking-widest uppercase mb-5">
              <span className="w-5 border-t-2 border-blue-400 inline-block" />
              Question Content
            </p>
            <div
              className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-8 max-w-2xl prose prose-xl"
              dangerouslySetInnerHTML={{ __html: q.strQuestionText }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {q.answers.map((ans, ai) => (
                <button key={ans.lgId} onClick={() => setSelected(ans.lgId)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                    selected === ans.lgId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <span className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    selected === ans.lgId ? 'border-blue-500 text-blue-600 bg-white' : 'border-gray-300 text-gray-500 bg-white'
                  }`}>
                    {letters[ai] ?? String(ai + 1)}
                  </span>
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{ans.strAnswerText}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-10 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white border border-gray-300 text-gray-600 rounded px-1.5 py-0.5 font-mono text-[10px] shadow-sm">A-D</kbd>
                Select Answer
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white border border-gray-300 text-gray-600 rounded px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Enter</kbd>
                Confirm &amp; Next
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white border border-gray-300 text-gray-600 rounded px-1.5 py-0.5 font-mono text-[10px] shadow-sm">S</kbd>
                Skip Question
              </span>
            </div>
          </div>

          {showStrategy && (
            <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-l border-gray-200 bg-white overflow-y-auto shrink-0">
              <div className="p-5 flex flex-col gap-4">
                <div className="bg-blue-600 rounded-xl p-4">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
                    <span className="w-4 h-4 rounded-full border border-blue-300 flex items-center justify-center text-[10px] shrink-0">i</span>
                    Strategy tip
                  </p>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    {q.strHint ?? 'Read the question carefully and eliminate obviously wrong answers first.'}
                  </p>
                </div>
                {q.emDifficulty && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenShortcut(openShortcut === 0 ? null : 0)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                      Question Info
                      <ChevronDown size={15} className={`text-gray-400 transition-transform ${openShortcut === 0 ? 'rotate-180' : ''}`} />
                    </button>
                    {openShortcut === 0 && (
                      <div className="px-4 pb-4 pt-2 text-xs text-gray-500 leading-relaxed border-t border-gray-100 space-y-1">
                        <p>Difficulty: <strong>{q.emDifficulty}</strong></p>
                        <p>Type: <strong>{q.emQuestionType}</strong></p>
                        <p>Domain: <strong>{q.strDomainCode}</strong></p>
                      </div>
                    )}
                  </div>
                )}
                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">SESSION TARGET</p>
                    <p className="text-sm font-bold text-gray-900">{Math.ceil(questions.length * 0.84)}+ Correct Answers</p>
                  </div>
                  <span className="text-gray-400 text-lg">◎</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-200 bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 text-[10px] text-gray-400">
          <span className="font-semibold tracking-wide">RELIABILITY: 99.9%</span>
          <span className="flex items-center gap-1">
            <span className="text-gray-400">ⓘ</span>
            Note: You cannot return to previous questions.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleSkip} disabled={submitting}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors px-2 py-2">
            Skip this question
          </button>
          <button onClick={handleNext} disabled={selected === null || submitting}
            className={`flex items-center gap-2 text-sm font-semibold text-white rounded-xl px-5 py-2.5 transition-colors ${
              selected !== null && !submitting ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
            }`}>
            {submitting ? <Loader2 size={15} className="animate-spin" /> : idx + 1 === questions.length ? 'Finish Test' : 'Next Question'}
            {!submitting && <span className="text-base">›</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
