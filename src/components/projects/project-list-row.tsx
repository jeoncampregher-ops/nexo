import { StatusBadge } from '@/components/shared/status-badge'
import { PriorityBadge } from '@/components/shared/priority-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { formatDate, isDelayed } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'
import type { Project } from '@/lib/types'

interface Props {
  project: Project
}

export function ProjectListRow({ project }: Props) {
  const delayed = isDelayed(project.expected_date, project.completed_at)

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {delayed && <AlertTriangle className="size-3.5 text-red-400 flex-shrink-0" />}
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{project.title}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        {project.sector && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{ backgroundColor: `${project.sector.color}18`, color: project.sector.color }}
          >
            {project.sector.name}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={project.status} size="sm" />
      </td>
      <td className="px-4 py-3">
        <PriorityBadge priority={project.priority} size="sm" />
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs ${delayed ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
          {formatDate(project.expected_date)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <UserAvatar user={project.assignee} size="sm" />
          {project.assignee && (
            <span className="text-xs text-slate-600 dark:text-slate-400 hidden xl:block">{project.assignee.full_name}</span>
          )}
        </div>
      </td>
    </tr>
  )
}
