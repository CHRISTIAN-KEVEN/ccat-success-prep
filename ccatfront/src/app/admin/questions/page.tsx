'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, X, Check, Upload, ChevronDown, PlusCircle, Pencil } from 'lucide-react'
import { api } from '@/lib/apiClient'
import type { QuestionResponse } from '@/lib/sessionService'
import type { DomainResponse } from '@/lib/domainService'
import { DataTable, type Column } from '@/components/ui/DataTable'
import RichTextEditor from '@/components/ui/RichTextEditor'

type Tab = 'list' | 'create' | 'edit' | 'import'

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD']
const TYPES = ['MULTIPLE_CHOICE', 'TRUE_FALSE']
const CONTENTS = ['TEXT', 'IMAGE']

interface EditableAnswer {
  lgId?: number
  strAnswerText: string
  strAnswerLabel: string
  bIsCorrect: boolean
  intSortOrder: number
}

type FormState = {
  strDomainCode: string
  emDifficulty: string
  emQuestionType: string
  emContentType: string
  strQuestionText: string
  strExplanation: string
  strHint: string
  intPointValue: number
  intTimeLimitMs: number
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim()

const labelFor = (i: number) => String.fromCharCode(65 + i)

const defaultAnswers = (): EditableAnswer[] => [1, 2, 3, 4].map((_, i) => ({
  strAnswerText: '', strAnswerLabel: labelFor(i), bIsCorrect: false, intSortOrder: i + 1,
}))

const tfAnswers = (): EditableAnswer[] => [
  { strAnswerText: 'Vrai', strAnswerLabel: 'A', bIsCorrect: false, intSortOrder: 1 },
  { strAnswerText: 'Faux', strAnswerLabel: 'B', bIsCorrect: false, intSortOrder: 2 },
]

const emptyForm = (): FormState => ({
  strDomainCode: '', emDifficulty: 'MEDIUM', emQuestionType: 'MULTIPLE_CHOICE',
  emContentType: 'TEXT', strQuestionText: '', strExplanation: '', strHint: '',
  intPointValue: 1, intTimeLimitMs: 18000,
})

const inputCls = 'border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all w-full bg-white'
const labelCls = 'text-xs font-semibold text-gray-600'

const diffColor = (d: string) =>
  d === 'EASY' ? 'bg-green-100 text-green-700' : d === 'HARD' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'

function toggleCorrect(
  list: EditableAnswer[], setList: (a: EditableAnswer[]) => void, i: number, isTF: boolean
) {
  setList(list.map((a, idx) => ({
    ...a, bIsCorrect: isTF ? idx === i && !a.bIsCorrect : idx === i ? !a.bIsCorrect : a.bIsCorrect,
  })))
}

function reindex(list: EditableAnswer[]): EditableAnswer[] {
  return list.map((a, i) => ({ ...a, strAnswerLabel: labelFor(i), intSortOrder: i + 1 }))
}

/* ─── Standalone sub-components (MUST be outside parent to preserve input focus) ─── */

function AnswerSection({ list, setList, isTF, onDelete }: {
  list: EditableAnswer[]
  setList: (a: EditableAnswer[]) => void
  isTF: boolean
  onDelete?: (lgId: number) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Réponses</h2>
        <span className="text-[11px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Cochez la/les bonne(s)</span>
      </div>
      <div className="p-5 flex flex-col gap-3">
        {list.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 border border-blue-100">
              {a.strAnswerLabel}
            </span>
            <input
              value={a.strAnswerText}
              onChange={e => setList(list.map((x, xi) => xi === i ? { ...x, strAnswerText: e.target.value } : x))}
              placeholder={`Réponse ${a.strAnswerLabel}`}
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-white"
            />
            <button
              type="button"
              onClick={() => toggleCorrect(list, setList, i, isTF)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                a.bIsCorrect ? 'bg-green-500 border-green-500 text-white shadow-sm' : 'border-gray-300 text-transparent hover:border-green-400'
              }`}
            >
              <Check size={14} />
            </button>
            {!isTF && list.length > 2 && (
              <button
                type="button"
                onClick={() => {
                  if (a.lgId && onDelete) onDelete(a.lgId)
                  setList(reindex(list.filter((_, xi) => xi !== i)))
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
              >
                <X size={15} />
              </button>
            )}
          </div>
        ))}
        {!isTF && list.length < 6 && (
          <button
            type="button"
            onClick={() => setList([...list, { strAnswerText: '', strAnswerLabel: labelFor(list.length), bIsCorrect: false, intSortOrder: list.length + 1 }])}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 w-fit"
          >
            <PlusCircle size={15} /> Ajouter une réponse
          </button>
        )}
      </div>
    </div>
  )
}

function MetaForm({ f, setF, disableDomain, domains }: {
  f: FormState
  setF: (v: FormState) => void
  disableDomain?: boolean
  domains: DomainResponse[]
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Informations de la question</h2>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Domaine</label>
            {disableDomain
              ? <div className="border border-gray-100 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm text-gray-500 font-medium">{f.strDomainCode}</div>
              : <select required value={f.strDomainCode} onChange={e => setF({ ...f, strDomainCode: e.target.value })} className={inputCls}>
                  <option value="">— Choisir —</option>
                  {domains.map(d => <option key={d.strDomainCode} value={d.strDomainCode}>{d.strLabel}</option>)}
                </select>
            }
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Difficulté</label>
            <select value={f.emDifficulty} onChange={e => setF({ ...f, emDifficulty: e.target.value })} className={inputCls}>
              {DIFFICULTIES.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Points</label>
            <input type="number" min={1} value={f.intPointValue}
              onChange={e => setF({ ...f, intPointValue: +e.target.value })} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Temps limite (ms)</label>
            <input type="number" min={1000} value={f.intTimeLimitMs}
              onChange={e => setF({ ...f, intTimeLimitMs: +e.target.value })} className={inputCls} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Texte de la question <span className="text-red-400">*</span></label>
          <RichTextEditor
            value={f.strQuestionText}
            onChange={val => setF({ ...f, strQuestionText: val })}
            placeholder="Saisissez l'énoncé de la question…"
            minHeight="110px"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Explication <span className="text-gray-300">(optionnel)</span></label>
            <textarea rows={3} value={f.strExplanation}
              onChange={e => setF({ ...f, strExplanation: e.target.value })}
              placeholder="Explication de la bonne réponse…"
              className={`${inputCls} resize-none`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Indice <span className="text-gray-300">(optionnel)</span></label>
            <textarea rows={3} value={f.strHint}
              onChange={e => setF({ ...f, strHint: e.target.value })}
              placeholder="Indice pour guider l'utilisateur…"
              className={`${inputCls} resize-none`} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main page ─── */

export default function AdminQuestionsPage() {
  const [domains, setDomains] = useState<DomainResponse[]>([])
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [selectedDomain, setSelectedDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('list')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  const [form, setForm] = useState<FormState>(emptyForm())
  const [answers, setAnswers] = useState<EditableAnswer[]>(defaultAnswers())

  const [editQ, setEditQ] = useState<QuestionResponse | null>(null)
  const [editForm, setEditForm] = useState<FormState>(emptyForm())
  const [editAnswers, setEditAnswers] = useState<EditableAnswer[]>([])
  const [deletedIds, setDeletedIds] = useState<number[]>([])

  const [importJson, setImportJson] = useState('')
  const [importError, setImportError] = useState('')

  useEffect(() => {
    api.get<DomainResponse[]>('/api/v1/domains/all').then(d => {
      setDomains(d)
    }).catch((err: unknown) => {
      setLoadError((err as { message?: string })?.message ?? 'Impossible de charger les domaines')
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    setLoadError('')
    const path = selectedDomain ? `/api/v1/questions/domain/${selectedDomain}` : '/api/v1/questions/all'
    api.get<QuestionResponse[]>(path)
      .then(setQuestions)
      .catch((err: unknown) => {
        setQuestions([])
        setLoadError((err as { message?: string })?.message ?? 'Impossible de charger les questions')
      })
      .finally(() => setLoading(false))
  }, [selectedDomain])

  const reloadDomain = async (code: string) => {
    setLoadError('')
    const path = code ? `/api/v1/questions/domain/${code}` : '/api/v1/questions/all'
    try {
      const data = await api.get<QuestionResponse[]>(path)
      setQuestions(data)
    } catch (err: unknown) {
      setQuestions([])
      setLoadError((err as { message?: string })?.message ?? 'Impossible de charger les questions')
      throw err
    }
  }

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!answers.some(a => a.bIsCorrect)) { setError('Au moins une bonne réponse requise'); return }
    if (answers.some(a => !a.strAnswerText.trim())) { setError('Toutes les réponses doivent avoir un texte'); return }
    setSaving(true); setError('')
    try {
      const targetDomain = form.strDomainCode || selectedDomain
      await api.post('/api/v1/questions/bulk-import', [{
        ...form, answers: answers.map(a => ({ ...a, lgQuestionId: 0 })),
      }])
      setTab('list')
      // reload errors show via loadError in the list tab — don't block the creation success
      if (!selectedDomain) {
        reloadDomain('').catch(() => {})
      } else if (targetDomain && targetDomain !== selectedDomain) {
        setSelectedDomain(targetDomain)
      } else if (targetDomain) {
        reloadDomain(targetDomain).catch(() => {})
      }
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Erreur lors de la création')
    } finally { setSaving(false) }
  }

  const openEdit = (q: QuestionResponse) => {
    setEditQ(q)
    setEditForm({
      strDomainCode: q.strDomainCode, emDifficulty: q.emDifficulty,
      emQuestionType: q.emQuestionType, emContentType: q.emContentType ?? 'TEXT',
      strQuestionText: q.strQuestionText, strExplanation: q.strExplanation ?? '',
      strHint: q.strHint ?? '', intPointValue: q.intPointValue,
      intTimeLimitMs: q.intTimeLimitMs ?? 18000,
    })
    setEditAnswers(q.answers.map(a => ({
      lgId: a.lgId, strAnswerText: a.strAnswerText, strAnswerLabel: a.strAnswerLabel,
      bIsCorrect: a.bIsCorrect ?? false, intSortOrder: a.intSortOrder,
    })))
    setDeletedIds([])
    setError('')
    setTab('edit')
  }

  const handleSaveEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!editQ) return
    if (!editAnswers.some(a => a.bIsCorrect)) { setError('Au moins une bonne réponse requise'); return }
    if (editAnswers.some(a => !a.strAnswerText.trim())) { setError('Toutes les réponses doivent avoir un texte'); return }
    setSaving(true); setError('')
    try {
      await api.patch(`/api/v1/questions/${editQ.strUuid}`, {
        emDifficulty: editForm.emDifficulty, emQuestionType: editForm.emQuestionType,
        emContentType: editForm.emContentType, strQuestionText: editForm.strQuestionText,
        strExplanation: editForm.strExplanation || null, strHint: editForm.strHint || null,
        intPointValue: editForm.intPointValue, intTimeLimitMs: editForm.intTimeLimitMs,
      })
      await Promise.all(deletedIds.map(id => api.delete(`/api/v1/questions/answers/${id}`)))
      await Promise.all(editAnswers.map(a =>
        a.lgId
          ? api.patch(`/api/v1/questions/answers/${a.lgId}`, {
              lgQuestionId: editQ.lgId, strAnswerText: a.strAnswerText,
              strAnswerLabel: a.strAnswerLabel, bIsCorrect: a.bIsCorrect, intSortOrder: a.intSortOrder,
            })
          : api.post(`/api/v1/questions/${editQ.strUuid}/answers`, {
              lgQuestionId: editQ.lgId, strAnswerText: a.strAnswerText,
              strAnswerLabel: a.strAnswerLabel, bIsCorrect: a.bIsCorrect, intSortOrder: a.intSortOrder,
            })
      ))
      setTab('list')
      await reloadDomain(selectedDomain)
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Erreur')
    } finally { setSaving(false) }
  }

  const handleDelete = async (uuid: string) => {
    if (!confirm('Désactiver cette question ?')) return
    await api.delete(`/api/v1/questions/${uuid}`)
    setQuestions(q => q.filter(x => x.strUuid !== uuid))
  }

  const handleBulkImport = async () => {
    setImportError(''); setSaving(true)
    try {
      const payload = JSON.parse(importJson) as Array<{ strDomainCode?: string }>
      const targetDomain = payload.find(item => item?.strDomainCode)?.strDomainCode ?? selectedDomain
      await api.post('/api/v1/questions/bulk-import', payload)
      setImportJson(''); setTab('list')
      if (!selectedDomain) {
        reloadDomain('').catch(() => {})
      } else if (targetDomain && targetDomain !== selectedDomain) {
        setSelectedDomain(targetDomain)
      } else if (targetDomain) {
        reloadDomain(targetDomain).catch(() => {})
      }
    } catch (err: unknown) {
      setImportError((err as { message?: string })?.message ?? 'JSON invalide')
    } finally { setSaving(false) }
  }

  const columns: Column<QuestionResponse>[] = [
    {
      key: 'strQuestionText', header: 'Question', sortable: true,
      render: q => (
        <div className="max-w-xs">
          <p className="text-gray-800 font-medium truncate">{stripHtml(q.strQuestionText)}</p>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{q.strUuid.slice(0, 8)}…</p>
        </div>
      ),
    },
    {
      key: 'emDifficulty', header: 'Difficulté', sortable: true,
      render: q => (
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${diffColor(q.emDifficulty)}`}>
          {q.emDifficulty}
        </span>
      ),
    },
    { key: 'strDomainCode', header: 'Domaine', sortable: true, render: q => <span className="text-xs text-gray-500">{q.strDomainCode}</span> },
    { key: 'emQuestionType', header: 'Type', render: q => <span className="text-xs text-gray-500">{q.emQuestionType}</span> },
    { key: 'intPointValue', header: 'Points', sortable: true, render: q => <span className="text-gray-600">{q.intPointValue}</span> },
    { key: 'answers', header: 'Réponses', render: q => <span className="text-gray-600">{q.answers?.length ?? 0}</span> },
    {
      key: 'actions', header: 'Actions',
      render: q => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(q)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => handleDelete(q.strUuid)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  const tabs: { key: Tab; label: string }[] = [
    { key: 'list', label: 'Liste' },
    { key: 'create', label: 'Créer' },
    { key: 'import', label: 'Import' },
  ]
  if (tab === 'edit') tabs.push({ key: 'edit', label: 'Modifier' })

  const btnPrimary = 'flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors'
  const btnSecondary = 'flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gérez la banque de questions du CCAT.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setImportError(''); setTab('import') }}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <Upload size={14} /> Import JSON
          </button>
          <button onClick={() => { setForm(emptyForm()); setAnswers(defaultAnswers()); setError(''); setTab('create') }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            <Plus size={15} /> Nouvelle question
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(({ key: t, label }) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* LIST */}
      {tab === 'list' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-700 shrink-0">Domaine :</label>
            <div className="relative">
              <select value={selectedDomain} onChange={e => setSelectedDomain(e.target.value)}
                className="border border-gray-200 rounded-xl px-3.5 py-2 pr-9 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 appearance-none transition-all bg-white">
                <option value="">Tous les domaines</option>
                {domains.map(d => <option key={d.strDomainCode} value={d.strDomainCode}>{d.strLabel}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{questions.length} question(s)</span>
          </div>
          {loadError && (
            <div className="flex items-center justify-between gap-3 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl mb-4">
              <span>{loadError}</span>
              <button
                onClick={() => reloadDomain(selectedDomain).catch(() => {})}
                className="shrink-0 text-xs font-semibold underline hover:no-underline"
              >Réessayer</button>
            </div>
          )}
          {loading
            ? <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-blue-600" /></div>
            : <DataTable data={questions} columns={columns} searchPlaceholder="Rechercher une question…" emptyMessage={selectedDomain ? 'Aucune question pour ce domaine.' : 'Aucune question disponible.'} />
          }
        </div>
      )}

      {/* CREATE */}
      {tab === 'create' && (
        <div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl mb-4">{error}</p>}
          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <div className="grid lg:grid-cols-2 gap-5 items-start">
              {/* Colonne gauche */}
              <div className="flex flex-col gap-5">
                <MetaForm f={form} setF={setForm} domains={domains} />
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">Type de question</h2>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelCls}>Type de question</label>
                      <select value={form.emQuestionType} onChange={e => {
                        const t = e.target.value
                        setForm(f => ({ ...f, emQuestionType: t }))
                        setAnswers(t === 'TRUE_FALSE' ? tfAnswers() : defaultAnswers())
                      }} className={inputCls}>
                        {TYPES.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelCls}>Type de contenu</label>
                      <select value={form.emContentType}
                        onChange={e => setForm(f => ({ ...f, emContentType: e.target.value }))} className={inputCls}>
                        {CONTENTS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* Colonne droite */}
              <div className="flex flex-col gap-5">
                <AnswerSection list={answers} setList={setAnswers} isTF={form.emQuestionType === 'TRUE_FALSE'} />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setTab('list')} className={btnSecondary}>Annuler</button>
                  <button type="submit" disabled={saving} className={btnPrimary}>
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <><Check size={15} /> Créer la question</>}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* EDIT */}
      {tab === 'edit' && editQ && (
        <div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl mb-4">{error}</p>}
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-5">
            <div className="grid lg:grid-cols-2 gap-5 items-start">
              {/* Colonne gauche */}
              <MetaForm f={editForm} setF={setEditForm} domains={domains} disableDomain />
              {/* Colonne droite */}
              <div className="flex flex-col gap-5">
                <AnswerSection
                  list={editAnswers} setList={setEditAnswers}
                  isTF={editForm.emQuestionType === 'TRUE_FALSE'}
                  onDelete={id => setDeletedIds(prev => [...prev, id])}
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setTab('list')} className={btnSecondary}>Annuler</button>
                  <button type="submit" disabled={saving} className={btnPrimary}>
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <><Check size={15} /> Enregistrer</>}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* IMPORT */}
      {tab === 'import' && (
        <div className="max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Import JSON</h2>
              <p className="text-xs text-gray-500 mt-0.5">Tableau JSON de questions avec <code className="bg-gray-100 px-1 rounded font-mono">answers</code>.</p>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {importError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">{importError}</p>}
              <textarea rows={16} value={importJson} onChange={e => setImportJson(e.target.value)}
                placeholder={`[\n  {\n    "strDomainCode": "VERBAL",\n    "emDifficulty": "MEDIUM",\n    "emQuestionType": "MULTIPLE_CHOICE",\n    "emContentType": "TEXT",\n    "strQuestionText": "...",\n    "answers": [\n      {"lgQuestionId":0,"strAnswerText":"A","strAnswerLabel":"A","bIsCorrect":true,"intSortOrder":1}\n    ]\n  }\n]`}
                className="border border-gray-200 rounded-xl px-3.5 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none w-full bg-white" />
              <div className="flex gap-3">
                <button onClick={() => setTab('list')} className={btnSecondary}>Annuler</button>
                <button onClick={handleBulkImport} disabled={saving || !importJson.trim()} className={btnPrimary}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <><Upload size={15} /> Importer</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
