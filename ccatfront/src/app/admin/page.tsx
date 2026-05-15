'use client'
import { useEffect, useState } from 'react'
import { BookOpen, HelpCircle, Loader2, Activity, TrendingUp } from 'lucide-react'
import { type DomainResponse } from '@/lib/domainService'
import { api } from '@/lib/apiClient'
import { DataTable, type Column } from '@/components/ui/DataTable'
import Link from 'next/link'

interface DomainWithAll extends DomainResponse {
  emStatus: string
}

export default function AdminDashboardPage() {
  const [domains, setDomains] = useState<DomainWithAll[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<DomainWithAll[]>('/api/v1/domains/all')
      .then(setDomains)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const active = domains.filter(d => d.emStatus === 'ACTIVE')
  const totalQuestions = domains.reduce((a, d) => a + (d.intQuestionCount ?? 0), 0)

  const stats = [
    { label: 'DOMAINES ACTIFS', value: active.length, icon: BookOpen, color: 'text-blue-600 bg-blue-50', border: 'border-blue-100' },
    { label: 'TOTAL DOMAINES', value: domains.length, icon: Activity, color: 'text-gray-600 bg-gray-100', border: 'border-gray-200' },
    { label: 'TOTAL QUESTIONS', value: totalQuestions, icon: HelpCircle, color: 'text-purple-600 bg-purple-50', border: 'border-purple-100' },
    { label: 'TAUX ACTIF', value: domains.length ? `${Math.round((active.length / domains.length) * 100)}%` : '—', icon: TrendingUp, color: 'text-green-600 bg-green-50', border: 'border-green-100' },
  ]

  const columns: Column<DomainWithAll>[] = [
    {
      key: 'strDomainCode', header: 'Code', sortable: true,
      render: d => <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{d.strDomainCode}</span>,
    },
    {
      key: 'strLabel', header: 'Label', sortable: true,
      render: d => <span className="font-medium text-gray-800">{d.strLabel}</span>,
    },
    { key: 'intQuestionCount', header: 'Questions', sortable: true, render: d => <span className="text-gray-600">{d.intQuestionCount ?? 0}</span> },
    {
      key: 'emStatus', header: 'Statut',
      render: d => (
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${d.emStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {d.emStatus}
        </span>
      ),
    },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={24} className="animate-spin text-blue-600" />
    </div>
  )

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vue d'ensemble de la banque de questions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-xl p-4 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 leading-tight">{s.value}</p>
              <p className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase mt-0.5 truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Tous les domaines</h2>
          <Link href="/admin/domains" className="text-xs text-blue-600 hover:underline font-medium">Gérer →</Link>
        </div>
        <DataTable
          data={domains}
          columns={columns}
          searchable={false}
          emptyMessage="Aucun domaine."
        />
      </div>
    </div>
  )
}
