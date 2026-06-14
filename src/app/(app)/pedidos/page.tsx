import { Suspense } from 'react'
import { getRequests } from '@/lib/queries/requests'
import { getStatuses } from '@/lib/queries/settings'
import { Header } from '@/components/layout/header'
import { RequestsKanban } from './requests-kanban'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function RequestsContent() {
  const [requests, statuses] = await Promise.all([
    getRequests(),
    getStatuses('request'),
  ])
  return <RequestsKanban requests={requests} statuses={statuses} />
}

export default function RequestsPage() {
  return (
    <>
      <Header
        title="Pedidos"
        actions={
          <Link href="/pedidos/novo" className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}>
            <Plus className="size-3.5" /> Novo pedido
          </Link>
        }
      />
      <div className="flex-1 overflow-hidden p-6">
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <RequestsContent />
        </Suspense>
      </div>
    </>
  )
}
