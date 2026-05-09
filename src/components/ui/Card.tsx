import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { children: React.ReactNode }
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200 shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}
export function CardHeader({ className, children, ...props }: CardProps) {
  return <div className={cn('p-6 border-b border-slate-100', className)} {...props}>{children}</div>
}
export function CardContent({ className, children, ...props }: CardProps) {
  return <div className={cn('p-6', className)} {...props}>{children}</div>
}