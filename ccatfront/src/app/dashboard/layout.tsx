import DashboardNav from '@/components/layout/DashboardNav'
import DashboardSidebar from '@/components/layout/DashboardSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header — fixe en haut */}
      <DashboardNav />

      {/* Body — sidebar + contenu */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — fixe à gauche */}
        <DashboardSidebar />

        {/* Content — seule zone scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
