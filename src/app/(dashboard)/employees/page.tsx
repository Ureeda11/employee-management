'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import EmployeeTable from '@/components/employees/EmployeeTable'
import EmployeeForm from '@/components/employees/EmployeeForm'
import type { Employee, Department, Role, PaginationInfo } from '@/types'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Employee | null>(null)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const fetchEmployees = useCallback(async (page = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '10' })
    if (search) params.set('search', search)
    if (filterDept) params.set('departmentId', filterDept)
    if (filterStatus) params.set('status', filterStatus)
    const res = await fetch(`/api/employees?${params}`)
    const data = await res.json()
    setEmployees(data.employees ?? [])
    setPagination(data.pagination)
    setLoading(false)
  }, [search, filterDept, filterStatus])

  useEffect(() => { fetchEmployees(1) }, [fetchEmployees])

  useEffect(() => {
    Promise.all([
      fetch('/api/departments').then(r => r.json()),
      fetch('/api/roles').then(r => r.json()),
    ]).then(([d, r]) => {
      setDepartments(d.departments ?? [])
      setRoles(r.roles ?? [])
    })
  }, [])

  const openAdd = () => { setEditTarget(null); setShowModal(true) }
  const openEdit = (emp: Employee) => { setEditTarget(emp); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditTarget(null) }
  const handleSaved = () => { closeModal(); fetchEmployees(pagination.page) }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee?')) return
    await fetch(`/api/employees/${id}`, { method: 'DELETE' })
    fetchEmployees(pagination.page)
  }

  const exportCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Role', 'Status']
    const rows = employees.map(e => [e.employeeId, e.firstName, e.lastName, e.email, e.department.name, e.role.name, e.status])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'employees.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">All Employees</h2>
          <p className="text-sm text-slate-400">{pagination.total} total records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 text-sm px-4 py-2.5 font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={openAdd} className="inline-flex items-center gap-2 text-sm px-4 py-2.5 font-medium rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg">
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, ID…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer">
              <option value="">All Depts</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      <EmployeeTable
        employees={employees} loading={loading} pagination={pagination}
        onEdit={openEdit} onDelete={handleDelete} onPageChange={fetchEmployees}
      />

      <Modal open={showModal} onClose={closeModal}
        title={editTarget ? 'Edit Employee' : 'Add New Employee'} size="xl">
        <EmployeeForm
          employee={editTarget} departments={departments} roles={roles}
          onSaved={handleSaved} onCancel={closeModal}
        />
      </Modal>
    </div>
  )
}