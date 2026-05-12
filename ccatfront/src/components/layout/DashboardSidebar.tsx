'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart2, BookOpen, ClipboardList, History,
  LayoutDashboard, Menu, Settings, X, Zap,
} from 'lucide-react'
import { useState } from 'react'
import { mockUser } from '@/data/mockDashboard'

const navItems = [
  { label: 'Analytics', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Practice Test', icon: ClipboardList, href: '/dashboard/test' },
  { label: 'Study Plan', icon: BookOpen, href: '/dashboard/study' },
  { label: 'Domain Analysis', icon: BarChart2, href: '/dashboard/analysis' },
  { label: 'Test History', icon: History, href: '/dashboard/history' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname() ?? ''

  return (
    <div className="flex flex-col h-full p-4 gap-2">
      {/* Close button — mobile only */}
      {onClose && (
        <div className="flex justify-end mb-2 lg:hidden">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Pro status card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Zap size={13} className="text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-blue-700">Pro Status</p>
        </div>
        <p className="text-xs text-blue-600 leading-relaxed">
          Expires in <strong>{mockUser.proExpiresIn} days</strong>. Keep your streak alive!
        </p>
        <button className="mt-3 w-full border border-blue-200 bg-white text-xs font-semibold text-gray-700 rounded-lg py-2 hover:bg-blue-50 transition-colors">
          Renew Early
        </button>
      </div>
    </div>
  )
}

/* Mobile overlay sidebar */
export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col overflow-y-auto">
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}

/* Desktop sidebar */
export default function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
      <SidebarContent />
    </aside>
  )
}
