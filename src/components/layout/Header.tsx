'use client'
// src/components/layout/Header.tsx
import { Bell, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/dashboard':   'Dashboard',
  '/employees':   'Employees',
  '/departments': 'Departments',
  '/roles':       'Roles & Permissions',
  '/settings':    'Settings',
}

export default function Header() {
  const pathname = usePathname()
  const base = '/' + pathname.split('/')[1]
  const title = titles[base] ?? 'EMS Admin'

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 gap-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl w-56 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            SA
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-slate-800">Super Admin</div>
            <div className="text-xs text-slate-400">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  )
}