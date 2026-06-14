import { KanbanCard } from '@/components/kanban/kanban-card'
import { PriorityBadge } from '@/components/shared/priority-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Calendar, TrendingUp } from 'lucide-react'
import type { Request } from '@/lib/types'

interface Props {
  request: Request
}

export function RequestCard({ request }: Props) {
  return (
    <KanbanCard id={request.id}>
      <div className="flex flex-col gap-2.5">
        <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">{request.title}</p>

        {request.sector && (
          <span
            className="self-start text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${request.sector.color}18`, color: request.sector.color }}
          >
            {request.sector.name}
          </span>
        )}

        {request.priority && <PriorityBadge priority={request.priority} size="sm" />}

        {request.roi_value != null && request.roi_value > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
            <TrendingUp className="size-3" />
            ROI: {formatCurrency(request.roi_value)}
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar className="size-3" />
            {formatDate(request.created_at)}
          </div>
          {request.requester && <UserAvatar user={request.requester} size="sm" />}
        </div>
      </div>
    </KanbanCard>
  )
}
