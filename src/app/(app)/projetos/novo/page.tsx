import { Suspense } from 'react'
import { getStatuses, getSectors, getTeams, getPriorities, getProfiles } from '@/lib/queries/settings'
import { Header } from '@/components/layout/header'
import { NewProjectForm } from './new-project-form'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function FormContent() {
  const [statuses, sectors, teams, priorities, profiles] = await Promise.all([
    getStatuses('project'),
    getSectors(),
    getTeams(),
    getPriorities(),
    getProfiles(),
  ])

  const defaultStatus = statuses[0]
  if (!defaultStatus) {
    return (
      <p className="text-sm text-slate-500">
        Configure os status de projetos em Configurações primeiro.
      </p>
    )
  }

  return (
    <NewProjectForm
      defaultStatusId={defaultStatus.id}
      sectors={sectors}
      teams={teams}
      priorities={priorities}
      profiles={profiles}
    />
  )
}

export default function NewProjectPage() {
  return (
    <>
      <Header
        title="Novo projeto"
        actions={
          <Link href="/projetos" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}>
            <ArrowLeft className="size-3.5" /> Voltar
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-6">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <FormContent />
          </Suspense>
        </div>
      </div>
    </>
  )
}
