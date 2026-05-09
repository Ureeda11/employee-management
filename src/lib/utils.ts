import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(date))
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'active':   return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'inactive': return 'bg-red-100 text-red-700 border-red-200'
    case 'on_leave': return 'bg-amber-100 text-amber-700 border-amber-200'
    default:         return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getAvatarColor(name: string) {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
  ]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}