'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Activity, HelpCircle, LayoutDashboard, Settings, LogOut, User } from 'lucide-react'
import { mockUser } from '@/data/mockDashboard'
import { MobileSidebar } from './DashboardSidebar'

export default function DashboardNav() {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 sm:px-6 shrink-0 z-40">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <MobileSidebar />

        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 shrink-0">
          <Activity size={18} className="text-blue-600" />
          <span className="hidden sm:inline">CCAT Pro</span>
        </Link>

        <Link
          href="/dashboard"
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
            pathname.startsWith('/dashboard')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <LayoutDashboard size={15} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <HelpCircle size={18} />
        </button>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-gray-900 leading-tight">{mockUser.name}</p>
            <p className="text-[10px] text-blue-600 font-medium">{mockUser.tier}</p>
          </div>

          {/* Avatar + dropdown */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(o => !o)}
              className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-green-400 ring-offset-1 hover:ring-blue-400 transition-all"
            >
              {mockUser.initials}
            </button>

            {open && (
              <div className="absolute right-0 top-10 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{mockUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">{mockUser.email}</p>
                </div>

                {/* Links */}
                <div className="py-1">
                  <button
                    onClick={() => { setOpen(false); router.push('/dashboard/settings') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={15} className="text-gray-400" /> Profile
                  </button>
                  <button
                    onClick={() => { setOpen(false); router.push('/dashboard/settings') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={15} className="text-gray-400" /> Settings
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => { setOpen(false); router.push('/login') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
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
