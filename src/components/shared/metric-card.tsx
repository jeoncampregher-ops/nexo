import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: { value: number; label: string }
  className?: string
}

export function MetricCard({ title, value, subtitle, icon: Icon, iconColor = 'text-indigo-500', trend, className }: Props) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={cn('p-2 rounded-lg bg-slate-50', iconColor.replace('text-', 'text-'))}>
          <Icon className={cn('size-4', iconColor)} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      {trend && (
        <p className={cn('text-xs font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-red-500')}>
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </p>
      )}
    </div>
  )
}
