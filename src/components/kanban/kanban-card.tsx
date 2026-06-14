'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  children: React.ReactNode
  className?: string
}

export function KanbanCard({ id, children, className }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-white rounded-lg border border-slate-200 p-3.5 cursor-grab active:cursor-grabbing',
        'shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-150',
        isDragging && 'opacity-40 shadow-xl rotate-1 scale-105',
        className
      )}
    >
      {children}
    </div>
  )
}
