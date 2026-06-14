'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  title: string
  color: string
  count: number
  itemIds: string[]
  children: React.ReactNode
}

export function KanbanColumn({ id, title, color, count, itemIds, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] w-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="size-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate flex-1">{title}</h3>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-0.5 tabular-nums">
          {count}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2.5 rounded-xl p-2.5 min-h-[200px] transition-colors duration-150',
          isOver
            ? 'bg-indigo-50/70 dark:bg-indigo-500/10 ring-2 ring-indigo-200 dark:ring-indigo-500/30'
            : 'bg-slate-100/70 dark:bg-slate-800/50'
        )}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </div>
  )
}
