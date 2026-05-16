'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Volume2, VolumeX, CheckCircle, RotateCcw, BarChart2, Lightbulb, Clock, Loader2, BookOpen, ThumbsUp, ThumbsDown, Lock, Zap, Trophy, Star, Infinity, Brain, TrendingUp } from 'lucide-react'
import { sessionService, type QuestionResponse, type TestResultResponse } from '@/lib/sessionService'
import { adviceService, type UserAdviceResponse } from '@/lib/adviceService'

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
  const [advices, setAdvices] = useState<UserAdviceResponse[]>([])
  const [submitting, setSubmitting]   = useState(false)
  const [finishError, setFinishError] = useState('')

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
        const msg = err?.message ?? 'Unable to start the test'
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
      adviceService.getBySession(sessionId).then(setAdvices).catch(() => {})
    } catch (err) {
      setFinishError((err as {message?: string})?.message ?? 'Failed to submit the test')
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
      <p className="text-sm text-gray-500">Starting the test...</p>
    </div>
  )

  if (startError) {
    const isPaywall = startError.toLowerCase().includes('already') || startError.toLowerCase().includes('upgrade') || startError.toLowerCase().includes('premium')
    if (isPaywall) return (
      <div className="h-full bg-white flex items-center justify-center p-4 relative overflow-hidden">

        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl flex gap-8 items-center">

          {/* LEFT — Trophy + title + XP + back */}
          <div className="flex flex-col items-center gap-4 flex-1 min-w-0">
            {/* Trophy */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
                <Trophy size={36} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <CheckCircle size={14} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3].map(i => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
            </div>

            {/* Title */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Free test completed</p>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                You unlocked{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  your potential
                </span>
              </h1>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Upgrade to Premium to keep practicing and reach your target score.
              </p>
            </div>

            {/* XP earned */}
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-xl w-full justify-center">
              <Zap size={13} className="text-yellow-500 shrink-0" />
              <p className="text-[11px] text-yellow-700 font-medium">You earned <strong>+80 XP</strong> from your free test!</p>
            </div>

            {/* Back link */}
            <button onClick={() => router.push('/dashboard')}
              className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">
              Continue without upgrading
            </button>
          </div>

          {/* RIGHT — Features + Pricing */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">

            {/* Locked features — 2×2 grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Infinity,   label: 'Unlimited Tests',      desc: 'As many as you want' },
                { icon: Brain,      label: 'AI Explanations',      desc: 'Understand every mistake' },
                { icon: TrendingUp, label: 'Progress Tracking',    desc: 'Trends and weak domains' },
                { icon: BookOpen,   label: 'Study Plan',           desc: '14-day program' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 border border-blue-100">
                    <Icon size={15} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{label}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">{desc}</p>
                  </div>
                  <Lock size={11} className="text-gray-300 shrink-0" />
                </div>
              ))}
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Annual — highlighted */}
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 border border-blue-500 shadow-lg shadow-blue-200">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-[9px] font-extrabold text-black px-2.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                  Best value
                </div>
                <p className="text-[9px] font-bold text-blue-200 uppercase tracking-wide mt-1">Yearly</p>
                <p className="text-xl font-extrabold text-white mt-0.5">4,99€<span className="text-xs font-normal text-blue-200">/mois</span></p>
                <p className="text-[10px] text-blue-200 mt-0.5">59,99€ / year · -50%</p>
                <button className="mt-2.5 w-full bg-white text-blue-700 text-xs font-extrabold py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  Get Started →
                </button>
              </div>

              {/* Monthly */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1">Monthly</p>
                <p className="text-xl font-extrabold text-gray-900 mt-0.5">9,99€<span className="text-xs font-normal text-gray-400">/mois</span></p>
                <p className="text-[10px] text-gray-400 mt-0.5">No commitment</p>
                <button className="mt-2.5 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl transition-colors border border-gray-200">
                  Choose
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <p className="text-red-500 font-semibold text-center">{startError}</p>
        <button onClick={() => router.push('/dashboard')}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
          Back to dashboard
        </button>
      </div>
    )
  }

  // Results
  if (done && result) {
    const pct = Math.round((result.intTotalScore / result.intQuestionCount) * 100)
    const isPass = result.bPassedThreshold

    const handleFeedback = async (adviceId: number, helpful: boolean) => {
      try {
        const updated = await adviceService.submitFeedback(adviceId, helpful)
        setAdvices(prev => prev.map(a => a.lgId === adviceId ? updated : a))
      } catch { /* ignore */ }
    }

    return (
      <div className="min-h-full bg-gray-50 p-4 sm:p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col gap-4">

          {/* Score card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col items-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${isPass ? 'bg-green-100' : pct >= 50 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <CheckCircle size={32} className={isPass ? 'text-green-600' : pct >= 50 ? 'text-yellow-500' : 'text-red-500'} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Test completed</h1>
              <p className="text-sm text-gray-400 mt-0.5">Here are your results</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 text-center mb-5">
              <p className="text-5xl font-extrabold text-blue-600">
                {result.intTotalScore}
                <span className="text-2xl text-gray-300 font-normal">/{result.intQuestionCount}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {pct}% correct · ~{result.intPercentileEstimate}th percentile · {result.emPaceRating}
              </p>
              <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {isPass ? '✓ Threshold reached' : '✗ Threshold not reached (24/50)'}
              </span>
            </div>

            {result.domainPerformances.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {result.domainPerformances.map(dp => (
                  <div key={dp.strDomainCode} className="border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{dp.intCorrectCount}/{dp.intTotalCount}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{dp.strDomainLabel || dp.strDomainCode}</p>
                    <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${dp.dbAccuracyPercent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                <RotateCcw size={14} /> Retry
              </button>
              <button onClick={() => router.push(`/dashboard/review/${sessionId}`)}
                className="flex-1 flex items-center justify-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-xl py-3 text-sm font-semibold hover:bg-blue-100 transition">
                <BookOpen size={14} /> View review
              </button>
              <button onClick={() => router.push('/dashboard')}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition">
                <BarChart2 size={14} /> Dashboard
              </button>
            </div>
          </div>

          {/* Advice cards */}
          {advices.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
                Personalized advice ({advices.length})
              </p>
              {advices.map(advice => (
                <div key={advice.lgId} className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        advice.adviceCard.emPriority === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                        advice.adviceCard.emPriority === 'HIGH'     ? 'bg-orange-100 text-orange-600' :
                        advice.adviceCard.emPriority === 'MEDIUM'   ? 'bg-blue-100 text-blue-600' :
                                                                       'bg-gray-100 text-gray-500'
                      }`}>
                        {advice.adviceCard.emPriority}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{advice.adviceCard.emCategory}</span>
                    </div>
                    {advice.bWasHelpful === null && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleFeedback(advice.lgId, true)}
                          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-green-600 transition">
                          <ThumbsUp size={13} /> Helpful
                        </button>
                        <button onClick={() => handleFeedback(advice.lgId, false)}
                          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition">
                          <ThumbsDown size={13} />
                        </button>
                      </div>
                    )}
                    {advice.bWasHelpful !== null && (
                      <span className="text-[11px] text-gray-400">
                        {advice.bWasHelpful ? '👍 Helpful' : '👎 Not helpful'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{advice.adviceCard.strTitle}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{advice.adviceCard.strContent}</p>
                  {advice.adviceCard.strActionLabel && advice.adviceCard.strActionUrl && (
                    <a href={advice.adviceCard.strActionUrl}
                      className="inline-block mt-3 text-xs font-semibold text-blue-600 hover:underline">
                      {advice.adviceCard.strActionLabel} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (done && !result) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      {finishError ? (
        <>
          <p className="text-red-500 font-semibold">{finishError}</p>
          <button onClick={() => sessionId && sessionService.getResult(sessionId).then(r => { setResult(r); setFinishError('') }).catch(() => {})}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
            Fetch results
          </button>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-400 hover:underline">
            Back to dashboard
          </button>
        </>
      ) : (
        <Loader2 size={24} className="animate-spin text-blue-600" />
      )}
    </div>
  )

  if (!q) return null

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
