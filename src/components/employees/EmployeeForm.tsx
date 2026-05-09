'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Employee, Department, Role } from '@/types'

interface Props {
  employee?: Employee | null
  departments: Department[]
  roles: Role[]
  onSaved: () => void
  onCancel: () => void
}

export default function EmployeeForm({ employee, departments, roles, onSaved, onCancel }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm] = useState({
    firstName:    employee?.firstName    ?? '',
    lastName:     employee?.lastName     ?? '',
    email:        employee?.email        ?? '',
    phone:        employee?.phone        ?? '',
    address:      employee?.address      ?? '',
    dateOfBirth:  employee?.dateOfBirth  ? employee.dateOfBirth.split('T')[0] : '',
    joinDate:     employee?.joinDate     ? employee.joinDate.split('T')[0]    : '',
    status:       employee?.status       ?? 'active',
    departmentId: employee?.departmentId ? String(employee.departmentId) : '',
    roleId:       employee?.roleId       ? String(employee.roleId)       : '',
    basicSalary:  employee?.salary?.basic       ? String(employee.salary.basic)       : '',
    allowances:   employee?.salary?.allowances  ? String(employee.salary.allowances)  : '0',
    deductions:   employee?.salary?.deductions  ? String(employee.salary.deductions)  : '0',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const url    = employee ? `/api/employees/${employee.id}` : '/api/employees'
      const method = employee ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return }
      onSaved()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = "w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* Personal info */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-600 flex items-center justify-center text-xs">1</span>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="First Name *" value={form.firstName} onChange={set('firstName')} required placeholder="Alice" />
          <Input label="Last Name *"  value={form.lastName}  onChange={set('lastName')}  required placeholder="Johnson" />
          <Input label="Email *"      value={form.email}     onChange={set('email')}     required type="email" placeholder="alice@company.com" />
          <Input label="Phone"        value={form.phone}     onChange={set('phone')}     type="tel"  placeholder="+1-555-0100" />
          <Input label="Date of Birth" value={form.dateOfBirth} onChange={set('dateOfBirth')} type="date" />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select value={form.status} onChange={set('status')} className={fieldClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <textarea value={form.address} onChange={set('address')} rows={2}
            className={fieldClass + ' resize-none'}
            placeholder="123 Main St, City, Country" />
        </div>
      </div>

      {/* Job info */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-600 flex items-center justify-center text-xs">2</span>
          Job Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Department *</label>
            <select value={form.departmentId} onChange={set('departmentId')} required className={fieldClass}>
              <option value="">Select department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Role *</label>
            <select value={form.roleId} onChange={set('roleId')} required className={fieldClass}>
              <option value="">Select role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <Input label="Join Date" value={form.joinDate} onChange={set('joinDate')} type="date" />
        </div>
      </div>

      {/* Salary */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-600 flex items-center justify-center text-xs">3</span>
          Salary Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input label="Basic Salary (USD)" value={form.basicSalary} onChange={set('basicSalary')} type="number" min="0" placeholder="75000" />
          <Input label="Allowances"         value={form.allowances}  onChange={set('allowances')}  type="number" min="0" placeholder="5000" />
          <Input label="Deductions"         value={form.deductions}  onChange={set('deductions')}  type="number" min="0" placeholder="2000" />
        </div>
        {form.basicSalary && (
          <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-emerald-700">
              Net Salary: <strong>
                ${(parseFloat(form.basicSalary || '0') + parseFloat(form.allowances || '0') - parseFloat(form.deductions || '0')).toLocaleString()}
              </strong> / year
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
          ) : employee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  )
}