'use client'

import { useTransition } from 'react'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { RequestCard } from '@/components/requests/request-card'
import { updateRequestKanban } from '@/lib/actions/requests'
import type { Request, Status } from '@/lib/types'

interface Props {
  requests: Request[]
  statuses: Status[]
}

export function RequestsKanban({ requests, statuses }: Props) {
  const [, startTransition] = useTransition()

  const handleReorder = async (updates: { id: string; status_id: string | null; kanban_position: number }[]) => {
    startTransition(() => { updateRequestKanban(updates) })
  }

  return (
    <div className="overflow-x-auto pb-4">
      <KanbanBoard
        statuses={statuses}
        items={requests}
        onReorder={handleReorder}
        renderCard={(request) => <RequestCard key={request.id} request={request as Request} />}
      />
    </div>
  )
}
