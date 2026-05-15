'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminNav from '@/components/layout/AdminNav'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return
    if (!isAuthenticated) router.replace('/login')
    else if (user?.emRole !== 'ADMIN') router.replace('/dashboard')
  }, [isAuthenticated, isHydrated, user, router])

  if (!isHydrated || !isAuthenticated || user?.emRole !== 'ADMIN') return null

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AdminNav />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
