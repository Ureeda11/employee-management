'use client'
// src/components/employees/EmployeeTable.tsx
import { Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate, getAvatarColor, getInitials, getStatusColor } from '@/lib/utils'
import type { Employee, PaginationInfo } from '@/types'

interface Props {
  employees: Employee[]
  loading: boolean
  pagination: PaginationInfo
  onEdit: (e: Employee) => void
  onDelete: (id: string) => void
  onPageChange: (page: number) => void
}

export default function EmployeeTable({ employees, loading, pagination, onEdit, onDelete, onPageChange }: Props) {
  if (loading) return (
    <div className="bg-white rounded-2xl border border-slate-200 flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
    </div>
  )

  if (!employees.length) return (
    <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">👥</div>
      <p className="text-slate-500 font-medium">No employees found</p>
      <p className="text-sm text-slate-400">Try adjusting your filters</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Employee', 'ID', 'Department', 'Role', 'Status', 'Salary', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                {/* Avatar + Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${getAvatarColor(emp.firstName)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {getInitials(emp.firstName, emp.lastName)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-slate-400">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{emp.employeeId}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-700">{emp.department.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-500">{emp.role.name}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge className={getStatusColor(emp.status)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                    {emp.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {emp.salary ? (
                    <div>
                      <p className="font-medium text-slate-800">{formatCurrency(emp.salary.basic)}</p>
                      <p className="text-xs text-slate-400">basic/yr</p>
                    </div>
                  ) : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(emp.joinDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(emp)}
                      className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center transition">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(emp.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
        <p className="text-sm text-slate-500">
          Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-600 px-2">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button variant="secondary" size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}