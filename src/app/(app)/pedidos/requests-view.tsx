'use client'

import { useState } from 'react'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { RequestCard } from '@/components/requests/request-card'
import { NewRequestModal } from '@/components/requests/new-request-modal'
import { updateRequestKanban } from '@/lib/actions/requests'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTransition } from 'react'
import type { Priority, RoiConfig, Sector, Request, Status } from '@/lib/types'

interface Props {
  requests: Request[]
  statuses: Status[]
  sectors: Sector[]
  priorities: Priority[]
  roiConfig: RoiConfig | null
  defaultStatusId: string
}

export function RequestsView({ requests, statuses, sectors, priorities, roiConfig, defaultStatusId }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [, startTransition] = useTransition()

  const handleReorder = async (updates: { id: string; status_id: string | null; kanban_position: number }[]) => {
    startTransition(() => { updateRequestKanban(updates) })
  }

  return (
    <>
      <NewRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultStatusId={defaultStatusId}
        sectors={sectors}
        priorities={priorities}
        roiConfig={roiConfig}
      />

      <div className="flex items-center justify-end mb-4">
        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          disabled={!defaultStatusId}
          title={!defaultStatusId ? 'Configure um status de pedido primeiro' : undefined}
          className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="size-3.5" /> Novo pedido
        </Button>
      </div>

      <div className="overflow-x-auto pb-4">
        <KanbanBoard
          statuses={statuses}
          items={requests}
          onReorder={handleReorder}
          renderCard={(request) => <RequestCard key={request.id} request={request as Request} />}
        />
      </div>
    </>
  )
}
