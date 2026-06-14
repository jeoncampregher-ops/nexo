import { Suspense } from 'react'
import { getSectors, getTeams, getStatuses, getPriorities, getRoiConfig, getProfiles, getCurrentProfile } from '@/lib/queries/settings'
import { SettingsTabsView } from '@/components/settings/settings-tabs-view'
import { Settings2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

async function SettingsContent() {
  const [sectors, teams, statuses, priorities, roiConfig, profiles, currentProfile] = await Promise.all([
    getSectors(),
    getTeams(),
    getStatuses(),
    getPriorities(),
    getRoiConfig(),
    getProfiles(),
    getCurrentProfile(),
  ])

  return (
    <SettingsTabsView
      sectors={sectors}
      teams={teams}
      statuses={statuses}
      priorities={priorities}
      roiConfig={roiConfig}
      profiles={profiles}
      currentUserId={currentProfile?.id ?? ''}
    />
  )
}

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Header escuro */}
      <div className="flex items-center gap-4 px-6 py-4 bg-slate-950 shrink-0">
        <div className="size-9 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/30 flex items-center justify-center shrink-0">
          <Settings2 className="size-4 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white leading-none mb-0.5">Configurações</h1>
          <p className="text-[11px] text-slate-400">Gerencie setores, times, status e preferências do sistema</p>
        </div>
      </div>

      {/* Tabs + conteúdo */}
      <Suspense fallback={
        <div className="p-6 flex flex-col gap-3">
          <Skeleton className="h-8 w-full rounded-xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      }>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
