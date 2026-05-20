'use client'
import { useState, useEffect } from 'react'
import { User, Building2, Briefcase, DollarSign, Calendar, Mail, Phone } from 'lucide-react'

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/employee/me')
      .then(r => r.json())
      .then(data => { setEmployee(data.employee); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!employee) return (
    <div className="text-center py-20 text-slate-500">Could not load your data.</div>
  )

  const netSalary = employee.salary
    ? employee.salary.basic + employee.salary.allowances - employee.salary.deductions
    : 0

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome, {employee.firstName}!</h2>
            <p className="text-white/70">{employee.role.name} · {employee.department.name}</p>
            <p className="text-white/60 text-sm font-mono">{employee.employeeId}</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" /> Personal Info
          </h3>
          <div className="space-y-3">
            {[
              { icon: Mail, label: 'Email', value: employee.email },
              { icon: Phone, label: 'Phone', value: employee.phone || '—' },
              { icon: Calendar, label: 'Join Date', value: new Date(employee.joinDate).toLocaleDateString() },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-medium text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-500" /> Job Info
          </h3>
          <div className="space-y-3">
            {[
              { icon: Building2, label: 'Department', value: employee.department.name },
              { icon: Briefcase, label: 'Role', value: employee.role.name },
              { icon: User, label: 'Status', value: employee.status.replace('_', ' ') },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-medium text-slate-800 capitalize">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary */}
      {employee.salary && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Salary Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Basic', value: employee.salary.basic, color: 'text-slate-800' },
              { label: 'Allowances', value: employee.salary.allowances, color: 'text-blue-600' },
              { label: 'Deductions', value: employee.salary.deductions, color: 'text-red-500' },
              { label: 'Net Salary', value: netSalary, color: 'text-emerald-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className={`text-lg font-bold ${color}`}>${value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}