'use client'
import { useEffect, useState } from 'react'
import { Bookmark, BookmarkX, ChevronDown, ChevronUp, Clock, Lightbulb, Loader2 } from 'lucide-react'
import { bookmarkService, type BookmarkResponse } from '@/lib/bookmarkService'
import type { AnswerResponse } from '@/lib/sessionService'

function AnswerOption({ ans }: { ans: AnswerResponse }) {
  const correct = ans.bIsCorrect
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
      correct ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
    }`}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
        correct ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {ans.strAnswerLabel}
      </span>
      <p className={`text-sm leading-snug ${correct ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
        {ans.strAnswerText}
      </p>
    </div>
  )
}

function BookmarkCard({ bm, onRemove }: { bm: BookmarkResponse; onRemove: (id: number) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-stretch text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-1 shrink-0 bg-blue-400" />
        <div className="flex-1 flex items-center gap-3 px-4 py-3.5 min-w-0">
          <p className="flex-1 text-sm font-medium text-gray-800 line-clamp-1 min-w-0"
            dangerouslySetInnerHTML={{ __html: bm.strQuestionText ?? '' }} />
        </div>
        <div className="flex items-center gap-3 px-4 shrink-0">
          <span className="hidden sm:block text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {bm.strDomainCode}
          </span>
          <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {bm.emDifficulty}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onRemove(bm.lgQuestionId) }}
            className="text-blue-400 hover:text-red-400 transition-colors"
            title="Retirer le bookmark"
          >
            <BookmarkX size={15} />
          </button>
          <div className="text-gray-400">
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: bm.strQuestionText ?? '' }} />

          <div className="flex flex-col gap-2">
            {bm.answers.map(ans => <AnswerOption key={ans.lgId} ans={ans} />)}
          </div>

          {bm.strExplanation && (
            <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
              <Lightbulb size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wide mb-1">Explication</p>
                <p className="text-sm text-blue-700 leading-relaxed">{bm.strExplanation}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock size={10} /> Ajouté le {new Date(bm.dtCreated).toLocaleDateString('fr-FR')}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkResponse[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    bookmarkService.getMyBookmarks()
      .then(setBookmarks)
      .finally(() => setLoading(false))
  }, [])

  const remove = async (questionId: number) => {
    await bookmarkService.toggle(questionId)
    setBookmarks(prev => prev.filter(b => b.lgQuestionId !== questionId))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin text-blue-600" />
    </div>
  )

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2.5">
        <Bookmark size={20} className="text-blue-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bookmarks</h1>
          <p className="text-xs text-gray-400 mt-0.5">{bookmarks.length} question{bookmarks.length !== 1 ? 's' : ''} sauvegardée{bookmarks.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center gap-3">
          <Bookmark size={32} className="text-gray-200" />
          <p className="text-sm font-medium text-gray-500">Aucun bookmark pour l&apos;instant</p>
          <p className="text-xs text-gray-400">Clique sur l&apos;icône <Bookmark size={11} className="inline" /> dans la revue d&apos;un test pour sauvegarder une question.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookmarks.map(bm => (
            <BookmarkCard key={bm.lgId} bm={bm} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
