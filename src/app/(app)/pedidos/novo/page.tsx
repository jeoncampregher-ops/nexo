import { Suspense } from 'react'
import { getStatuses, getPriorities, getSectors, getRoiConfig } from '@/lib/queries/settings'
import { Header } from '@/components/layout/header'
import { NewRequestForm } from './new-request-form'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function FormContent() {
  const [statuses, priorities, sectors, roiConfig] = await Promise.all([
    getStatuses('request'),
    getPriorities(),
    getSectors(),
    getRoiConfig(),
  ])

  const defaultStatus = statuses[0]
  if (!defaultStatus) return (
    <p className="text-sm text-slate-500 p-6">
      Configure os status de pedidos em{' '}
      <a href="/configuracoes" className="text-indigo-600 underline">Configurações → Status</a> primeiro.
    </p>
  )

  return (
    <NewRequestForm
      defaultStatusId={defaultStatus.id}
      priorities={priorities}
      sectors={sectors}
      roiConfig={roiConfig}
    />
  )
}

export default function NewRequestPage() {
  return (
    <>
      <Header
        title="Novo pedido"
        actions={
          <Link href="/pedidos" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}>
            <ArrowLeft className="size-3.5" /> Voltar
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Suspense fallback={<Skeleton className="h-64 m-6 rounded-xl" />}>
            <FormContent />
          </Suspense>
        </div>
      </div>
    </>
  )
}
