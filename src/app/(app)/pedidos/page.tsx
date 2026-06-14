import { Suspense } from 'react'
import { getRequests } from '@/lib/queries/requests'
import { getStatuses, getPriorities, getSectors, getRoiConfig } from '@/lib/queries/settings'
import { Header } from '@/components/layout/header'
import { RequestsView } from './requests-view'
import { Skeleton } from '@/components/ui/skeleton'

async function RequestsContent() {
  const [requests, statuses, priorities, sectors, roiConfig] = await Promise.all([
    getRequests(),
    getStatuses('request'),
    getPriorities(),
    getSectors(),
    getRoiConfig(),
  ])

  const defaultStatusId = statuses[0]?.id ?? ''

  return (
    <RequestsView
      requests={requests}
      statuses={statuses}
      sectors={sectors}
      priorities={priorities}
      roiConfig={roiConfig}
      defaultStatusId={defaultStatusId}
    />
  )
}

export default function RequestsPage() {
  return (
    <>
      <Header title="Pedidos" />
      <div className="flex-1 overflow-hidden p-6">
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <RequestsContent />
        </Suspense>
      </div>
    </>
  )
}
