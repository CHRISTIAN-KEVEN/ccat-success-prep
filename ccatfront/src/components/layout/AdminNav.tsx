'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Activity, Settings, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/apiClient'
import { MobileAdminSidebar } from './AdminSidebar'

export default function AdminNav() {
  const router = useRouter()
  const { user, clearSession } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user
    ? `${user.strFirstName?.[0] ?? ''}${user.strLastName?.[0] ?? ''}`.toUpperCase()
    : '?'
  const fullName = user ? `${user.strFirstName} ${user.strLastName}` : ''

  const handleLogout = async () => {
    setOpen(false)
    try { await api.post('/api/v1/auth/logout', {}) } catch { /* ignore */ }
    clearSession()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 sm:px-6 shrink-0 z-40">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <MobileAdminSidebar />
        <Link href="/admin" className="flex items-center gap-2 font-bold text-gray-900 shrink-0">
          <Activity size={18} className="text-blue-600" />
          <span className="hidden sm:inline">CCAT Admin</span>
        </Link>
        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">ADMIN</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-gray-900 leading-tight">{fullName}</p>
            <p className="text-[10px] text-orange-500 font-medium">ADMINISTRATEUR</p>
          </div>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(o => !o)}
              className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-orange-400 ring-offset-1 hover:ring-orange-500 transition-all"
            >
              {initials}
            </button>

            {open && (
              <div className="absolute right-0 top-10 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.strEmail}</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { setOpen(false); router.push('/admin/settings') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={15} className="text-gray-400" /> Profil
                  </button>
                  <button onClick={() => { setOpen(false); router.push('/admin/settings') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings size={15} className="text-gray-400" /> Paramètres
                  </button>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
