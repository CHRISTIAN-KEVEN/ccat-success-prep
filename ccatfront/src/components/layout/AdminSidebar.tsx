'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, HelpCircle, Settings, Menu, X, Shield } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', exact: true },
  { label: 'Domaines', icon: BookOpen, href: '/admin/domains' },
  { label: 'Questions', icon: HelpCircle, href: '/admin/questions' },
  { label: 'Paramètres', icon: Settings, href: '/admin/settings' },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname() ?? ''

  return (
    <div className="flex flex-col h-full p-4 gap-2">
      {onClose && (
        <div className="flex justify-end mb-2 lg:hidden">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>
      )}

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, icon: Icon, href, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
            <Shield size={13} className="text-orange-600" />
          </div>
          <p className="text-sm font-semibold text-orange-700">Admin Panel</p>
        </div>
        <p className="text-xs text-orange-600 leading-relaxed">
          Accès complet à la gestion des <strong>domaines</strong> et <strong>questions</strong>.
        </p>
      </div>
    </div>
  )
}

export function MobileAdminSidebar() {
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

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
      <SidebarContent />
    </aside>
  )
}
