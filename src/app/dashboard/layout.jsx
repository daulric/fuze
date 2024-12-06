import Sidebar from '@/components/dashboard/sidebar'
import Header from '@/components/dashboard/header'

export default function DashboardLayout({children}) {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}