'use client'
import { useAuth } from '@/context/AuthContext'
import { User, Shield, CheckCircle2, XCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const { user } = useAuth()

  const initials = `${user?.strFirstName?.[0] ?? ''}${user?.strLastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-2xl">

      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <User size={20} className="text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">Compte administrateur</h1>
        </div>

        <div className="flex items-center gap-4 mb-7">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 font-bold text-xl flex items-center justify-center ring-2 ring-orange-200 shrink-0">
            {initials || '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.strFirstName} {user?.strLastName}</p>
            <p className="text-sm text-gray-500">{user?.strEmail}</p>
            <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full mt-1 inline-block">ADMIN</span>
          </div>
        </div>

        <div className="flex flex-col gap-0 divide-y divide-gray-50">
          {[
            { label: 'Prénom', value: user?.strFirstName },
            { label: 'Nom', value: user?.strLastName },
            { label: 'Email', value: user?.strEmail },
            { label: 'Statut', value: user?.emStatus },
            {
              label: 'Email vérifié',
              value: user?.bEmailVerified ? (
                <span className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                  <CheckCircle2 size={14} /> Vérifié
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-500 font-medium text-sm">
                  <XCircle size={14} /> Non vérifié
                </span>
              ),
            },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-3.5">
              <span className="text-sm text-gray-500">{row.label}</span>
              {typeof row.value === 'string' || row.value === undefined
                ? <span className="text-sm font-medium text-gray-900">{row.value ?? '—'}</span>
                : row.value
              }
            </div>
          ))}
        </div>
      </div>

      {/* Role & permissions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
          <Shield size={20} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Rôle et permissions</h2>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full shrink-0 mt-0.5">ADMIN</span>
          <div className="flex flex-col gap-2">
            {[
              'Gestion des domaines (CRUD)',
              'Gestion des questions (CRUD, import bulk)',
              'Consultation de toutes les sessions',
              'Accès complet au panneau d\'administration',
            ].map(perm => (
              <div key={perm} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                {perm}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
