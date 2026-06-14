import React from 'react'
import { cn } from '@/lib/utils'
import type { Status } from '@/lib/types'

interface Props {
  status: Status | null | undefined
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: Props) {
  if (!status) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
      style={{
        backgroundColor: `${status.color}18`,
        color: status.color,
        '--tw-ring-color': `${status.color}30`,
      } as React.CSSProperties}
    >
      <span
        className="size-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: status.color }}
      />
      {status.name}
    </span>
  )
}
