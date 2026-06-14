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

export function MetricCard({ title, value, subtitle, icon: Icon, iconColor = 'text-indigo-500 dark:text-indigo-400', trend, className }: Props) {
  return (
    <div className={cn(
      'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/6 p-5 flex flex-col gap-4',
      className
    )}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5">
          <Icon className={cn('size-4', iconColor)} />
        </div>
      </div>

      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight leading-none">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{subtitle}</p>}
      </div>

      {trend && (
        <p className={cn('text-xs font-medium', trend.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400')}>
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </p>
      )}
    </div>
  )
}
