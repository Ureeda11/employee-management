import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <input ref={ref}
        className={cn(
          'w-full px-3 py-2.5 text-sm rounded-xl border bg-slate-50 text-slate-800 placeholder-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition',
          error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'