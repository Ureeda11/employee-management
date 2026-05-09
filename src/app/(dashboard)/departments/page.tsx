'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Building2, Users } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import type { Department } from '@/types'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Department | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchDepts = async () => {
    setLoading(true)
    const res = await fetch('/api/departments')
    const data = await res.json()
    setDepartments(data.departments ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchDepts() }, [])

  const openAdd = () => { setEditTarget(null); setForm({ name: '', description: '' }); setError(''); setShowModal(true) }
  const openEdit = (d: Department) => { setEditTarget(d); setForm({ name: d.name, description: d.description ?? '' }); setError(''); setShowModal(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    const url = editTarget ? `/api/departments/${editTarget.id}` : '/api/departments'
    const method = editTarget ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Error'); setSaving(false); return }
    setShowModal(false); fetchDepts(); setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this department?')) return
    const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { alert(data.error); return }
    fetchDepts()
  }

  const colors = ['from-violet-500 to-indigo-600', 'from-blue-500 to-cyan-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-pink-500 to-rose-600']

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Departments</h2>
          <p className="text-sm text-slate-400">{departments.length} departments configured</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 text-sm px-4 py-2.5 font-medium rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <div key={dept.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${colors[i % colors.length]} flex items-center justify-center shadow-lg`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(dept)} className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(dept.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{dept.name}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{dept.description || 'No description'}</p>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Users className="w-4 h-4" />
                <span>{dept._count?.employees ?? 0} employees</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Department' : 'Add Department'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Engineering"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="What does this department do?" />
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium rounded-xl bg-slate-100 text-slate-700">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2.5 text-sm font-medium rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white">
              {saving ? 'Saving…' : editTarget ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}