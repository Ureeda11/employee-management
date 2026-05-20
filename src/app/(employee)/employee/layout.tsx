'use client'
import { Users, LogOut, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/employee/logout', { method: 'POST' })
    window.location.href = '/employee-login'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-white border-r border-slate-200 shadow-sm">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">Employee Portal</div>
            <div className="text-xs text-slate-400">My Account</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/employee/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === '/employee/dashboard'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}>
            <LayoutDashboard className="w-4 h-4" />
            My Dashboard
          </Link>
        </nav>

        <div className="px-3 py-4 border-t border-slate-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <h1 className="text-lg font-semibold text-slate-800">Employee Portal</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}