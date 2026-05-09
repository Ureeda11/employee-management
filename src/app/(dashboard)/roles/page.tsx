'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import type { Role } from '@/types'

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Role | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchRoles = async () => {
    setLoading(true)
    const res = await fetch('/api/roles')
    const data = await res.json()
    setRoles(data.roles ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchRoles() }, [])

  const openAdd = () => { setEditTarget(null); setForm({ name: '', description: '' }); setError(''); setShowModal(true) }
  const openEdit = (r: Role) => { setEditTarget(r); setForm({ name: r.name, description: r.description ?? '' }); setError(''); setShowModal(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    const url = editTarget ? `/api/roles/${editTarget.id}` : '/api/roles'
    const method = editTarget ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Error'); setSaving(false); return }
    setShowModal(false); fetchRoles(); setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this role?')) return
    const res = await fetch(`/api/roles/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { alert(data.error); return }
    fetchRoles()
  }

  const colors = ['from-violet-500 to-purple-600', 'from-blue-500 to-indigo-600', 'from-emerald-500 to-green-600', 'from-orange-500 to-amber-600', 'from-pink-500 to-rose-600', 'from-cyan-500 to-teal-600']

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Roles & Permissions</h2>
          <p className="text-sm text-slate-400">{roles.length} roles defined</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 text-sm px-4 py-2.5 font-medium rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg">
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-36 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role, i) => (
            <div key={role.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(role)} className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(role.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{role.name}</h3>
              <p className="text-sm text-slate-400 mb-3 line-clamp-2">{role.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                  {role._count?.employees ?? 0} employee{(role._count?.employees ?? 0) !== 1 ? 's' : ''}
                </span>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${(role._count?.employees ?? 0) > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {(role._count?.employees ?? 0) > 0 ? 'In use' : 'Unused'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Role' : 'Add Role'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Role Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Software Engineer"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Describe the responsibilities" />
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