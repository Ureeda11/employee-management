import { prisma } from '@/lib/prisma'
import { Users, TrendingUp, Building2, Clock, DollarSign, UserPlus } from 'lucide-react'

async function getStats() {
  const [total, active, onLeave, depts, salaries, thisMonth] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: 'active' } }),
    prisma.employee.count({ where: { status: 'on_leave' } }),
    prisma.department.count(),
    prisma.salary.aggregate({ _sum: { basic: true, allowances: true, deductions: true } }),
    prisma.employee.count({
      where: {
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }
    })
  ])
  const payroll = (salaries._sum.basic ?? 0) + (salaries._sum.allowances ?? 0) - (salaries._sum.deductions ?? 0)
  return { total, active, onLeave, depts, payroll, thisMonth }
}

async function getRecentEmployees() {
  return prisma.employee.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { department: true, role: true, salary: true }
  })
}

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([getStats(), getRecentEmployees()])

  const statCards = [
    { label: 'Total Employees', value: stats.total, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Active Employees', value: stats.active, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Departments', value: stats.depts, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'On Leave', value: stats.onLeave, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Monthly Payroll', value: `$${stats.payroll.toLocaleString()}`, icon: DollarSign, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'New This Month', value: stats.thisMonth, icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back, Super Admin!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Employees */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Recent Employees</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recent.map((emp: any) => (
            <div key={emp.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {emp.firstName[0]}{emp.lastName[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{emp.firstName} {emp.lastName}</p>
                <p className="text-sm text-slate-400">{emp.role.name} · {emp.department.name}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                emp.status === 'on_leave' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {emp.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}