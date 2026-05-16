'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  CheckCircle2, XCircle, MinusCircle, ChevronDown, ChevronUp,
  ArrowLeft, Loader2, Clock, Lightbulb, SkipForward, Bookmark,
} from 'lucide-react'
import { sessionService, type QuestionReviewResponse } from '@/lib/sessionService'
import { bookmarkService } from '@/lib/bookmarkService'

type Filter = 'ALL' | 'CORRECT' | 'WRONG' | 'SKIPPED'

function formatMs(ms: number) {
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`
}

function ScoreRing({ pct }: { pct: number }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const color = pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'
  return (
    <svg width={88} height={88} className="shrink-0">
      <circle cx={44} cy={44} r={r} fill="none" stroke="#f3f4f6" strokeWidth={7} />
      <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 44 44)" />
      <text x={44} y={44} textAnchor="middle" dominantBaseline="central"
        className="font-extrabold" style={{ fontSize: 15, fill: color, fontWeight: 800 }}>
        {pct}%
      </text>
    </svg>
  )
}

function AnswerOption({ ans, isChosen, isCorrect }: {
  ans: QuestionReviewResponse['answers'][number]
  isChosen: boolean
  isCorrect: boolean
}) {
  const base = 'flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all'
  let style = `${base} border-gray-200 bg-gray-50`
  if (isCorrect && isChosen) style = `${base} border-green-400 bg-green-50`
  else if (isCorrect)        style = `${base} border-green-300 bg-green-50`
  else if (isChosen)         style = `${base} border-red-300 bg-red-50`

  return (
    <div className={style}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5
        ${isCorrect ? 'bg-green-500 text-white' : isChosen ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-500'}`}>
        {ans.strAnswerLabel}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${isCorrect ? 'text-green-800 font-medium' : isChosen ? 'text-red-700' : 'text-gray-700'}`}>
          {ans.strAnswerText}
        </p>
        {ans.strExplanation && (
          <p className="text-xs text-gray-400 mt-1 italic">{ans.strExplanation}</p>
        )}
      </div>
      <div className="shrink-0 mt-0.5">
        {isCorrect && isChosen && <CheckCircle2 size={16} className="text-green-500" />}
        {isCorrect && !isChosen && <CheckCircle2 size={16} className="text-green-400" />}
        {isChosen && !isCorrect && <XCircle size={16} className="text-red-400" />}
      </div>
    </div>
  )
}

function QuestionCard({ item, index, bookmarked, onToggleBookmark }: {
  item: QuestionReviewResponse
  index: number
  bookmarked: boolean
  onToggleBookmark: (id: number) => void
}) {
  const [open, setOpen] = useState(false)

  const leftBar = item.bWasSkipped ? 'bg-gray-300' : item.bIsCorrect ? 'bg-green-400' : 'bg-red-400'
  const statusBadge = item.bWasSkipped
    ? <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"><MinusCircle size={11} /> Skipped</span>
    : item.bIsCorrect
      ? <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><CheckCircle2 size={11} /> Correct</span>
      : <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full"><XCircle size={11} /> Incorrect</span>

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
        className="w-full flex items-stretch text-left hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {/* Left status bar */}
        <div className={`w-1 shrink-0 ${leftBar}`} />

        {/* Content */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3.5 min-w-0">
          <span className="text-xs font-bold text-gray-300 shrink-0 w-7 text-right">{index + 1}</span>
          <p className="flex-1 text-sm font-medium text-gray-800 line-clamp-1 min-w-0"
            dangerouslySetInnerHTML={{ __html: item.strQuestionText ?? '' }} />
        </div>

        {/* Right meta */}
        <div className="flex items-center gap-3 px-4 shrink-0">
          {statusBadge}
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400">
            <Clock size={11} /> {formatMs(item.intResponseTimeMs)}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onToggleBookmark(item.lgQuestionId) }}
            className={`shrink-0 transition-colors ${bookmarked ? 'text-blue-500' : 'text-gray-300 hover:text-blue-400'}`}
          >
            <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <div className="text-gray-400">
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-5">

          {/* Full question */}
          <div className="text-sm font-semibold text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.strQuestionText ?? '' }} />

          {/* Answers */}
          <div className="flex flex-col gap-2">
            {item.answers.map(ans => (
              <AnswerOption
                key={ans.lgId}
                ans={ans}
                isChosen={ans.lgId === item.lgChosenAnswerId}
                isCorrect={ans.bIsCorrect}
              />
            ))}
          </div>

          {/* Skipped notice */}
          {item.bWasSkipped && (
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-4 py-3 rounded-xl">
              <SkipForward size={15} className="shrink-0" />
              Question skipped — no answer selected.
            </div>
          )}

          {/* Explanation */}
          {item.strExplanation && (
            <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
              <Lightbulb size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wide mb-1">Explanation</p>
                <p className="text-sm text-blue-700 leading-relaxed">{item.strExplanation}</p>
              </div>
            </div>
          )}

          {/* Meta tags */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: item.strDomainCode },
              { label: item.emDifficulty },
              { label: item.emQuestionType.replace('_', ' ') },
            ].map(t => (
              <span key={t.label} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {t.label}
              </span>
            ))}
            <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <Clock size={10} /> {formatMs(item.intResponseTimeMs)}
            </span>
            {item.bWasChanged && (
              <span className="text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Answer changed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'ALL',     label: 'All' },
  { key: 'CORRECT', label: 'Correct' },
  { key: 'WRONG',   label: 'Incorrect' },
  { key: 'SKIPPED', label: 'Skipped' },
]

export default function ReviewPage() {
  const params    = useParams()
  const router    = useRouter()
  const sessionId = Number(params?.sessionId)

  const [items,       setItems]       = useState<QuestionReviewResponse[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [filter,      setFilter]      = useState<Filter>('ALL')
  const [bookmarked,  setBookmarked]  = useState<Set<number>>(new Set())

  const toggleBookmark = async (questionId: number) => {
    const { bBookmarked } = await bookmarkService.toggle(questionId)
    setBookmarked(prev => {
      const next = new Set(prev)
      bBookmarked ? next.add(questionId) : next.delete(questionId)
      return next
    })
  }

  useEffect(() => {
    if (!sessionId) return
    bookmarkService.getMyBookmarkedIds().then(ids => setBookmarked(new Set(ids)))
    sessionService.getReview(sessionId)
      .then(setItems)
      .catch(err => setError(err?.message ?? 'Unable to load the review'))
      .finally(() => setLoading(false))
  }, [sessionId])

  const correct  = items.filter(i => !i.bWasSkipped && i.bIsCorrect).length
  const wrong    = items.filter(i => !i.bWasSkipped && !i.bIsCorrect).length
  const skipped  = items.filter(i => i.bWasSkipped).length
  const accuracy = correct + wrong > 0 ? Math.round(correct / (correct + wrong) * 100) : 0

  const counts: Record<Filter, number> = {
    ALL: items.length, CORRECT: correct, WRONG: wrong, SKIPPED: skipped,
  }

  const filtered = filter === 'ALL'     ? items
    : filter === 'CORRECT' ? items.filter(i => !i.bWasSkipped && i.bIsCorrect)
    : filter === 'WRONG'   ? items.filter(i => !i.bWasSkipped && !i.bIsCorrect)
    :                        items.filter(i => i.bWasSkipped)

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-blue-600" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <XCircle size={24} className="text-red-400" />
      </div>
      <div>
        <p className="font-semibold text-gray-800">Loading error</p>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
      </div>
      <button onClick={() => router.back()}
        className="text-sm font-medium text-blue-600 hover:underline">
        ← Back
      </button>
    </div>
  )

  return (
    <div className="min-h-full bg-gray-50">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors shrink-0">
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-gray-900 truncate">Test Review</h1>
          <p className="text-[11px] text-gray-400">{items.length} questions · session #{sessionId}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0
          ${accuracy >= 70 ? 'bg-green-100 text-green-700' : accuracy >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
          {correct}/{items.length} correct
        </span>
      </div>

      <div className="px-4 sm:px-6 py-6 flex flex-col gap-5">

        {/* Score summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-6 shadow-sm">
          <ScoreRing pct={accuracy} />
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-green-600">{correct}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Correct</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-2xl font-extrabold text-red-500">{wrong}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Incorrect</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-gray-400">{skipped}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Skipped</p>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === f.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}>
              {f.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                filter === f.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Question list */}
        <div className="flex flex-col gap-2.5">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-400">
              No questions in this category.
            </div>
          ) : filtered.map((item) => (
            <QuestionCard key={item.lgQuestionId} item={item} index={items.indexOf(item)} bookmarked={bookmarked.has(item.lgQuestionId)} onToggleBookmark={toggleBookmark} />
          ))}
        </div>
      </div>
    </div>
  )
}
