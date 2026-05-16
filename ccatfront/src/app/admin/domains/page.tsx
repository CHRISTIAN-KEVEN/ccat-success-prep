'use client'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react'
import { api } from '@/lib/apiClient'
import { DataTable, type Column } from '@/components/ui/DataTable'

interface Domain {
  strDomainCode: string
  strLabel: string
  strDescription: string | null
  emStatus: string
  intDefaultRatio: number
  intQuestionCount: number
  intSortOrder: number
}

interface DomainForm {
  strDomainCode: string
  strLabel: string
  strDescription: string
  intDefaultRatio: number
  intSortOrder: number
}

const empty: DomainForm = { strDomainCode: '', strLabel: '', strDescription: '', intDefaultRatio: 33, intSortOrder: 0 }

const inputCls = 'border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all w-full'
const labelCls = 'text-xs font-semibold text-gray-600'

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<DomainForm>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    api.get<Domain[]>('/api/v1/domains/all').then(setDomains).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); setError('') }
  const openEdit = (d: Domain) => {
    setEditing(d.strDomainCode)
    setForm({ strDomainCode: d.strDomainCode, strLabel: d.strLabel, strDescription: d.strDescription ?? '', intDefaultRatio: d.intDefaultRatio, intSortOrder: d.intSortOrder })
    setShowForm(true)
    setError('')
  }

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await api.patch(`/api/v1/domains/${editing}`, { strLabel: form.strLabel, strDescription: form.strDescription, intDefaultRatio: form.intDefaultRatio, intSortOrder: form.intSortOrder })
      } else {
        await api.post('/api/v1/domains', form)
      }
      setShowForm(false)
      load()
    } catch (err: unknown) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (d: Domain) => {
    const newStatus = d.emStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await api.patch(`/api/v1/domains/${d.strDomainCode}`, { emStatus: newStatus })
      load()
    } catch { /* ignore */ }
  }

  const handleDelete = async (code: string) => {
    if (!confirm(`Disable domain ${code}?`)) return
    await api.delete(`/api/v1/domains/${code}`)
    load()
  }

  const columns: Column<Domain>[] = [
    {
      key: 'strDomainCode', header: 'Code', sortable: true,
      render: d => <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{d.strDomainCode}</span>,
    },
    {
      key: 'strLabel', header: 'Label', sortable: true,
      render: d => <span className="font-medium text-gray-800">{d.strLabel}</span>,
    },
    { key: 'intQuestionCount', header: 'Questions', sortable: true, render: d => <span className="text-gray-600">{d.intQuestionCount ?? 0}</span> },
    { key: 'intDefaultRatio', header: 'Ratio', sortable: true, render: d => <span className="text-gray-600">{d.intDefaultRatio}%</span> },
    { key: 'intSortOrder', header: 'Order', sortable: true, render: d => <span className="text-gray-600">{d.intSortOrder}</span> },
    {
      key: 'emStatus', header: 'Status',
      render: d => (
        <button
          onClick={() => handleToggle(d)}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
            d.emStatus === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {d.emStatus}
        </button>
      ),
    },
    {
      key: 'actions', header: 'Actions',
      render: d => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(d)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => handleDelete(d.strDomainCode)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Domains</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage question bank categories.</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={15} /> New Domain
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Domain' : 'New Domain'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl mb-4">{error}</p>}
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                {!editing && (
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Code (unique)</label>
                    <input required value={form.strDomainCode}
                      onChange={e => setForm(f => ({ ...f, strDomainCode: e.target.value.toUpperCase() }))}
                      placeholder="ex: VERBAL" className={inputCls} />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Label</label>
                  <input required value={form.strLabel}
                    onChange={e => setForm(f => ({ ...f, strLabel: e.target.value }))}
                    placeholder="ex: Verbal Reasoning" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Description</label>
                  <textarea rows={2} value={form.strDescription}
                    onChange={e => setForm(f => ({ ...f, strDescription: e.target.value }))}
                    className={`${inputCls} resize-none`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Default Ratio (%)</label>
                    <input type="number" min={0} max={100} value={form.intDefaultRatio}
                      onChange={e => setForm(f => ({ ...f, intDefaultRatio: +e.target.value }))}
                      className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Display Order</label>
                    <input type="number" value={form.intSortOrder}
                      onChange={e => setForm(f => ({ ...f, intSortOrder: +e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <><Check size={15} /> Save</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-blue-600" /></div>
      ) : (
        <DataTable
          data={domains}
          columns={columns}
          searchPlaceholder="Search a domain..."
          emptyMessage="No domains."
        />
      )}
    </div>
  )
}
