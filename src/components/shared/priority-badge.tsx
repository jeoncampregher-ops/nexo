import { cn } from '@/lib/utils'
import type { Priority } from '@/lib/types'

interface Props {
  priority: Priority | null | undefined
  size?: 'sm' | 'md'
}

const ICONS: Record<number, string> = { 1: '↓', 2: '→', 3: '↑', 4: '⚡' }

export function PriorityBadge({ priority, size = 'md' }: Props) {
  if (!priority) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded font-medium',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs'
      )}
      style={{
        backgroundColor: `${priority.color}18`,
        color: priority.color,
      }}
    >
      <span>{ICONS[priority.level] ?? '→'}</span>
      {priority.name}
    </span>
  )
}
