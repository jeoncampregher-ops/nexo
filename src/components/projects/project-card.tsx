import { KanbanCard } from '@/components/kanban/kanban-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { PriorityBadge } from '@/components/shared/priority-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { formatDate, isDelayed } from '@/lib/utils'
import { AlertTriangle, Calendar } from 'lucide-react'
import type { Project } from '@/lib/types'

interface Props {
  project: Project
  isDragging?: boolean
}

export function ProjectCard({ project, isDragging }: Props) {
  const delayed = isDelayed(project.expected_date, project.completed_at)

  return (
    <KanbanCard id={project.id}>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">{project.title}</p>
          {delayed && <AlertTriangle className="size-3.5 text-red-400 flex-shrink-0 mt-0.5" />}
        </div>

        {project.sector && (
          <span
            className="self-start text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${project.sector.color}18`, color: project.sector.color }}
          >
            {project.sector.name}
          </span>
        )}

        <div className="flex items-center gap-1.5 flex-wrap">
          {project.priority && <PriorityBadge priority={project.priority} size="sm" />}
          {project.status && <StatusBadge status={project.status} size="sm" />}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/8">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar className="size-3" />
            {project.expected_date ? (
              <span className={delayed ? 'text-red-400 font-medium' : ''}>
                {formatDate(project.expected_date)}
              </span>
            ) : (
              <span>Sem prazo</span>
            )}
          </div>
          {project.assignee && <UserAvatar user={project.assignee} size="sm" />}
        </div>
      </div>
    </KanbanCard>
  )
}
