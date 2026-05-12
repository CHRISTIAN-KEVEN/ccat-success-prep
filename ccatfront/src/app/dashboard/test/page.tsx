'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { mockQuestions } from '@/data/mockQuestions'
import { ChevronDown, Volume2, VolumeX, CheckCircle, RotateCcw, BarChart2, Lightbulb, Clock } from 'lucide-react'

const TOTAL_TIME = 900

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function TestPage() {
  const router = useRouter()
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(mockQuestions.length).fill(null))
  const [selected, setSelected] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [muted, setMuted] = useState(false)
  const [showStrategy, setShowStrategy] = useState(true)
  const [openShortcut, setOpenShortcut] = useState<number | null>(0)
  const [done, setDone] = useState(false)

  const q = mockQuestions[idx]
  const urgent = timeLeft < 120

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setTimeLeft(s => {
      if (s <= 1) { clearInterval(t); setDone(true); return 0 }
      return s - 1
    }), 1000)
    return () => clearInterval(t)
  }, [done])

  const goNext = useCallback((ans: string | null) => {
    const updated = [...answers]
    updated[idx] = ans
    setAnswers(updated)
    if (idx + 1 >= mockQuestions.length) {
      setDone(true)
    } else {
      const next = idx + 1
      setIdx(next)
      setSelected(updated[next] ?? null)
      setOpenShortcut(0)
    }
  }, [idx, answers])

  const handleNext = useCallback(() => { if (selected) goNext(selected) }, [selected, goNext])
  const handleSkip = useCallback(() => goNext(null), [goNext])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return
      const key = e.key.toUpperCase()
      if (['A', 'B', 'C', 'D'].includes(key)) setSelected(key)
      if (e.key === 'Enter') handleNext()
      if (e.key === 's' || e.key === 'S') handleSkip()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [done, handleNext, handleSkip])

  const restart = () => {
    setIdx(0)
    setAnswers(Array(mockQuestions.length).fill(null))
    setSelected(null)
    setTimeLeft(TOTAL_TIME)
    setDone(false)
    setOpenShortcut(0)
  }

  /* ── Results ── */
  if (done) {
    const score = answers.filter((a, i) => a === mockQuestions[i].correct).length
    const pct = Math.round((score / mockQuestions.length) * 100)
    const percentile = pct >= 90 ? 95 : pct >= 75 ? 80 : pct >= 60 ? 65 : pct >= 50 ? 50 : 35
    const cats = ['Numerical Reasoning', 'Verbal Reasoning', 'Spatial Reasoning'] as const
    const byCategory = cats.map(cat => {
      const qs = mockQuestions.filter(q => q.category === cat)
      const correct = qs.filter(q => answers[mockQuestions.indexOf(q)] === q.correct).length
      return { cat, correct, total: qs.length }
    })
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
              {score}<span className="text-2xl text-gray-400">/{mockQuestions.length}</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">{pct}% correct · ~{percentile}th percentile</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {byCategory.map(({ cat, correct, total }) => (
              <div key={cat} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{correct}/{total}</p>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{cat.split(' ')[0]}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={restart} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              <RotateCcw size={15} /> Retake
            </button>
            <button onClick={() => router.push('/dashboard')} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition">
              <BarChart2 size={15} /> View Analytics
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Test ── */
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">

      {/* ── Card ── */}
      <div className="flex-1 flex flex-col border-b border-gray-200 bg-white overflow-hidden">

        {/* Top bar */}
        <div className="shrink-0 border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4 bg-white">
          {/* Left: progress */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-0.5">PROGRESS</p>
              <p className="text-sm font-bold text-gray-900 leading-none">
                Question <span className="text-blue-600">{idx + 1}</span> of {mockQuestions.length}
              </p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full hidden sm:inline">
              {q.category}
            </span>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowStrategy(s => !s)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Lightbulb size={14} className="text-blue-500" />
              {showStrategy ? 'Hide Strategy' : 'Show Strategy'}
            </button>

            <button
              onClick={() => setMuted(m => !m)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
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

          {/* Question area */}
          <div className="flex-1 bg-gray-50 overflow-y-auto p-6 sm:p-10 flex flex-col">

            {/* Question label */}
            <p className="flex items-center gap-2 text-[10px] font-semibold text-blue-500 tracking-widest uppercase mb-5">
              <span className="w-5 border-t-2 border-blue-400 inline-block" />
              Question Content
            </p>

            {/* Question text */}
            <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-8 max-w-2xl">
              {q.content}
            </p>

            {/* Options 2×2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {q.options.map(opt => (
                <button
                  key={opt.letter}
                  onClick={() => setSelected(opt.letter)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                    selected === opt.letter
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    selected === opt.letter
                      ? 'border-blue-500 text-blue-600 bg-white'
                      : 'border-gray-300 text-gray-500 bg-white'
                  }`}>
                    {opt.letter}
                  </span>
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{opt.text}</span>
                </button>
              ))}
            </div>

            {/* Keyboard shortcuts — centered */}
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

          {/* Strategy sidebar */}
          {showStrategy && (
            <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-l border-gray-200 bg-white overflow-y-auto shrink-0">
              <div className="p-5 flex flex-col gap-4">

                {/* Strategy tip — blue card */}
                <div className="bg-blue-600 rounded-xl p-4">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
                    <span className="w-4 h-4 rounded-full border border-blue-300 flex items-center justify-center text-[10px] shrink-0">i</span>
                    {q.strategy.title}
                  </p>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    {q.strategy.tip.replace('stop and estimate.', '').trim()}{' '}
                    {q.strategy.tip.includes('stop and estimate.') && (
                      <strong className="text-white">stop and estimate.</strong>
                    )}
                  </p>
                </div>

                {/* Accordions */}
                {q.shortcuts.map((s, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenShortcut(openShortcut === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      {s.title}
                      <ChevronDown size={15} className={`text-gray-400 transition-transform ${openShortcut === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openShortcut === i && (
                      <div className="px-4 pb-4 pt-2 text-xs text-gray-500 leading-relaxed border-t border-gray-100">
                        {s.body}
                      </div>
                    )}
                  </div>
                ))}

                {/* Session target */}
                <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">SESSION TARGET</p>
                    <p className="text-sm font-bold text-gray-900">{Math.ceil(mockQuestions.length * 0.84)}+ Correct Answers</p>
                  </div>
                  <span className="text-gray-400 text-lg">◎</span>
                </div>

              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Bottom bar — outside the card */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 text-[10px] text-gray-400">
          <span className="font-semibold tracking-wide">RELIABILITY: 99.9%</span>
          <span className="flex items-center gap-1">
            <span className="text-gray-400">ⓘ</span>
            Note: You cannot return to previous questions.
          </span>
          <span className="font-semibold tracking-wide">INPUT MODE: SMART_FOCUS</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors px-2 py-2"
          >
            Skip this question
          </button>
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`flex items-center gap-2 text-sm font-semibold text-white rounded-xl px-5 py-2.5 transition-colors ${
              selected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            {idx + 1 === mockQuestions.length ? 'Finish Test' : 'Next Question'} <span className="text-base">›</span>
          </button>
        </div>
      </div>

    </div>
  )
}
